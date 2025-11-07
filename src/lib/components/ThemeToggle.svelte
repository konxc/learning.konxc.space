<script lang="ts">
	import { onMount } from 'svelte';
	let theme = $state<'light' | 'dark'>('light');

	function applyTheme(t: 'light' | 'dark') {
		const root = document.documentElement;
		if (t === 'dark') root.classList.add('dark');
		else root.classList.remove('dark');
	}

	function saveTheme(t: 'light' | 'dark') {
		try {
			localStorage.setItem('theme', t);
		} catch {}
	}

	function loadInitial() {
		try {
			const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
			if (saved) return saved;
		} catch {}
		const prefersDark = globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches;
		return prefersDark ? 'dark' : 'light';
	}

	onMount(() => {
		theme = loadInitial();
		applyTheme(theme);
	});

	function toggle() {
		theme = theme === 'dark' ? 'light' : 'dark';
		applyTheme(theme);
		saveTheme(theme);
	}
</script>

<button
	type="button"
	onclick={toggle}
	class="inline-flex items-center gap-2 rounded border px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
	aria-label="Toggle theme"
>
	{#if theme === 'dark'}
		<span>Light</span>
	{:else}
		<span>Dark</span>
	{/if}
</button>
