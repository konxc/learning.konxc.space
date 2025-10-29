<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let sortBy = $state('newest');

	function handleSearch(e: Event) {
		const target = e.target as HTMLInputElement;
		searchQuery = target.value.toLowerCase();
	}

	function handleSort(e: Event) {
		const target = e.target as HTMLSelectElement;
		sortBy = target.value;
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
	<title>Course Marketplace - Naik Kelas</title>
</svelte:head>

<div class="marketplace-page">
	<div class="hero-section">
		<h1>Discover Our Courses</h1>
		<p>Learn programming, AI tools, and build real projects</p>
	</div>

	<div class="search-bar">
		<input
			type="text"
			placeholder="Search courses..."
			value={searchQuery}
			oninput={handleSearch}
			class="search-input"
		/>
		<select value={sortBy} onchange={handleSort} class="sort-select">
			<option value="newest">Newest First</option>
			<option value="price-low">Price: Low to High</option>
			<option value="price-high">Price: High to Low</option>
			<option value="duration">Duration: Short to Long</option>
		</select>
	</div>

	<div class="courses-grid">
		{#each filteredCourses as course}
			<a href="/marketplace/{course.id}" class="course-card">
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
				</div>
			</a>
		{/each}
	</div>

	{#if filteredCourses.length === 0}
		<div class="empty-state">
			<p>No courses found</p>
		</div>
	{/if}
</div>

<style>
	.marketplace-page {
		max-width: 1400px;
		margin: 0 auto;
		padding: 40px 20px;
	}

	.hero-section {
		text-align: center;
		margin-bottom: 48px;
	}

	.hero-section h1 {
		font-size: 3em;
		color: var(--color-primary-dark);
		margin-bottom: 16px;
	}

	.hero-section p {
		font-size: 1.2em;
		color: var(--color-primary-medium);
	}

	.search-bar {
		display: flex;
		gap: 16px;
		margin-bottom: 32px;
	}

	.search-input {
		flex: 1;
		padding: 14px 20px;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
		font-size: 1em;
		transition: all 0.2s ease;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.sort-select {
		padding: 14px 20px;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
		font-size: 1em;
		cursor: pointer;
		transition: all 0.2s ease;
		background: white;
	}

	.sort-select:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.courses-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 32px;
		margin-bottom: 48px;
	}

	.course-card {
		background: white;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
		text-decoration: none;
		color: inherit;
		transition: all 0.3s ease;
		display: block;
	}

	.course-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
	}

	.thumbnail,
	.thumbnail-placeholder {
		width: 100%;
		height: 220px;
		object-fit: cover;
		background: linear-gradient(135deg, var(--color-bg-hero) 0%, var(--color-bg-hero-end) 100%);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.thumbnail-placeholder .emoji {
		font-size: 5em;
	}

	.course-info {
		padding: 24px;
	}

	.course-info h3 {
		font-size: 1.4em;
		color: var(--color-primary-dark);
		margin-bottom: 12px;
		font-weight: 600;
	}

	.description {
		color: var(--color-primary-medium);
		line-height: 1.6;
		margin-bottom: 20px;
		min-height: 60px;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.course-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 16px;
		border-top: 1px solid #e5e7eb;
	}

	.price {
		font-size: 1.3em;
		font-weight: 700;
		color: var(--color-gradient-purple-start);
	}

	.duration {
		color: var(--color-primary-medium);
		font-size: 0.9em;
		background: var(--color-bg-hero);
		padding: 6px 12px;
		border-radius: 6px;
	}

	.empty-state {
		text-align: center;
		padding: 80px 20px;
		color: var(--color-primary-medium);
	}

	.empty-state p {
		font-size: 1.2em;
	}

	@media (max-width: 768px) {
		.hero-section h1 {
			font-size: 2em;
		}

		.search-bar {
			flex-direction: column;
		}

		.courses-grid {
			grid-template-columns: 1fr;
			gap: 24px;
		}
	}
</style>
