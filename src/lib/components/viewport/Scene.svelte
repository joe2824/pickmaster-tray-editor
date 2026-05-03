<script lang="ts">
  import { T, useThrelte, useTask } from '@threlte/core';
  import * as THREE from 'three';
  import TrayMesh from './TrayMesh.svelte';
  import ItemMesh from './ItemMesh.svelte';
  import OrbitCamera from './OrbitCamera.svelte';
  import { editor } from '$state/editor.svelte';
  import { selection } from '$state/selection.svelte';
  import { history } from '$state/history.svelte';
  import { viewport } from '$state/viewport.svelte';
  import { contextMenu } from '$state/contextmenu.svelte';
  import { sceneInteraction } from '$state/scene.svelte';
  import { onMount } from 'svelte';
  import { v4 as uuid } from 'uuid';

  const { camera, renderer, scene } = useThrelte();
  const raycaster = new THREE.Raycaster();

  function ndc(e: MouseEvent) {
    const r = renderer.domElement.getBoundingClientRect();
    return new THREE.Vector2(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      -((e.clientY - r.top) / r.height) * 2 + 1
    );
  }

  function getHitId(e: MouseEvent): string | null {
    const cam = camera.current;
    if (!cam) return null;
    raycaster.setFromCamera(ndc(e), cam);
    const hits = raycaster.intersectObjects(scene.children, true);
    for (const hit of hits) {
      if (hit.object instanceof THREE.LineSegments) continue;
      let obj: THREE.Object3D | null = hit.object;
      while (obj) {
        if (obj.userData?.arrangementId) return obj.userData.arrangementId as string;
        obj = obj.parent;
      }
    }
    return null;
  }

  function getWorldXY(e: MouseEvent, planeZ = 0): THREE.Vector3 | null {
    const cam = camera.current;
    if (!cam) return null;
    raycaster.setFromCamera(ndc(e), cam);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -planeZ);
    const pt = new THREE.Vector3();
    return raycaster.ray.intersectPlane(plane, pt) ? pt : null;
  }

  // Interaction state
  let canvasPointerDown = false;
  let downButton = -1;
  let downHitId: string | null = null;
  let pointerMoved = false;
  let dragActive = false;
  const dragThreshold = 5;
  let dragStartScreen = { x: 0, y: 0 };
  let dragStartWorld = new THREE.Vector3();
  let dragItemOrigins = new Map<string, { x: number; y: number }>();

  // Update measure point screen projections every frame
  useTask(() => {
    const cam = camera.current;
    if (!cam || (!sceneInteraction.measureA && !sceneInteraction.measureB)) return;
    const rect = renderer.domElement.getBoundingClientRect();

    const project = (pt: { x: number; y: number; z: number }) => {
      const v = new THREE.Vector3(pt.x, pt.y, pt.z).project(cam);
      return { x: ((v.x + 1) / 2) * rect.width + rect.left, y: ((-v.y + 1) / 2) * rect.height + rect.top };
    };

    sceneInteraction.measureAScreen = sceneInteraction.measureA ? project(sceneInteraction.measureA) : null;
    sceneInteraction.measureBScreen = sceneInteraction.measureB ? project(sceneInteraction.measureB) : null;
  });

  onMount(() => {
    const canvas = renderer.domElement;

    const onPointerdown = (e: MouseEvent) => {
      canvasPointerDown = true;
      downButton = e.button;
      if (e.button !== 0 || e.altKey || e.ctrlKey) return;

      pointerMoved = false;
      dragActive = false;
      downHitId = getHitId(e);
      dragStartScreen = { x: e.clientX, y: e.clientY };

      if (viewport.mode === 'measure') {
        const pt = getWorldXY(e);
        if (pt) {
          if (!sceneInteraction.measureA) {
            sceneInteraction.measureA = { x: pt.x, y: pt.y, z: pt.z };
          } else {
            sceneInteraction.measureB = { x: pt.x, y: pt.y, z: pt.z };
          }
        }
        return;
      }

      sceneInteraction.marqueeStart = { x: e.clientX, y: e.clientY };
      sceneInteraction.marqueeEnd = null;
      sceneInteraction.marqueeShift = e.shiftKey;
      sceneInteraction.marqueeCtrl = e.ctrlKey || e.metaKey;
    };

    const onPointermove = (e: MouseEvent) => {
      if (!canvasPointerDown || downButton !== 0 || e.altKey || e.ctrlKey) return;
      if (viewport.mode === 'measure') return;

      const dx = e.clientX - dragStartScreen.x;
      const dy = e.clientY - dragStartScreen.y;
      if (Math.sqrt(dx * dx + dy * dy) < dragThreshold) return;
      pointerMoved = true;

      if (!dragActive && downHitId !== null) {
        if (!selection.has(downHitId)) selection.set([downHitId]);
        const pt = getWorldXY(e);
        if (pt) {
          dragActive = true;
          dragStartWorld.copy(pt);
          dragItemOrigins.clear();
          for (const id of selection.ids) {
            const arr = editor.arrangedById(id);
            if (arr) dragItemOrigins.set(id, { x: arr.x, y: arr.y });
          }
          sceneInteraction.marqueeStart = null;
          sceneInteraction.marqueeEnd = null;
        }
      }

      if (dragActive) {
        const pt = getWorldXY(e);
        if (!pt) return;
        const ddx = pt.x - dragStartWorld.x;
        const ddy = pt.y - dragStartWorld.y;
        for (const [id, origin] of dragItemOrigins) {
          const arr = editor.arrangedById(id);
          if (!arr) continue;
          let nx = origin.x + ddx;
          let ny = origin.y + ddy;
          if (viewport.snap) {
            nx = Math.round(nx / viewport.snapSize) * viewport.snapSize;
            ny = Math.round(ny / viewport.snapSize) * viewport.snapSize;
          }
          arr.x = nx;
          arr.y = ny;
        }
        editor.arranged = [...editor.arranged];
      } else if (downHitId === null) {
        sceneInteraction.marqueeEnd = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerup = (e: MouseEvent) => {
      // Only react to interactions that started on the canvas
      if (!canvasPointerDown || e.button !== 0) {
        canvasPointerDown = false;
        downButton = -1;
        return;
      }
      canvasPointerDown = false;

      if (dragActive) {
        dragActive = false;
        dragItemOrigins.clear();
        history.push();
      } else if (pointerMoved && sceneInteraction.marqueeStart && sceneInteraction.marqueeEnd) {
        applyMarquee(
          sceneInteraction.marqueeStart,
          sceneInteraction.marqueeEnd,
          sceneInteraction.marqueeShift,
          sceneInteraction.marqueeCtrl
        );
      } else if (!pointerMoved && viewport.mode !== 'measure') {
        if (downHitId) {
          e.shiftKey ? selection.toggle(downHitId) : selection.set([downHitId]);
        } else if (viewport.activeItemTypeId && editor.tray) {
          // Placement mode: click on empty area → place active item type
          const pt = getWorldXY(e);
          if (pt) {
            let x = pt.x, y = pt.y;
            if (viewport.snap) {
              x = Math.round(x / viewport.snapSize) * viewport.snapSize;
              y = Math.round(y / viewport.snapSize) * viewport.snapSize;
            }
            const newItem = {
              id: uuid(), itemId: viewport.activeItemTypeId,
              x, y, z: 0, rx: 0, ry: 0, rz: 0,
              order: editor.nextOrderId++, layerId: editor.activeLayer,
            };
            editor.arranged = [...editor.arranged, newItem];
            selection.set([newItem.id]);
            history.push();
            // Keep placement mode active for rapid placing
          }
        } else if (!e.shiftKey) {
          selection.clear();
        }
      }

      sceneInteraction.marqueeStart = null;
      sceneInteraction.marqueeEnd = null;
      downButton = -1;
    };

    const onContextmenu = (e: MouseEvent) => {
      e.preventDefault();
      const id = getHitId(e);
      if (id) {
        if (!selection.has(id)) selection.set([id]);
        contextMenu.show(e.clientX, e.clientY, id);
      }
    };

    canvas.addEventListener('pointerdown', onPointerdown);
    window.addEventListener('pointermove', onPointermove);
    window.addEventListener('pointerup', onPointerup);
    canvas.addEventListener('contextmenu', onContextmenu);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerdown);
      window.removeEventListener('pointermove', onPointermove);
      window.removeEventListener('pointerup', onPointerup);
      canvas.removeEventListener('contextmenu', onContextmenu);
    };
  });

  function applyMarquee(
    start: { x: number; y: number },
    end: { x: number; y: number },
    additive: boolean,
    subtractive: boolean
  ) {
    const x1 = Math.min(start.x, end.x), x2 = Math.max(start.x, end.x);
    const y1 = Math.min(start.y, end.y), y2 = Math.max(start.y, end.y);
    const cam = camera.current;
    if (!cam) return;
    const rect = renderer.domElement.getBoundingClientRect();
    const inRect: string[] = [];
    for (const arr of editor.arranged) {
      if (!editor.layer(arr.layerId)?.visible) continue;
      const v = new THREE.Vector3(arr.x, arr.y, 0).project(cam);
      const sx = ((v.x + 1) / 2) * rect.width + rect.left;
      const sy = ((-v.y + 1) / 2) * rect.height + rect.top;
      if (sx >= x1 && sx <= x2 && sy >= y1 && sy <= y2) inRect.push(arr.id);
    }
    if (additive) inRect.forEach((id) => selection.add(id));
    else if (subtractive) inRect.forEach((id) => selection.delete(id));
    else selection.set(inRect);
  }
</script>

<OrbitCamera />

<T.AmbientLight intensity={0.7} />
<T.DirectionalLight position={[500, 500, 1500]} intensity={1.2} castShadow />
<T.DirectionalLight position={[-300, -300, 800]} intensity={0.4} />

<TrayMesh />
{#each editor.arranged as arr (arr.id)}
  <ItemMesh {arr} />
{/each}
