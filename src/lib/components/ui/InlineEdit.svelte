<script lang="ts">
	import { COLOR, RADIUS, TRANSITION, TEXT } from '$lib/config/design';

	interface Props {
		value: string;
		onSave: (newValue: string) => Promise<void>;
		placeholder?: string;
	}

	let { value, onSave, placeholder = 'Click to edit...' }: Props = $props();

	let isEditing = $state(false);
	let isSaving = $state(false);
	let hasError = $state(false);
	let draft = $state(value);
	let inputEl = $state<HTMLInputElement | null>(null);

	function startEdit() {
		draft = value;
		isEditing = true;
		hasError = false;
		// Focus input on next tick
		setTimeout(() => inputEl?.focus(), 0);
	}

	async function save() {
		if (draft === value) {
			isEditing = false;
			return;
		}
		isSaving = true;
		hasError = false;
		try {
			await onSave(draft);
			isEditing = false;
		} catch {
			hasError = true;
			draft = value; // revert
		} finally {
			isSaving = false;
		}
	}

	function cancel() {
		draft = value;
		isEditing = false;
		hasError = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			save();
		} else if (e.key === 'Escape') {
			cancel();
		}
	}
</script>

{#if isEditing}
	<div class="flex items-center gap-2">
		<input
			bind:this={inputEl}
			bind:value={draft}
			onkeydown={handleKeydown}
			onblur={save}
			{placeholder}
			disabled={isSaving}
			class={`flex-1 px-3 py-1.5 text-sm ${RADIUS.input} border ${
				hasError
					? 'border-red-400 focus:ring-red-200'
					: `${COLOR.cardBorder} focus:border-blue-500 focus:ring-blue-100`
			} ${COLOR.textPrimary} bg-white outline-none focus:ring-2 dark:bg-zinc-800 dark:focus:ring-blue-900/50 ${TRANSITION.colors} disabled:opacity-60`}
			aria-label="Edit value"
		/>
		{#if isSaving}
			<!-- Spinner -->
			<svg
				class="h-4 w-4 animate-spin text-blue-500"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				aria-label="Saving..."
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
				></path>
			</svg>
		{/if}
		{#if hasError}
			<span class="text-xs text-red-500">Gagal menyimpan</span>
		{/if}
	</div>
{:else}
	<button
		onclick={startEdit}
		class={`group inline-flex items-center gap-1.5 rounded px-1 py-0.5 text-left ${TEXT.body} ${COLOR.textPrimary} ${TRANSITION.colors} hover:bg-zinc-100 dark:hover:bg-zinc-800`}
		aria-label="Klik untuk mengedit"
		title="Klik untuk mengedit"
	>
		<span>{value || placeholder}</span>
		<!-- Pencil icon -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="opacity-0 transition-opacity group-hover:opacity-40"
			aria-hidden="true"
		>
			<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
			<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
		</svg>
	</button>
{/if}
