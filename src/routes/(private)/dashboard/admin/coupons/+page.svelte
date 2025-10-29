<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	let filter = $state('all');
	let searchQuery = $state('');

	let copiedCode = $state<string | null>(null);

	const filteredCoupons = $derived(
		data.coupons.filter((coupon) => {
			const matchesFilter =
				filter === 'all' ||
				(filter === 'active' &&
					coupon.isActive &&
					(!coupon.validUntil || new Date(coupon.validUntil) > new Date())) ||
				(filter === 'expired' && coupon.validUntil && new Date(coupon.validUntil) < new Date());

			const matchesSearch =
				searchQuery === '' || coupon.code.toLowerCase().includes(searchQuery.toLowerCase());

			return matchesFilter && matchesSearch;
		})
	);

	const allCount = $derived.by(
		() =>
			data.coupons.filter(
				(c) => searchQuery === '' || c.code.toLowerCase().includes(searchQuery.toLowerCase())
			).length
	);

	const activeCount = $derived.by(
		() =>
			data.coupons.filter(
				(c) =>
					c.isActive &&
					(!c.validUntil || new Date(c.validUntil) > new Date()) &&
					(searchQuery === '' || c.code.toLowerCase().includes(searchQuery.toLowerCase()))
			).length
	);

	const expiredCount = $derived.by(
		() =>
			data.coupons.filter(
				(c) =>
					c.validUntil &&
					new Date(c.validUntil) < new Date() &&
					(searchQuery === '' || c.code.toLowerCase().includes(searchQuery.toLowerCase()))
			).length
	);

	async function copyCode(code: string) {
		try {
			await navigator.clipboard.writeText(code);
			copiedCode = code;
			setTimeout(() => {
				copiedCode = null;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	async function duplicateCoupon(couponId: string) {
		if (!confirm('Duplicate this coupon? A new code will be generated.')) return;

		try {
			const response = await fetch(`/dashboard/admin/coupons?action=duplicate`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ couponId })
			});

			if (response.ok) {
				window.location.reload();
			}
		} catch (err) {
			console.error('Failed to duplicate:', err);
		}
	}

	async function toggleStatus(couponId: string, currentStatus: boolean) {
		try {
			const response = await fetch(`/dashboard/admin/coupons?action=toggle`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ couponId })
			});

			if (response.ok) {
				window.location.reload();
			}
		} catch (err) {
			console.error('Failed to toggle:', err);
		}
	}
</script>

<svelte:head>
	<title>Coupon Management - Admin</title>
</svelte:head>

