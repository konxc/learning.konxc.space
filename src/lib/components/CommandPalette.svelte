<script lang="ts">
	import { onMount } from 'svelte';
	import { COLOR, RADIUS, SPACING, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';

	interface CommandPaletteItem {
		label: string;
		href: string;
	}

	interface CommandPaletteProps {
		items: CommandPaletteItem[];
	}

	let { items }: CommandPaletteProps = $props();
	let open = $state(false);
	let query = $state('');
	let inputEl = $state<HTMLInputElement | null>(null);
	const filtered = $derived(
		items.filter((i: { label: string; href: string }) =>
			i.label.toLowerCase().includes(query.toLowerCase())
		)
	);

	function onKey(e: KeyboardEvent) {
		const isMac = navigator.platform.toUpperCase().includes('MAC');
		if (
			(isMac && e.metaKey && e.key.toLowerCase() === 'k') ||
			(!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')
		) {
			e.preventDefault();
			open = !open;
		}
		if (open && e.key === 'Escape') open = false;
	}

	$effect(() => {
		if (open && inputEl) {
			// Focus input when palette opens
			setTimeout(() => inputEl?.focus(), 0);
		}
	});

	onMount(() => {
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

{#if open}
	<div
		class="fixed inset-0 z-60 bg-black/40"
		role="button"
		tabindex="-1"
		onclick={() => (open = false)}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				open = false;
			}
		}}
		aria-label="Close command palette"
	>
		<div
			class={`mx-auto mt-24 w-full max-w-xl ${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} p-2 ${ELEVATION.card}`}
			role="dialog"
			aria-modal="true"
			aria-label="Command palette"
			tabindex="0"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => {
				if (e.key === 'Escape') open = false;
			}}
		>
			<input
				class={`w-full ${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} ${COLOR.textPrimary} outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
				placeholder="Type to search... (Esc to close)"
				bind:value={query}
				bind:this={inputEl}
			/>
			<div class="max-h-64 overflow-auto">
				{#each filtered as i}
					<a
						href={i.href}
						class={`block ${RADIUS.small} px-3 py-2 ${TEXT.body} ${COLOR.textPrimary} ${TRANSITION.colors} hover:bg-gray-100 dark:hover:bg-neutral-800`}
						onclick={() => (open = false)}>{i.label}</a
					>
				{/each}
				{#if filtered.length === 0}
					<div class={`px-3 py-2 ${TEXT.body} ${COLOR.textSecondary}`}>No results</div>
				{/if}
			</div>
			<div class={`px-3 pt-1 text-[11px] ${COLOR.textMuted}`}>Press Ctrl/Cmd+K to toggle</div>
		</div>
	</div>
{/if}
