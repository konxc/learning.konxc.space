<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import { page } from '$app/stores';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let searchQuery = $state('');
	let statusFilter = $state('');
	let showNotesModal = $state<string | null>(null);
	let notesValue = $state('');

	// Client-side filtering
	let filteredEntries = $derived(() => {
		let entries = data.entries;

		// Filter by status
		if (statusFilter) {
			entries = entries.filter((entry) => entry.status === statusFilter);
		}

		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			entries = entries.filter(
				(entry) =>
					entry.fullName.toLowerCase().includes(query) ||
					entry.email.toLowerCase().includes(query) ||
					(entry.phone && entry.phone.includes(query))
			);
		}

		return entries;
	});

	const statusCounts = $derived(() => {
		const counts: Record<string, number> = {
			all: data.entries.length,
			new: 0,
			contacted: 0,
			qualified: 0,
			converted: 0,
			archived: 0
		};

		data.entries.forEach((entry) => {
			if (entry.status in counts) {
				counts[entry.status]++;
			}
		});

		return counts;
	});

	const statusLabels: Record<string, string> = {
		new: 'New',
		contacted: 'Contacted',
		qualified: 'Qualified',
		converted: 'Converted',
		archived: 'Archived'
	};

	const statusColors: Record<string, string> = {
		new: 'bg-blue-100 text-blue-800',
		contacted: 'bg-yellow-100 text-yellow-800',
		qualified: 'bg-green-100 text-green-800',
		converted: 'bg-purple-100 text-purple-800',
		archived: 'bg-gray-100 text-gray-800'
	};

	function openNotesModal(entry: { id: string; notes: string | null }) {
		notesValue = entry.notes || '';
		showNotesModal = entry.id;
	}

	function closeNotesModal() {
		showNotesModal = null;
		notesValue = '';
	}
</script>

<svelte:head>
	<title>CRM: Waiting List - Naik Kelas</title>
</svelte:head>

