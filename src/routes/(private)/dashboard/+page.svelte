<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Dashboard - Naik Kelas</title>
</svelte:head>

<div class="dashboard-overview">
	<h1>Welcome, {data.user.username}!</h1>

	<div class="stats-grid">
		<div class="stat-card">
			<h3>My Courses</h3>
			<p class="stat-value">0</p>
		</div>

		<div class="stat-card">
			<h3>Progress</h3>
			<p class="stat-value">0%</p>
		</div>

		<div class="stat-card">
			<h3>Certificates</h3>
			<p class="stat-value">0</p>
		</div>
	</div>

	<div class="quick-actions">
		<h2>Quick Actions</h2>
		<div class="actions-grid">
			<a href="/dashboard/courses" class="action-card"> Browse Courses </a>
			<a href="/dashboard/my-courses" class="action-card"> My Enrollments </a>
			{#if data.user.role === 'admin'}
				<a href="/dashboard/admin/courses" class="action-card"> Manage Courses </a>
			{/if}
		</div>
	</div>
</div>

<style>
	.dashboard-overview {
		display: flex;
		flex-direction: column;
		gap: 30px;
	}

	h1 {
		font-size: 2em;
		color: var(--color-primary-dark);
		margin-bottom: 10px;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 20px;
	}

	.stat-card {
		background: linear-gradient(135deg, var(--color-bg-hero) 0%, var(--color-bg-hero-end) 100%);
		padding: 24px;
		border-radius: 12px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.stat-card h3 {
		font-size: 0.9em;
		color: var(--color-primary-medium);
		margin-bottom: 8px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.stat-value {
		font-size: 2em;
		font-weight: 700;
		color: var(--color-gradient-purple-start);
	}

	.quick-actions h2 {
		font-size: 1.5em;
		color: var(--color-primary-dark);
		margin-bottom: 20px;
	}

	.actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
	}

	.action-card {
		background: white;
		padding: 30px;
		border-radius: 12px;
		text-align: center;
		text-decoration: none;
		color: var(--color-primary-dark);
		font-weight: 600;
		border: 2px solid var(--color-bg-hero-end);
		transition: all 0.3s ease;
	}

	.action-card:hover {
		border-color: var(--color-gradient-purple-start);
		transform: translateY(-5px);
		box-shadow: 0 10px 20px rgba(102, 126, 234, 0.2);
	}
</style>
