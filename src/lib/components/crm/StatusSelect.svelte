<script lang="ts">
	import { enhance } from '$app/forms';
	import { RADIUS, COLOR, SPACING, TEXT, TRANSITION } from '$lib/config/design';
	import { toast } from '$lib/stores/toast';

	export interface StatusSelectProps {
		entryId: string;
		currentStatus: string;
		statusLabels: Record<string, string>;
		action?: string;
	}

	let {
		entryId,
		currentStatus,
		statusLabels,
		action = '?/updateStatus'
	}: StatusSelectProps = $props();
</script>

<form
	method="POST"
	{action}
	use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				toast.success('Status berhasil diperbarui!');
			} else if (result.type === 'failure') {
				const errorMsg =
					result.data && typeof result.data === 'object' && 'error' in result.data
						? String(result.data.error)
						: 'Gagal memperbarui status';
				toast.error(errorMsg);
			}
			await update();
		};
	}}
>
	<input type="hidden" name="id" value={entryId} />
	<select
		name="status"
		onchange={(e) => {
			const form = (e.target as HTMLSelectElement).form;
			if (form) {
				form.requestSubmit();
			}
		}}
		class={`${RADIUS.input} border border-gray-300 dark:border-neutral-600 ${SPACING.input} ${TEXT.button} ${COLOR.textPrimary} cursor-pointer bg-white outline-none dark:bg-neutral-800 ${TRANSITION.all} hover:border-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:hover:border-neutral-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/50`}
	>
		{#each Object.keys(statusLabels) as key}
			<option
				value={key}
				selected={currentStatus === key}
				class="bg-white text-gray-900 dark:bg-neutral-800 dark:text-gray-100"
			>
				{statusLabels[key]}
			</option>
		{/each}
	</select>
</form>

<style>
	/* Custom styling untuk select dropdown agar konsisten dengan tema */
	form select {
		color-scheme: light dark;
	}

	/* Memastikan dropdown arrow icon juga menyesuaikan tema */
	form select::-webkit-appearance {
		appearance: none;
	}

	form select {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
		background-position: right 0.5rem center;
		background-repeat: no-repeat;
		background-size: 1.5em 1.5em;
		padding-right: 2.5rem;
	}
</style>
