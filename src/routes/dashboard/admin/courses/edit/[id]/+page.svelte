<script lang="ts">
	import type { PageData } from './$types';
	let { data, form }: { data: PageData; form: any } = $props();
</script>

<svelte:head>
	<title>Edit Course - Admin</title>
</svelte:head>

<div class="edit-course-page">
	<div class="page-header">
		<h1>Edit Course</h1>
		<a href="/dashboard/admin/courses" class="back-btn">← Back to Courses</a>
	</div>

	{#if form?.error}
		<div class="error-message">{form.error}</div>
	{/if}

	<form method="POST" class="course-form">
		<div class="form-group">
			<label for="title">Course Title *</label>
			<input
				type="text"
				id="title"
				name="title"
				required
				value={data.course.title}
				placeholder="Enter course title"
			/>
		</div>

		<div class="form-group">
			<label for="description">Description *</label>
			<textarea
				id="description"
				name="description"
				required
				rows="5"
				placeholder="Enter course description"
			>{data.course.description}</textarea>
		</div>

		<div class="form-row">
			<div class="form-group">
				<label for="price">Price (Rp) *</label>
				<input
					type="number"
					id="price"
					name="price"
					required
					min="0"
					value={data.course.price}
				/>
			</div>

			<div class="form-group">
				<label for="duration">Duration (weeks)</label>
				<input
					type="number"
					id="duration"
					name="duration"
					min="1"
					value={data.course.duration || ''}
					placeholder="Optional"
				/>
			</div>
		</div>

		<div class="form-group">
			<label for="status">Status *</label>
			<select id="status" name="status" value={data.course.status}>
				<option value="draft">Draft</option>
				<option value="published">Published</option>
				<option value="archived">Archived</option>
			</select>
		</div>

		<div class="form-group">
			<label for="thumbnailUrl">Thumbnail URL</label>
			<input
				type="url"
				id="thumbnailUrl"
				name="thumbnailUrl"
				value={data.course.thumbnailUrl || ''}
				placeholder="https://example.com/image.jpg"
			/>
		</div>

		<div class="form-group">
			<label for="mentorId">Assign Mentor</label>
			<select id="mentorId" name="mentorId">
				<option value="none">None</option>
				{#each data.users as user}
					<option value={user.id} selected={data.course.mentorId === user.id}>
						{user.username} ({user.role})
					</option>
				{/each}
			</select>
		</div>

		<div class="form-actions">
			<button type="submit" class="submit-btn">Update Course</button>
			<a href="/dashboard/admin/courses" class="cancel-btn">Cancel</a>
		</div>
	</form>
</div>

<style>
	.edit-course-page {
		max-width: 800px;
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

	.back-btn {
		padding: 10px 20px;
		background: #f3f4f6;
		color: var(--color-primary-dark);
		text-decoration: none;
		border-radius: 8px;
		font-weight: 500;
		transition: all 0.2s ease;
	}

	.back-btn:hover {
		background: #e5e7eb;
	}

	.error-message {
		padding: 12px 16px;
		background: #fee2e2;
		color: #dc2626;
		border-radius: 8px;
		margin-bottom: 24px;
	}

	.course-form {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
	}

	label {
		font-weight: 600;
		color: var(--color-primary-dark);
		font-size: 0.95em;
	}

	input,
	textarea,
	select {
		padding: 12px 16px;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-size: 1em;
		transition: all 0.2s ease;
		font-family: inherit;
	}

	input:focus,
	textarea:focus,
	select:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	textarea {
		resize: vertical;
		min-height: 100px;
	}

	.form-actions {
		display: flex;
		gap: 12px;
		margin-top: 12px;
	}

	.submit-btn {
		padding: 14px 32px;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1em;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.submit-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
	}

	.cancel-btn {
		padding: 14px 32px;
		background: white;
		color: var(--color-primary-dark);
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		text-decoration: none;
		font-size: 1em;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.cancel-btn:hover {
		border-color: var(--color-gradient-purple-start);
		background: var(--color-bg-hero);
	}

	@media (max-width: 768px) {
		.page-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
		}

		.form-row {
			grid-template-columns: 1fr;
		}
	}
</style>
