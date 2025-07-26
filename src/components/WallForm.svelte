<script lang="ts">
  import FeatureForm from "./FeatureForm.svelte";

  let props = $props();
  const {wall, index} = props;

  const features = $state(wall.features);

  const addFeature = () => {
    // Logic to add a new feature to the wall
    console.log(`Add feature to wall ${index}`);
    features.push({
      point1: [0, 0],
      point2: [0, 0],
      width: 10,
      height: 10,
    });
  }
</script>

<div>
  <label for={`wall-${index}`} class="text-sm font-medium">
    Wall {index + 1}
  </label>
  <div class="flex flex-col gap-2">
    <div class="flex flex-row flex-1  w-full gap-2">
      <input
        type="text"
        id={`wall-${index}-x`}
        value={wall.point1[0]}
        class="flex-1 w-[50%]"
        placeholder="x"
      />
      <input
        type="text"
        id={`wall-${index}-y`}
        value={wall.point1[1]}
        class="flex-1 w-[50%]"
        placeholder="y"
      />
    </div>


    <h6>Features</h6>


    <div class="border-l-1 border-gray-300 pl-2 flex flex-col gap-2">
      {#each features as feature, featureIndex}
        <FeatureForm feature={feature}  index={featureIndex} />
      {/each}

      <button class="bg-blue-300 py-1 px-4 rounded cursor-pointer" onclick={addFeature}>
        + Add Feature
      </button>
    </div>
  </div>

</div>