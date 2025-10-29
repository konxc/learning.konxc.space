<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	let filter = $state('all');

	async function deleteCourse(courseId: string) {
		if (confirm('Are you sure you want to delete this course?')) {
			const response = await fetch(`/dashboard/admin/courses/delete/${courseId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				window.location.reload();
			} else {
				alert('Failed to delete course');
			}
		}
	}
</script>

<svelte:head>
	<title>Course Management - Admin</title>
</svelte:head>

<div class="admin-courses-page">
	<div class="page-header">
		<h1>Course Management</h1>
		<a href="/dashboard/admin/courses/create" class="create-btn">+ Create Course</a>
	</div>

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

	<div class="courses-table">
		<table>
			<thead>
				<tr>
					<th>Title</th>
					<th>Status</th>
					<th>Price</th>
					<th>Duration</th>
					<th>Created</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.courses.filter((c) => filter === 'all' || c.status === filter) as course}
					<tr>
						<td class="title-cell">
							<div class="course-title">
								{#if course.thumbnailUrl}
									<img src={course.thumbnailUrl} alt={course.title} class="thumb" />
								{:else}
									<div class="thumb-placeholder">📚</div>
								{/if}
								<span>{course.title}</span>
							</div>
						</td>
						<td>
							<span class="status-badge" class:published={course.status === 'published'}>
								{course.status}
							</span>
						</td>
						<td>Rp {course.price.toLocaleString('id-ID')}</td>
						<td>{course.duration || 'N/A'} weeks</td>
						<td>{new Date(course.createdAt).toLocaleDateString('id-ID')}</td>
						<td class="actions">
							<a href="/dashboard/admin/courses/edit/{course.id}" class="edit-btn">Edit</a>
							<button class="delete-btn" onclick={() => deleteCourse(course.id)}>Delete</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if data.courses.length === 0}
		<div class="empty-state">
			<p>No courses found. Create your first course!</p>
			<a href="/dashboard/admin/courses/create" class="create-btn">+ Create Course</a>
		</div>
	{/if}
</div>

<style>
	.admin-courses-page {
		max-width: 1400px;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
	}

	.page-header h1 {
		font-size: 2em;
		color: var(--color-primary-dark);
	}

	.create-btn {
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

	.create-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
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

	.courses-table {
		background: white;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	thead {
		background: var(--color-bg-hero);
	}

	th {
		padding: 16px;
		text-align: left;
		font-weight: 600;
		color: var(--color-primary-dark);
		font-size: 0.9em;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	td {
		padding: 16px;
		border-top: 1px solid #e5e7eb;
	}

	.title-cell {
		max-width: 300px;
	}

	.course-title {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.thumb,
	.thumb-placeholder {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		object-fit: cover;
		background: var(--color-bg-hero);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.thumb-placeholder {
		font-size: 1.5em;
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

	.actions {
		display: flex;
		gap: 8px;
	}

	.edit-btn {
		padding: 6px 12px;
		background: var(--color-gradient-purple-start);
		color: white;
		text-decoration: none;
		border-radius: 6px;
		font-size: 0.85em;
		transition: all 0.2s ease;
	}

	.edit-btn:hover {
		opacity: 0.9;
	}

	.delete-btn {
		padding: 6px 12px;
		background: #fee2e2;
		color: #dc2626;
		border: none;
		border-radius: 6px;
		font-size: 0.85em;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.delete-btn:hover {
		background: #fecaca;
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
</style>
