<script lang="ts">
	import { page } from '$app/stores';
	import { m } from '$lib/paraglide/messages.js';

	interface BreadcrumbItem {
		label: string;
		href: string;
	}

	interface BreadcrumbProps {
		breadcrumbs?: BreadcrumbItem[];
		includeHome?: boolean;
		homeHref?: string;
		homeLabel?: string;
	}

	function buildSegments(pathname: string | undefined): BreadcrumbItem[] {
		if (!pathname) return [];

		const parts = pathname.split('/').filter(Boolean);
		const items: BreadcrumbItem[] = [];
		let acc = '';

		for (const part of parts) {
			acc += `/${part}`;
			items.push({
				label: part.charAt(0).toUpperCase() + part.slice(1),
				href: acc
			});
		}

		return items;
	}

	let { breadcrumbs, includeHome, homeHref = '/', homeLabel }: BreadcrumbProps = $props();

	const resolvedHomeLabel = $derived<string>(homeLabel ?? m.home());
	const computedSegments = $derived<BreadcrumbItem[]>(
		breadcrumbs ?? buildSegments($page?.url.pathname)
	);
	const renderHomeLink = $derived<boolean>(includeHome ?? !breadcrumbs?.length);
	const lastSegment = $derived<BreadcrumbItem | undefined>(computedSegments.at(-1));
</script>

<nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm text-neutral-500">
	{#if renderHomeLink}
		<a href={homeHref} class="hover:underline">{resolvedHomeLabel}</a>
		{#if computedSegments.length}
			<span>/</span>
		{/if}
	{/if}

	{#if computedSegments.length}
		{#each computedSegments.slice(0, -1) as segment}
			<a href={segment.href} class="hover:underline">{segment.label}</a>
			<span>/</span>
		{/each}
		{#if lastSegment}
			<span class="text-neutral-800 dark:text-neutral-200">{lastSegment.label}</span>
		{/if}
	{:else if !renderHomeLink}
		<span class="text-neutral-800 dark:text-neutral-200">{resolvedHomeLabel}</span>
	{/if}
</nav>
