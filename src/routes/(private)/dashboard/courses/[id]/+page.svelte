<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.course?.title || 'Course Details'} - Naik Kelas</title>
</svelte:head>

{#if !data.course}
	<div class="error-page">
		<h1>Course Not Found</h1>
		<p>The course you're looking for doesn't exist or has been removed.</p>
		<a href="/dashboard/courses" class="back-btn">← Back to Courses</a>
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
							<span class="info-label">Status</span>
							<span class="info-value" class:published={data.course.status === 'published'}>
								{data.course.status}
							</span>
						</div>
						<div class="info-item">
							<span class="info-label">Created</span>
							<span class="info-value">
								{new Date(data.course.createdAt).toLocaleDateString('id-ID')}
							</span>
						</div>
						{#if data.mentor}
							<div class="info-item">
								<span class="info-label">Mentor</span>
								<span class="info-value">{data.mentor.username}</span>
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

					{#if data.isEnrolled}
						<div class="enrolled-badge">
							<span>✓ You are enrolled in this course</span>
						</div>
						<a href="/dashboard/my-courses" class="view-courses-btn">View My Courses</a>
					{:else}
						<form method="POST" action="/dashboard/courses/{data.course.id}/enroll">
							<a href="/dashboard/courses/{data.course.id}/enroll" class="enroll-cta-btn"
								>Enroll Now</a
							>
						</form>
					{/if}
				</div>
			</aside>
		</div>
	</div>
{/if}

<style>
	.course-detail-page {
		max-width: 1400px;
	}

	.error-page {
		text-align: center;
		padding: 60px 20px;
	}

	.error-page h1 {
		font-size: 2em;
		color: var(--color-primary-dark);
		margin-bottom: 16px;
	}

	.error-page p {
		color: var(--color-primary-medium);
		margin-bottom: 24px;
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
	}

	.course-hero {
		position: relative;
		width: 100%;
		height: 400px;
		border-radius: 16px;
		overflow: hidden;
		margin-bottom: 32px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
		font-size: 6em;
	}

	.hero-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
		padding: 40px;
	}

	.hero-content h1 {
		font-size: 2.5em;
		color: white;
		margin-bottom: 12px;
	}

	.hero-description {
		font-size: 1.2em;
		color: rgba(255, 255, 255, 0.9);
		line-height: 1.6;
	}

	.course-container {
		display: flex;
		gap: 32px;
	}

	.course-main {
		flex: 1;
		background: white;
		border-radius: 12px;
		padding: 32px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.course-section {
		margin-bottom: 32px;
	}

	.course-section h2 {
		font-size: 1.5em;
		color: var(--color-primary-dark);
		margin-bottom: 16px;
	}

	.course-description {
		color: var(--color-primary-medium);
		line-height: 1.8;
		font-size: 1.05em;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 20px;
	}

	.info-item {
		padding: 16px;
		background: var(--color-bg-hero);
		border-radius: 8px;
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
		color: var(--color-primary-dark);
		font-weight: 600;
	}

	.info-value.published {
		color: #059669;
	}

	.course-sidebar {
		width: 350px;
	}

	.enrollment-card {
		background: white;
		border-radius: 12px;
		padding: 24px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		position: sticky;
		top: 20px;
	}

	.price-section {
		margin-bottom: 24px;
		padding-bottom: 24px;
		border-bottom: 2px solid var(--color-bg-hero-end);
	}

	.price-label {
		display: block;
		font-size: 0.9em;
		color: var(--color-primary-medium);
		margin-bottom: 8px;
	}

	.price-amount {
		display: block;
		font-size: 2em;
		font-weight: 700;
		color: var(--color-gradient-purple-start);
	}

	.enrolled-badge {
		background: #d1fae5;
		color: #065f46;
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 16px;
		text-align: center;
		font-weight: 600;
	}

	.enroll-cta-btn,
	.view-courses-btn {
		display: block;
		width: 100%;
		padding: 14px 32px;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		color: white;
		text-decoration: none;
		border-radius: 8px;
		text-align: center;
		font-weight: 600;
		transition: all 0.3s ease;
	}

	.enroll-cta-btn:hover,
	.view-courses-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
	}

	@media (max-width: 1024px) {
		.course-container {
			flex-direction: column;
		}

		.course-sidebar {
			width: 100%;
		}

		.hero-content h1 {
			font-size: 2em;
		}

		.hero-description {
			font-size: 1em;
		}
	}

	@media (max-width: 768px) {
		.course-hero {
			height: 300px;
		}

		.hero-content {
			padding: 20px;
		}

		.hero-content h1 {
			font-size: 1.5em;
		}

		.course-main {
			padding: 24px;
		}
	}
</style>
