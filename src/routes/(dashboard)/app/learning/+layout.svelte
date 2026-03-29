<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { updateQueryParam } from '$lib/utils/url-params';
	import { RADIUS, COLOR, SPACING, TRANSITION, TEXT } from '$lib/config/design';
	import Tabs from '$lib/components/ui/Tabs.svelte';
	import Heading from '$lib/components/ui/Heading.svelte';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';

	let { children }: { children: Snippet } = $props();

	let searchQuery = $state($page.url.searchParams.get('q') || '');

	async function handleSearch(e: Event) {
		e.preventDefault();
		await updateQueryParam($page.url, 'q', searchQuery || null, goto);
	}

	const learningTabs = [
		{ label: 'Active Courses', value: 'courses' },
		{ label: 'Progress & Analytics', value: 'progress' },
		{ label: 'Weekly Checkpoints', value: 'checkpoints' },
		{ label: 'Certificates', value: 'certificates' }
	];
</script>

<PageWrapper>
	<div>
		<div class="space-y-6 md:space-y-8">
			<div>
				<Heading level="h1" class="mb-1">My Learning</Heading>
				<p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
					Track your progress and access your enrolled courses.
				</p>
			</div>

			<Tabs tabs={learningTabs} basePath="/app/learning" variant="action">
				{#snippet action()}
					<div class="flex items-center gap-3">
						<form onsubmit={handleSearch} class="relative flex items-center">
							<input
								type="text"
								bind:value={searchQuery}
								placeholder="Search curriculum..."
								class={`${RADIUS.input} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.input} ${TEXT.body} h-10 w-64 pr-10 outline-none ${TRANSITION.all} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`}
							/>
							<button
								type="submit"
								class="absolute right-3 text-neutral-400 hover:text-blue-500"
								aria-label="Cari"
							>
								🔍
							</button>
						</form>

						<div class="h-6 w-px bg-zinc-200 dark:bg-zinc-800"></div>

						<a
							href="/app/explore"
							class="inline-flex items-center gap-2 rounded-xl border border-zinc-200/50 px-4 py-2 text-sm font-semibold tracking-tight transition-all hover:bg-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-zinc-800/50 dark:hover:bg-zinc-800 dark:focus-visible:ring-offset-neutral-900"
						>
							<span aria-hidden="true">🧭</span>
							Explore Catalog
						</a>
					</div>
				{/snippet}
			</Tabs>
		</div>

		<div class="mt-8 md:mt-10">
			{@render children()}
		</div>
	</div>
</PageWrapper>
