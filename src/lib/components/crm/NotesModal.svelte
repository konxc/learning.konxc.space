<script lang="ts">
	import { enhance } from '$app/forms';
	import { RADIUS, COLOR, SPACING, TEXT, TRANSITION } from '$lib/config/design';
	import { toast } from '$lib/stores/toast';
	import Modal from '$lib/components/ui/Modal.svelte';

	export interface NotesModalProps {
		entryId: string;
		notes: string;
		isOpen?: boolean;
		onClose: () => void;
		onSave?: () => void;
	}

	let { entryId, notes: initialNotes, isOpen = true, onClose, onSave }: NotesModalProps = $props();

	let notesValue = $state(initialNotes);

	// Sync dengan initialNotes ketika berubah
	$effect(() => {
		notesValue = initialNotes;
	});
</script>

<Modal {isOpen} title="Add/Edit Notes" size="2xl" {onClose}>
	<form
		method="POST"
		action="?/addNotes"
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					toast.success('Notes berhasil disimpan!');
					onSave?.();
					onClose();
				} else if (result.type === 'failure') {
					const errorMsg =
						result.data && typeof result.data === 'object' && 'error' in result.data
							? String(result.data.error)
							: 'Gagal menyimpan notes';
					toast.error(errorMsg);
				}
				await update();
			};
		}}
		class="space-y-4"
	>
		<input type="hidden" name="id" value={entryId} />
		<textarea
			name="notes"
			bind:value={notesValue}
			placeholder="Tambahkan catatan untuk entry ini..."
			class={`w-full ${RADIUS.input} border border-gray-300 dark:border-neutral-600 ${SPACING.input} ${TEXT.body} ${COLOR.textPrimary} bg-white outline-none dark:bg-neutral-800 ${TRANSITION.all} resize-y focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/50`}
			rows="6"
		></textarea>
		<div class="flex items-center justify-end gap-3 pt-2">
			<button
				type="button"
				class={`inline-flex items-center ${RADIUS.button} border border-gray-300 dark:border-neutral-600 ${SPACING.button} ${TEXT.button} ${COLOR.textPrimary} bg-white dark:bg-neutral-800 ${TRANSITION.all} hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600/70 focus-visible:ring-offset-1 dark:hover:border-neutral-500 dark:hover:bg-neutral-700 dark:focus-visible:ring-gray-500/70`}
				onclick={onClose}
			>
				Batal
			</button>
			<button
				type="submit"
				class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} ${SPACING.button} ${TEXT.button} font-semibold text-white shadow-sm ${TRANSITION.all} hover:opacity-90 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
			>
				Simpan Notes
			</button>
		</div>
	</form>
</Modal>
