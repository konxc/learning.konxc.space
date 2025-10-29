<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	let filter = $state('all');
</script>

<svelte:head>
	<title>My Courses - Mentor</title>
</svelte:head>

<div class="mentor-courses-page">
	<h1>My Assigned Courses</h1>

	<div class="filters">
		<button class="filter-btn" class:active={filter === 'all'} onclick={() => (filter = 'all')}>
			All ({data.courses.length})
		</button>
		<button
			class="filter-btn"
			class:active={filter === 'published'}
			onclick={() => (filter = 'published')}
		>
			Published ({data.courses.filter((c) => c.status === 'published').length})
		</button>
		<button class="filter-btn" class:active={filter === 'draft'} onclick={() => (filter = 'draft')}>
			Draft ({data.courses.filter((c) => c.status === 'draft').length})
		</button>
	</div>

	<div class="courses-grid">
		{#each data.courses.filter((c) => filter === 'all' || c.status === filter) as course}
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

					<div class="course-footer">
						<span class="status-badge" class:published={course.status === 'published'}>
							{course.status}
						</span>
						<a href="/dashboard/mentor/students?course={course.id}" class="view-students-btn">
							View Students →
						</a>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if data.courses.length === 0}
		<div class="empty-state">
			<p>You haven't been assigned to any courses yet</p>
		</div>
	{/if}
</div>

<style>
	.mentor-courses-page {
		max-width: 1200px;
	}

	h1 {
		font-size: 2em;
		color: var(--color-primary-dark);
		margin-bottom: 30px;
	}

	.filters {
		display: flex;
		gap: 12px;
		margin-bottom: 24px;
	}

	.filter-btn {
		padding: 8px 16px;
		background: white;
		border: 2px solid var(--color-bg-hero-end);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.filter-btn:hover {
		border-color: var(--color-gradient-purple-start);
	}

	.filter-btn.active {
		background: var(--color-gradient-purple-start);
		color: white;
		border-color: var(--color-gradient-purple-start);
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

	.course-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 12px;
		border-top: 1px solid #e5e7eb;
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

	.view-students-btn {
		color: var(--color-gradient-purple-start);
		text-decoration: none;
		font-weight: 600;
		font-size: 0.9em;
		transition: all 0.2s ease;
	}

	.view-students-btn:hover {
		transform: translateX(5px);
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
