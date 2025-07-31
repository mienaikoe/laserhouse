<script lang="ts">
  import type { Floor } from "$lib/types.js";
  import { getContext, setContext } from "svelte";
  import WallForm from "./WallForm.svelte";

  let getFloor = getContext("floor") as () => Floor;
  let setFloor = getContext("setFloor") as (floor: Floor) => void;
  let floor = getFloor();

  let floorName = $state(floor?.name);
  let pageWidth = $state(floor?.pageWidth);
  let pageHeight = $state(floor?.pageHeight);
  let wallHeight = $state(floor?.wallHeight);
  let materialThickness = $state(floor?.materialThickness);
  let jointTabLength = $state(floor?.jointTabLength || 10); // default to 10mm
  let walls = $state(floor?.walls);
  let internalWalls = $state(floor?.internalWalls || []);

  $effect(() => {
    const newFloor: Floor = {
      ...floor,
      name: floorName,
      pageWidth: Number(pageWidth || 0),
      pageHeight: Number(pageHeight || 0),
      wallHeight: Number(wallHeight || 0),
      materialThickness: Number(materialThickness || 0),
      jointTabLength: Number(jointTabLength || 10),
      walls: walls.map((wall) => ({
        ...wall,
        point1: [Number(wall.point1[0]), Number(wall.point1[1])],
        point2: [Number(wall.point2[0]), Number(wall.point2[1])],
      })),
      internalWalls: internalWalls.map((wall) => ({
        ...wall,
        point1: [Number(wall.point1[0]), Number(wall.point1[1])],
        point2: [Number(wall.point2[0]), Number(wall.point2[1])],
      })),
    };
    if (JSON.stringify(newFloor) !== JSON.stringify(floor)) {
      setFloor(newFloor);
    }
  });

  const handleSave = () => {
    window.localStorage.setItem("floor", JSON.stringify(floor));
    console.log("Floor is saved:", floor);
    alert("Floor saved successfully!");
  };
</script>

<div
  class="fixed top-12 right-4 bottom-4 w-[400px] bg-gray-100 p-4 rounded overflow-y-auto"
>
  <div class="flex flex-col gap-4">
    <div class="flex flex-row items-center justify-between">
      <h4 class="text-2xl">{floorName}</h4>
      <button
        onclick={handleSave}
        class="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Save
      </button>
    </div>
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

    <div>
      <label for="joint-tab-length" class="block mb-2 text-sm font-medium">
        Joint Tab Length (mm)
      </label>
      <input type="number" bind:value={jointTabLength} id="joint-tab-length" />
    </div>

    <div class="border-b-1 border-gray-300 my-4"></div>

    {#each floor?.walls as wall, index}
      <WallForm {wall} {index} />
    {/each}

    <button
      class="mt-2 py-1 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
      onclick={() => {
        walls.push({
          point1: [0, 0],
          point2: [100, 0],
          features: [],
        });
      }}
    >
      + Add Wall
    </button>

    <div class="border-b-1 border-gray-300 my-4"></div>

    {#each floor?.internalWalls as wall, index}
      <WallForm {wall} {index} internal={true} />
    {/each}

    <button
      class="mt-2 py-1 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
      onclick={() => {
        internalWalls.push({
          point1: [0, 0],
          point2: [100, 0],
          features: [],
        });
      }}
    >
      + Add Internal Wall
    </button>
  </div>
</div>
