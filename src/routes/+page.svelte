<script lang="ts">
	import type { Floor } from  '../lib/types.ts';
  import FloorForm from '../components/FloorForm.svelte';

  const newFloor: Floor = {
    name: 'Main Floor',
    wallHeight: 120,
    materialThickness: 3,
    pageWidth: 300,
    pageHeight: 300,
    walls: [{
      point1: { x: 0, y: 0 },
      point2: { x: 100, y: 0 },
      features: [],
    }, {
      point1: { x: 100, y: 0 },
      point2: { x: 100, y: 100 },
      features: [],
    }, {
      point1: { x: 100, y: 100 },
      point2: { x: 0, y: 100 },
      features: [],
    }, {
      point1: { x: 0, y: 100 },
      point2: { x: 0, y: 0 },
      features: [],
    }],
  }
</script>

<svg width={newFloor.pageWidth} height={newFloor.pageHeight} class="m-4 border-1 border-gray-300" >
  <g transform="translate(5, 5)">
    {#each newFloor.walls as wall}
      <line
        x1={wall.point1.x}
        y1={wall.point1.y}
        x2={wall.point2.x}
        y2={wall.point2.y}
        stroke="black"
        stroke-width="2"
      />
    {/each}
  </g>
</svg>

<svg width={newFloor.pageWidth} height={newFloor.pageHeight} class="m-4 border-1 border-gray-300" >
  <g transform="translate(5, 5)">
    {#each newFloor.walls as wall, index}
      <rect
        x={0}
        y={index * newFloor.wallHeight}
        width={Math.sqrt(Math.pow(wall.point2.x - wall.point1.x, 2) + Math.pow(wall.point2.y - wall.point1.y, 2))}
        height={newFloor.wallHeight}
        stroke="black"
        stroke-width="2"
        fill="none"
      />
    {/each}
  </g>
</svg>

<FloorForm floor={newFloor} />