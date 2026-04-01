<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('id-ID', {
			dateStyle: 'long'
		}).format(new Date(date));
	}
</script>

<svelte:head>
	<title>Certificates - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="Certificates" description="Your earned certificates from completed courses" />

	{#if data.certificates.length === 0}
		<PageSection>
			<div class="py-16 text-center">
				<div class="mb-4 text-6xl">🎓</div>
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>No Certificates Yet</h3>
				<p class={`${TEXT.body} ${COLOR.textMuted} mb-6`}>
					Complete your first course to earn a certificate!
				</p>
				<a
					href="/app/learning"
					class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-6 py-3 ${TEXT.button} text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5`}
				>
					View My Courses
				</a>
			</div>
		</PageSection>
	{:else}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.certificates as cert}
				<a
					href="/app/learning/certificates/{cert.id}"
					class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} overflow-hidden ${TRANSITION.all} hover:-translate-y-1 ${ELEVATION.cardHover}`}
				>
					<div
						class="flex aspect-video items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600"
					>
						<span class="text-6xl">🎓</span>
					</div>
					<div class="p-4">
						<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-1 line-clamp-2`}>
							{cert.course.title}
						</h3>
						<p class={`${TEXT.small} ${COLOR.textMuted} mb-2`}>
							{formatDate(cert.issuedAt)}
						</p>
						<p class={`${TEXT.small} font-mono ${COLOR.accent}`}>
							{cert.serial}
						</p>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</PageWrapper>
