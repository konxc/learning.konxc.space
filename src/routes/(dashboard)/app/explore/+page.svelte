<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import Tabs from '$lib/components/ui/Tabs.svelte';
	import Heading from '$lib/components/ui/Heading.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
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
	<div class="space-y-12 pb-20 animate-in fade-in duration-1000">
		<header class="flex flex-col md:flex-row md:items-end justify-between gap-8 py-4">
			<div class="space-y-4">
				<div class="flex items-center gap-3">
					<div class="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></div>
					<span class="text-[10px] font-black tracking-[0.3em] text-zinc-400 uppercase">Knowledge Protocol</span>
				</div>
				<h1 class="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[0.85]">
					Explore <span class="bg-linear-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent italic">Catalog</span>
				</h1>
				<p class="max-w-xl text-base font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
					Discover high-performance learning tracks across five strategic domains. 
					Acquire industry-standard skills and join specialized cohorts.
				</p>
			</div>

			<div class="flex items-center gap-3">
				<button 
					onclick={() => showFilters = !showFilters}
					class={`h-11 px-6 rounded-2xl border transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-sm ${showFilters ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white' : 'bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-white dark:border-zinc-800'}`}
				>
					<Icon name={showFilters ? 'x' : 'filters'} size={14} />
					{showFilters ? 'Hide Tools' : 'Discovery Tools'}
				</button>
			</div>
		</header>

		<div class="border-b border-zinc-100 dark:border-zinc-800 pb-2">
			<Tabs
				queryParam="category"
				variant="action"
				tabs={[
					{ label: 'All Protocols', value: 'all' },
					{ label: 'Marketing', value: 'marketing', icon: '📢' },
					{ label: 'Technical', value: 'technical', icon: '💻' },
					{ label: 'Business', value: 'business', icon: '💼' },
					{ label: 'Soft Skills', value: 'soft_skills', icon: '🧠' },
					{ label: 'Creative', value: 'creative', icon: '🎨' }
				]}
			/>
		</div>

		<!-- Architectural Layout -->
		<div class="flex flex-col lg:flex-row gap-12 items-start">
			<!-- Discovery Feed -->
			<main class="flex-1 min-w-0">
				{#if filteredCourses.length === 0}
					<div class="flex flex-col items-center justify-center rounded-[3rem] border border-zinc-200 bg-zinc-50/50 py-32 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
						<div class="mb-8 text-7xl grayscale opacity-30">🧭</div>
						<h3 class="text-3xl font-black text-zinc-900 dark:text-white mb-4 italic tracking-tighter">Null Catalog State</h3>
						<p class="mt-2 max-w-sm text-sm font-medium text-zinc-500 uppercase tracking-widest leading-relaxed px-6">
							The current filter combination yielded zero matching tracks. Modify your protocol.
						</p>
						<button 
							onclick={clearFilters}
							class="mt-10 h-12 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl"
						>
							RESET FILTERS
						</button>
					</div>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
						{#each filteredCourses as course, i}
							{@const category = course.category?.toLowerCase() || 'general'}
							{@const catConfig = categoryConfig[category] || categoryConfig.general}
							<div
								class={`flex flex-col overflow-hidden ${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} hover:-translate-y-2 hover:shadow-2xl hover:border-blue-500/20 group animate-in fade-in slide-in-from-bottom-5 duration-700`}
								style="animation-delay: {i * 50}ms"
							>
								<!-- Visual Hub -->
								<div class="relative h-56 w-full overflow-hidden">
									{#if course.thumbnailUrl}
										<img src={course.thumbnailUrl} alt={course.title} class="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
									{:else}
										<div class={`flex h-full w-full items-center justify-center bg-linear-to-br ${catConfig.gradient} opacity-90 transition-all duration-1000 group-hover:scale-110`}>
											<span class="text-7xl group-hover:rotate-12 transition-transform duration-700">{catConfig.icon}</span>
										</div>
									{/if}
									<div class="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
									
									<!-- Level/Badge -->
									<div class="absolute top-4 left-4">
										<span class={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-sm ${catConfig.badge} border border-white/20`}>
											{category.replace('_', ' ')}
										</span>
									</div>
								</div>

								<div class="flex flex-1 flex-col p-8">
									<h3 class="text-xl font-black tracking-tight text-zinc-900 dark:text-white mb-3 line-clamp-1 italic uppercase group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
										{course.title}
									</h3>
									<p class="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-8 line-clamp-3 min-h-[60px] leading-relaxed italic">
										{course.description}
									</p>

									<div class="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800">
										<div class="flex items-center justify-between mb-8">
											<div class="flex flex-col">
												<span class="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Admissions</span>
												<span class="text-xl font-black tracking-tighter text-zinc-900 dark:text-white italic">Rp {course.price.toLocaleString('id-ID')}</span>
											</div>
											{#if course.duration}
												<div class="text-right">
													<span class="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Cycles</span>
													<p class="text-xs font-black tracking-widest text-blue-600 dark:text-blue-400 uppercase">{course.duration} Weeks</p>
												</div>
											{/if}
										</div>

										<div class="flex gap-3">
											<a 
												href="/app/explore/{course.id}" 
												class="flex-1 h-12 flex items-center justify-center rounded-2xl border border-zinc-200 bg-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-all text-zinc-600 dark:text-zinc-300 shadow-sm"
											>Details</a>
											<a 
												href="/app/explore/{course.id}/enroll" 
												class="flex-1 h-12 flex items-center justify-center rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-zinc-950/20 dark:shadow-white/5"
											>Enroll Now</a>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</main>

			<!-- Strategic Filter Panel -->
			{#if showFilters}
				<aside class="w-full lg:w-96 shrink-0 lg:sticky lg:top-32 animate-in slide-in-from-right-10 duration-700">
					<div class="p-8 rounded-[2.5rem] bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 shadow-2xl space-y-10 relative overflow-hidden">
						<!-- Atmospheric Accent -->
						<div class="absolute -top-10 -right-10 h-32 w-32 bg-blue-500/5 rounded-full blur-3xl"></div>
						
						<div class="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-6">
							<div class="flex items-center gap-3">
								<div class="h-2 w-2 rounded-full bg-blue-600"></div>
								<h3 class="text-xs font-black tracking-[0.2em] text-zinc-900 dark:text-white uppercase">Discovery Tools</h3>
							</div>
							<button onclick={clearFilters} class="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">Reset</button>
						</div>

						<div class="space-y-8">
							<div class="space-y-3">
								<label for="search" class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Input Search</label>
								<div class="group relative">
									<div class="absolute inset-y-0 left-4 flex items-center text-zinc-300 group-focus-within:text-blue-500 transition-colors">
										<Icon name="search" size={16} />
									</div>
									<input 
										type="text" 
										placeholder="Keywords..."
										bind:value={searchQuery}
										class="w-full h-14 bg-zinc-50 border-none dark:bg-zinc-800/50 rounded-2xl pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500/10 transition-all"
									/>
								</div>
							</div>

							<div class="space-y-3">
								<label for="sortBy" class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Sort Order</label>
								<select 
									bind:value={sortBy}
									class="w-full h-14 bg-zinc-50 border-none dark:bg-zinc-800/50 rounded-2xl px-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer"
								>
									<option value="newest">Recent Arrivals</option>
									<option value="price-low">Value Orientation</option>
									<option value="price-high">Premium Tiers</option>
									<option value="duration">Study Timeline</option>
								</select>
							</div>

							<div class="space-y-3">
								<label for="maxPrice" class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Budget Cap (RP)</label>
								<div class="relative">
									<span class="absolute inset-y-0 left-4 flex items-center text-[10px] font-black text-zinc-300 uppercase">Rp</span>
									<input 
										type="number"
										placeholder="Threshold..."
										bind:value={maxPrice}
										class="w-full h-14 bg-zinc-50 border-none dark:bg-zinc-800/50 rounded-2xl pl-10 pr-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500/10 transition-all"
									/>
								</div>
							</div>

							<div class="space-y-3">
								<label for="minDuration" class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Min Commitment (Weeks)</label>
								<input 
									type="number"
									placeholder="Timeline..."
									bind:value={minDuration}
									class="w-full h-14 bg-zinc-50 border-none dark:bg-zinc-800/50 rounded-2xl px-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500/10 transition-all"
								/>
							</div>
						</div>

						<div class="mt-4 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/30 text-center">
							<p class="text-[9px] font-black text-blue-700/70 dark:text-blue-300 uppercase tracking-widest">Matching <span class="text-blue-950 dark:text-white">{filteredCourses.length}</span> Protocols</p>
						</div>
					</div>
					
					<div class="mt-8 p-10 rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-zinc-800 text-center opacity-50 group transition-opacity hover:opacity-100">
						<p class="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] group-hover:text-zinc-600 transition-colors">Knowledge AI Assistant Coming Soon</p>
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
