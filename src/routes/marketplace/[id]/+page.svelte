<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	function getEnrollUrl() {
		return `/marketplace/${data.course?.id}/checkout`;
	}
</script>

<svelte:head>
	<title>{data.course?.title || 'Course Details'} - Naik Kelas</title>
</svelte:head>

{#if !data.course}
	<div class="error-page">
		<h1>Course Not Found</h1>
		<p>The course you're looking for doesn't exist or is not available.</p>
		<a href="/marketplace" class="back-btn">← Back to Marketplace</a>
	</div>
{:else}
	<div class="course-detail-page">
		<div class="course-hero">
			{#if data.course.thumbnailUrl}
				<img src={data.course.thumbnailUrl} alt={data.course.title} class="hero-image" />
			{:else}
				<div class="hero-placeholder">
					<span class="emoji">📚</span>
				</div>
			{/if}
			<div class="hero-overlay">
				<div class="hero-content">
					<h1>{data.course.title}</h1>
					<p class="hero-description">{data.course.description}</p>
				</div>
			</div>
		</div>

		<div class="course-container">
			<main class="course-main">
				<div class="course-section">
					<h2>About This Course</h2>
					<p class="course-description">{data.course.description}</p>
				</div>

				<div class="course-section">
					<h2>Course Information</h2>
					<div class="info-grid">
						<div class="info-item">
							<span class="info-label">Duration</span>
							<span class="info-value">{data.course.duration || 'N/A'} weeks</span>
						</div>
						<div class="info-item">
							<span class="info-label">Created</span>
							<span class="info-value">
								{new Date(data.course.createdAt).toLocaleDateString('id-ID')}
							</span>
						</div>
						{#if data.mentor}
							<div class="info-item">
								<span class="info-label">Instructor</span>
								<span class="info-value">{data.mentor.fullName || data.mentor.username}</span>
							</div>
						{/if}
					</div>
				</div>
			</main>

			<aside class="course-sidebar">
				<div class="enrollment-card">
					<div class="price-section">
						<span class="price-label">Price</span>
						<span class="price-amount">Rp {data.course.price.toLocaleString('id-ID')}</span>
					</div>

					<a href={getEnrollUrl()} class="enroll-cta-btn">Enroll Now</a>

					<div class="login-prompt">
						<p>
							<strong>Not registered yet?</strong>
							<br />
							<a href="/auth/signup">Sign up</a> or <a href="/auth/signin">login</a> to enroll in this
							course
						</p>
					</div>
				</div>
			</aside>
		</div>
	</div>
{/if}

<style>
	.course-detail-page {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.error-page {
		text-align: center;
		padding: 80px 20px;
	}

	.error-page h1 {
		font-size: 2em;
		color: var(--color-primary-dark);
		margin-bottom: 16px;
	}

	.error-page p {
		color: var(--color-primary-medium);
		margin-bottom: 32px;
	}

	.back-btn {
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

	.back-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
	}

	.course-hero {
		position: relative;
		width: 100%;
		height: 450px;
		border-radius: 16px;
		overflow: hidden;
		margin: 40px 0;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
	}

	.hero-image,
	.hero-placeholder {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.hero-placeholder {
		background: linear-gradient(135deg, var(--color-bg-hero) 0%, var(--color-bg-hero-end) 100%);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hero-placeholder .emoji {
		font-size: 8em;
	}

	.hero-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
		padding: 60px;
	}

	.hero-content h1 {
		font-size: 3em;
		color: white;
		margin-bottom: 16px;
	}

	.hero-description {
		font-size: 1.3em;
		color: rgba(255, 255, 255, 0.95);
		line-height: 1.6;
	}

	.course-container {
		display: flex;
		gap: 40px;
		margin: 48px 0;
	}

	.course-main {
		flex: 1;
		background: white;
		border-radius: 16px;
		padding: 40px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
	}

	.course-section {
		margin-bottom: 40px;
	}

	.course-section h2 {
		font-size: 1.8em;
		color: var(--color-primary-dark);
		margin-bottom: 20px;
		font-weight: 600;
	}

	.course-description {
		color: var(--color-primary-medium);
		line-height: 1.8;
		font-size: 1.1em;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 24px;
	}

	.info-item {
		padding: 20px;
		background: var(--color-bg-hero);
		border-radius: 12px;
	}

	.info-label {
		display: block;
		font-size: 0.9em;
		color: var(--color-primary-medium);
		margin-bottom: 10px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-weight: 600;
	}

	.info-value {
		display: block;
		font-size: 1.2em;
		color: var(--color-primary-dark);
		font-weight: 600;
	}

	.course-sidebar {
		width: 400px;
	}

	.enrollment-card {
		background: white;
		border-radius: 16px;
		padding: 32px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		position: sticky;
		top: 20px;
	}

	.price-section {
		margin-bottom: 32px;
		padding-bottom: 32px;
		border-bottom: 2px solid var(--color-bg-hero-end);
	}

	.price-label {
		display: block;
		font-size: 1em;
		color: var(--color-primary-medium);
		margin-bottom: 12px;
	}

	.price-amount {
		display: block;
		font-size: 2.5em;
		font-weight: 700;
		color: var(--color-gradient-purple-start);
	}

	.enroll-cta-btn {
		display: block;
		width: 100%;
		padding: 18px 32px;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		color: white;
		text-decoration: none;
		border-radius: 12px;
		text-align: center;
		font-weight: 600;
		font-size: 1.1em;
		transition: all 0.3s ease;
		margin-bottom: 24px;
	}

	.enroll-cta-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
	}

	.login-prompt {
		text-align: center;
		padding: 20px;
		background: var(--color-bg-hero);
		border-radius: 12px;
	}

	.login-prompt p {
		font-size: 0.95em;
		color: var(--color-primary-medium);
		line-height: 1.6;
	}

	.login-prompt a {
		color: var(--color-gradient-purple-start);
		text-decoration: none;
		font-weight: 600;
	}

	.login-prompt a:hover {
		text-decoration: underline;
	}

	@media (max-width: 1024px) {
		.course-container {
			flex-direction: column;
		}

		.course-sidebar {
			width: 100%;
		}

		.hero-content h1 {
			font-size: 2.5em;
		}

		.hero-description {
			font-size: 1.1em;
		}
	}

	@media (max-width: 768px) {
		.course-hero {
			height: 350px;
		}

		.hero-overlay {
			padding: 30px;
		}

		.hero-content h1 {
			font-size: 1.8em;
		}

		.course-main {
			padding: 24px;
		}
	}
</style>
