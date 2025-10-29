<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	let filter = $state('all');
</script>

<svelte:head>
	<title>User Management - Admin</title>
</svelte:head>

<div class="users-page">
	<div class="page-header">
		<h1>User Management</h1>
	</div>

	<div class="filters">
		<button class="filter-btn" class:active={filter === 'all'} onclick={() => (filter = 'all')}>
			All ({data.users.length})
		</button>
		<button
			class="filter-btn"
			class:active={filter === 'admin'}
			onclick={() => (filter = 'admin')}
		>
			Admins ({data.users.filter((u) => u.role === 'admin').length})
		</button>
		<button
			class="filter-btn"
			class:active={filter === 'mentor'}
			onclick={() => (filter = 'mentor')}
		>
			Mentors ({data.users.filter((u) => u.role === 'mentor').length})
		</button>
		<button
			class="filter-btn"
			class:active={filter === 'user'}
			onclick={() => (filter = 'user')}
		>
			Users ({data.users.filter((u) => u.role === 'user').length})
		</button>
	</div>

	<div class="users-table">
		<table>
			<thead>
				<tr>
					<th>Username</th>
					<th>Full Name</th>
					<th>Email</th>
					<th>Role</th>
					<th>Onboarding</th>
					<th>Joined</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users.filter((u) => filter === 'all' || u.role === filter) as user}
					<tr>
						<td>
							<div class="username-cell">
								<strong>{user.username}</strong>
							</div>
						</td>
						<td>{user.fullName || '—'}</td>
						<td>{user.email || '—'}</td>
						<td>
							<span class="role-badge" class:admin={user.role === 'admin'} class:mentor={user.role === 'mentor'}>
								{user.role}
							</span>
						</td>
						<td>
							{#if user.onboardingCompleted}
								<span class="badge-completed">✓ Completed</span>
							{:else}
								<span class="badge-pending">Pending</span>
							{/if}
						</td>
						<td>{new Date(user.createdAt).toLocaleDateString('id-ID')}</td>
						<td class="actions">
							<button class="edit-btn">Edit</button>
							<button class="role-btn">Change Role</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if data.users.length === 0}
		<div class="empty-state">
			<p>No users found.</p>
		</div>
	{/if}
</div>

<style>
	.users-page {
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

	.filters {
		display: flex;
		gap: 12px;
		margin-bottom: 24px;
		flex-wrap: wrap;
	}

	.filter-btn {
		padding: 8px 16px;
		background: white;
		border: 2px solid var(--color-bg-hero-end);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.filter-btn:hover {
		border-color: var(--color-gradient-purple-start);
	}

	.filter-btn.active {
		background: var(--color-gradient-purple-start);
		color: white;
		border-color: var(--color-gradient-purple-start);
	}

	.users-table {
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

	.username-cell {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.role-badge {
		display: inline-block;
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 0.85em;
		text-transform: capitalize;
		background: #f3f4f6;
		color: #6b7280;
	}

	.role-badge.admin {
		background: #fef3c7;
		color: #92400e;
	}

	.role-badge.mentor {
		background: #dbeafe;
		color: #1e40af;
	}

	.badge-completed {
		color: #065f46;
	}

	.badge-pending {
		color: #92400e;
	}

	.actions {
		display: flex;
		gap: 8px;
	}

	.edit-btn,
	.role-btn {
		padding: 6px 12px;
		background: var(--color-gradient-purple-start);
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 0.85em;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.edit-btn:hover,
	.role-btn:hover {
		opacity: 0.9;
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
		.users-table {
			overflow-x: auto;
		}

		table {
			min-width: 800px;
		}
	}
</style>
