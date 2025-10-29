<script lang="ts">
	import HeaderNavigation from '$lib/components/HeaderNavigation.svelte';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	let { data, children }: { data: PageData; children: any } = $props();
</script>

<div class="dashboard-layout">
	<HeaderNavigation />

	<div class="dashboard-container">
		<sidebar class="dashboard-sidebar">
			<nav class="sidebar-nav">
				{#each data.navItems as item}
					<a href={item.href} class:active={$page.url.pathname === item.href} class="nav-item">
						{item.label}
					</a>
				{/each}
			</nav>

			<div class="user-profile">
				<p class="username">{data.user.username}</p>
				<p class="role">Role: {data.user.role || 'user'}</p>
			</div>
		</sidebar>

		<main class="dashboard-content">
			{@render children?.()}
		</main>
	</div>
</div>

<style>
	.dashboard-layout {
		min-height: 100vh;
		background: var(--color-bg-hero);
	}

	.dashboard-container {
		display: flex;
		gap: 20px;
		padding: 20px;
		max-width: 1400px;
		margin: 0 auto;
	}

	.dashboard-sidebar {
		width: 250px;
		background: white;
		border-radius: 12px;
		padding: 20px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.nav-item {
		padding: 12px 16px;
		border-radius: 8px;
		text-decoration: none;
		color: var(--color-primary-dark);
		transition: all 0.2s ease;
	}

	.nav-item:hover {
		background: var(--color-bg-hero);
	}

	.nav-item.active {
		background: var(--color-gradient-purple-start);
		color: white;
	}

	.user-profile {
		padding-top: 20px;
		border-top: 1px solid #e5e7eb;
	}

	.username {
		font-weight: 600;
		color: var(--color-primary-dark);
		margin-bottom: 4px;
	}

	.role {
		font-size: 0.85em;
		color: var(--color-primary-medium);
		text-transform: capitalize;
	}

	.dashboard-content {
		flex: 1;
		background: white;
		border-radius: 12px;
		padding: 30px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		min-height: 600px;
	}

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		.dashboard-container {
			flex-direction: column;
		}

		.dashboard-sidebar {
			width: 100%;
		}

		.dashboard-content {
			padding: 20px;
		}
	}
</style>
