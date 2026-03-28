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

<div class="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center p-4">
	<div class={`max-w-md w-full ${COLOR.card} ${RADIUS.card} border ${COLOR.cardBorder} ${ELEVATION.card} p-8 text-center`}>
		{#if organization.logoUrl}
			<img src={organization.logoUrl} alt={organization.name} class="h-16 w-16 mx-auto rounded-xl object-cover mb-4" />
		{:else}
			<div 
				class="h-16 w-16 mx-auto rounded-xl flex items-center justify-center text-2xl font-bold text-white mb-4"
				style="background-color: {organization.brandColor || '#4f46e5'}">
				{organization.name[0].toUpperCase()}
			</div>
		{/if}

		<h1 class={`${TEXT.h1} mb-2`}>You're Invited!</h1>
		<p class={`${TEXT.body} ${COLOR.textMuted} mb-6`}>
			You've been invited to join <strong>{organization.name}</strong> as a <strong>{invitation.role}</strong>.
		</p>

		<div class="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4 mb-6">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Invitation sent to: <strong>{invitation.email}</strong>
			</p>
			<p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
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
				href="/login?redirect=/org/invite/{token}"
				class={`block w-full px-6 py-3 ${RADIUS.button} bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all`}>
				Login to Accept
			</a>
			<a 
				href="/register?redirect=/org/invite/{token}"
				class={`block w-full px-6 py-3 ${RADIUS.button} border border-gray-200 dark:border-neutral-700 font-bold hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all`}>
				Create Account
			</a>
		</div>

		<p class="text-xs text-gray-500 mt-6">
			Not {invitation.email}? <a href="/" class="text-indigo-600 hover:underline">Go to homepage</a>
		</p>
	</div>
</div>