<div class="coupons-page">
	<div class="page-header">
		<h1>Coupon Management</h1>
		<a href="/dashboard/admin/coupons/create" class="create-btn">+ Create Coupon</a>
	</div>

	<div class="search-bar">
		<input
			type="text"
			placeholder="Search by coupon code..."
			bind:value={searchQuery}
			class="search-input"
		/>
	</div>

	<div class="filters">
		<button class="filter-btn" class:active={filter === 'all'} onclick={() => (filter = 'all')}>
			All ({allCount})
		</button>
		<button
			class="filter-btn"
			class:active={filter === 'active'}
			onclick={() => (filter = 'active')}
		>
			Active ({activeCount})
		</button>
		<button
			class="filter-btn"
			class:active={filter === 'expired'}
			onclick={() => (filter = 'expired')}
		>
			Expired ({expiredCount})
		</button>
	</div>

	<div class="coupons-table">
		<table>
			<thead>
				<tr>
					<th>Code</th>
					<th>Type</th>
					<th>Discount</th>
					<th>Usage</th>
					<th>Valid Until</th>
					<th>Status</th>
					<th>Created By</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredCoupons as coupon}
					<tr>
						<td>
							<div style="display: flex; align-items: center; gap: 8px;">
								<code class="coupon-code">{coupon.code}</code>
								<button
									class="copy-btn"
									onclick={() => copyCode(coupon.code)}
									title="Copy code"
									class:copied={copiedCode === coupon.code}
								>
									{copiedCode === coupon.code ? '✓' : '📋'}
								</button>
							</div>
						</td>
						<td>
							<span class="type-badge" class:free={coupon.type === 'free'}>
								{coupon.type}
							</span>
						</td>
						<td>
							{#if coupon.type === 'discount'}
								{#if coupon.discountType === 'percentage'}
									{coupon.discountValue}%
								{:else}
									Rp {coupon.discountValue?.toLocaleString('id-ID')}
								{/if}
							{:else}
								<span class="text-muted">Free course</span>
							{/if}
						</td>
						<td>
							{coupon.currentUses}
							{#if coupon.maxUses}
								/ {coupon.maxUses}
							{/if}
						</td>
						<td>
							{#if coupon.validUntil}
								{new Date(coupon.validUntil).toLocaleDateString('id-ID')}
							{:else}
								<span class="text-muted">No expiry</span>
							{/if}
						</td>
						<td>
							<span class="status-badge" class:active={coupon.isActive}>
								{coupon.isActive ? 'Active' : 'Inactive'}
							</span>
						</td>
						<td>{coupon.creator.username}</td>
						<td class="actions">
							<a href="/dashboard/admin/coupons/edit/{coupon.id}" class="edit-btn">Edit</a>
							<button
								class="duplicate-btn"
								onclick={() => duplicateCoupon(coupon.id)}
								title="Duplicate coupon"
							>
								📋 Copy
							</button>
							<button
								class="toggle-btn"
								class:activate={!coupon.isActive}
								class:deactivate={coupon.isActive}
								onclick={() => toggleStatus(coupon.id, coupon.isActive)}
							>
								{coupon.isActive ? 'Deactivate' : 'Activate'}
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if data.coupons.length === 0}
		<div class="empty-state">
			<p>No coupons found. Create your first coupon!</p>
			<a href="/dashboard/admin/coupons/create" class="create-btn">+ Create Coupon</a>
		</div>
	{/if}
</div>

<style>
	.coupons-page {
		max-width: 1400px;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
	}

	.search-bar {
		margin-bottom: 20px;
	}

	.search-input {
		width: 100%;
		padding: 12px 16px;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-size: 1em;
		transition: all 0.2s ease;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.page-header h1 {
		font-size: 2em;
		color: var(--color-primary-dark);
	}

	.create-btn {
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

	.create-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
	}

	.filters {
		display: flex;
		gap: 12px;
		margin-bottom: 24px;
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

	.coupons-table {
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

	.coupon-code {
		background: #f9fafb;
		padding: 4px 8px;
		border-radius: 4px;
		font-family: 'Courier New', monospace;
		font-weight: 600;
		color: var(--color-gradient-purple-start);
	}

	.type-badge {
		display: inline-block;
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 0.85em;
		text-transform: capitalize;
		background: #f3f4f6;
		color: #6b7280;
	}

	.type-badge.free {
		background: #dbeafe;
		color: #1e40af;
	}

	.status-badge {
		display: inline-block;
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 0.85em;
		text-transform: capitalize;
		background: #f3f4f6;
		color: #6b7280;
	}

	.status-badge.active {
		background: #d1fae5;
		color: #065f46;
	}

	.actions {
		display: flex;
		gap: 8px;
	}

	.edit-btn,
	.duplicate-btn,
	.toggle-btn {
		padding: 6px 12px;
		background: var(--color-gradient-purple-start);
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 0.85em;
		cursor: pointer;
		transition: all 0.2s ease;
		text-decoration: none;
		display: inline-block;
	}

	.edit-btn:hover,
	.duplicate-btn:hover {
		opacity: 0.9;
	}

	.toggle-btn.activate {
		background: #d1fae5;
		color: #065f46;
	}

	.toggle-btn.deactivate {
		background: #fee2e2;
		color: #dc2626;
	}

	.toggle-btn:hover {
		opacity: 0.9;
	}

	.copy-btn {
		padding: 4px 8px;
		background: #f3f4f6;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9em;
		transition: all 0.2s ease;
	}

	.copy-btn:hover {
		background: #e5e7eb;
	}

	.copy-btn.copied {
		background: #d1fae5;
		color: #065f46;
	}

	.text-muted {
		color: var(--color-primary-medium);
		font-size: 0.9em;
	}

	.empty-state {
		text-align: center;
		padding: 60px 20px;
		color: var(--color-primary-medium);
	}

	.empty-state p {
		font-size: 1.2em;
		margin-bottom: 20px;
	}

	@media (max-width: 768px) {
		.coupons-table {
			overflow-x: auto;
		}

		table {
			min-width: 800px;
		}
	}
</style>
