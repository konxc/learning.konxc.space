<script lang="ts">
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();

	let adminNotes = $state('');
</script>

<svelte:head>
	<title>Review Mentor Application - Admin</title>
</svelte:head>

<div class="review-page">
	<div class="page-header">
		<h1>Review Mentor Application</h1>
		<a href="/dashboard/admin/mentor-applications" class="back-btn">← Back to Applications</a>
	</div>

	{#if form?.error}
		<div class="error-message">{form.error}</div>
	{/if}

	<div class="application-preview">
		<div class="application-header">
			<div>
				<h2>{data.application.fullName}</h2>
				<p class="user-info">@{data.user.username} • {data.user.email}</p>
			</div>
			<span
				class="status-badge"
				class:pending={data.application.status === 'pending'}
				class:approved={data.application.status === 'approved'}
				class:rejected={data.application.status === 'rejected'}
			>
				{data.application.status}
			</span>
		</div>

		<div class="info-grid">
			<div class="info-card">
				<span class="info-label">Email</span>
				<span class="info-value">{data.application.email}</span>
			</div>
			<div class="info-card">
				<span class="info-label">Phone</span>
				<span class="info-value">{data.application.phone}</span>
			</div>
			<div class="info-card">
				<span class="info-label">Expertise</span>
				<span class="info-value">{data.application.expertise}</span>
			</div>
			<div class="info-card">
				<span class="info-label">Experience</span>
				<span class="info-value">{data.application.yearsExperience} years</span>
			</div>
			<div class="info-card">
				<span class="info-label">Applied On</span>
				<span class="info-value">
					{new Date(data.application.createdAt).toLocaleDateString('id-ID')}
				</span>
			</div>
			<div class="info-card">
				<span class="info-label">Current Role</span>
				<span class="info-value" class:mentor={data.user.role === 'mentor'}>
					{data.user.role}
				</span>
			</div>
		</div>

		<div class="section">
			<h3>Bio</h3>
			<p>{data.application.bio}</p>
		</div>

		<div class="section">
			<h3>Motivation</h3>
			<p>{data.application.motivation}</p>
		</div>

		{#if data.application.portfolioUrl || data.application.githubUrl || data.application.linkedinUrl}
			<div class="section">
				<h3>Links</h3>
				<div class="links">
					{#if data.application.portfolioUrl}
						<a
							href={data.application.portfolioUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="link-btn">Portfolio →</a
						>
					{/if}
					{#if data.application.githubUrl}
						<a
							href={data.application.githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="link-btn">GitHub →</a
						>
					{/if}
					{#if data.application.linkedinUrl}
						<a
							href={data.application.linkedinUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="link-btn">LinkedIn →</a
						>
					{/if}
				</div>
			</div>
		{/if}

		{#if data.application.adminNotes}
			<div class="section">
				<h3>Previous Admin Notes</h3>
				<div class="previous-notes">
					<p>{data.application.adminNotes}</p>
				</div>
			</div>
		{/if}
	</div>

	{#if data.application.status === 'pending'}
		<div class="review-actions">
			<h3>Review Application</h3>
			<form method="POST" action="?/approve">
				<div class="form-group">
					<label for="adminNotes">Admin Notes (optional for approval)</label>
					<textarea
						id="adminNotes"
						name="adminNotes"
						rows="3"
						bind:value={adminNotes}
						placeholder="Add notes about this approval..."
					></textarea>
				</div>

				<div class="action-buttons">
					<button type="submit" class="approve-btn">✓ Approve Application</button>
				</div>
			</form>

			<form method="POST" action="?/reject">
				<div class="form-group">
					<label for="rejectNotes">Rejection Reason *</label>
					<textarea
						id="rejectNotes"
						name="adminNotes"
						rows="3"
						required
						placeholder="Please provide reason for rejection..."
					></textarea>
					<small>This feedback will be shown to the applicant</small>
				</div>

				<div class="action-buttons">
					<button type="submit" class="reject-btn">✗ Reject Application</button>
				</div>
			</form>
		</div>
	{/if}
</div>

<style>
	.review-page {
		max-width: 1000px;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32px;
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

	.application-preview {
		background: white;
		border-radius: 16px;
		padding: 32px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		margin-bottom: 32px;
	}

	.application-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 32px;
		padding-bottom: 24px;
		border-bottom: 2px solid var(--color-bg-hero-end);
	}

	.application-header h2 {
		font-size: 1.8em;
		color: var(--color-primary-dark);
		margin-bottom: 8px;
	}

	.user-info {
		color: var(--color-primary-medium);
		font-size: 1em;
	}

	.status-badge {
		padding: 8px 20px;
		border-radius: 20px;
		font-size: 0.9em;
		font-weight: 600;
		text-transform: capitalize;
	}

	.status-badge.pending {
		background: #fef3c7;
		color: #92400e;
	}

	.status-badge.approved {
		background: #d1fae5;
		color: #065f46;
	}

	.status-badge.rejected {
		background: #fee2e2;
		color: #991b1b;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 16px;
		margin-bottom: 32px;
	}

	.info-card {
		padding: 16px;
		background: var(--color-bg-hero);
		border-radius: 12px;
	}

	.info-label {
		display: block;
		font-size: 0.85em;
		color: var(--color-primary-medium);
		margin-bottom: 8px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.info-value {
		display: block;
		font-size: 1.1em;
		font-weight: 600;
		color: var(--color-primary-dark);
	}

	.info-value.mentor {
		color: #059669;
	}

	.section {
		margin-bottom: 32px;
	}

	.section h3 {
		font-size: 1.2em;
		color: var(--color-primary-dark);
		margin-bottom: 12px;
		font-weight: 600;
	}

	.section p {
		color: var(--color-primary-medium);
		line-height: 1.8;
		font-size: 1.05em;
	}

	.links {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.link-btn {
		padding: 12px 24px;
		background: var(--color-bg-hero);
		color: var(--color-gradient-purple-start);
		text-decoration: none;
		border-radius: 8px;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.link-btn:hover {
		background: #e5e7eb;
	}

	.previous-notes {
		padding: 16px;
		background: #fef3c7;
		border-radius: 8px;
	}

	.previous-notes p {
		color: #92400e;
	}

	.review-actions {
		background: white;
		border-radius: 16px;
		padding: 32px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	.review-actions h3 {
		font-size: 1.3em;
		color: var(--color-primary-dark);
		margin-bottom: 24px;
	}

	.form-group {
		margin-bottom: 24px;
	}

	.form-group label {
		display: block;
		font-weight: 600;
		color: var(--color-primary-dark);
		margin-bottom: 8px;
	}

	.form-group textarea {
		width: 100%;
		padding: 12px 16px;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-family: inherit;
		resize: vertical;
		transition: all 0.2s ease;
	}

	.form-group textarea:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.form-group small {
		display: block;
		margin-top: 8px;
		font-size: 0.85em;
		color: var(--color-primary-medium);
	}

	.action-buttons {
		margin-top: 24px;
	}

	.approve-btn,
	.reject-btn {
		width: 100%;
		padding: 16px 32px;
		border: none;
		border-radius: 12px;
		font-size: 1.1em;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.approve-btn {
		background: linear-gradient(135deg, #059669 0%, #047857 100%);
		color: white;
	}

	.approve-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 40px rgba(5, 150, 105, 0.3);
	}

	.reject-btn {
		background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
		color: white;
		margin-top: 16px;
	}

	.reject-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 40px rgba(220, 38, 38, 0.3);
	}
</style>
