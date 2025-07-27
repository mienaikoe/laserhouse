<script lang="ts">
    import type { Floor, Point } from "$lib/types.js";
    import { getContext } from "svelte";

    const { hitbox } = $props();

    const floor = getContext('floor') as Floor;

    const JOINT_INCREMENT = 10; // mm

    const lines: [Point, Point][] = [];

    const horizontalLine = (xStart: number, xEnd: number, yStart: number) => {
        for( let i = 0; i * JOINT_INCREMENT < xEnd; i++) {
            const x1 = xStart + (i * JOINT_INCREMENT);
            const x2 = xStart + ((i + 1) * JOINT_INCREMENT);
            const isCutIn = i % 2 === 0; // alternate between cut in and cut out
            const y = yStart + (isCutIn ? floor.materialThickness : 0); // cut in at
            lines.push([
                [x1, y],
                [x2, y]
            ]);
            if( x2 < xEnd ) {
                lines.push([
                    [x2, y],
                    [x2, y + (isCutIn ? -floor.materialThickness : floor.materialThickness)]
                ]);
            } 
            if( x1 === xStart && isCutIn) {
                lines.push([
                    [x1, y],
                    [x1, y -floor.materialThickness]
                ]);
            }
        }
    }

    const verticalLine = (yStart: number, yEnd: number, xStart: number) => {
        for( let i = 0; i * JOINT_INCREMENT < yEnd; i++) {
            const y1 = yStart + (i * JOINT_INCREMENT);
            const y2 = yStart + ((i + 1) * JOINT_INCREMENT);
            const isCutIn = i % 2 === 0; // alternate between cut in and cut out
            const x = xStart + (isCutIn ? floor.materialThickness : 0); // cut in at
            lines.push([
                [x, y1],
                [x, y2]
            ]);
            if( y2 < yEnd) {
                lines.push([
                    [x, y2],
                    [x + (isCutIn ? -floor.materialThickness : floor.materialThickness), y2]
                ]);
            }
            if( y1 === yStart && isCutIn) {
                lines.push([
                    [x, y2],
                    [x - floor.materialThickness, y2]
                ]);
            }
        }
    }

    floor.walls.forEach(wall => {
        const { point1, point2 } = wall;
        const x1 = point1[0];
        const y1 = point1[1];
        const x2 = point2[0];
        const y2 = point2[1];

        if( x1 === x2 ){
            // vertical wall
            verticalLine(
                y1 > y2 ? y2 : y1, 
                y1 > y2 ? y1 : y2, 
                x1
            );
        } else if( y1 === y2 ) {
            // horizontal wall
            horizontalLine(
                x1 > x2 ? x2 : x1, 
                x1 > x2 ? x1 : x2, 
                y1
            );
        } else {
            // diagonal wall
            console.warn("Diagonal walls are not supported yet.");
        }
    });
</script>


<g transform={`translate(${hitbox.origin[0]}, ${hitbox.origin[1]})`}>
    {#each lines as pointPair, index}
        <line x1={pointPair[0][0]} y1={pointPair[0][1]} 
            x2={pointPair[1][0]} y2={pointPair[1][1]} 
            stroke="orange" stroke-width="1" />
    {/each}
</g>
