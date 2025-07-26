<script lang="ts">
  const makerjs = require("makerjs");

  const line = {
    type: "line",
    origin: [0, 0],
    end: [50, 50],
  };

  const svg = makerjs.exporter.toSVG(line);
</script>

<!-- markup (zero or more items) goes here -->
<div class="lh-canvas">
  {@html svg}
</div>

<style>
  /* styles go here */
  .lh-canvas {
    width: 500px;
    height: 500px;
  }
</style>
