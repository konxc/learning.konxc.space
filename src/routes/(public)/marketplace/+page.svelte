<script lang="ts">
	import type { PageData } from './$types';
	import { 
		COLOR, 
		TEXT, 
		RADIUS, 
		ELEVATION, 
		TRANSITION, 
		GRADIENT, 
		SPACING 
	} from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { fly, fade } from 'svelte/transition';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let sortBy = $state('newest');
	let maxPrice = $state<number | null>(null);
	let minDuration = $state<number | null>(null);
	let maxDuration = $state<number | null>(null);

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
		const target = e.target as HTMLSelectElement;
		minDuration = target.value && target.value !== '' ? parseInt(target.value) : null;
	}

	function handleMaxDuration(e: Event) {
		const target = e.target as HTMLSelectElement;
		maxDuration = target.value && target.value !== '' ? parseInt(target.value) : null;
	}

	function clearFilters() {
		searchQuery = '';
		sortBy = 'newest';
		maxPrice = null;
		minDuration = null;
		maxDuration = null;
	}

	// Get unique price points and durations for filters
	let maxPriceValue = $derived(Math.max(...data.courses.map((c: any) => c.price), 0) || 10000000);

	let filteredCourses = $derived.by(() => {
		let courses = data.courses;

		// Search filter
		if (searchQuery) {
			courses = courses.filter(
				(course: any) =>
					course.title.toLowerCase().includes(searchQuery) ||
					course.description.toLowerCase().includes(searchQuery) ||
					course.mentor?.fullName?.toLowerCase().includes(searchQuery) ||
					course.mentor?.username?.toLowerCase().includes(searchQuery)
			);
		}

		// Price filter
		const maxPriceFilter = maxPrice;
		if (maxPriceFilter !== null) {
			courses = courses.filter((course: any) => course.price <= maxPriceFilter);
		}

		// Duration filter
		const minDurationFilter = minDuration;
		const maxDurationFilter = maxDuration;
		if (minDurationFilter !== null || maxDurationFilter !== null) {
			courses = courses.filter((course: any) => {
				if (!course.duration) {
					if (minDurationFilter !== null && maxDurationFilter !== null) return false;
					if (minDurationFilter !== null) return false;
					return true;
				}
				if (minDurationFilter !== null && course.duration < minDurationFilter) return false;
				if (maxDurationFilter !== null && course.duration > maxDurationFilter) return false;
				return true;
			});
		}

		// Sort
		courses = [...courses].sort((a: any, b: any) => {
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

	let activeFilterCount = $derived.by(() => {
		let count = 0;
		if (searchQuery) count++;
		if (maxPrice !== null) count++;
		if (minDuration !== null) count++;
		if (maxDuration !== null) count++;
		return count;
	});
</script>

<svelte:head>
	<title>Course Marketplace - Naik Kelas</title>
	<meta
		name="description"
		content="Pelajari programming, AI tools, dan bangun project nyata bersama mentor berpengalaman. Bangun portfolio dan tingkatkan karier tech kamu!"
	/>
	<meta
		name="keywords"
		content="kursus programming, belajar coding, web development, python, AI tools, marketplace kursus"
	/>
	<link rel="canonical" href="https://learning.konxc.space/marketplace" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://learning.konxc.space/marketplace" />
	<meta property="og:title" content="Course Marketplace - Naik Kelas" />
	<meta
		property="og:description"
		content="Temukan berbagai kursus programming, AI tools, dan web development dari mentor berpengalaman."
	/>
	<meta property="og:image" content="https://learning.konxc.space/og-image.png" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://learning.konxc.space/marketplace" />
	<meta name="twitter:title" content="Course Marketplace - Naik Kelas" />
	<meta
		name="twitter:description"
		content="Temukan berbagai kursus programming, AI tools, dan web development dari mentor berpengalaman."
	/>
	<meta name="twitter:image" content="https://learning.konxc.space/og-image.png" />
</svelte:head>

<div class={`min-h-screen ${COLOR.bg} selection:bg-blue-500/20 animate-in fade-in duration-1000 uppercase-badges`}>
	<!-- Immersive Knowledge Hero -->
	<div class="relative overflow-hidden pt-32 pb-24 md:pt-48 md:pb-32">
		<!-- Ultra-Layered Background -->
		<div class="absolute inset-0 -z-20 bg-linear-to-b from-blue-50/50 to-white dark:from-zinc-950 dark:to-zinc-950"></div>
		<div class="absolute top-0 left-1/2 -z-10 h-[800px] w-[140%] -translate-x-1/2 rounded-[100%] bg-linear-to-b from-blue-400/5 via-transparent to-transparent blur-3xl dark:from-blue-600/5"></div>
		<div class="absolute -top-40 -right-40 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-600/5 animate-pulse"></div>
		<div class="absolute top-1/4 -left-40 -z-10 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[100px] dark:bg-purple-600/5"></div>

		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="flex flex-col items-center text-center space-y-10" in:fade={{ duration: 1000 }}>
				<div class="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-blue-100 bg-white/50 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50 shadow-sm">
					<div class="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></div>
					<span class="text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">Knowledge Marketplace</span>
				</div>
				
				<div class="space-y-6">
					<h1 class="mx-auto max-w-5xl text-6xl font-black tracking-tighter text-zinc-900 md:text-8xl dark:text-white leading-[0.85]">
						Elevate Your Career with <span class="bg-linear-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent italic px-2">Expert-Led Tracks</span>
					</h1>
					<p class="mx-auto max-w-2xl text-lg font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
						Discover industry-standard tech, AI fundamentals, and digital marketing strategies from 
						professional practitioners. Outcome-driven learning starts here.
					</p>
				</div>

				<!-- Command Palette Search -->
				<div class="w-full max-w-3xl" in:fly={{ y: 30, duration: 800, delay: 300 }}>
					<div class="group relative overflow-hidden rounded-[2.5rem] border border-blue-100 bg-white p-2 shadow-2xl transition-all hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
						<div class="flex items-center px-6 py-4">
							<div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
								<Icon name="search" size={20} />
							</div>
							<input
								type="text"
								placeholder="Explore tracks by skill, tool, or mentor..."
								value={searchQuery}
								oninput={handleSearch}
								class="flex-1 border-none bg-transparent px-6 text-xl font-black tracking-tight text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-0 dark:text-white"
							/>
							<div class="hidden items-center gap-3 md:flex">
								<div class="h-8 w-px bg-zinc-100 dark:bg-zinc-800"></div>
								<span class="px-4 py-1.5 rounded-xl border border-zinc-100 bg-zinc-50 text-[10px] font-black text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 uppercase tracking-widest whitespace-nowrap">
									{filteredCourses.length} TRACKS FOUND
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Strategic Catalog Interface -->
	<div class="mx-auto max-w-7xl px-6 pb-40 lg:px-8">
		<div class="grid grid-cols-1 gap-16 lg:grid-cols-12">
			
			<!-- Professional Filter Board -->
			<aside class="lg:col-span-3">
				<div class="sticky top-32 space-y-12">
					<div class="space-y-8">
						<div class="flex items-center justify-between border-b border-zinc-100 pb-5 dark:border-zinc-800">
							<h3 class="text-xs font-black tracking-[0.2em] text-zinc-900 uppercase dark:text-white">Refine Discovery</h3>
							{#if activeFilterCount > 0}
								<button 
									onclick={clearFilters}
									class="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline"
								>
									RESET ALL
								</button>
							{/if}
						</div>

						<!-- Filter Groups Modernized -->
						<div class="space-y-6">
							<div class="space-y-3">
								<label for="sort" class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sequence Order</label>
								<div class="relative group">
									<select 
										id="sort" 
										value={sortBy} 
										onchange={handleSort} 
										class={`w-full h-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 ${RADIUS.button} px-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer`}
									>
										<option value="newest">Latest Releases</option>
										<option value="price-low">Value: Low to High</option>
										<option value="price-high">Value: High to Low</option>
										<option value="duration">Fastest Completion</option>
									</select>
								</div>
							</div>

							<div class="space-y-3">
								<label for="max-price" class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Capital Threshold</label>
								<div class="relative h-12">
									<span class="absolute inset-y-0 left-4 flex items-center text-xs font-black text-zinc-400">RP</span>
									<input
										id="max-price"
										type="number"
										placeholder="Unlimited"
										value={maxPrice || ''}
										oninput={handleMaxPrice}
										class={`w-full h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 pl-12 pr-4 ${RADIUS.button} text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500/20 transition-all`}
										min="0"
										max={maxPriceValue}
									/>
								</div>
							</div>

							<div class="grid grid-cols-2 gap-4 lg:grid-cols-1">
								<div class="space-y-3">
									<label for="min-duration" class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Minimum Commitment</label>
									<select id="min-duration" value={minDuration || ''} onchange={handleMinDuration} class={`w-full h-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 ${RADIUS.button} px-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500/20 transition-all`}>
										<option value="">No Minimum</option>
										<option value="1">1 Week</option>
										<option value="4">4 Weeks</option>
										<option value="8">8 Weeks</option>
									</select>
								</div>
								<div class="space-y-3">
									<label for="max-duration" class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Maximum Window</label>
									<select id="max-duration" value={maxDuration || ''} onchange={handleMaxDuration} class={`w-full h-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 ${RADIUS.button} px-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500/20 transition-all`}>
										<option value="">Unlimited</option>
										<option value="4">4 Weeks</option>
										<option value="8">8 Weeks</option>
										<option value="12">12 Weeks</option>
									</select>
								</div>
							</div>
						</div>
					</div>

					<!-- Premium Sidebar Utility -->
					<div class="group relative overflow-hidden rounded-[2rem] bg-linear-to-br from-zinc-900 to-zinc-950 p-8 shadow-xl dark:border dark:border-zinc-800">
						<div class="relative z-10 space-y-6">
							<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
								<span class="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
								<span class="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">Priority Access</span>
							</div>
							<p class="text-sm font-black italic tracking-tighter text-white leading-tight">Join the Protocol Waiting List</p>
							<p class="text-[10px] font-medium text-zinc-500 leading-relaxed uppercase tracking-widest">Early access to exclusive industry tracks and career placement reports.</p>
							<a href="/waiting-list" class="flex items-center justify-between w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-[0.2em] px-6 rounded-2xl transition-all active:scale-95">
								JOIN NOW
								<Icon name="arrow-right" size={14} />
							</a>
							<div
								class="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-linear-to-tr from-blue-600/10 to-transparent blur-2xl transition-transform duration-1000 group-hover:scale-150"
							></div>
						</div>
						<div class="absolute -right-4 -bottom-4 text-8xl opacity-10 rotate-12 transition-transform group-hover:scale-110 duration-700 pointer-events-none italic">NK</div>
					</div>
				</div>
			</aside>

			<!-- Knowledge Catalog Feed -->
			<div class="lg:col-span-9 space-y-10">
				{#if filteredCourses.length === 0}
					<div class="flex min-h-[500px] flex-col items-center justify-center rounded-[3rem] border border-zinc-200 bg-white/50 backdrop-blur-md p-16 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
						<div class="relative mb-10 h-24 w-24">
							<div class="absolute inset-0 rounded-full bg-blue-500/10 animate-ping"></div>
							<div class="relative flex h-full w-full items-center justify-center rounded-full bg-white text-5xl shadow-2xl dark:bg-zinc-800">🕵️</div>
						</div>
						<h3 class="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white mb-4 italic">No Signal Detected</h3>
						<p class="mx-auto max-w-sm text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
							The current protocol combination yielded zero results. Reset filters to broaden your search.
						</p>
						<button 
							onclick={clearFilters}
							class="mt-12 h-14 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 font-black text-[10px] uppercase tracking-[0.3em] px-10 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl"
						>
							CLEAR FILTERS
						</button>
					</div>
				{:else}
					<div class="flex items-center justify-between px-2">
						<div class="flex items-center gap-3">
							<span class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Showing Results</span>
							<div class="h-1 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
								<div class="h-full bg-blue-600" style="width: {(filteredCourses.length / data.courses.length) * 100}%"></div>
							</div>
							<span class="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">{filteredCourses.length} / {data.courses.length}</span>
						</div>
					</div>

					<div class="grid grid-cols-1 gap-12 sm:grid-cols-2">
						{#each filteredCourses as course, i}
							<a 
								href="/marketplace/{course.id}" 
								class={`group relative flex flex-col overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 ${RADIUS.card} ${ELEVATION.card} ${TRANSITION.all} hover:-translate-y-2 hover:shadow-2xl hover:border-blue-500/20`}
								in:fly={{ y: 30, duration: 800, delay: i * 50 }}
							>
								<!-- Course Visual Hub -->
								<div class="relative h-64 w-full overflow-hidden">
									{#if course.thumbnailUrl}
										<img src={course.thumbnailUrl} alt={course.title} class="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
									{:else}
										<div class={`flex h-full w-full items-center justify-center bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900`}>
											<span class="text-6xl grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">💎</span>
										</div>
									{/if}
									
									<div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
									
									<!-- Floating Information -->
									{#if course.mentor}
										<div class="absolute top-6 left-6 flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white/90 backdrop-blur-md dark:bg-zinc-900/90 shadow-xl border border-white/20">
											<div class="h-7 w-7 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] text-white font-black overflow-hidden shadow-sm">
												{course.mentor.fullName?.[0] || 'M'}
											</div>
											<span class="text-[9px] font-black text-zinc-900 dark:text-white uppercase tracking-widest truncate max-w-[100px]">{course.mentor.fullName || course.mentor.username}</span>
										</div>
									{/if}

									<div class="absolute bottom-6 left-6 right-6 flex items-center justify-between translate-y-10 group-hover:translate-y-0 transition-transform duration-500 pb-2">
										<div class="flex items-center gap-2">
											<span class="px-2 py-0.5 rounded-md bg-white border border-zinc-100 text-[8px] font-black text-blue-600 uppercase tracking-widest shadow-sm">Verified Track</span>
										</div>
									</div>
								</div>

								<!-- Content & Protocol Details -->
								<div class="flex flex-1 flex-col p-10">
									<div class="mb-6 flex items-center gap-4">
										<span class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] leading-none">Module Protocol</span>
										<div class="h-px flex-1 bg-zinc-100 dark:bg-zinc-800 opacity-50"></div>
										{#if course.duration}
											<span class="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-none">{course.duration} Cycles</span>
										{/if}
									</div>

									<h3 class="mb-5 text-2xl font-black tracking-tighter text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors leading-tight italic">
										{course.title}
									</h3>
									
									<p class="mb-10 line-clamp-2 text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400 italic">
										{course.description}
									</p>

									<div class="mt-auto flex items-center justify-between border-t border-zinc-100 pt-8 dark:border-zinc-800">
										<div class="flex flex-col gap-1">
											<span class="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Admission Fee</span>
											<span class="text-3xl font-black tracking-tighter text-zinc-950 dark:text-white italic">
												RP {course.price.toLocaleString('id-ID')}
											</span>
										</div>
										<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 transition-all group-hover:bg-blue-600 group-hover:text-white shadow-xl active:scale-95">
											<Icon name="arrow-right" size={20} />
										</div>
									</div>
								</div>
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

