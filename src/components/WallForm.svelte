<script lang="ts">
  import { getContext, setContext } from "svelte";
  import FeatureForm from "./FeatureForm.svelte";
  import type { Floor, Wall } from "$lib/types.js";

  let props = $props();
  const { index } = props;

  let getFloor = getContext("floor") as () => Floor;
  let setFloor = getContext("setFloor") as (floor: Floor) => void;
  let floor = getFloor();

  const wall = floor.walls[index];

  let point1X = $state(wall.point1[0]);
  let point1Y = $state(wall.point1[1]);
  let point2X = $state(wall.point2[0]);
  let point2Y = $state(wall.point2[1]);

  let features = $state(wall.features);

  $effect(() => {
    const newWalls = [...floor.walls];
    const newWall: Wall = {
      point1: [Number(point1X || 0), Number(point1Y || 0)],
      point2: [Number(point2X || 0), Number(point2Y || 0)],
      features: features,
    };

    newWalls[index] = newWall;
    const newFloor: Floor = {
      ...floor,
      walls: newWalls,
    };
    if (JSON.stringify(newFloor) !== JSON.stringify(floor)) {
      setFloor(newFloor);
    }

    console.log("Wall updated:", newWall);
  });

  const addFeature = () => {
    // Logic to add a new feature to the wall
    features = [
      ...features,
      {
        type: "cut",
        origin: [0, 0],
        width: 10,
        height: 10,
      },
    ];
  };

  const removeWall = () => {
    // Logic to remove the wall
    floor.walls = floor.walls.filter((_, i) => i !== index);
    setContext("floor", { ...floor });
  };
</script>

<div>
  <div class="flex flex-row items-center justify-between">
    <h4 class="text-lg">Wall {index + 1}</h4>
    <button
      class="cursor-pointer bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
      onclick={removeWall}
    >
      Remove
    </button>
  </div>

  <div class="flex flex-col gap-2">
    <div class="flex flex-row flex-1 w-full gap-2">
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
    <div class="flex flex-row flex-1 w-full gap-2">
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
        <FeatureForm {feature} index={featureIndex} wallIndex={index} />
      {/each}

      <button
        class="mt-2 py-1 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
        onclick={addFeature}
      >
        + Add Feature
      </button>
    </div>
  </div>
</div>
