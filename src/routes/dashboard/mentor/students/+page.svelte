<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	let selectedCourse = $state(data.selectedCourse || 'all');
</script>

<svelte:head>
	<title>My Students - Mentor</title>
</svelte:head>

<div class="students-page">
	<div class="page-header">
		<h1>My Students</h1>
		{#if data.courses.length > 0}
			<select bind:value={selectedCourse} class="course-filter">
				<option value="all">All Courses</option>
				{#each data.courses as course}
					<option value={course.id}>{course.title}</option>
				{/each}
			</select>
		{/if}
	</div>

	<div class="students-table">
		<table>
			<thead>
				<tr>
					<th>Student</th>
					<th>Email</th>
					<th>Course</th>
					<th>Status</th>
					<th>Enrolled</th>
					<th>Completed</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.students.filter((s) => selectedCourse === 'all' || s.course.id === selectedCourse) as student}
					<tr>
						<td>
							<div class="student-cell">
								<strong>{student.student.username}</strong>
								{#if student.student.fullName}
									<span class="full-name">{student.student.fullName}</span>
								{/if}
							</div>
						</td>
						<td>{student.student.email || '—'}</td>
						<td>
							<span class="course-badge">{student.course.title}</span>
						</td>
						<td>
							<span class="status-badge" class:active={student.status === 'active'}>
								{student.status}
							</span>
						</td>
						<td>{new Date(student.enrolledAt).toLocaleDateString('id-ID')}</td>
						<td>
							{#if student.completedAt}
								{new Date(student.completedAt).toLocaleDateString('id-ID')}
							{:else}
								<span class="text-muted">—</span>
							{/if}
						</td>
						<td>
							<button class="view-btn">View Progress</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if data.students.length === 0}
		<div class="empty-state">
			<p>No students enrolled in your courses yet</p>
		</div>
	{/if}
</div>

<style>
	.students-page {
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

	.course-filter {
		padding: 10px 16px;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-size: 1em;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.course-filter:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.students-table {
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

	.student-cell {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.full-name {
		font-size: 0.85em;
		color: var(--color-primary-medium);
	}

	.course-badge {
		display: inline-block;
		padding: 4px 12px;
		background: #e0e7ff;
		color: #3730a3;
		border-radius: 12px;
		font-size: 0.85em;
	}

	.status-badge {
		display: inline-block;
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 0.85em;
		text-transform: capitalize;
		background: #f3f4f6;
		color: #6b7280;
	}

	.status-badge.active {
		background: #d1fae5;
		color: #065f46;
	}

	.view-btn {
		padding: 6px 12px;
		background: var(--color-gradient-purple-start);
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 0.85em;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.view-btn:hover {
		opacity: 0.9;
	}

	.text-muted {
		color: var(--color-primary-medium);
		font-size: 0.9em;
	}

	.empty-state {
		text-align: center;
		padding: 60px 20px;
		color: var(--color-primary-medium);
	}

	.empty-state p {
		font-size: 1.2em;
	}

	@media (max-width: 768px) {
		.students-table {
			overflow-x: auto;
		}

		table {
			min-width: 800px;
		}
	}
</style>
