<script lang="ts">
  let props = $props();
  const {feature, index} = props;
</script>

<div>
  <label for={`feature-${index}`} class="text-sm font-medium">
    Feature {index + 1}
  </label>
  <div class="flex flex-col items-center gap-2">
    <div class="flex flex-row flex-1  w-full gap-2">
      <input
        type="text"
        id={`feature-${index}-x`}
        value={feature?.point1[0]}
        class="flex-1 w-[50%]"
        placeholder="x"
      />
      <input
        type="text"
        id={`feature-${index}-y`}
        value={feature?.point1[1]}
        class="flex-1 w-[50%]"
        placeholder="y"
      />
    </div>
    <div class="flex flex-row flex-1  w-full  gap-2">
      <input
        type="text"
        id={`feature-${index}-width`}
        value={feature?.point1[0]}
        class="flex-1 w-[50%]"
        placeholder="x"
      />
      <input
        type="text"
        id={`feature-${index}-height`}
        value={feature.point1[1]}
        class="flex-1 w-[50%]"
        placeholder="y"
      />
    </div>
  </div>

</div>