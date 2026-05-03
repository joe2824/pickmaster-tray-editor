<script lang="ts">
  import { viewport } from '$state/viewport.svelte';

  const SIZE = 60;
  const C = SIZE / 2;
  const AXIS_LEN = 20;

  // Project 3D axis direction onto screen 2D (Z-up orbit math)
  function proj(dx: number, dy: number, dz: number) {
    const { theta, phi } = viewport.orbit;
    const st = Math.sin(theta), ct = Math.cos(theta);
    const sp = Math.sin(phi), cp = Math.cos(phi);
    const sx = -dx * st + dy * ct;
    const sy = dx * ct * cp + dy * st * cp - dz * sp;
    return { x: sx * AXIS_LEN, y: sy * AXIS_LEN };
  }

  const axes = $derived([
    { dx: 1, dy: 0, dz: 0, color: '#ff4444', label: 'X' },
    { dx: 0, dy: 1, dz: 0, color: '#44cc44', label: 'Y' },
    { dx: 0, dy: 0, dz: 1, color: '#4488ff', label: 'Z' },
  ].map((a) => ({ ...a, p: proj(a.dx, a.dy, a.dz) })));
</script>

<div class="absolute bottom-8 right-3 pointer-events-none select-none">
  <svg width={SIZE} height={SIZE} overflow="visible" style="overflow:visible">
    <circle cx={C} cy={C} r={C} fill="rgb(13,15,20)" opacity="0.75" />
    {#each axes as ax}
      <line
        x1={C} y1={C}
        x2={C + ax.p.x} y2={C + ax.p.y}
        stroke={ax.color} stroke-width="1.5" stroke-linecap="round"
      />
      <text
        x={C + ax.p.x * 1.45} y={C + ax.p.y * 1.45}
        fill={ax.color} font-size="9" text-anchor="middle" dominant-baseline="middle"
        font-family="monospace" font-weight="600"
      >{ax.label}</text>
    {/each}
    <circle cx={C} cy={C} r="2.5" fill="white" />
  </svg>
</div>
