<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>My Mentor Application - Naik Kelas</title>
</svelte:head>

{#if data.isMentor}
	<div class="success-page">
		<div class="success-card">
			<span class="success-icon">🎉</span>
			<h1>You are a Mentor!</h1>
			<p>Congratulations! You are now a mentor on Naik Kelas.</p>
			<a href="/dashboard/mentor/courses" class="view-courses-btn">View My Courses</a>
		</div>
	</div>
{:else if data.application}
	<div class="application-status-page">
		<h1>My Mentor Application</h1>

		<div
			class="status-card"
			class:pending={data.application.status === 'pending'}
			class:approved={data.application.status === 'approved'}
			class:rejected={data.application.status === 'rejected'}
		>
			<h2>Application Status</h2>
			<div
				class="status-badge"
				class:pending={data.application.status === 'pending'}
				class:approved={data.application.status === 'approved'}
				class:rejected={data.application.status === 'rejected'}
			>
				{data.application.status === 'pending' && '⏳ Under Review'}
				{data.application.status === 'approved' && '✓ Approved'}
				{data.application.status === 'rejected' && '✗ Rejected'}
			</div>
			<p class="status-date">
				Submitted: {new Date(data.application.createdAt).toLocaleDateString('id-ID')}
			</p>

			{#if data.application.reviewedAt}
				<p class="status-date">
					Reviewed: {new Date(data.application.reviewedAt).toLocaleDateString('id-ID')}
				</p>
			{/if}

			{#if data.application.adminNotes}
				<div class="admin-notes">
					<strong>Admin Feedback:</strong>
					<p>{data.application.adminNotes}</p>
				</div>
			{/if}
		</div>

		<div class="application-details">
			<h2>Application Details</h2>
			<div class="details-grid">
				<div class="detail-item">
					<span class="detail-label">Full Name</span>
					<span class="detail-value">{data.application.fullName}</span>
				</div>
				<div class="detail-item">
					<span class="detail-label">Email</span>
					<span class="detail-value">{data.application.email}</span>
				</div>
				<div class="detail-item">
					<span class="detail-label">Phone</span>
					<span class="detail-value">{data.application.phone}</span>
				</div>
				<div class="detail-item">
					<span class="detail-label">Expertise</span>
					<span class="detail-value">{data.application.expertise}</span>
				</div>
				<div class="detail-item">
					<span class="detail-label">Years of Experience</span>
					<span class="detail-value">{data.application.yearsExperience} years</span>
				</div>
			</div>

			<div class="detail-section">
				<h3>Bio</h3>
				<p>{data.application.bio}</p>
			</div>

			<div class="detail-section">
				<h3>Motivation</h3>
				<p>{data.application.motivation}</p>
			</div>

			{#if data.application.githubUrl || data.application.linkedinUrl || data.application.portfolioUrl}
				<div class="detail-section">
					<h3>Links</h3>
					<div class="links-list">
						{#if data.application.portfolioUrl}
							<a href={data.application.portfolioUrl} target="_blank" rel="noopener noreferrer">
								Portfolio →
							</a>
						{/if}
						{#if data.application.githubUrl}
							<a href={data.application.githubUrl} target="_blank" rel="noopener noreferrer">
								GitHub →
							</a>
						{/if}
						{#if data.application.linkedinUrl}
							<a href={data.application.linkedinUrl} target="_blank" rel="noopener noreferrer">
								LinkedIn →
							</a>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div class="no-application-page">
		<h1>Become a Mentor</h1>
		<p>Share your expertise and help others grow their programming skills</p>
		<a href="/dashboard/apply-mentor" class="apply-btn">Apply as Mentor</a>
	</div>
{/if}

<style>
	.application-status-page,
	.no-application-page,
	.success-page {
		max-width: 900px;
	}

	h1 {
		font-size: 2em;
		color: var(--color-primary-dark);
		margin-bottom: 24px;
	}

	.status-card {
		background: white;
		border-radius: 16px;
		padding: 32px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		margin-bottom: 32px;
	}

	.status-card h2 {
		font-size: 1.5em;
		color: var(--color-primary-dark);
		margin-bottom: 16px;
	}

	.status-badge {
		display: inline-block;
		padding: 12px 24px;
		border-radius: 8px;
		font-size: 1.2em;
		font-weight: 600;
		margin-bottom: 16px;
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

	.status-date {
		color: var(--color-primary-medium);
		margin-bottom: 8px;
	}

	.admin-notes {
		padding: 16px;
		background: var(--color-bg-hero);
		border-radius: 8px;
		margin-top: 16px;
	}

	.admin-notes strong {
		display: block;
		margin-bottom: 8px;
		color: var(--color-primary-dark);
	}

	.admin-notes p {
		color: var(--color-primary-medium);
		line-height: 1.6;
	}

	.application-details {
		background: white;
		border-radius: 16px;
		padding: 32px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	.application-details h2 {
		font-size: 1.3em;
		color: var(--color-primary-dark);
		margin-bottom: 20px;
	}

	.details-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
		margin-bottom: 32px;
	}

	.detail-item {
		padding: 16px;
		background: var(--color-bg-hero);
		border-radius: 8px;
	}

	.detail-label {
		display: block;
		font-size: 0.85em;
		color: var(--color-primary-medium);
		margin-bottom: 8px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.detail-value {
		display: block;
		font-size: 1.1em;
		color: var(--color-primary-dark);
		font-weight: 600;
	}

	.detail-section {
		margin-bottom: 24px;
	}

	.detail-section h3 {
		font-size: 1.1em;
		color: var(--color-primary-dark);
		margin-bottom: 12px;
	}

	.detail-section p {
		color: var(--color-primary-medium);
		line-height: 1.6;
	}

	.links-list {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.links-list a {
		padding: 10px 16px;
		background: var(--color-bg-hero);
		color: var(--color-gradient-purple-start);
		text-decoration: none;
		border-radius: 8px;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.links-list a:hover {
		background: #e5e7eb;
	}

	.no-application-page {
		text-align: center;
		padding: 80px 20px;
	}

	.no-application-page p {
		color: var(--color-primary-medium);
		font-size: 1.2em;
		margin-bottom: 32px;
	}

	.apply-btn {
		display: inline-block;
		padding: 16px 40px;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		color: white;
		text-decoration: none;
		border-radius: 12px;
		font-size: 1.1em;
		font-weight: 600;
		transition: all 0.3s ease;
	}

	.apply-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
	}

	.success-page {
		text-align: center;
		padding: 80px 20px;
	}

	.success-card {
		background: white;
		border-radius: 16px;
		padding: 48px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	.success-icon {
		font-size: 5em;
		display: block;
		margin-bottom: 24px;
	}

	.success-card h1 {
		font-size: 2em;
		color: var(--color-primary-dark);
		margin-bottom: 16px;
	}

	.success-card p {
		color: var(--color-primary-medium);
		font-size: 1.2em;
		margin-bottom: 32px;
	}

	.view-courses-btn {
		display: inline-block;
		padding: 16px 40px;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		color: white;
		text-decoration: none;
		border-radius: 12px;
		font-size: 1.1em;
		font-weight: 600;
		transition: all 0.3s ease;
	}

	.view-courses-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
	}
</style>
