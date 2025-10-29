<script lang="ts">
	import type { PageData } from './$types';
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

	let filteredCourses = $derived(() => {
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
		if (maxPrice !== null) {
			courses = courses.filter((course) => course.price <= maxPrice);
		}

		// Duration filter
		if (minDuration !== null) {
			courses = courses.filter((course) => course.duration && course.duration >= minDuration);
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

<div class="courses-page">
	<div class="page-header">
		<h1>Browse Courses</h1>
		<button class="filter-toggle" onclick={() => (showFilters = !showFilters)}>
			<span class="filter-icon">🔍</span>
			Filters
		</button>
	</div>

	<div class="marketplace-container">
		{#if showFilters}
			<aside class="filters-sidebar">
				<h3>Filters</h3>

				<div class="filter-group">
					<label for="search">Search Courses</label>
					<input
						type="text"
						id="search"
						placeholder="Search by title or description..."
						value={searchQuery}
						oninput={handleSearch}
					/>
				</div>

				<div class="filter-group">
					<label for="sortBy">Sort By</label>
					<select id="sortBy" value={sortBy} onchange={handleSort}>
						<option value="newest">Newest First</option>
						<option value="price-low">Price: Low to High</option>
						<option value="price-high">Price: High to Low</option>
						<option value="duration">Duration: Short to Long</option>
					</select>
				</div>

				<div class="filter-group">
					<label for="maxPrice">Max Price (Rp)</label>
					<input
						type="number"
						id="maxPrice"
						placeholder="e.g. 500000"
						min="0"
						value={maxPrice || ''}
						oninput={handleMaxPrice}
					/>
				</div>

				<div class="filter-group">
					<label for="minDuration">Min Duration (weeks)</label>
					<input
						type="number"
						id="minDuration"
						placeholder="e.g. 2"
						min="1"
						value={minDuration || ''}
						oninput={handleMinDuration}
					/>
				</div>

				{#if searchQuery || maxPrice !== null || minDuration !== null}
					<button class="clear-filters-btn" onclick={clearFilters}> Clear All Filters </button>
				{/if}
			</aside>
		{/if}

		<div class="courses-content">
			<div class="courses-grid">
				{#each filteredCourses as course}
					<div class="course-card">
						{#if course.thumbnailUrl}
							<img src={course.thumbnailUrl} alt={course.title} class="thumbnail" />
						{:else}
							<div class="thumbnail-placeholder">
								<span class="emoji">📚</span>
							</div>
						{/if}

						<div class="course-info">
							<h3>{course.title}</h3>
							<p class="description">{course.description}</p>

							<div class="course-meta">
								<span class="price">Rp {course.price.toLocaleString('id-ID')}</span>
								{#if course.duration}
									<span class="duration">{course.duration} weeks</span>
								{/if}
							</div>

							<div class="card-actions">
								<a href="/dashboard/courses/{course.id}" class="view-btn">View Details</a>
								<a href="/dashboard/courses/{course.id}/enroll" class="enroll-btn">Enroll Now</a>
							</div>
						</div>
					</div>
				{/each}
			</div>

			{#if filteredCourses.length === 0}
				<div class="empty-state">
					<p>No courses found matching your filters</p>
					{#if searchQuery || maxPrice !== null || minDuration !== null}
						<button class="clear-filters-btn" onclick={clearFilters}>Clear Filters</button>
					{/if}
				</div>
			{:else if data.courses.length === 0}
				<div class="empty-state">
					<p>No courses available yet</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.courses-page {
		max-width: 1400px;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}

	.filter-toggle {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 20px;
		background: white;
		border: 2px solid var(--color-bg-hero-end);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		font-weight: 500;
	}

	.filter-toggle:hover {
		border-color: var(--color-gradient-purple-start);
	}

	.filter-icon {
		font-size: 1.2em;
	}

	.marketplace-container {
		display: flex;
		gap: 24px;
	}

	.filters-sidebar {
		background: white;
		border-radius: 12px;
		padding: 24px;
		width: 300px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		height: fit-content;
		position: sticky;
		top: 20px;
	}

	.filters-sidebar h3 {
		font-size: 1.2em;
		color: var(--color-primary-dark);
		margin-bottom: 20px;
	}

	.filter-group {
		margin-bottom: 20px;
	}

	.filter-group label {
		display: block;
		font-weight: 600;
		color: var(--color-primary-dark);
		margin-bottom: 8px;
		font-size: 0.95em;
	}

	.filter-group input,
	.filter-group select {
		width: 100%;
		padding: 10px 12px;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-size: 1em;
		transition: all 0.2s ease;
	}

	.filter-group input:focus,
	.filter-group select:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.clear-filters-btn {
		width: 100%;
		padding: 10px 16px;
		background: #fee2e2;
		color: #dc2626;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		margin-top: 12px;
	}

	.clear-filters-btn:hover {
		background: #fecaca;
	}

	.courses-content {
		flex: 1;
	}

	h1 {
		font-size: 2em;
		color: var(--color-primary-dark);
		margin-bottom: 30px;
	}

	.courses-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 24px;
	}

	.course-card {
		background: white;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
	}

	.course-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
	}

	.thumbnail,
	.thumbnail-placeholder {
		width: 100%;
		height: 200px;
		object-fit: cover;
		background: var(--color-bg-hero);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.thumbnail-placeholder .emoji {
		font-size: 4em;
	}

	.course-info {
		padding: 20px;
	}

	.course-info h3 {
		font-size: 1.3em;
		color: var(--color-primary-dark);
		margin-bottom: 10px;
	}

	.description {
		color: var(--color-primary-medium);
		line-height: 1.6;
		margin-bottom: 16px;
		min-height: 60px;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card-actions {
		display: flex;
		gap: 8px;
		margin-top: auto;
		padding-top: 16px;
		border-top: 1px solid #e5e7eb;
	}

	.view-btn,
	.enroll-btn {
		padding: 10px 20px;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
		font-size: 0.9em;
		transition: all 0.2s ease;
		flex: 1;
		text-align: center;
	}

	.view-btn {
		background: white;
		color: var(--color-primary-dark);
		border: 2px solid #e5e7eb;
	}

	.view-btn:hover {
		border-color: var(--color-gradient-purple-start);
		background: var(--color-bg-hero);
	}

	.enroll-btn {
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		color: white;
		border: none;
	}

	.enroll-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
	}

	.course-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}

	.price {
		font-size: 1.2em;
		font-weight: 700;
		color: var(--color-gradient-purple-start);
	}

	.duration {
		color: var(--color-primary-medium);
		font-size: 0.9em;
	}

	.status-badge {
		display: inline-block;
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 0.8em;
		text-transform: capitalize;
		background: #f3f4f6;
		color: #6b7280;
	}

	.status-badge.published {
		background: #d1fae5;
		color: #065f46;
	}

	.empty-state {
		text-align: center;
		padding: 60px 20px;
		color: var(--color-primary-medium);
	}

	.empty-state p {
		font-size: 1.2em;
	}
</style>
