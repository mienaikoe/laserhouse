<script lang="ts">
    import type { Floor, Point, Wall } from "$lib/types.js";
    import { getContext } from "svelte";
    import paper from "paper";

    const { hitbox } = $props();

    let getFloor = getContext("floor") as () => Floor;
    let floor = getFloor();

    paper.setup(new paper.Size(floor?.pageWidth || 0, floor?.pageHeight || 0));

    const { materialThickness } = floor || { materialThickness: 0 };

    const getWallJointTabs = (
        point1: [number, number],
        point2: [number, number],
        wall: Wall,
        isInternal: boolean = false,
    ) => {
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
        const wallJointTabs: paper.Path[] = [];
        for (
            let tabCrawler = 0;
            tabCrawler * floor.jointTabLength < wallWidth;
            tabCrawler += 2
        ) {
            const x =
                wall.point1[0] +
                tabCrawler * floor.jointTabLength * unitVector.x;
            const y =
                wall.point1[1] +
                tabCrawler * floor.jointTabLength * unitVector.y;
            const distanceTravled = tabCrawler * floor.jointTabLength;
            const tabLength = Math.min(
                floor.jointTabLength,
                wallWidth - distanceTravled,
            );
            const tabHalfWidth = isInternal
                ? materialThickness / 2
                : materialThickness; // mega cuts for external walls

            const jointTab = new paper.Path();
            jointTab.add(new paper.Point(x, y));
            jointTab.add(
                new paper.Point(
                    x + orthoClockVector.x * tabHalfWidth,
                    y + orthoClockVector.y * tabHalfWidth,
                ),
            );
            jointTab.add(
                // up the length of the joint
                new paper.Point(
                    x +
                        orthoClockVector.x * tabHalfWidth +
                        unitVector.x * tabLength,
                    y +
                        orthoClockVector.y * tabHalfWidth +
                        unitVector.y * tabLength,
                ),
            );
            jointTab.add(
                // the far cap of the joint rectangle
                new paper.Point(
                    x +
                        unitVector.x * tabLength +
                        orthoCounterVector.x * tabHalfWidth,
                    y +
                        unitVector.y * tabLength +
                        orthoCounterVector.y * tabHalfWidth,
                ),
            );
            jointTab.add(
                // down the length of the joint
                new paper.Point(
                    x + orthoCounterVector.x * tabHalfWidth,
                    y + orthoCounterVector.y * tabHalfWidth,
                ),
            );
            jointTab.add(
                // back to the start point
                new paper.Point(x, y),
            );
            wallJointTabs.push(jointTab);
        }
        return wallJointTabs;
    };

    const basePolygon = new paper.Path();
    let floorPolygon: paper.PathItem | undefined = undefined;
    const jointTabs: paper.Path[] = [];
    floor.walls.forEach((wall, idx) => {
        const { point1, point2 } = wall;
        if (idx === 0) {
            const p1 = new paper.Point(point1[0], point1[1]);
            basePolygon.add(p1);
        }
        const p2 = new paper.Point(point2[0], point2[1]);
        basePolygon.add(p2);

        floorPolygon = basePolygon.clone();

        const wallJointTabs = getWallJointTabs(point1, point2, wall, false);

        jointTabs.push(...wallJointTabs);
    });

    jointTabs.forEach((tab) => {
        floorPolygon = floorPolygon?.subtract(tab);
    });

    // handle internal walls
    (floor.internalWalls ?? []).forEach((wall, wallIndex) => {
        const { point1, point2 } = wall;
        const internalWallJointTabs = getWallJointTabs(
            point1,
            point2,
            wall,
            true,
        );
        internalWallJointTabs.forEach((tab, tabIndex) => {
            floorPolygon = floorPolygon?.subtract(tab);
        });
    });
</script>

<g transform={`translate(${hitbox.origin[0]}, ${hitbox.origin[1]})`}>
    {#if floorPolygon}
        <path
            d={floorPolygon.pathData}
            fill="none"
            stroke="black"
            stroke-width="1"
        />
        {#each floor.walls as wall, wallIndex}
            <text
                x={wall.point1[0] + (wall.point2[0] - wall.point1[0]) / 2 + 10}
                y={wall.point1[1] + (wall.point2[1] - wall.point1[1]) / 2 + 10}
                fill="red"
                font-size="12"
                text-anchor="middle"
                dominant-baseline="central"
            >
                {wallIndex + 1}
            </text>
        {/each}
        {#each floor.internalWalls as wall, wallIndex}
            <text
                x={wall.point1[0] + (wall.point2[0] - wall.point1[0]) / 2 + 10}
                y={wall.point1[1] + (wall.point2[1] - wall.point1[1]) / 2 + 10}
                fill="red"
                font-size="12"
                text-anchor="middle"
                dominant-baseline="central"
            >
                {wallIndex + 1}
            </text>
        {/each}
    {/if}
</g>
