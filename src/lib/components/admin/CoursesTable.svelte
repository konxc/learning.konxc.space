<script lang="ts">
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { TableColumn } from '$lib/types/table';
	import { COLOR, RADIUS, TEXT, TRANSITION } from '$lib/config/design';
	import { formatDateTime } from '$lib/utils/format';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/stores/toastStore';

	interface CourseEntry {
		id: string;
		title: string;
		status: string;
		price: number;
		duration?: number | null;
		createdAt: Date | string;
	}

	let {
		entries,
		columns,
		columnVisibility,
		isColumnVisible,
		onDelete
	}: {
		entries: CourseEntry[];
		columns: TableColumn[];
		columnVisibility: Record<string, boolean>;
		isColumnVisible: (key: string) => boolean;
		onDelete?: (courseId: string) => Promise<void>;
	} = $props();

	async function handleDelete(courseId: string, courseTitle: string) {
		if (!confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
			return;
		}

		if (onDelete) {
			try {
				await onDelete(courseId);
			} catch (error) {
				console.error('Error deleting course:', error);
			}
		} else {
			// Fallback to default delete action
			const response = await fetch(`/app/admin/courses/delete/${courseId}`, {
				method: 'POST'
			});
			if (response.ok) {
				toast.success('Kursus berhasil dihapus');
				await goto('/app/admin/courses', { invalidateAll: true });
			} else {
				toast.error('Gagal menghapus kursus');
			}
		}
	}

	function formatPrice(price: number): string {
		return `Rp ${price.toLocaleString('id-ID')}`;
	}

	function formatDuration(duration: number | null | undefined): string {
		if (!duration) return 'N/A';
		return `${duration} week${duration > 1 ? 's' : ''}`;
	}
</script>

<DataTable
	{entries}
	{columns}
	{columnVisibility}
	{isColumnVisible}
	emptyStateMessage="Tidak ada courses yang sesuai dengan filter."
>
	{#snippet cell(key, entry: CourseEntry, index)}
		{#if key === 'title'}
			<a
				href="/app/admin/courses/edit/{entry.id}"
				class="font-medium hover:text-blue-600 dark:hover:text-blue-400 ${TRANSITION.colors}"
			>
				{entry.title}
			</a>
		{:else if key === 'status'}
			<span
				class={`inline-flex items-center ${RADIUS.small} px-2 py-1 text-xs font-medium ${
					entry.status === 'published'
						? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
						: 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-300'
				}`}
			>
				{entry.status}
			</span>
		{:else if key === 'price'}
			{formatPrice(entry.price)}
		{:else if key === 'duration'}
			{formatDuration(entry.duration)}
		{:else if key === 'createdAt'}
			{formatDateTime(entry.createdAt)}
		{:else if key === 'actions'}
			<div class="flex items-center gap-2">
				<a
					href="/app/admin/courses/edit/{entry.id}"
					class={`inline-flex items-center gap-1.5 ${RADIUS.small} border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold ${COLOR.textSecondary} ${TRANSITION.all} hover:border-blue-500/50 hover:bg-blue-50/50 hover:text-blue-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-blue-500/50 dark:hover:bg-blue-900/30 dark:hover:text-blue-400`}
				>
					<Icon name="edit" size={14} />
					Edit
				</a>
				<button
					type="button"
					class={`inline-flex items-center gap-1.5 ${RADIUS.small} border border-red-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-600 ${TRANSITION.all} hover:border-red-500/50 hover:bg-red-50/50 hover:text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:border-red-500/50 dark:hover:bg-red-900/30 dark:hover:text-red-300`}
					onclick={() => handleDelete(entry.id, entry.title)}
				>
					<Icon name="delete" size={14} />
					Delete
				</button>
			</div>
		{/if}
	{/snippet}
</DataTable>
