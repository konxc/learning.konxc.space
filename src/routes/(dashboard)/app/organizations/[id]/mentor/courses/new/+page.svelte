<script lang="ts">
	import CourseWizard from '$lib/components/app/mentor/CourseBuilder/CourseWizard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Kursus Baru - Naik Kelas</title>
</svelte:head>

<CourseWizard orgId={data.membership?.orgId} />
