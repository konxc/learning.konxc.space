<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import Tabs from '$lib/components/ui/Tabs.svelte';
	import Heading from '$lib/components/ui/Heading.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let sortBy = $state('newest');
	let maxPrice = $state<number | null>(null);
	let minDuration = $state<number | null>(null);
	let showFilters = $state(true);

	const selectedCategory = $derived($page.url.searchParams.get('category') ?? 'all');

	// Category configurations for adaptive cards
	const categoryConfig: Record<string, { icon: string; gradient: string; badge: string }> = {
		marketing: {
			icon: '📢',
			gradient: 'from-orange-500 to-red-500',
			badge: 'bg-orange-100 text-orange-700'
		},
		technical: {
			icon: '💻',
			gradient: 'from-blue-500 to-indigo-500',
			badge: 'bg-blue-100 text-blue-700'
		},
		business: {
			icon: '💼',
			gradient: 'from-green-500 to-emerald-500',
			badge: 'bg-green-100 text-green-700'
		},
		soft_skills: {
			icon: '🧠',
			gradient: 'from-purple-500 to-pink-500',
			badge: 'bg-purple-100 text-purple-700'
		},
		creative: {
			icon: '🎨',
			gradient: 'from-pink-500 to-rose-500',
			badge: 'bg-pink-100 text-pink-700'
		},
		general: {
			icon: '📚',
			gradient: 'from-blue-600 to-purple-600',
			badge: 'bg-blue-100 text-blue-700'
		}
	};

	function handleSearch(e: Event) {
		const target = e.target as HTMLInputElement;
		searchQuery = target.value.toLowerCase();
	}

	function handleSort(e: Event) {
		const target = e.target as HTMLSelectElement;
		sortBy = target.value;
	}

	function handleMaxPrice(e: Event) {
		const target = e.target as HTMLInputElement;
		maxPrice = target.value ? parseInt(target.value) : null;
	}

	function handleMinDuration(e: Event) {
		const target = e.target as HTMLInputElement;
		minDuration = target.value ? parseInt(target.value) : null;
	}

	function clearFilters() {
		searchQuery = '';
		sortBy = 'newest';
		maxPrice = null;
		minDuration = null;
		const url = new URL($page.url);
		url.searchParams.delete('category');
		window.history.pushState({}, '', url.pathname + url.search);
	}

	let filteredCourses = $derived.by(() => {
		let courses = data.courses;

		// Search filter
		if (searchQuery) {
			courses = courses.filter(
				(course) =>
					course.title.toLowerCase().includes(searchQuery) ||
					course.description.toLowerCase().includes(searchQuery)
			);
		}

		// Category filter
		if (selectedCategory !== 'all') {
			courses = courses.filter(
				(course) => (course.category?.toLowerCase() || 'general') === selectedCategory
			);
		}

		// Price filter
		const maxPriceFilter = maxPrice;
		if (maxPriceFilter !== null) {
			courses = courses.filter((course) => course.price <= maxPriceFilter);
		}

		// Duration filter
		const minDurationFilter = minDuration;
		if (minDurationFilter !== null) {
			courses = courses.filter((course) => {
				const { duration } = course;
				return typeof duration === 'number' && duration >= minDurationFilter;
			});
		}

		// Sort
		courses = [...courses].sort((a, b) => {
			switch (sortBy) {
				case 'price-low':
					return a.price - b.price;
				case 'price-high':
					return b.price - a.price;
				case 'duration':
					return (a.duration || 0) - (b.duration || 0);
				case 'newest':
				default:
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			}
		});

		return courses;
	});
</script>

