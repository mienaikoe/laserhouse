<script lang="ts">
    import { getContext, setContext } from "svelte";
  import FeatureForm from "./FeatureForm.svelte";
    import type { Floor } from "$lib/types.js";

  let props = $props();
  const {index} = props;

  const floor = getContext('floor') as Floor;

  const wall = floor.walls[index];

  let point1X = $state(wall.point1[0]);
  let point1Y = $state(wall.point1[1]);
  let point2X = $state(wall.point2[0]);
  let point2Y = $state(wall.point2[1]);

  let features = $state(wall.features);

  $effect(() => {
    floor.walls[index] = {
      point1: [point1X || 0, point1Y || 0],
      point2: [point2X || 0, point2Y || 0],
      features: features,
    };
    setContext('floor', {...floor});
  });

  const addFeature = () => {
    // Logic to add a new feature to the wall
    features = [...features, {
      origin: [0, 0],
      width: 10,
      height: 10,
    }];
  }
</script>

<div>
  <h4 class="text-lg">Wall {index + 1}</h4>

  <div class="flex flex-col gap-2">
    <div class="flex flex-row flex-1  w-full gap-2">
      <div class="flex flex-col w-[50%]">
        <label for={`wall-${index}-x`} class="text-sm">P1 (x)</label>
        <input
          type="number"
          id={`wall-${index}-x`}
          bind:value={point1X}
          placeholder="x"
        />
      </div>
      <div class="flex flex-col w-[50%]">
        <label for={`wall-${index}-y`} class="text-sm">P1 (y)</label>
        <input
          type="number"
          id={`wall-${index}-y`}
          bind:value={point1Y}
          placeholder="y"
        />
      </div>
    </div>
     <div class="flex flex-row flex-1  w-full gap-2">
      <div class="flex flex-col w-[50%]">
        <label for={`wall-${index}-x`} class="text-sm">P2 (x)</label>
        <input
          type="number"
          id={`wall-${index}-x`}
          bind:value={point2X}
          placeholder="x"
        />
      </div>
      <div class="flex flex-col w-[50%]">
        <label for={`wall-${index}-y`} class="text-sm">P2 (y)</label>
        <input
          type="number"
          id={`wall-${index}-y`}
          bind:value={point2Y}
          placeholder="y"
        />
      </div>
    </div>

    <div class="border-l-1 border-gray-300 pl-2 flex flex-col gap-2">
      {#each features as feature, featureIndex}
        <FeatureForm feature={feature}  index={featureIndex} wallIndex={index} />
      {/each}

      <button class="mt-2 py-1 px-4  bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer" onclick={addFeature}>
        + Add Feature
      </button>
    </div>
  </div>

</div>