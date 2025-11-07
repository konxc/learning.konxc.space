<script lang="ts">
	import FloatingActionButton from './FloatingActionButton.svelte';

	function scrollToNext() {
		const aboutSection = document.querySelector('#about');
		if (aboutSection) {
			aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
</script>

<FloatingActionButton
	label="Scroll untuk tahu lebih lanjut"
	icon="↓"
	onClick={scrollToNext}
	ariaLabel="Scroll ke section berikutnya"
	animate={true}
/>
