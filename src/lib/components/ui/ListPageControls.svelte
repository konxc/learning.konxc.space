<script lang="ts">
	import { RADIUS, TEXT, COLOR, TRANSITION } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';

	export interface ListPageControlsProps {
		filteredCount: number;
		totalCount: number;
		searchValue?: string;
		searchPlaceholder?: string;
		onSearchChange?: (value: string) => void;
		onSearchClear?: () => void;
		children?: import('svelte').Snippet;
		class?: string;
	}

	let {
		filteredCount,
		totalCount,
		searchValue = '',
		searchPlaceholder = 'Cari...',
		onSearchChange,
		onSearchClear,
		children,
		class: className = ''
	}: ListPageControlsProps = $props();

	function handleSearch(e: Event) {
		const target = e.target as HTMLInputElement;
		if (onSearchChange) {
			onSearchChange(target.value);
		}
	}

	function handleClear() {
		if (onSearchClear) {
			onSearchClear();
		}
	}
</script>

<div class={`flex flex-col gap-3 md:flex-row md:items-center md:justify-between ${className}`}>
	<!-- Results Summary -->
	<div class="min-w-0 flex-1">
		<p class="{TEXT.small} {COLOR.textMuted}">
			{#if filteredCount === totalCount}
				Menampilkan <span class="font-bold text-zinc-900 dark:text-zinc-100">{totalCount}</span> item
			{:else}
				Menampilkan <span class="font-bold text-zinc-900 dark:text-zinc-100">{filteredCount}</span>
				dari <span class="font-bold text-zinc-900 dark:text-zinc-100">{totalCount}</span> item
			{/if}
		</p>
	</div>

	<!-- Search and Actions -->
	<div class="flex shrink-0 items-center gap-3">
		{#if onSearchChange}
			<div class="relative">
				<Icon
					name="search"
					size={16}
					strokeWidth={2}
					class="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
				/>
				<input
					type="text"
					value={searchValue}
					placeholder={searchPlaceholder}
					oninput={handleSearch}
					class={`h-9 w-48 rounded-lg border ${RADIUS.input} border-zinc-200 bg-white pr-8 pl-9 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500`}
				/>
				{#if searchValue && onSearchClear}
					<button
						type="button"
						onclick={handleClear}
						class="absolute top-1/2 right-2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
					>
						<Icon name="x" size={14} strokeWidth={2} />
					</button>
				{/if}
			</div>
		{/if}

		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
