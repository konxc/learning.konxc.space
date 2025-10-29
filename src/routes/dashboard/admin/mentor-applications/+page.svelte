<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	let filter = $state('all');

	function getStatusCount(status: string) {
		return data.applications.filter((app) => app.status === status).length;
	}
</script>

<svelte:head>
	<title>Mentor Applications - Admin</title>
</svelte:head>

<div class="applications-page">
	<div class="page-header">
		<h1>Mentor Applications</h1>
	</div>

	<div class="filters">
		<button class="filter-btn" class:active={filter === 'all'} onclick={() => (filter = 'all')}>
			All ({data.applications.length})
		</button>
		<button
			class="filter-btn"
			class:active={filter === 'pending'}
			onclick={() => (filter = 'pending')}
		>
			Pending ({getStatusCount('pending')})
		</button>
		<button
			class="filter-btn"
			class:active={filter === 'approved'}
			onclick={() => (filter = 'approved')}
		>
			Approved ({getStatusCount('approved')})
		</button>
		<button
			class="filter-btn"
			class:active={filter === 'rejected'}
			onclick={() => (filter = 'rejected')}
		>
			Rejected ({getStatusCount('rejected')})
		</button>
	</div>

	<div class="applications-list">
		{#each data.applications.filter((app) => filter === 'all' || app.status === filter) as application}
			<div class="application-card" class:pending={application.status === 'pending'}>
				<div class="application-header">
					<div>
						<h3>{application.fullName}</h3>
						<p class="user-info">@{application.user.username}</p>
					</div>
					<span
						class="status-badge"
						class:pending={application.status === 'pending'}
						class:approved={application.status === 'approved'}
						class:rejected={application.status === 'rejected'}
					>
						{application.status}
					</span>
				</div>

				<div class="application-info">
					<div class="info-row">
						<span class="info-label">Email:</span>
						<span class="info-value">{application.email}</span>
					</div>
					<div class="info-row">
						<span class="info-label">Phone:</span>
						<span class="info-value">{application.phone}</span>
					</div>
					<div class="info-row">
						<span class="info-label">Expertise:</span>
						<span class="info-value">{application.expertise}</span>
					</div>
					<div class="info-row">
						<span class="info-label">Experience:</span>
						<span class="info-value">{application.yearsExperience} years</span>
					</div>
					<div class="info-row">
						<span class="info-label">Applied:</span>
						<span class="info-value">
							{new Date(application.createdAt).toLocaleDateString('id-ID')}
						</span>
					</div>
				</div>

				<div class="bio-section">
					<h4>Bio</h4>
					<p>{application.bio}</p>
				</div>

				<div class="motivation-section">
					<h4>Motivation</h4>
					<p>{application.motivation}</p>
				</div>

				{#if application.portfolioUrl || application.githubUrl || application.linkedinUrl}
					<div class="links-section">
						<h4>Links</h4>
						<div class="links">
							{#if application.portfolioUrl}
								<a href={application.portfolioUrl} target="_blank" rel="noopener noreferrer"
									>Portfolio</a
								>
							{/if}
							{#if application.githubUrl}
								<a href={application.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
							{/if}
							{#if application.linkedinUrl}
								<a href={application.linkedinUrl} target="_blank" rel="noopener noreferrer"
									>LinkedIn</a
								>
							{/if}
						</div>
					</div>
				{/if}

				{#if application.adminNotes}
					<div class="admin-notes-section">
						<h4>Admin Notes</h4>
						<p>{application.adminNotes}</p>
					</div>
				{/if}

				<div class="application-actions">
					<a href="/dashboard/admin/mentor-applications/review/{application.id}" class="review-btn">
						View & Review
					</a>
				</div>
			</div>
		{/each}
	</div>

	{#if data.applications.length === 0}
		<div class="empty-state">
			<p>No mentor applications found</p>
		</div>
	{/if}
</div>

<style>
	.applications-page {
		max-width: 1200px;
	}

	.page-header {
		margin-bottom: 32px;
	}

	.page-header h1 {
		font-size: 2em;
		color: var(--color-primary-dark);
	}

	.filters {
		display: flex;
		gap: 12px;
		margin-bottom: 24px;
		flex-wrap: wrap;
	}

	.filter-btn {
		padding: 10px 20px;
		background: white;
		border: 2px solid var(--color-bg-hero-end);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		font-weight: 500;
	}

	.filter-btn:hover {
		border-color: var(--color-gradient-purple-start);
	}

	.filter-btn.active {
		background: var(--color-gradient-purple-start);
		color: white;
		border-color: var(--color-gradient-purple-start);
	}

	.applications-list {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.application-card {
		background: white;
		border-radius: 12px;
		padding: 24px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		transition: all 0.2s ease;
	}

	.application-card.pending {
		border-left: 4px solid #f59e0b;
	}

	.application-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 20px;
	}

	.application-header h3 {
		font-size: 1.3em;
		color: var(--color-primary-dark);
		margin-bottom: 4px;
	}

	.user-info {
		color: var(--color-primary-medium);
		font-size: 0.9em;
	}

	.status-badge {
		padding: 6px 16px;
		border-radius: 20px;
		font-size: 0.85em;
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

	.application-info {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 16px;
		margin-bottom: 20px;
	}

	.info-row {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.info-label {
		font-size: 0.85em;
		color: var(--color-primary-medium);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.info-value {
		font-weight: 600;
		color: var(--color-primary-dark);
	}

	.bio-section,
	.motivation-section,
	.admin-notes-section {
		margin-bottom: 20px;
	}

	.bio-section h4,
	.motivation-section h4,
	.admin-notes-section h4 {
		font-size: 1em;
		color: var(--color-primary-dark);
		margin-bottom: 8px;
		font-weight: 600;
	}

	.bio-section p,
	.motivation-section p,
	.admin-notes-section p {
		color: var(--color-primary-medium);
		line-height: 1.6;
	}

	.links-section {
		margin-bottom: 20px;
	}

	.links-section h4 {
		font-size: 1em;
		color: var(--color-primary-dark);
		margin-bottom: 8px;
		font-weight: 600;
	}

	.links {
		display: flex;
		gap: 12px;
	}

	.links a {
		padding: 8px 16px;
		background: var(--color-bg-hero);
		color: var(--color-gradient-purple-start);
		text-decoration: none;
		border-radius: 8px;
		font-weight: 600;
		font-size: 0.9em;
		transition: all 0.2s ease;
	}

	.links a:hover {
		background: #e5e7eb;
	}

	.application-actions {
		margin-top: 24px;
		padding-top: 24px;
		border-top: 1px solid #e5e7eb;
	}

	.review-btn {
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
		display: inline-block;
	}

	.review-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
	}

	.empty-state {
		text-align: center;
		padding: 80px 20px;
		color: var(--color-primary-medium);
	}

	.empty-state p {
		font-size: 1.2em;
	}
</style>
