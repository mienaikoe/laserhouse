<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="w-full h-8 bg-red-100 flex items-center justify-center text-center">
	<h6 class="text-center">Laser House</h6>
</div>

{@render children()}
