<script lang="ts">
  import WallForm from './WallForm.svelte';
  let { floor } = $props();

  let { floorName } = $state(floor.name || 'New Floor');

  console.log(floorName);
</script>

<div class="fixed top-12 right-4 bottom-4 w-[400px] bg-gray-100 p-4 rounded overflow-y-auto">
  <div class="flex flex-col gap-4">
    <h4 class="text-2xl">{floorName}</h4>
    <div>
      <label for="floor-name" class="block mb-2 text-sm font-medium">
        Floor Name
      </label>
      <input type="text" value={floorName} id="floor-name"  />
    </div>

    <div>
      <label for="page-width" class="block mb-2 text-sm font-medium">
        Page Width (mm)
      </label>
      <input type="number" value={floor?.pageWidth} id="page-width" />
    </div>

    <div>
      <label for="wall-height" class="block mb-2 text-sm font-medium">
        Wall Height (mm)
      </label>
      <input type="number" value={floor?.wallHeight} id="wall-height" />
    </div>

    <div>
      <label for="material-thickness" class="block mb-2 text-sm font-medium">
        Material Thickness (mm)
      </label>
      <input
        type="number"
        value={floor?.materialThickness}
        id="material-thickness"
      />
    </div>

    <div class="border-b-1 border-gray-300 my-4" ></div>

    <h4 class="text-lg">Walls ({floor?.walls.length})</h4>

    {#each floor?.walls as wall, index}
      <WallForm wall={wall} index={index} />
    {/each}
  </div>
</div>
