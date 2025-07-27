<script lang="ts">
  import type { Floor } from '$lib/types.js';
  import { getContext, setContext } from 'svelte';
  import WallForm from './WallForm.svelte';

  let floor = getContext('floor') as Floor;

  let floorName = $state(floor.name);
  let pageWidth = $state(floor.pageWidth);
  let pageHeight = $state(floor.pageHeight);
  let wallHeight = $state(floor.wallHeight);
  let materialThickness = $state(floor.materialThickness);

  let walls = $state(floor.walls);

  $effect(() => {
    floor.name = floorName;
    floor.pageWidth = pageWidth;
    floor.pageHeight = pageHeight;
    floor.wallHeight = wallHeight;
    floor.materialThickness = materialThickness;
    floor.walls = walls;

    setContext('floor', {...floor});
  });
</script>

<div class="fixed top-12 right-4 bottom-4 w-[400px] bg-gray-100 p-4 rounded overflow-y-auto">
  <div class="flex flex-col gap-4">
    <h4 class="text-2xl">{floorName}</h4>
    <div>
      <label for="floor-name" class="block mb-2 text-sm font-medium">
        Floor Name
      </label>
      <input type="text" bind:value={floorName} id="floor-name" />
    </div>

    <div>
      <label for="page-width" class="block mb-2 text-sm font-medium">
        Page Width (mm)
      </label>
      <input type="number" bind:value={pageWidth} id="page-width" />
    </div>
    <div>
      <label for="page-height" class="block mb-2 text-sm font-medium">
        Page Height (mm)
      </label>
      <input type="number" bind:value={pageHeight} id="page-height" />
    </div>

    <div>
      <label for="wall-height" class="block mb-2 text-sm font-medium">
        Wall Height (mm)
      </label>
      <input type="number" bind:value={wallHeight} id="wall-height" />
    </div>
    

    <div>
      <label for="material-thickness" class="block mb-2 text-sm font-medium">
        Material Thickness (mm)
      </label>
      <input
        type="number"
        bind:value={materialThickness}
        id="material-thickness"
      />
    </div>

    <div class="border-b-1 border-gray-300 my-4" ></div>
    
    {#each walls as wall, index}
      <WallForm wall={wall} index={index} />
    {/each}

    <button
      class="mt-2 py-1 px-4  bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
      onclick={() => {
        walls.push({
          point1: { x: 0, y: 0 },
          point2: { x: 100, y: 0 },
          features: [],
        });
      }}
    >
      + Add Wall
    </button>
  </div>
</div>
