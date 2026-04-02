<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { RADIUS, TEXT, COLOR, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();
	const { invitation, organization } = data;
	const token = $derived($page.params.token);
</script>

<svelte:head>
	<title>Join {organization.name} — Naik Kelas</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-neutral-900">
	<div
		class={`w-full max-w-md ${COLOR.card} ${RADIUS.card} border ${COLOR.cardBorder} ${ELEVATION.card} p-8 text-center`}
	>
		{#if organization.logoUrl}
			<img
				src={organization.logoUrl}
				alt={organization.name}
				class="mx-auto mb-4 h-16 w-16 rounded-xl object-cover"
			/>
		{:else}
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold text-white"
				style="background-color: {organization.brandColor || '#4f46e5'}"
			>
				{organization.name[0].toUpperCase()}
			</div>
		{/if}

		<h1 class={`${TEXT.h1} mb-2`}>You're Invited!</h1>
		<p class={`${TEXT.body} ${COLOR.textMuted} mb-6`}>
			You've been invited to join <strong>{organization.name}</strong> as a
			<strong>{invitation.role}</strong>.
		</p>

		<div class="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Invitation sent to: <strong>{invitation.email}</strong>
			</p>
			<p class="mt-1 text-xs text-gray-500 dark:text-gray-500">
				Expires: {new Date(invitation.expiresAt).toLocaleDateString('id-ID', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</p>
		</div>

		<div class="space-y-3">
			<a
				href="/auth/signin?redirect=/org/invite/{token}"
				class={`block w-full px-6 py-3 ${RADIUS.button} bg-indigo-600 font-bold text-white transition-all hover:bg-indigo-700`}
			>
				Login to Accept
			</a>
			<a
				href="/auth/signup?redirect=/org/invite/{token}"
				class={`block w-full px-6 py-3 ${RADIUS.button} border border-gray-200 font-bold transition-all hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800`}
			>
				Create Account
			</a>
		</div>

		<p class="mt-6 text-xs text-gray-500">
			Not {invitation.email}? <a href="/" class="text-indigo-600 hover:underline">Go to homepage</a>
		</p>
	</div>
</div>
