<script lang="ts">
	import { RADIUS, TEXT, COLOR, TRANSITION } from '$lib/config/design';

	export interface AccordionMenuItem {
		value: string;
		label: string;
		icon: string;
		activeClasses: string;
		inactiveClasses: string;
		href?: string;
		onClick?: (value: string, e: MouseEvent) => void;
	}

	let {
		title,
		icon: titleIcon,
		items,
		activeValue,
		accordionRef,
		onToggle,
		groupName = 'accordion'
	}: {
		title: string;
		icon?: string;
		items: AccordionMenuItem[];
		activeValue: string;
		accordionRef?: HTMLDetailsElement;
		onToggle?: (e: Event) => void;
		groupName?: string;
	} = $props();

	function handleItemClick(item: AccordionMenuItem, e: MouseEvent) {
		if (item.onClick) {
			e.preventDefault();
			e.stopPropagation();
			item.onClick(item.value, e);
		}
	}

	function handleDetailsToggle(e: Event) {
		// Pastikan event di-trigger setelah state ter-update
		if (onToggle) {
			// Gunakan setTimeout untuk memastikan state sudah ter-update
			setTimeout(() => {
				onToggle(e);
			}, 0);
		}
	}
</script>

<details bind:this={accordionRef} class="group/{groupName}" ontoggle={handleDetailsToggle}>
	<summary
		class={`flex w-full cursor-pointer list-none items-center justify-between ${RADIUS.small} px-3 py-2 ${TEXT.button} ${COLOR.textSecondary} ${TRANSITION.colors} hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 dark:hover:bg-neutral-800 dark:hover:text-gray-100`}
		onclick={(e) => e.stopPropagation()}
	>
		<span class="flex items-center gap-2">
			{#if titleIcon}
				<span aria-hidden="true">{titleIcon}</span>
			{/if}
			{title}
		</span>
		<svg
			class="h-4 w-4 transition-transform group-open/{groupName}:rotate-180"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</summary>
	<div class="mt-1 space-y-0.5 rounded-lg bg-gray-100/60 p-1.5 dark:bg-neutral-800/40">
		{#each items as item}
			{@const isActive = activeValue === item.value}
			{#if item.href}
				<a
					href={item.href}
					class={`block w-full cursor-pointer ${RADIUS.small} px-2.5 py-1.5 text-left text-xs font-medium ${TRANSITION.colors} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
						isActive ? item.activeClasses : item.inactiveClasses
					}`}
					aria-current={isActive ? 'page' : undefined}
				>
					<span class="mr-2" aria-hidden="true">{item.icon}</span>
					{item.label}
				</a>
			{:else}
				<button
					type="button"
					class={`w-full cursor-pointer ${RADIUS.small} px-2.5 py-1.5 text-left text-xs font-medium ${TRANSITION.colors} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
						isActive ? item.activeClasses : item.inactiveClasses
					}`}
					onclick={(e) => handleItemClick(item, e)}
					onmousedown={(e) => e.stopPropagation()}
					aria-pressed={isActive}
				>
					<span class="mr-2" aria-hidden="true">{item.icon}</span>
					{item.label}
				</button>
			{/if}
		{/each}
	</div>
</details>
