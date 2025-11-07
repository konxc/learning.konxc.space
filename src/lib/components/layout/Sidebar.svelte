<script lang="ts" context="module">
	export interface NavItem {
		label: string;
		href: string;
	}
</script>

<script lang="ts">
	import { page } from '$app/stores';
	let { items = [] }: { items: NavItem[] } = $props();
</script>

<aside class="hidden min-h-[calc(100vh-56px)] w-72 border-r bg-white md:block">
	<nav class="space-y-1 p-3 text-sm leading-tight" aria-label="Sidebar">
		{#each items as item}
			<a
				href={item.href}
				class="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 {$page
					.url.pathname === item.href || $page.url.pathname.startsWith(item.href + '/')
					? 'bg-gray-100 font-medium text-gray-900'
					: ''}"
				aria-current={$page.url.pathname === item.href ||
				$page.url.pathname.startsWith(item.href + '/')
					? 'page'
					: undefined}
			>
				{item.label}
			</a>
		{/each}
	</nav>
</aside>
