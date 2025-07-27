<script lang="ts">
    import type { Floor, Point } from "$lib/types.js";
    import { getContext } from "svelte";

    const { hitbox, wall } = $props();

    const floor = getContext('floor') as Floor;

    const JOINT_INCREMENT = 10; // mm

    const lines: [Point, Point][] = [];

    const origin = hitbox.origin;
    const width = hitbox.width;
    const height = hitbox.height;

    // Top line (from 0,0 to width,0)
    // does not interlock!
    lines.push([
        [0, 0],
        [width, 0]
    ]);
    // Right line (from width,0 to width,height)
    for( let i = 0; i * JOINT_INCREMENT < height; i++) {
        const y1 = i * JOINT_INCREMENT;
        const y2 = (i + 1) * JOINT_INCREMENT;
        const isCutIn = i % 2 === 0; // alternate between cut in and cut out
        const x = width - (isCutIn ? floor.materialThickness : 0); // cut in at
        lines.push([
            [x, y1],
            [x, y2]
        ]);
        if( y2 < height) {
            lines.push([
                [x, y2],
                [x + (isCutIn ? floor.materialThickness : -floor.materialThickness), y2]
            ]);
        }
    }
    // Bottom line (from width,height to 0,height)
    for( let i = 0; i * JOINT_INCREMENT < width; i++) {
        const x1 = i * JOINT_INCREMENT;
        const x2 = (i + 1) * JOINT_INCREMENT;
        const isCutIn = i % 2 === 0; // alternate between cut in and cut out
        const y = height - (isCutIn ? floor.materialThickness : 0); // cut in at
        lines.push([
            [x1, y],
            [x2, y]
        ]);
        if( x2 < width) {
            lines.push([
                [x2, y],
                [x2, y + (isCutIn ? floor.materialThickness : -floor.materialThickness)]
            ]);
        }
    }
    // Left line (from 0,height to 0,0)
    // uses staggered cuts to create a zig-zag pattern
    for( let i = 0; i * JOINT_INCREMENT < height; i++) {
        const y1 = i * JOINT_INCREMENT;
        const y2 = (i + 1) * JOINT_INCREMENT;
        const isCutIn = i % 2 === 1; // alternate between cut in and cut out
        const x = isCutIn ? floor.materialThickness : 0; // cut in at
        lines.push([
            [x, y1],
            [x, y2]
        ]);
        if( y2 < height) {
            lines.push([
                [x, y2],
                [x + (isCutIn ? -floor.materialThickness : floor.materialThickness), y2]
            ]);
        }
    }
</script>


<g transform={`translate(${hitbox.origin[0]}, ${hitbox.origin[1]})`}>
    {#each lines as pointPair}
        <line 
            x1={pointPair[0][0]} y1={pointPair[0][1]} 
            x2={pointPair[1][0]} y2={pointPair[1][1]} 
            stroke="black" 
            stroke-width="1" 
        />
    {/each}
    {#if hitbox.panel?.features}
        {#each hitbox.panel.features as feature}
            <rect
                x={feature.origin[0]}
                y={feature.origin[1]}
                width={feature.width}
                height={feature.height}
                stroke={feature.type === 'cut' ? 'black' : 'magenta'}
                stroke-width="1"
                fill="none"
            />
        {/each}
    {/if}
</g>

