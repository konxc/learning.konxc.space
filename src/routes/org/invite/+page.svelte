<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { COLOR, TEXT, RADIUS, ELEVATION, SPACING, TRANSITION } from '$lib/config/design';
	import { ROLE_ALIASES } from '$lib/constants/roles';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Terima Undangan - Naik Kelas</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center px-4 py-12 {COLOR.bg}">
	<div
		class={`w-full max-w-md ${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${ELEVATION.card} p-8`}
	>
		{#if data.error === 'invalid_token'}
			<!-- Invalid token state -->
			<div class="text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/40"
				>
					<svg
						class="h-8 w-8 text-rose-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</div>
				<h1 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>Undangan Tidak Valid</h1>
				<p class={`${TEXT.body} ${COLOR.textSecondary}`}>
					Undangan tidak valid atau sudah digunakan.
				</p>
				<a
					href="/app"
					class={`mt-6 inline-block ${COLOR.accentBg} ${COLOR.accentHover} ${RADIUS.button} ${SPACING.button} ${TEXT.button} text-white ${TRANSITION.colors}`}
				>
					Kembali ke Dashboard
				</a>
			</div>
		{:else if data.error === 'expired'}
			<!-- Expired state -->
			<div class="text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/40"
				>
					<svg
						class="h-8 w-8 text-amber-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h1 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>Undangan Kedaluwarsa</h1>
				<p class={`${TEXT.body} ${COLOR.textSecondary}`}>
					Undangan sudah kedaluwarsa. Minta pengirim untuk mengirim undangan baru.
				</p>
				<a
					href="/app"
					class={`mt-6 inline-block ${COLOR.accentBg} ${COLOR.accentHover} ${RADIUS.button} ${SPACING.button} ${TEXT.button} text-white ${TRANSITION.colors}`}
				>
					Kembali ke Dashboard
				</a>
			</div>
		{:else if data.invitation && data.org}
			<!-- Valid invitation -->
			<div class="text-center">
				<!-- Org logo / initial -->
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl"
				>
					{#if data.org.logoUrl}
						<img src={data.org.logoUrl} alt={data.org.name} class="h-full w-full object-cover" />
					{:else}
						<div
							class="flex h-full w-full items-center justify-center text-2xl font-bold text-white"
							style="background-color: {data.org.brandColor ?? '#4f46e5'}"
						>
							{data.org.name[0].toUpperCase()}
						</div>
					{/if}
				</div>

				<h1 class={`${TEXT.h3} ${COLOR.textPrimary} mb-1`}>Anda Diundang!</h1>
				<p class={`${TEXT.body} ${COLOR.textSecondary} mb-6`}>
					Bergabunglah ke <span class="font-semibold {COLOR.textPrimary}">{data.org.name}</span>
					sebagai
					<span class="font-semibold {COLOR.textPrimary}"
						>{ROLE_ALIASES[data.invitation.role] ?? data.invitation.role}</span
					>.
				</p>

				{#if form?.error}
					<div
						class="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
					>
						{form.error}
					</div>
				{/if}

				<form method="POST" action="?/accept" use:enhance>
					<button
						type="submit"
						class={`w-full ${COLOR.accentBg} ${COLOR.accentHover} ${RADIUS.button} ${SPACING.button} ${TEXT.button} text-white ${TRANSITION.colors}`}
					>
						Terima Undangan
					</button>
				</form>

				<a
					href="/app"
					class={`mt-3 inline-block ${TEXT.body} ${COLOR.textMuted} hover:${COLOR.textSecondary} ${TRANSITION.colors}`}
				>
					Tolak
				</a>
			</div>
		{/if}
	</div>
</div>
