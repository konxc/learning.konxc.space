<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>My Courses - Naik Kelas</title>
</svelte:head>

<div class="my-courses-page">
	<h1>My Enrolled Courses</h1>

	<div class="courses-grid">
		{#each data.enrollments as enrollment}
			<a href="/dashboard/courses/{enrollment.course.id}" class="course-card">
				{#if enrollment.course.thumbnailUrl}
					<img
						src={enrollment.course.thumbnailUrl}
						alt={enrollment.course.title}
						class="thumbnail"
					/>
				{:else}
					<div class="thumbnail-placeholder">
						<span class="emoji">📚</span>
					</div>
				{/if}

				<div class="course-info">
					<h3>{enrollment.course.title}</h3>
					<p class="description">{enrollment.course.description}</p>

					<div class="enrollment-meta">
						<span class="enrolled-date">
							Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString('id-ID')}
						</span>
						<span class="status-badge" class:active={enrollment.status === 'active'}>
							{enrollment.status}
						</span>
					</div>
				</div>
			</a>
		{/each}
	</div>

	{#if data.enrollments.length === 0}
		<div class="empty-state">
			<p>You haven't enrolled in any courses yet</p>
			<a href="/dashboard/courses" class="browse-btn">Browse Courses</a>
		</div>
	{/if}
</div>

<style>
	.my-courses-page {
		max-width: 1200px;
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
		text-decoration: none;
		color: inherit;
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

	.enrollment-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1px solid #e5e7eb;
	}

	.enrolled-date {
		font-size: 0.85em;
		color: var(--color-primary-medium);
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

	.status-badge.active {
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
		margin-bottom: 20px;
	}

	.browse-btn {
		display: inline-block;
		padding: 12px 24px;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		color: white;
		text-decoration: none;
		border-radius: 8px;
		font-weight: 600;
		transition: all 0.3s ease;
	}

	.browse-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
	}
</style>