<svelte:head>
	<title>Explore Catalog - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<div>
		<div class="space-y-6 md:space-y-8">
			<div>
				<Heading level="h1" class="mb-1">Explore Catalog</Heading>
				<p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
					Find and enroll in new courses to enhance your skills.
				</p>
			</div>

			<Tabs
				queryParam="category"
				variant="action"
				tabs={[
					{ label: 'All Categories', value: 'all' },
					{ label: 'Marketing', value: 'marketing', icon: '📢' },
					{ label: 'Technical', value: 'technical', icon: '💻' },
					{ label: 'Business', value: 'business', icon: '💼' },
					{ label: 'Soft Skills', value: 'soft_skills', icon: '🧠' },
					{ label: 'Creative', value: 'creative', icon: '🎨' }
				]}
			>
				{#snippet action()}
					<button
						class={`filter-toggle inline-flex items-center gap-2 rounded-2xl border border-zinc-200 px-5 py-2.5 text-[10px] font-black tracking-widest uppercase transition-all ${
							showFilters
								? 'bg-zinc-900 text-white shadow-xl hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
								: 'bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80'
						}`}
						onclick={() => (showFilters = !showFilters)}
						type="button"
					>
						<span class="text-xs">{showFilters ? '✕' : '🔍'}</span>
						{showFilters ? 'Close Tools' : 'Show Tools'}
					</button>
				{/snippet}
			</Tabs>
		</div>

		<!-- Two-Column Architectural Layout -->
		<div class="mt-8 flex flex-col gap-10 md:mt-10 lg:flex-row lg:items-start">
			<!-- MAIN CONTENT COLUMN: Flexible Space -->
			<main class="min-w-0 flex-1">
				<div class="courses-grid grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
					{#each filteredCourses as course}
						{@const category = course.category?.toLowerCase() || 'general'}
						{@const catConfig = categoryConfig[category] || categoryConfig.general}
						<div
							class={`flex flex-col overflow-hidden ${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${ELEVATION.base} ${ELEVATION.cardHover} ${ELEVATION.transition} group`}
						>
							<!-- Adaptive header based on category -->
							{#if course.thumbnailUrl}
								<div class="relative overflow-hidden">
									<img
										src={course.thumbnailUrl}
										alt={course.title}
										class="h-[220px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
										loading="lazy"
									/>
									<div
										class="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
									></div>
								</div>
							{:else}
								<div
									class={`flex h-[220px] w-full items-center justify-center bg-linear-to-br transition-all duration-700 group-hover:scale-110 ${catConfig.gradient}`}
								>
									<span class="text-7xl transition-transform duration-700 group-hover:rotate-12"
										>{catConfig.icon}</span
									>
								</div>
							{/if}

							<div class="flex flex-1 flex-col p-6 lg:p-7">
								<!-- Category badge -->
								<span
									class={`mb-4 inline-flex w-fit items-center rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${catConfig.badge}`}
								>
									{category.replace('_', ' ')}
								</span>

								<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-3 line-clamp-1 font-black`}>
									{course.title}
								</h3>
								<p
									class={`mb-6 line-clamp-3 min-h-[66px] text-sm leading-relaxed ${COLOR.textSecondary}`}
								>
									{course.description}
								</p>

								<div
									class="mb-5 flex items-center justify-between border-t border-zinc-100 pt-5 dark:border-zinc-800"
								>
									<span class="text-lg font-black text-blue-600 dark:text-blue-400"
										>Rp {course.price.toLocaleString('id-ID')}</span
									>
									{#if course.duration}
										<span class="text-xs font-bold tracking-widest text-zinc-400 uppercase"
											>{course.duration} weeks</span
										>
									{/if}
								</div>

								<div class="mt-auto flex gap-3">
									<a
										href="/app/explore/{course.id}"
										class={`flex-1 text-center no-underline ${RADIUS.button} border border-zinc-200 bg-white py-3 text-xs font-black tracking-widest uppercase transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800`}
										>Details</a
									>
									<a
										href="/app/explore/{course.id}/enroll"
										class={`flex-1 text-center no-underline ${RADIUS.button} ${COLOR.accentBg} py-3 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30 active:scale-95`}
										>Enroll</a
									>
								</div>
							</div>
						</div>
					{/each}
				</div>

				{#if filteredCourses.length === 0}
					<div
						class={`flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-zinc-200 bg-zinc-50/50 py-32 text-center dark:border-zinc-800 dark:bg-zinc-900/30`}
					>
						<div class="mb-6 text-7xl">🧭</div>
						<h3 class="text-2xl font-black text-zinc-900 dark:text-white">Empty Catalog</h3>
						<p class="mt-2 max-w-sm text-zinc-500">
							Your search didn't return any matches. Modify your filters to explore more
							opportunities.
						</p>
						{#if searchQuery || maxPrice !== null || minDuration !== null || selectedCategory !== 'all'}
							<button
								class={`mt-8 inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-10 py-4 text-xs font-black tracking-widest text-white uppercase shadow-2xl transition-all hover:scale-105 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900`}
								onclick={clearFilters}
							>
								Clear All Filters
							</button>
						{/if}
					</div>
				{/if}
			</main>

			<!-- RIGHT SIDEBAR COLUMN: Dedicated Space for Tools -->
			{#if showFilters}
				<aside class="w-full shrink-0 space-y-8 lg:sticky lg:top-[116px] lg:w-96">
					<!-- Floating Filter Widget -->
					<div
						class={`flex flex-col gap-8 rounded-[2.5rem] border border-white/20 bg-white/70 p-8 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.12)] backdrop-blur-3xl transition-all duration-500 dark:border-zinc-700/30 dark:bg-zinc-900/75 dark:shadow-[0_32px_80px_-20px_rgba(0,0,0,0.4)]`}
					>
						<div
							class="flex items-center justify-between border-b border-zinc-100 pb-6 dark:border-zinc-800"
						>
							<div class="flex items-center gap-3">
								<div class="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
								<h3 class={`${TEXT.h3} font-black tracking-tight uppercase`}>Filters</h3>
							</div>
							<button
								type="button"
								onclick={clearFilters}
								class="text-[10px] font-black tracking-widest text-blue-600 uppercase hover:underline dark:text-blue-400"
							>
								Reset All
							</button>
						</div>

						<div class="space-y-7">
							<!-- Search Input -->
							<div class="space-y-3">
								<label
									for="search"
									class="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase"
									>Keyword</label
								>
								<div class="group relative">
									<span
										class="absolute top-1/2 left-4 -translate-y-1/2 text-lg text-zinc-300 transition-colors group-focus-within:text-blue-500"
										>🔍</span
									>
									<input
										type="text"
										id="search"
										placeholder="e.g. Content Creator"
										value={searchQuery}
										oninput={handleSearch}
										class="w-full rounded-2xl border-none bg-zinc-50 py-4 pr-4 pl-12 text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500/20 dark:bg-zinc-800/50"
									/>
								</div>
							</div>

							<!-- Sort Select -->
							<div class="space-y-3">
								<label
									for="sortBy"
									class="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase"
									>Sort Order</label
								>
								<select
									id="sortBy"
									value={sortBy}
									onchange={handleSort}
									class="w-full rounded-2xl border-none bg-zinc-50 px-4 py-4 text-sm font-bold transition-all focus:ring-2 focus:ring-blue-500/20 dark:bg-zinc-800/50"
								>
									<option value="newest">Recent Additions</option>
									<option value="price-low">Most Affordable</option>
									<option value="price-high">Premium Access</option>
									<option value="duration">Study Duration</option>
								</select>
							</div>

							<!-- Price Range -->
							<div class="space-y-3">
								<label
									for="maxPrice"
									class="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase"
									>Affordability (Max Rp)</label
								>
								<div class="relative">
									<span
										class="absolute top-1/2 left-4 -translate-y-1/2 text-[10px] font-black text-zinc-400"
										>Rp</span
									>
									<input
										type="number"
										id="maxPrice"
										placeholder="Target price..."
										min="0"
										value={maxPrice || ''}
										oninput={handleMaxPrice}
										class="w-full rounded-2xl border-none bg-zinc-50 py-4 pr-4 pl-10 text-sm font-bold transition-all focus:ring-2 focus:ring-blue-500/20 dark:bg-zinc-800/50"
									/>
								</div>
							</div>

							<!-- Duration -->
							<div class="space-y-3">
								<label
									for="minDuration"
									class="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase"
									>Minimum Commitment</label
								>
								<div class="relative">
									<input
										type="number"
										id="minDuration"
										placeholder="Duration in weeks..."
										min="1"
										value={minDuration || ''}
										oninput={handleMinDuration}
										class="w-full rounded-2xl border-none bg-zinc-50 px-4 py-4 text-sm font-bold transition-all focus:ring-2 focus:ring-blue-500/20 dark:bg-zinc-800/50"
									/>
									<span
										class="absolute top-1/2 right-4 -translate-y-1/2 text-[10px] font-black text-zinc-400 uppercase"
										>weeks</span
									>
								</div>
							</div>
						</div>

						<div class="mt-4 rounded-2xl bg-blue-50/50 p-5 dark:bg-blue-900/10">
							<p
								class="text-center text-[10px] leading-relaxed font-bold text-blue-700/70 uppercase dark:text-blue-300/60"
							>
								Discovery Engine matching <span class="text-blue-700 dark:text-blue-300"
									>{filteredCourses.length}</span
								> results
							</p>
						</div>
					</div>

					<!-- Future Tools Placeholder -->
					<div
						class="rounded-[2.5rem] border border-dashed border-zinc-200 p-10 text-center dark:border-zinc-800"
					>
						<p class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
							Additional Tools Coming Soon
						</p>
					</div>
				</aside>
			{/if}
		</div>
	</div>
</PageWrapper>

<style>
	:global(.scrollbar-hide::-webkit-scrollbar) {
		display: none;
	}
	:global(.scrollbar-hide) {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
