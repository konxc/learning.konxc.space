<script lang="ts">
	import { brandMode, toggleBrandMode } from '$lib/stores/brandMode';
	import FloatingActionButton from './FloatingActionButton.svelte';

	const label = $derived($brandMode === 'chill' ? 'Chill Mode' : 'Hardcore Mode');
</script>

<FloatingActionButton {label} onClick={toggleBrandMode} ariaLabel="Toggle brand mode" />
