<script lang="ts">
	import { page } from '$app/stores';
	import { TEXT, TRANSITION } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	export interface Tab {
		label: string;
		value: string;
		icon?: string;
	}

	type Variant = 'clean' | 'action';

	let { 
		tabs, 
		action, 
		queryParam = 'tab', 
		basePath = '',
		variant = 'clean',
		subtitle
	}: { 
		tabs: Tab[]; 
		action?: Snippet; 
		queryParam?: string;
		basePath?: string;
		variant?: Variant;
		subtitle?: string;
	} = $props();

	const currentTab = $derived($page.url.searchParams.get(queryParam) || getDefaultTab());

	function isActive(value: string): boolean {
		return currentTab === value;
	}

	function buildHref(value: string): string {
		const url = new URL($page.url);
		url.searchParams.set(queryParam, value);
		return url.pathname + url.search;
	}

	function getDefaultTab(): string {
		return tabs[0]?.value ?? '';
	}
</script>

<div class="mb-4 flex flex-col gap-6">
	{#if subtitle}
		<p class="text-[15px] font-medium text-neutral-500 dark:text-neutral-400">
			{subtitle}
		</p>
	{/if}

	<div class="flex items-end justify-between border-b border-gray-200/80 dark:border-neutral-800/80">
		<nav class="-mb-px flex flex-1 gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide" aria-label="Tabs">
			{#each tabs as tab}
				{@const active = isActive(tab.value)}
				{#if variant === 'action'}
					<a
						href={buildHref(tab.value)}
						class={`relative py-5 whitespace-nowrap ${TEXT.small} font-black tracking-[0.15em] ${TRANSITION.colors} flex flex-row items-center gap-2 ${
							active
								? 'text-neutral-900 dark:text-white'
								: 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
						}`}
						aria-current={active ? 'page' : undefined}
					>
						{#if tab.icon}
							<span class="text-lg">{tab.icon}</span>
						{/if}
						{tab.label.replace('_', ' ').toUpperCase()}
						{#if active}
							<div class="absolute right-0 -bottom-px left-0 h-0.5 bg-neutral-900 dark:bg-white"></div>
						{/if}
					</a>
				{:else}
					<a
						href={buildHref(tab.value)}
						class={`relative py-4 whitespace-nowrap ${TEXT.small} font-bold tracking-widest ${TRANSITION.colors} ${
							active
								? 'text-neutral-900 dark:text-white'
								: 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
						}`}
						aria-current={active ? 'page' : undefined}
					>
						{tab.label}
						{#if active}
							<div class="absolute right-0 -bottom-px left-0 h-0.5 bg-neutral-900 dark:bg-white"></div>
						{/if}
					</a>
				{/if}
			{/each}
		</nav>
		
		{#if action}
			<div class="ml-4 flex shrink-0 pb-[11px]">
				{@render action()}
			</div>
		{/if}
	</div>
</div>
