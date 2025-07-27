<script lang="ts">
    import type { Floor } from "$lib/types.js";
    import { getContext, setContext } from "svelte";

  let props = $props();
  const {feature, index, wallIndex} = props;

  const floor = getContext('floor') as Floor;

  let originX = $state(feature?.origin[0]);
  let originY = $state(feature?.origin[1]);
  let width = $state(feature?.width);
  let height = $state(feature?.height);

  $effect(() => {
    floor.walls[wallIndex].features[index] = {
      origin: [originX || 0, originY || 0],
      width: width || 0,
      height: height || 0,
    };
    setContext('floor', {...floor});
  });

</script>

<div>
  <h6>
    Feature {index + 1}
  </h6>
  <div class="flex flex-col items-center gap-2">
    <div class="flex flex-row flex-1 w-full gap-2">
      <div class="flex flex-col flex-1 w-[50%]">
      <label for={`feature-${index}-x`} class="text-sm">X </label>
      <input
        type="text"
        id={`feature-${index}-x`}
        bind:value={originX}
        placeholder="x"
      />
      </div>
      <div class="flex flex-col flex-1 w-[50%]">
      <label for={`feature-${index}-y`} class="text-sm">Y </label>
      <input
        type="text"
        id={`feature-${index}-y`}
        bind:value={originY}
        placeholder="y"
      />
      </div>
    </div>
    <div class="flex flex-row flex-1  w-full  gap-2">
      <div class="flex flex-col flex-1 w-[50%]">
      <label for={`feature-${index}-width`} class="text-sm">Width</label>
      <input
        type="text"
        id={`feature-${index}-width`}
        bind:value={width}
        placeholder="x"
      />
      </div>
      <div  class="flex flex-col flex-1 w-[50%]">
      <label for={`feature-${index}-height`} class="text-sm">Height</label>
      <input
        type="text"
        id={`feature-${index}-height`}
        bind:value={height}
        placeholder="y"
      />
      </div>
    </div>
  </div>

</div>