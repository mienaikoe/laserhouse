<script lang="ts">
    import type { Floor, Point } from "$lib/types.js";
    import { getContext } from "svelte";
    import paper from "paper";

    const { hitbox, wall } = $props();

    let getFloor = getContext("floor") as () => Floor;
    let floor = getFloor();

    const JOINT_INCREMENT = 10; // mm

    const width = hitbox.width;
    const height = hitbox.height;
    const { materialThickness } = floor || { materialThickness: 0 };

    paper.setup(new paper.Size(floor?.pageWidth || 0, floor?.pageHeight || 0));

    const basePolygon = new paper.Path();
    let cutPolygon: paper.PathItem | undefined = $state(undefined);
    const jointTabs: paper.Path[] = [];

    basePolygon.add(new paper.Point(0, 0));
    basePolygon.add(new paper.Point(width, 0));
    basePolygon.add(new paper.Point(width, height));
    basePolygon.add(new paper.Point(0, height));
    basePolygon.add(new paper.Point(0, 0));

    basePolygon.curves.forEach((side, idx) => {
        const { point1, point2 } = side;

        const wallWidth = Math.sqrt(
            Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2),
        );
        const unitVector = new paper.Point(
            (point2.x - point1.x) / wallWidth,
            (point2.y - point1.y) / wallWidth,
        );
        const orthoClockVector = new paper.Point(unitVector.y, -unitVector.x);
        const orthoCounterVector = new paper.Point(-unitVector.y, unitVector.x);
        for (
            let tabCrawler = 0;
            tabCrawler * JOINT_INCREMENT < wallWidth;
            tabCrawler += 2
        ) {
            const x = point1.x + tabCrawler * JOINT_INCREMENT * unitVector.x;
            const y = point1.y + tabCrawler * JOINT_INCREMENT * unitVector.y;

            const jointTab = new paper.Path();
            jointTab.add(new paper.Point(x, y));
            jointTab.add(
                new paper.Point(
                    Math.max(0, x + orthoClockVector.x * materialThickness),
                    Math.max(0, y + orthoClockVector.y * materialThickness),
                ),
            );
            jointTab.add(
                // up the length of the joint
                new paper.Point(
                    Math.max(
                        0,
                        x +
                            orthoClockVector.x * materialThickness +
                            unitVector.x * JOINT_INCREMENT,
                    ),
                    Math.max(
                        0,
                        y +
                            orthoClockVector.y * materialThickness +
                            unitVector.y * JOINT_INCREMENT,
                    ),
                ),
            );
            jointTab.add(
                // the far cap of the joint rectangle
                new paper.Point(
                    Math.max(
                        0,
                        x +
                            unitVector.x * JOINT_INCREMENT +
                            orthoCounterVector.x * materialThickness,
                    ),
                    Math.max(
                        0,
                        y +
                            unitVector.y * JOINT_INCREMENT +
                            orthoCounterVector.y * materialThickness,
                    ),
                ),
            );
            jointTab.add(
                // down the length of the joint
                new paper.Point(
                    Math.max(0, x + orthoCounterVector.x * materialThickness),
                    Math.max(0, y + orthoCounterVector.y * materialThickness),
                ),
            );
            jointTab.add(
                // back to the start point
                new paper.Point(x, y),
            );
            jointTab.closed = true;
            jointTabs.push(jointTab);
        }
        cutPolygon = basePolygon.clone();
        jointTabs.forEach((tab, idx) => {
            cutPolygon = cutPolygon?.subtract(tab);
        });
    });
</script>

<g transform={`translate(${hitbox.origin[0]}, ${hitbox.origin[1]})`}>
    {#if cutPolygon}
        <path
            d={cutPolygon.pathData}
            fill="none"
            stroke="black"
            stroke-width="1"
        />
    {/if}
    {#if hitbox.panel?.features}
        {#each hitbox.panel.features as feature}
            <rect
                x={feature.origin[0]}
                y={feature.origin[1]}
                width={feature.width}
                height={feature.height}
                stroke={feature.type === "cut" ? "black" : "magenta"}
                stroke-width="1"
                fill="none"
            />
        {/each}
    {/if}
</g>
