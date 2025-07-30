<script lang="ts">
    import type { Floor, Point } from "$lib/types.js";
    import { getContext } from "svelte";
    import paper from "paper";

    const { hitbox } = $props();

    let getFloor = getContext("floor") as () => Floor;
    let floor = getFloor();

    const JOINT_INCREMENT = 10; // mm

    paper.setup(new paper.Size(floor?.pageWidth || 0, floor?.pageHeight || 0));

    const basePolygon = new paper.Path();
    let floorPolygon: paper.PathItem | undefined = undefined;
    const jointTabs: paper.Path[] = [];
    const { materialThickness } = floor || { materialThickness: 0 };
    floor.walls.forEach((wall, idx) => {
        const { point1, point2 } = wall;
        if (idx === 0) {
            const p1 = new paper.Point(point1[0], point1[1]);
            basePolygon.add(p1);
        }
        const p2 = new paper.Point(point2[0], point2[1]);
        basePolygon.add(p2);

        const wallWidth = Math.sqrt(
            Math.pow(point2[0] - point1[0], 2) +
                Math.pow(point2[1] - point1[1], 2),
        );
        const unitVector = new paper.Point(
            (point2[0] - point1[0]) / wallWidth,
            (point2[1] - point1[1]) / wallWidth,
        );
        const orthoClockVector = new paper.Point(unitVector.y, -unitVector.x);
        const orthoCounterVector = new paper.Point(-unitVector.y, unitVector.x);
        for (
            let tabCrawler = 0;
            tabCrawler * JOINT_INCREMENT < wallWidth;
            tabCrawler += 2
        ) {
            const x =
                wall.point1[0] + tabCrawler * JOINT_INCREMENT * unitVector.x;
            const y =
                wall.point1[1] + tabCrawler * JOINT_INCREMENT * unitVector.y;
            const jointTab = new paper.Path();
            jointTab.add(new paper.Point(x, y));
            jointTab.add(
                new paper.Point(
                    x + orthoClockVector.x * materialThickness,
                    y + orthoClockVector.y * materialThickness,
                ),
            );
            jointTab.add(
                // up the length of the joint
                new paper.Point(
                    x +
                        orthoClockVector.x * materialThickness +
                        unitVector.x * JOINT_INCREMENT,
                    y +
                        orthoClockVector.y * materialThickness +
                        unitVector.y * JOINT_INCREMENT,
                ),
            );
            jointTab.add(
                // the far cap of the joint rectangle
                new paper.Point(
                    x +
                        unitVector.x * JOINT_INCREMENT +
                        orthoCounterVector.x * materialThickness,
                    y +
                        unitVector.y * JOINT_INCREMENT +
                        orthoCounterVector.y * materialThickness,
                ),
            );
            jointTab.add(
                // down the length of the joint
                new paper.Point(
                    x + orthoCounterVector.x * materialThickness,
                    y + orthoCounterVector.y * materialThickness,
                ),
            );
            jointTab.add(
                // back to the start point
                new paper.Point(x, y),
            );
            jointTabs.push(jointTab);
        }
        floorPolygon = basePolygon.clone();
        jointTabs.forEach((tab) => {
            floorPolygon = floorPolygon?.subtract(tab);
        });
    });
</script>

<g transform={`translate(${hitbox.origin[0]}, ${hitbox.origin[1]})`}>
    {#if floorPolygon}
        <path
            d={floorPolygon.pathData}
            fill="none"
            stroke="orange"
            stroke-width="1"
        />
    {/if}
</g>
