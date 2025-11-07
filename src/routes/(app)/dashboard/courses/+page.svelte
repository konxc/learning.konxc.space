<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let sortBy = $state('newest');
	let maxPrice = $state<number | null>(null);
	let minDuration = $state<number | null>(null);
	let showFilters = $state(false);

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
	<title>Browse Courses - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="Browse Courses">
		<button
			class={`filter-toggle inline-flex items-center gap-2 ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.button} ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
			onclick={() => (showFilters = !showFilters)}
			type="button"
		>
			<span class="filter-icon" aria-hidden="true">🔍</span>
			Filters
		</button>
	</PageHeader>

	<div class="marketplace-container grid grid-cols-1 gap-6 md:grid-cols-4">
		{#if showFilters}
			<PageSection>
				<aside class="md:sticky md:top-6">
					<h3 class={`${TEXT.h2} ${COLOR.textPrimary} mb-5`}>Filters</h3>

					<div class="mb-5">
						<label for="search" class={`block ${TEXT.secondary} mb-2 font-semibold`}
							>Search Courses</label
						>
						<input
							type="text"
							id="search"
							placeholder="Search by title or description..."
							value={searchQuery}
							oninput={handleSearch}
							class={`w-full ${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.button} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
						/>
					</div>

					<div class="mb-5">
						<label for="sortBy" class={`block ${TEXT.secondary} mb-2 font-semibold`}>Sort By</label>
						<select
							id="sortBy"
							value={sortBy}
							onchange={handleSort}
							class={`w-full ${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.button} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
						>
							<option value="newest">Newest First</option>
							<option value="price-low">Price: Low to High</option>
							<option value="price-high">Price: High to Low</option>
							<option value="duration">Duration: Short to Long</option>
						</select>
					</div>

					<div class="mb-5">
						<label for="maxPrice" class={`block ${TEXT.secondary} mb-2 font-semibold`}
							>Max Price (Rp)</label
						>
						<input
							type="number"
							id="maxPrice"
							placeholder="e.g. 500000"
							min="0"
							value={maxPrice || ''}
							oninput={handleMaxPrice}
							class={`w-full ${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.button} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
						/>
					</div>

					<div class="mb-5">
						<label for="minDuration" class={`block ${TEXT.secondary} mb-2 font-semibold`}
							>Min Duration (weeks)</label
						>
						<input
							type="number"
							id="minDuration"
							placeholder="e.g. 2"
							min="1"
							value={minDuration || ''}
							oninput={handleMinDuration}
							class={`w-full ${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.button} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
						/>
					</div>

					{#if searchQuery || maxPrice !== null || minDuration !== null}
						<button
							class={`clear-filters-btn w-full ${RADIUS.button} ${SPACING.button} ${TEXT.button} cursor-pointer border-none ${COLOR.error} font-semibold ${TRANSITION.colors} mt-3 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
							onclick={clearFilters}
							type="button"
						>
							Clear All Filters
						</button>
					{/if}
				</aside>
			</PageSection>
		{/if}

		<div class="courses-content md:col-span-3">
			<div class={`courses-grid grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3`}>
				{#each filteredCourses as course}
					<div
						class={`flex flex-col overflow-hidden ${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${ELEVATION.base} ${ELEVATION.hover} ${ELEVATION.transition}`}
					>
						{#if course.thumbnailUrl}
							<img
								src={course.thumbnailUrl}
								alt={course.title}
								class="h-[200px] w-full object-cover"
								loading="lazy"
								decoding="async"
								fetchpriority="low"
							/>
						{:else}
							<div
								class="flex h-[200px] w-full items-center justify-center bg-linear-to-br from-blue-600 to-purple-600"
							>
								<span class="text-6xl">📚</span>
							</div>
						{/if}

						<div class="flex flex-1 flex-col p-5">
							<h3 class={`${TEXT.h2} ${COLOR.textPrimary} mb-2.5`}>{course.title}</h3>
							<p class={`mb-4 line-clamp-3 min-h-[60px] leading-relaxed ${TEXT.secondary}`}>
								{course.description}
							</p>

							<div class="mb-3 flex items-center justify-between">
								<span class={`${COLOR.accent} font-bold`}
									>Rp {course.price.toLocaleString('id-ID')}</span
								>
								{#if course.duration}
									<span class={`${COLOR.textSecondary}`}>{course.duration} weeks</span>
								{/if}
							</div>

							<div
								class="mt-auto flex gap-2 border-t border-gray-200/60 pt-4 dark:border-neutral-800"
							>
								<a
									href="/dashboard/courses/{course.id}"
									class={`flex-1 text-center no-underline ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.button} ${COLOR.card} ${TRANSITION.colors} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
									>View Details</a
								>
								<a
									href="/dashboard/courses/{course.id}/enroll"
									class={`flex-1 text-center no-underline ${RADIUS.button} ${SPACING.button} ${TEXT.button} ${COLOR.accentBg} text-white ${ELEVATION.base} ${TRANSITION.all} ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
									>Enroll Now</a
								>
							</div>
						</div>
					</div>
				{/each}
			</div>

			{#if filteredCourses.length === 0}
				<PageSection>
					<div class="text-center">
						<p class={`mb-4 ${COLOR.textSecondary}`}>No courses found matching your filters</p>
						{#if searchQuery || maxPrice !== null || minDuration !== null}
							<button
								class={`clear-filters-btn ${RADIUS.button} ${SPACING.button} ${TEXT.button} ${COLOR.error} font-semibold ${TRANSITION.colors} hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
								onclick={clearFilters}
								type="button"
							>
								Clear Filters
							</button>
						{/if}
					</div>
				</PageSection>
			{:else if data.courses.length === 0}
				<PageSection>
					<div class="text-center">
						<p class={COLOR.textSecondary}>No courses available yet</p>
					</div>
				</PageSection>
			{/if}
		</div>
	</div>
</PageWrapper>
