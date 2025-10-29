<script lang="ts">
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();

	let portfolioUrl = $state('');
	let githubUrl = $state('');
	let linkedinUrl = $state('');
</script>

<svelte:head>
	<title>Apply as Mentor - Naik Kelas</title>
</svelte:head>

{#if data.existingApplication}
	<div class="application-status-page">
		<h1>Mentor Application Status</h1>
		<div
			class="status-card"
			class:pending={data.existingApplication.status === 'pending'}
			class:approved={data.existingApplication.status === 'approved'}
			class:rejected={data.existingApplication.status === 'rejected'}
		>
			<h2>Your Application Status</h2>
			<p
				class="status-badge"
				class:pending={data.existingApplication.status === 'pending'}
				class:approved={data.existingApplication.status === 'approved'}
				class:rejected={data.existingApplication.status === 'rejected'}
			>
				{data.existingApplication.status === 'pending' && '⏳ Under Review'}
				{data.existingApplication.status === 'approved' && '✓ Approved'}
				{data.existingApplication.status === 'rejected' && '✗ Rejected'}
			</p>
			<p class="status-date">
				Submitted: {new Date(data.existingApplication.createdAt).toLocaleDateString('id-ID')}
			</p>
			{#if data.existingApplication.adminNotes}
				<div class="admin-notes">
					<strong>Admin Notes:</strong>
					<p>{data.existingApplication.adminNotes}</p>
				</div>
			{/if}
		</div>
		<a href="/dashboard" class="back-btn">← Back to Dashboard</a>
	</div>
{:else}
	<div class="apply-mentor-page">
		<div class="page-header">
			<h1>Apply as Mentor</h1>
			<p>Share your expertise and help others grow their programming skills</p>
		</div>

		{#if form?.error}
			<div class="error-message">{form.error}</div>
		{/if}

		<form method="POST" class="application-form">
			<div class="form-row">
				<div class="form-group">
					<label for="fullName">Full Name *</label>
					<input
						type="text"
						id="fullName"
						name="fullName"
						required
						value={data.user.fullName || ''}
						placeholder="Enter your full name"
					/>
				</div>

				<div class="form-group">
					<label for="email">Email *</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						value={data.user.email || ''}
						placeholder="your@email.com"
					/>
				</div>
			</div>

			<div class="form-group">
				<label for="phone">Phone Number *</label>
				<input
					type="tel"
					id="phone"
					name="phone"
					required
					value={data.user.phone || ''}
					placeholder="e.g. 08123456789"
				/>
			</div>

			<div class="form-group">
				<label for="bio">Bio *</label>
				<textarea
					id="bio"
					name="bio"
					required
					rows="4"
					placeholder="Tell us about yourself, your background and experience..."
				></textarea>
			</div>

			<div class="form-group">
				<label for="expertise">Area of Expertise *</label>
				<input
					type="text"
					id="expertise"
					name="expertise"
					required
					placeholder="e.g. Web Development, Data Science, AI/ML"
				/>
				<small>What topics are you comfortable teaching?</small>
			</div>

			<div class="form-group">
				<label for="yearsExperience">Years of Experience *</label>
				<input
					type="number"
					id="yearsExperience"
					name="yearsExperience"
					required
					min="0"
					placeholder="e.g. 5"
				/>
			</div>

			<div class="form-group">
				<label for="portfolioUrl">Portfolio URL</label>
				<input
					type="url"
					id="portfolioUrl"
					name="portfolioUrl"
					bind:value={portfolioUrl}
					placeholder="https://yourportfolio.com"
				/>
			</div>

			<div class="form-row">
				<div class="form-group">
					<label for="githubUrl">GitHub URL</label>
					<input
						type="url"
						id="githubUrl"
						name="githubUrl"
						bind:value={githubUrl}
						placeholder="https://github.com/yourusername"
					/>
				</div>

				<div class="form-group">
					<label for="linkedinUrl">LinkedIn URL</label>
					<input
						type="url"
						id="linkedinUrl"
						name="linkedinUrl"
						bind:value={linkedinUrl}
						placeholder="https://linkedin.com/in/yourprofile"
					/>
				</div>
			</div>

			<div class="form-group">
				<label for="motivation">Why do you want to be a mentor? *</label>
				<textarea
					id="motivation"
					name="motivation"
					required
					rows="5"
					placeholder="Share your motivation for becoming a mentor..."
				></textarea>
			</div>

			<div class="form-actions">
				<button type="submit" class="submit-btn">Submit Application</button>
				<a href="/dashboard" class="cancel-btn">Cancel</a>
			</div>
		</form>
	</div>
{/if}

<style>
	.apply-mentor-page,
	.application-status-page {
		max-width: 800px;
	}

	.page-header {
		margin-bottom: 32px;
	}

	.page-header h1 {
		font-size: 2em;
		color: var(--color-primary-dark);
		margin-bottom: 8px;
	}

	.page-header p {
		color: var(--color-primary-medium);
		font-size: 1.1em;
	}

	.error-message {
		padding: 12px 16px;
		background: #fee2e2;
		color: #dc2626;
		border-radius: 8px;
		margin-bottom: 24px;
	}

	.application-form {
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

	small {
		font-size: 0.85em;
		color: var(--color-primary-medium);
	}

	input,
	textarea {
		padding: 12px 16px;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-size: 1em;
		transition: all 0.2s ease;
		font-family: inherit;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	textarea {
		resize: vertical;
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
		text-align: center;
		transition: all 0.2s ease;
	}

	.cancel-btn:hover {
		border-color: var(--color-gradient-purple-start);
		background: var(--color-bg-hero);
	}

	.status-card {
		background: white;
		border-radius: 16px;
		padding: 32px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		margin-bottom: 24px;
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
		margin-bottom: 16px;
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

	.back-btn {
		display: inline-block;
		padding: 12px 24px;
		background: var(--color-bg-hero);
		color: var(--color-primary-dark);
		text-decoration: none;
		border-radius: 8px;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.back-btn:hover {
		background: #e5e7eb;
	}

	@media (max-width: 768px) {
		.form-row {
			grid-template-columns: 1fr;
		}
	}
</style>
