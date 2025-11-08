<script lang="ts">
	import type { Writable } from 'svelte/store';
	import ThemeToggle from './ThemeToggle.svelte';
	import LocaleSwitcher from './LocaleSwitcher.svelte';
	import { m } from '$lib/paraglide/messages.js';

	interface HeaderProps {
		data: { user: any; roles: string[]; activeRole: string | null };
		isAdmin?: boolean;
	}

	let { data, isAdmin = false }: HeaderProps = $props();
	import AuroraOverlay from '$lib/components/decor/AuroraOverlay.svelte';
	import GlowOrbs from '$lib/components/decor/GlowOrbs.svelte';
	import { brandMode } from '$lib/stores/brandMode';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toast';
</script>

<header
	class="sticky top-0 z-40 overflow-hidden border-b bg-white/70 backdrop-blur dark:bg-neutral-900/70"
	style="
		--header-glow: {$brandMode === 'hardcore' ? 'rgba(251, 146, 60, 0.05)' : 'rgba(20, 184, 166, 0.05)'};
	"
>
	<div class="flex h-14 items-center gap-2 px-4 md:px-6">
		<div class="font-semibold tracking-tight">Naik Kelas</div>
		<div class="ml-auto flex items-center gap-2">
			<LocaleSwitcher />
			<ThemeToggle />
			{#if isAdmin}
				<div class="relative">
					<details class="group">
						<summary
							class="inline-flex cursor-pointer list-none items-center gap-2 rounded border px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
							>{m.switch_role()}</summary
						>
						<div
							class="absolute right-0 mt-1 min-w-40 rounded border bg-white p-1 shadow dark:bg-neutral-900"
						>
							<a
								href="/switch-role?role=admin"
								class="block rounded px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
								>Admin</a
							>
							<a
								href="/switch-role?role=mentor"
								class="block rounded px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
								>Mentor</a
							>
							<a
								href="/switch-role?role=siswa"
								class="block rounded px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
								>Siswa</a
							>
						</div>
					</details>
				</div>
			{/if}
			<a
				href="/settings"
				class="inline-flex items-center gap-2 rounded border px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
				>{m.settings()}</a
			>
			<div class="relative">
				<details class="group">
					<summary
						class="inline-flex cursor-pointer list-none items-center gap-2 rounded border px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
					>
						{data.user?.fullName ?? data.user?.username ?? m.profile()}
					</summary>
					<div
						class="absolute right-0 mt-1 min-w-40 rounded border bg-white p-1 shadow dark:bg-neutral-900"
					>
						<a
							href="/profile"
							class="block rounded px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
							>{m.profile()}</a
						>
						<form
							method="POST"
							action="/auth/signout"
							use:enhance={() => {
								return async ({ update }) => {
									toast.info('Sedang keluar...');
									await update();
								};
							}}
						>
							<button
								type="submit"
								class="w-full rounded px-3 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
								>{m.logout()}</button
							>
						</form>
					</div>
				</details>
			</div>
		</div>
	</div>

	<!-- Decorative overlays (subtle) -->
	<AuroraOverlay
		intensity={0.03}
		blurPx={36}
		speedSec={28}
		insetPercent={12}
		zIndex={0}
		mode={$brandMode}
	/>
	<GlowOrbs
		zIndex={0}
		orbs={[
			$brandMode === 'hardcore'
				? { size: 120, x: '-40px', y: '70%', color: 'rgba(251, 146, 60, 0.18)', hideOnMobile: true }
				: {
						size: 120,
						x: '-40px',
						y: '70%',
						color: 'rgba(20, 184, 166, 0.18)',
						hideOnMobile: true
					},
			$brandMode === 'hardcore'
				? {
						size: 100,
						x: 'calc(100% - 30px)',
						y: '-30px',
						color: 'rgba(59, 130, 246, 0.16)',
						delaySec: 2,
						hideOnMobile: true
					}
				: {
						size: 100,
						x: 'calc(100% - 30px)',
						y: '-30px',
						color: 'rgba(45, 212, 191, 0.16)',
						delaySec: 2,
						hideOnMobile: true
					}
		]}
	/>
</header>
