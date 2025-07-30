<script lang="ts">
  import type { Floor, Hitbox, Point } from "../lib/types.ts";
  import FloorForm from "../components/FloorForm.svelte";
  import SVGWall from "../components/SVGWall.svelte";
  import SVGFloor from "../components/SVGfloor.svelte";
  import { onMount, setContext } from "svelte";

  const LASER_PADDING = 5; // mm

  let floor: Floor = $state({
    name: "Main Floor",
    wallHeight: 120,
    materialThickness: 10,
    pageWidth: 300,
    pageHeight: 300,
    walls: [
      {
        point1: [0, 0],
        point2: [100, 0],
        features: [],
      },
      {
        point1: [100, 0],
        point2: [100, 100],
        features: [],
      },
      {
        point1: [100, 100],
        point2: [0, 100],
        features: [],
      },
      {
        point1: [0, 100],
        point2: [0, 0],
        features: [],
      },
    ],
  });

  const getFloor = () => floor;
  const setFloor = (newFloor: Floor) => {
    floor = newFloor;
    console.log("Floor updated:", floor);
  };

  setContext("floor", getFloor);
  setContext("setFloor", setFloor);

  onMount(() => {
    // Load floor from localStorage if available
    const savedFloor = window.localStorage.getItem("floor");
    if (savedFloor) {
      const restoredFloor = JSON.parse(savedFloor);
      floor = restoredFloor;
      console.log("Restored floor from localStorage:", floor?.walls.length);
    }
  });

  // grouped by page
  // each page is a new array of hitboxes
  let groupedHitboxes: Hitbox[][] = $derived.by(() => {
    let runningOrigin: Point = [0, 0];
    let runningRow = 0; // 0-indexed
    const runningRowHeights = [0]; // row-indexed, each row is a new number
    let maxRenderRowHeight = 0;
    const rowedHitboxes: Hitbox[][] = [[]]; // 0-indexed, each row is a new array

    // handle floor panel first
    const maxX = Math.max(
      ...(floor?.walls || []).map((wall) =>
        Math.max(wall.point1[0], wall.point2[0]),
      ),
    );
    const maxY = Math.max(
      ...(floor?.walls || []).map((wall) =>
        Math.max(wall.point1[1], wall.point2[1]),
      ),
    );
    rowedHitboxes[runningRow].push({
      origin: [0, 0],
      width: maxX,
      height: maxY,
      panel: floor,
      type: "floor",
    });
    runningOrigin = [maxX + (floor?.materialThickness || 0), 0];
    maxRenderRowHeight = maxY;

    // wall panels
    for (const wall of floor?.walls || []) {
      // pythagorean theorem to calculate the width of the wall
      const wallWidth =
        Math.sqrt(
          Math.pow(wall.point2[0] - wall.point1[0], 2) +
            Math.pow(wall.point2[1] - wall.point1[1], 2),
        ) + (floor?.materialThickness || 0); // add material thickness to the width for padding

      // if the wall exceeds the page width, move to the next row
      // and reset the x position
      // also reset the max render row height
      if (runningOrigin[0] + wallWidth > (floor?.pageWidth || 0)) {
        runningOrigin[0] = 0;
        rowedHitboxes.push([]);
        runningRowHeights[runningRow] = maxRenderRowHeight;
        maxRenderRowHeight = 0;

        runningRow++;
      }

      rowedHitboxes[runningRow].push({
        origin: [...runningOrigin],
        width: wallWidth,
        height: floor?.wallHeight || 0,
        panel: wall,
        type: "wall",
      });

      runningOrigin[0] += wallWidth + (floor?.materialThickness || 0);
      maxRenderRowHeight = Math.max(maxRenderRowHeight, floor?.wallHeight || 0);
    }

    runningRowHeights[runningRow] = maxRenderRowHeight;

    const pagedHitboxes: Hitbox[][] = [[]];
    let runningOriginY = 0;
    let currentPage = 0;
    for (let row = 0; row < rowedHitboxes.length; row++) {
      const rowHeight = runningRowHeights[row];
      if (runningOriginY + rowHeight > (floor?.pageHeight || 0)) {
        runningOriginY = 0;
        currentPage++;
        pagedHitboxes.push([]);
      }

      for (let hitbox of rowedHitboxes[row]) {
        // add the hitbox to the current page
        pagedHitboxes[currentPage].push({
          ...hitbox,
          origin: [hitbox.origin[0], hitbox.origin[1] + runningOriginY],
        });
      }

      runningOriginY += rowHeight;
    }

    return pagedHitboxes;
  });
</script>

{#key groupedHitboxes}
  <div class="flex flex-col gap-2 p-4">
    {#each groupedHitboxes as hitboxes, pageIndex}
      <h6 class="text-xl">Page {pageIndex + 1}</h6>
      <svg
        class="border-1 border-gray-300"
        width={(floor?.pageWidth || 0) + 2 * LASER_PADDING}
        height={(floor?.pageHeight || 0) + 2 * LASER_PADDING}
      >
        <g transform={`translate(${LASER_PADDING}, ${LASER_PADDING})`}>
          {#each hitboxes as hitbox}
            {#if hitbox.type === "wall"}
              <SVGWall wall={hitbox.panel} {hitbox} />
            {:else if hitbox.type === "floor"}
              <SVGFloor {hitbox} />
            {/if}
          {/each}
        </g>
      </svg>
    {/each}
  </div>
{/key}

{#key floor}
  <FloorForm />
{/key}