<div class="waiting-list-dashboard">
	<div class="dashboard-header">
		<h1>Waiting List Management</h1>
		<p>Kelola dan pantau semua calon customer yang mendaftar di waiting list</p>
	</div>

	{#if form?.success}
		<div class="success-message">Status berhasil diperbarui!</div>
	{/if}

	{#if form?.error}
		<div class="error-message">{form.error}</div>
	{/if}

	<!-- Filters and Search -->
	<div class="filters-section">
		<div class="filters-row">
			<div class="search-box">
				<input
					type="text"
					placeholder="Cari nama, email, atau HP..."
					bind:value={searchQuery}
					class="search-input"
				/>
			</div>

			<div class="status-filters">
				<button
					type="button"
					class="filter-btn"
					class:active={statusFilter === ''}
					onclick={() => (statusFilter = '')}
				>
					All ({statusCounts.all})
				</button>
				<button
					type="button"
					class="filter-btn"
					class:active={statusFilter === 'new'}
					onclick={() => (statusFilter = 'new')}
				>
					New ({statusCounts.new})
				</button>
				<button
					type="button"
					class="filter-btn"
					class:active={statusFilter === 'contacted'}
					onclick={() => (statusFilter = 'contacted')}
				>
					Contacted ({statusCounts.contacted})
				</button>
				<button
					type="button"
					class="filter-btn"
					class:active={statusFilter === 'qualified'}
					onclick={() => (statusFilter = 'qualified')}
				>
					Qualified ({statusCounts.qualified})
				</button>
				<button
					type="button"
					class="filter-btn"
					class:active={statusFilter === 'converted'}
					onclick={() => (statusFilter = 'converted')}
				>
					Converted ({statusCounts.converted})
				</button>
				<button
					type="button"
					class="filter-btn"
					class:active={statusFilter === 'archived'}
					onclick={() => (statusFilter = 'archived')}
				>
					Archived ({statusCounts.archived})
				</button>
			</div>

			<a href="?/export" class="export-btn">📥 Export CSV</a>
		</div>
	</div>

	<!-- Results Summary -->
	<div class="summary">
		Menampilkan <strong>{filteredEntries.length}</strong> dari
		<strong>{data.entries.length}</strong> entries
	</div>

	<!-- Table -->
	<div class="table-wrapper">
		<table class="waiting-list-table">
			<thead>
				<tr>
					<th>Nama</th>
					<th>Email</th>
					<th>HP</th>
					<th>Minat</th>
					<th>Source</th>
					<th>Status</th>
					<th>Tanggal Daftar</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredEntries as entry}
					<tr>
						<td>
							<strong>{entry.fullName}</strong>
						</td>
						<td>{entry.email}</td>
						<td>{entry.phone || '-'}</td>
						<td>{entry.interest || '-'}</td>
						<td>{entry.source || '-'}</td>
						<td>
							<form method="POST" action="?/updateStatus" use:enhance>
								<input type="hidden" name="id" value={entry.id} />
								<select name="status" onchange="this.form.requestSubmit()" class="status-select">
									{#each Object.keys(statusLabels) as statusKey}
										<option value={statusKey} selected={entry.status === statusKey}>
											{statusLabels[statusKey]}
										</option>
									{/each}
								</select>
							</form>
						</td>
						<td>{new Date(entry.createdAt).toLocaleString('id-ID')}</td>
						<td>
							<button type="button" class="notes-btn" onclick={() => openNotesModal(entry)}>
								📝 Notes
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		{#if filteredEntries.length === 0}
			<div class="empty-state">
				<p>Tidak ada entries yang sesuai dengan filter.</p>
			</div>
		{/if}
	</div>
</div>

<!-- Notes Modal -->
{#if showNotesModal}
	<div class="modal-overlay" onclick={closeNotesModal}>
		<div class="modal-content" onclick={(e) => e.stopPropagation()}>
			<h2>Add/Edit Notes</h2>
			<form method="POST" action="?/addNotes" use:enhance>
				<input type="hidden" name="id" value={showNotesModal} />
				<textarea
					name="notes"
					bind:value={notesValue}
					placeholder="Tambahkan catatan untuk entry ini..."
					class="notes-textarea"
					rows="6"
				></textarea>
				<div class="modal-actions">
					<button type="button" class="cancel-btn" onclick={closeNotesModal}>Batal</button>
					<button type="submit" class="save-btn">Simpan Notes</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.waiting-list-dashboard {
		padding: 20px;
	}

	.dashboard-header {
		margin-bottom: 30px;
	}

	.dashboard-header h1 {
		font-size: 2em;
		color: var(--color-primary-dark);
		margin-bottom: 8px;
	}

	.dashboard-header p {
		color: var(--color-primary-medium);
		font-size: 1em;
	}

	.success-message {
		padding: 12px 16px;
		background: #d1fae5;
		color: #065f46;
		border-radius: 8px;
		margin-bottom: 20px;
	}

	.error-message {
		padding: 12px 16px;
		background: #fee2e2;
		color: #dc2626;
		border-radius: 8px;
		margin-bottom: 20px;
	}

	.filters-section {
		background: white;
		padding: 20px;
		border-radius: 12px;
		margin-bottom: 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.filters-row {
		display: flex;
		gap: 16px;
		align-items: center;
		flex-wrap: wrap;
	}

	.search-box {
		flex: 1;
		min-width: 250px;
	}

	.search-input {
		width: 100%;
		padding: 10px 16px;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-size: 1em;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.status-filters {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.filter-btn {
		padding: 8px 16px;
		border: 2px solid #e5e7eb;
		background: white;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.9em;
		transition: all 0.2s ease;
	}

	.filter-btn:hover {
		background: var(--color-bg-hero);
	}

	.filter-btn.active {
		background: var(--color-gradient-purple-start);
		color: white;
		border-color: var(--color-gradient-purple-start);
	}

	.export-btn {
		padding: 10px 20px;
		background: var(--color-gradient-purple-start);
		color: white;
		text-decoration: none;
		border-radius: 8px;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.export-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	}

	.summary {
		margin-bottom: 16px;
		color: var(--color-primary-medium);
		font-size: 0.95em;
	}

	.table-wrapper {
		background: white;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.waiting-list-table {
		width: 100%;
		border-collapse: collapse;
	}

	.waiting-list-table thead {
		background: var(--color-bg-hero);
	}

	.waiting-list-table th {
		padding: 16px;
		text-align: left;
		font-weight: 600;
		color: var(--color-primary-dark);
		border-bottom: 2px solid #e5e7eb;
	}

	.waiting-list-table td {
		padding: 16px;
		border-bottom: 1px solid #e5e7eb;
	}

	.waiting-list-table tbody tr:hover {
		background: var(--color-bg-hero);
	}

	.status-select {
		padding: 6px 12px;
		border: 2px solid #e5e7eb;
		border-radius: 6px;
		font-size: 0.9em;
		cursor: pointer;
	}

	.status-select:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
	}

	.notes-btn {
		padding: 6px 12px;
		background: var(--color-bg-hero);
		border: 2px solid #e5e7eb;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9em;
		transition: all 0.2s ease;
	}

	.notes-btn:hover {
		background: var(--color-gradient-purple-start);
		color: white;
		border-color: var(--color-gradient-purple-start);
	}

	.empty-state {
		padding: 60px 20px;
		text-align: center;
		color: var(--color-primary-medium);
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-content {
		background: white;
		border-radius: 12px;
		padding: 30px;
		max-width: 600px;
		width: 90%;
		max-height: 80vh;
		overflow-y: auto;
	}

	.modal-content h2 {
		font-size: 1.5em;
		color: var(--color-primary-dark);
		margin-bottom: 20px;
	}

	.notes-textarea {
		width: 100%;
		padding: 12px;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-size: 1em;
		font-family: inherit;
		resize: vertical;
		margin-bottom: 20px;
	}

	.notes-textarea:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.modal-actions {
		display: flex;
		gap: 12px;
		justify-content: flex-end;
	}

	.cancel-btn,
	.save-btn {
		padding: 10px 20px;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		border: none;
	}

	.cancel-btn {
		background: #e5e7eb;
		color: var(--color-primary-dark);
	}

	.cancel-btn:hover {
		background: #d1d5db;
	}

	.save-btn {
		background: var(--color-gradient-purple-start);
		color: white;
	}

	.save-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.filters-row {
			flex-direction: column;
			align-items: stretch;
		}

		.search-box {
			width: 100%;
		}

		.status-filters {
			width: 100%;
			overflow-x: auto;
		}

		.waiting-list-table {
			font-size: 0.9em;
		}

		.waiting-list-table th,
		.waiting-list-table td {
			padding: 12px 8px;
		}
	}
</style>
