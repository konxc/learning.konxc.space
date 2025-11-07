<script lang="ts">
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import type { TableColumn } from '$lib/types/table';
	import { COLOR, RADIUS, TEXT, TRANSITION } from '$lib/config/design';
	import { formatDateTime } from '$lib/utils/format';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/stores/toast';

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
			const response = await fetch(`/dashboard/admin/courses/delete/${courseId}`, {
				method: 'POST'
			});
			if (response.ok) {
				toast.success('Course deleted');
				await goto('/dashboard/admin/courses', { invalidateAll: true });
			} else {
				toast.error('Failed to delete course');
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
				href="/dashboard/admin/courses/edit/{entry.id}"
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
					href="/dashboard/admin/courses/edit/{entry.id}"
					class={`inline-flex items-center gap-1.5 ${RADIUS.button} border border-gray-300 bg-white px-3 py-1.5 ${TEXT.button} ${COLOR.textPrimary} ${TRANSITION.all} hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:bg-blue-900/30 dark:hover:text-blue-300`}
				>
					✏️ Edit
				</a>
				<button
					type="button"
					class={`inline-flex items-center gap-1.5 ${RADIUS.button} border border-red-300 bg-white px-3 py-1.5 ${TEXT.button} text-red-700 ${TRANSITION.all} hover:border-red-500 hover:bg-red-50 dark:border-red-600 dark:bg-neutral-800 dark:text-red-400 dark:hover:border-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-300`}
					onclick={() => handleDelete(entry.id, entry.title)}
				>
					🗑️ Delete
				</button>
			</div>
		{/if}
	{/snippet}
</DataTable>
