<script lang="ts">
	import type { Floor, Hitbox, Point } from  '../lib/types.ts';
  import FloorForm from '../components/FloorForm.svelte';
    import { setContext } from 'svelte';

  const LASER_PADDING = 5; // mm

  // TODO: fetch from local storage, or list and have the user select
  let newFloor: Floor = $state({
    name: 'Main Floor',
    wallHeight: 120,
    materialThickness: 3,
    pageWidth: 300,
    pageHeight: 300,
    walls: [{
      point1: [0,0],
      point2: [100,0],
      features: [],
    }, {
      point1: [100,0],
      point2: [100, 100],
      features: [],
    }, {
      point1: [100,100],
      point2: [0, 100],
      features: [],
    }, {
      point1: [0,100],
      point2: [0, 0],
      features: [],
    }],
  });

  setContext('floor', newFloor);
  
  // grouped by page
  // each page is a new array of hitboxes
  let groupedHitboxes: Hitbox[][] = $derived.by(() => {
    let runningOrigin: Point = [0,0];
    let runningRow = 0; // 0-indexed
    const runningRowHeights = [0]; // row-indexed, each row is a new number
    let maxRenderRowHeight = 0;
    const rowedHitboxes: Hitbox[][] = [[]]; // 0-indexed, each row is a new array

    // handle floor panel first
    const maxX = Math.max(...newFloor.walls.map(wall => Math.max(wall.point1[0], wall.point2[0])));
    const maxY = Math.max(...newFloor.walls.map(wall => Math.max(wall.point1[1], wall.point2[1])));
    rowedHitboxes[runningRow].push({ 
      origin: [0, 0],
      width: maxX,
      height: maxY,
      panel: newFloor,
      type: 'floor',
    });
    runningOrigin = [maxX, 0];
    maxRenderRowHeight = maxY;
    
    // wall panels
    for( const wall of newFloor.walls) {
      // pythagorean theorem to calculate the width of the wall
      const wallWidth = Math.sqrt(
        Math.pow(wall.point2[0] - wall.point1[0], 2) + 
        Math.pow(wall.point2[1] - wall.point1[1], 2)
      );
      
      // if the wall exceeds the page width, move to the next row
      // and reset the x position
      // also reset the max render row height
      if( runningOrigin[0] + wallWidth > newFloor.pageWidth) {
        runningOrigin[0] = 0;
        rowedHitboxes.push([]);
        runningRowHeights[runningRow] = maxRenderRowHeight;
        maxRenderRowHeight = 0;

        runningRow++;
      }

      rowedHitboxes[runningRow].push({
        origin: [...runningOrigin],
        width: wallWidth,
        height: newFloor.wallHeight,
        panel: wall,
        type: 'wall',
      });

      runningOrigin[0] += wallWidth;
      maxRenderRowHeight = Math.max(maxRenderRowHeight, newFloor.wallHeight);
    }

    runningRowHeights[runningRow] = maxRenderRowHeight;

    const pagedHitboxes: Hitbox[][] = [[]];
    let runningOriginY = 0;
    let currentPage = 0;
    for( let row = 0; row < rowedHitboxes.length; row++) {
      const rowHeight = runningRowHeights[row];
      if( runningOriginY + rowHeight > newFloor.pageHeight) {
        runningOriginY = 0;
        currentPage++;
        pagedHitboxes.push([]);
      }

      for( let hitbox of rowedHitboxes[row]) {
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

<div class="flex flex-col gap-2 p-4">
  {#each groupedHitboxes as hitboxes, pageIndex}
    <h6 class="text-xl">Page {pageIndex + 1}</h6>
    <svg class="border-1 border-gray-300"  
        width={newFloor.pageWidth + (2 * LASER_PADDING)} 
        height={newFloor.pageHeight + (2 * LASER_PADDING)}>
      <g transform={`translate(${LASER_PADDING}, ${LASER_PADDING})`}>
        {#each hitboxes as hitbox}
          {#if hitbox.type === 'wall'}
            <rect
              x={hitbox.origin[0]}
              y={hitbox.origin[1]}
              width={hitbox.width}
              height={hitbox.height}
              stroke="black"
              stroke-width="1"
              fill="none"
            />
          {:else if hitbox.type === 'floor'}
            {#each hitbox.panel.walls as wall, wallIndex}
              <line
                x1={wall.point1[0] + hitbox.origin[0]}
                y1={wall.point1[1] + hitbox.origin[1]}
                x2={wall.point2[0] + hitbox.origin[0]}
                y2={wall.point2[1] + hitbox.origin[1]}
                stroke="black"
                stroke-width="1"
              />
            {/each}
          {/if}
          
          {#if hitbox.panel?.features}
            {#each hitbox.panel.features as feature, featureIndex}
              <rect
                x={hitbox.origin[0] + feature.origin[0]}
                y={hitbox.origin[1] + feature.origin[1]}
                width={feature.width}
                height={feature.height}
                stroke="black"
                stroke-width="1"
                fill="none"
              />
            {/each}
          {/if}
        {/each}
      </g>
    </svg>
  {/each}
</div>

<FloorForm />