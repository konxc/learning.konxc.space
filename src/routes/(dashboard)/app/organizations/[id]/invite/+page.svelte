<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const roleOptions = [
		{ value: 'member', label: 'Member', description: 'Can view organization and courses' },
		{ value: 'facilitator', label: 'Facilitator', description: 'Can manage cohorts and students' },
		{ value: 'creator', label: 'Creator', description: 'Can create and manage courses' },
		{ value: 'admin', label: 'Admin', description: 'Can manage members and settings' }
	];

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(date));
	}

	function isExpired(date: Date) {
		return new Date(date) < new Date();
	}
</script>

<svelte:head>
	<title>Invite Members - {data.organization.name} - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Invite Members"
		description="Send invitations to join {data.organization.name}"
	/>

	{#if form?.success}
		<div
			class="mb-4 rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-900 dark:text-green-200"
		>
			{form.message}
		</div>
	{/if}

	{#if form?.error}
		<div class="mb-4 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900 dark:text-red-200">
			{form.error}
		</div>
	{/if}

	<!-- Send Invitation Form -->
	<PageSection>
		<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>Send New Invitation</h2>

		<form method="post" action="?/sendInvite" use:enhance class="max-w-md space-y-4">
			<div>
				<label for="email" class={`block ${TEXT.body} font-semibold ${COLOR.textPrimary} mb-1`}>
					Email Address
				</label>
				<input
					type="email"
					id="email"
					name="email"
					required
					placeholder="user@example.com"
					class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} px-4 py-2 ${TEXT.body}`}
				/>
			</div>

			<div>
				<label for="role" class={`block ${TEXT.body} font-semibold ${COLOR.textPrimary} mb-1`}>
					Role
				</label>
				<select
					id="role"
					name="role"
					required
					class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} px-4 py-2 ${TEXT.body}`}
				>
					{#each roleOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
				<p class={`${TEXT.small} ${COLOR.textMuted} mt-1`}>
					{roleOptions.find((r) => r.value === 'member')?.description}
				</p>
			</div>

			<button
				type="submit"
				class={`${RADIUS.button} ${COLOR.accentBg} px-6 py-2 ${TEXT.button} text-white`}
			>
				Send Invitation
			</button>
		</form>
	</PageSection>

	<!-- Pending Invitations -->
	<PageSection>
		<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>
			Pending Invitations ({data.invitations.length})
		</h2>

		{#if data.invitations.length === 0}
			<p class={`${TEXT.body} ${COLOR.textMuted} py-4 text-center`}>No pending invitations</p>
		{:else}
			<div class="space-y-3">
				{#each data.invitations as invite}
					<div class="flex items-center justify-between rounded-lg border p-4 {COLOR.cardBorder}">
						<div>
							<p class={`${TEXT.body} font-semibold ${COLOR.textPrimary}`}>{invite.email}</p>
							<div class="mt-1 flex items-center gap-2">
								<span class={`${TEXT.small} ${COLOR.textMuted} capitalize`}>{invite.role}</span>
								<span
									class={`${TEXT.small} ${isExpired(invite.expiresAt) ? 'text-red-500' : COLOR.textMuted}`}
								>
									{isExpired(invite.expiresAt)
										? 'Expired'
										: `Expires ${formatDate(invite.expiresAt)}`}
								</span>
							</div>
							<p class={`${TEXT.small} ${COLOR.accent} mt-1 font-mono`}>
								Invite link: /org/invite/{invite.token}
							</p>
						</div>
						<form method="post" action="?/cancelInvite" use:enhance>
							<input type="hidden" name="invitationId" value={invite.id} />
							<button
								type="submit"
								class={`${RADIUS.button} bg-red-100 px-3 py-1 ${TEXT.small} text-red-600 hover:bg-red-200`}
							>
								Cancel
							</button>
						</form>
					</div>
				{/each}
			</div>
		{/if}
	</PageSection>
</PageWrapper>
