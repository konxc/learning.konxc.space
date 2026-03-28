<script lang="ts">
	import { page } from '$app/stores';
	import { TEXT, COLOR, TRANSITION, RADIUS, SPACING } from '$lib/config/design';
	import { m } from '$lib/paraglide/messages.js';

	const labelMapping: Record<string, string> = {
		app: 'Home',
		overview: 'Overview',
		courses: 'Browse',
		'my-courses': 'My Courses',
		learn: 'Learn',
		admin: 'Admin',
		mentor: 'Mentor'
	};

	function segments(pathname: string) {
		const parts = pathname.split('/').filter(Boolean);
		const items: { name: string; href: string }[] = [];
		let acc = '';
		for (const part of parts) {
			acc += '/' + part;
			const name = labelMapping[part.toLowerCase()] || (part.charAt(0).toUpperCase() + part.slice(1));
			items.push({ name, href: acc });
		}
		return items;
	}
</script>

<nav aria-label="Breadcrumb navigation" class="flex px-0 dark:border-neutral-800/50">
	<ol
		class="m-0 flex list-none flex-wrap items-baseline justify-start gap-1 p-0"
		itemscope
		itemtype="https://schema.org/BreadcrumbList"
	>
		{#each segments($page.url.pathname) as s, i}
			{#if i > 0}
				<li class="flex shrink-0 items-center" aria-hidden="true">
					<svg
						class={`h-3 w-3 ${COLOR.textMuted}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</li>
			{/if}
			<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
				{#if i === segments($page.url.pathname).length - 1}
					<span class={`truncate ${TEXT.small} ${COLOR.textPrimary} font-medium`} aria-current="page">
						{s.name}
					</span>
				{:else}
					<a
						href={s.href}
						itemprop="item"
						class={`inline-flex items-center no-underline ${TEXT.small} ${COLOR.textSecondary} ${TRANSITION.colors} hover:text-gray-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1 dark:hover:text-gray-100 ${RADIUS.small}`}
					>
						<span itemprop="name">{s.name}</span>
					</a>
				{/if}
				<meta itemprop="position" content={String(i + 1)} />
			</li>
		{/each}
	</ol>
</nav>
