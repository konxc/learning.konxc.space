<script lang="ts">
	import { page } from '$app/stores';
	import { TEXT, COLOR, TRANSITION, RADIUS } from '$lib/config/design';
	import { m } from '$lib/paraglide/messages.js';

	function segments(pathname: string) {
		const parts = pathname.split('/').filter(Boolean);
		const items: { name: string; href: string }[] = [];
		let acc = '';
		for (const part of parts) {
			acc += '/' + part;
			items.push({ name: part.charAt(0).toUpperCase() + part.slice(1), href: acc });
		}
		return items;
	}
</script>

<nav
	aria-label="Breadcrumb navigation"
	class="flex border-b border-gray-200/50 px-3 py-1 md:px-4 dark:border-neutral-800/50"
>
	<ol
		class="m-0 flex list-none flex-wrap items-baseline justify-center gap-1 p-0"
		itemscope
		itemtype="https://schema.org/BreadcrumbList"
	>
		<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
			<a
				href="/dashboard"
				itemprop="item"
				class={`inline-flex items-center no-underline ${TEXT.small} ${COLOR.textSecondary} ${TRANSITION.colors} hover:text-gray-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1 dark:hover:text-gray-100 ${RADIUS.small}`}
			>
				<span itemprop="name">{m.home()}</span>
			</a>
			<meta itemprop="position" content="1" />
		</li>
		{#if segments($page.url.pathname).length > 1}
			<li class="flex shrink-0 items-center" aria-hidden="true">
				<svg
					class="h-3 w-3 ${COLOR.textMuted}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</li>
			{#each segments($page.url.pathname).slice(1, -1) as s, i}
				<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
					<a
						href={s.href}
						itemprop="item"
						class={`inline-flex items-center no-underline ${TEXT.small} ${COLOR.textSecondary} ${TRANSITION.colors} hover:text-gray-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1 dark:hover:text-gray-100 ${RADIUS.small}`}
					>
						<span itemprop="name">{s.name}</span>
					</a>
					<meta itemprop="position" content={String(i + 2)} />
				</li>
				<li class="flex shrink-0 items-center" aria-hidden="true">
					<svg
						class="h-3 w-3 ${COLOR.textMuted}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</li>
			{/each}
			{#if segments($page.url.pathname).length}
				<li class={`truncate ${TEXT.small} ${COLOR.textPrimary} font-medium`} aria-current="page">
					{segments($page.url.pathname).at(-1)?.name}
				</li>
			{/if}
		{/if}
	</ol>
</nav>
