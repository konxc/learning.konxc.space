<script lang="ts">
	import { page } from '$app/stores';
	import { m } from '$lib/paraglide/messages.js';
	const { data } = $props<{
		data: { roles: string[]; activeRole: string | null };
	}>();
	const isAdmin = data.activeRole === 'admin';

	function isActive(href: string, path: string) {
		return path === href || (href !== '/dashboard' && path.startsWith(href));
	}
</script>

<aside class="hidden min-h-screen w-64 border-r bg-white md:block dark:bg-neutral-900">
	<nav class="space-y-1 p-3">
		{#if $page}
			{#key $page.url.pathname}
				{@const path = $page.url.pathname}
				<a
					href="/dashboard"
					aria-current={isActive('/dashboard', path)}
					class="block rounded px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 {isActive(
						'/dashboard',
						path
					)
						? 'bg-neutral-100 font-medium dark:bg-neutral-800'
						: ''}">{m.nav_dashboard()}</a
				>
				<a
					href="/courses"
					aria-current={isActive('/courses', path)}
					class="block rounded px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 {isActive(
						'/courses',
						path
					)
						? 'bg-neutral-100 font-medium dark:bg-neutral-800'
						: ''}">{m.nav_courses()}</a
				>
				<a
					href="/assignments"
					aria-current={isActive('/assignments', path)}
					class="block rounded px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 {isActive(
						'/assignments',
						path
					)
						? 'bg-neutral-100 font-medium dark:bg-neutral-800'
						: ''}">{m.nav_assignments()}</a
				>
				<a
					href="/discussions"
					aria-current={isActive('/discussions', path)}
					class="block rounded px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 {isActive(
						'/discussions',
						path
					)
						? 'bg-neutral-100 font-medium dark:bg-neutral-800'
						: ''}">{m.nav_discussions()}</a
				>
				<a
					href="/certificates"
					aria-current={isActive('/certificates', path)}
					class="block rounded px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 {isActive(
						'/certificates',
						path
					)
						? 'bg-neutral-100 font-medium dark:bg-neutral-800'
						: ''}">{m.nav_certificates()}</a
				>
				{#if isAdmin}
					<div class="px-3 pt-2 text-xs tracking-wider text-neutral-500 uppercase">
						{m.nav_admin()}
					</div>
					<a
						href="/admin/users"
						aria-current={isActive('/admin/users', path)}
						class="block rounded px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 {isActive(
							'/admin/users',
							path
						)
							? 'bg-neutral-100 font-medium dark:bg-neutral-800'
							: ''}">{m.users()}</a
					>
					<a
						href="/admin/settings"
						aria-current={isActive('/admin/settings', path)}
						class="block rounded px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 {isActive(
							'/admin/settings',
							path
						)
							? 'bg-neutral-100 font-medium dark:bg-neutral-800'
							: ''}">{m.settings()}</a
					>
				{/if}
			{/key}
		{/if}
	</nav>
</aside>
