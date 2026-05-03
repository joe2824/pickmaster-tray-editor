<script lang="ts">
  import { T, useTask, useThrelte } from '@threlte/core';
  import * as THREE from 'three';
  import type { PerspectiveCamera } from 'three';
  import { applyOrbit } from '$three/orbit';
  import { viewport } from '$state/viewport.svelte';
  import { onMount } from 'svelte';

  let cam = $state<PerspectiveCamera | undefined>(undefined);
  const { renderer } = useThrelte();

  let rotating = false,
    panning = false;
  let lastX = 0,
    lastY = 0;

  onMount(() => {
    const canvas = renderer.domElement;

    const onMousedown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (e.ctrlKey && e.shiftKey) {
        rotating = true;
        e.preventDefault();
      } else if (e.ctrlKey) {
        panning = true;
        e.preventDefault();
      }
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onMousemove = (e: MouseEvent) => {
      if (!rotating && !panning) return;
      const dx = e.clientX - lastX,
        dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      if (rotating) {
        viewport.orbit.theta -= dx * 0.008;
        viewport.orbit.phi = Math.max(
          0.001,
          Math.min(Math.PI - 0.001, viewport.orbit.phi - dy * 0.008)
        );
        if (viewport.view !== '3d') viewport.view = '3d';
      } else if (panning) {
        const scale = viewport.orbit.radius * 0.001;
        const ct = Math.cos(viewport.orbit.theta),
          st = Math.sin(viewport.orbit.theta);
        const cp = Math.cos(viewport.orbit.phi);
        viewport.orbit.panX += (dx * st - dy * ct * cp) * scale;
        viewport.orbit.panY += (-dx * ct - dy * st * cp) * scale;
      }
    };

    const onMouseup = () => {
      rotating = false;
      panning = false;
    };

    // Stop camera interaction as soon as modifier key is released
    const onKeyup = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'Shift') {
        rotating = false;
        panning = false;
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.1 : 0.9;

      // Zoom toward cursor: move pan center toward world point under mouse
      if (cam) {
        const rect = canvas.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        const ray = new THREE.Raycaster();
        ray.setFromCamera(new THREE.Vector2(nx, ny), cam);
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const pt = new THREE.Vector3();
        if (ray.ray.intersectPlane(plane, pt)) {
          // Move look-at point toward/away from cursor proportional to zoom
          viewport.orbit.panX += (pt.x - viewport.orbit.panX) * (1 - factor);
          viewport.orbit.panY += (pt.y - viewport.orbit.panY) * (1 - factor);
        }
      }

      viewport.orbit.radius = Math.max(50, Math.min(10000, viewport.orbit.radius * factor));
    };

    const onContextmenu = (e: Event) => e.preventDefault();

    canvas.addEventListener('mousedown', onMousedown);
    window.addEventListener('mousemove', onMousemove);
    window.addEventListener('mouseup', onMouseup);
    window.addEventListener('keyup', onKeyup);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('contextmenu', onContextmenu);

    return () => {
      canvas.removeEventListener('mousedown', onMousedown);
      window.removeEventListener('mousemove', onMousemove);
      window.removeEventListener('mouseup', onMouseup);
      window.removeEventListener('keyup', onKeyup);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('contextmenu', onContextmenu);
    };
  });

  useTask(() => {
    if (!cam) return;
    applyOrbit(cam, viewport.orbit);
  });
</script>

<T.PerspectiveCamera makeDefault fov={45} bind:ref={cam} />
