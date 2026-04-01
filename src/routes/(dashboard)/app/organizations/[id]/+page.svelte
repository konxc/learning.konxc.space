<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	const isOwner = $derived(data.membership.role === 'owner');
	const isAdmin = $derived(['owner', 'admin'].includes(data.membership.role));

	const planColors: Record<string, string> = {
		free: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
		pro: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
		enterprise: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
	};

	const roleColors: Record<string, string> = {
		owner: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
		admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
		creator: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
		facilitator: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
		member: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
	};

	function formatDate(date: Date | null) {
		if (!date) return '-';
		return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(date));
	}
</script>

<svelte:head>
	<title>{data.organization.name} - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<!-- Header -->
	<div class="mb-6 flex items-start justify-between">
		<div class="flex items-center gap-4">
			{#if data.organization.logoUrl}
				<img
					src={data.organization.logoUrl}
					alt={data.organization.name}
					class="h-16 w-16 rounded-xl"
				/>
			{:else}
				<div
					class="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white"
				>
					{data.organization.name.charAt(0).toUpperCase()}
				</div>
			{/if}
			<div>
				<h1 class={`${TEXT.h1} ${COLOR.textPrimary}`}>{data.organization.name}</h1>
				<div class="mt-1 flex items-center gap-2">
					<span
						class={`rounded-full px-3 py-1 ${TEXT.small} font-semibold capitalize ${planColors[data.organization.planType]}`}
					>
						{data.organization.planType}
					</span>
					<span
						class={`rounded-full px-3 py-1 ${TEXT.small} font-semibold capitalize ${roleColors[data.membership.role]}`}
					>
						{data.membership.role}
					</span>
				</div>
			</div>
		</div>

		{#if isAdmin}
			<div class="flex gap-2">
				<a
					href="/app/organizations/{data.organization.id}/members"
					class={`${RADIUS.button} border ${COLOR.cardBorder} px-4 py-2 ${TEXT.button}`}
				>
					Members
				</a>
				{#if isOwner}
					<a
						href="/app/organizations/{data.organization.id}/billing"
						class={`${RADIUS.button} ${COLOR.accentBg} px-4 py-2 ${TEXT.button} text-white`}
					>
						Billing
					</a>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Stats -->
	<div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<a
			href="/app/organizations/{data.organization.id}/members"
			class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4 ${TRANSITION.all} hover:-translate-y-1 ${ELEVATION.cardHover}`}
		>
			<p class={`${TEXT.small} ${COLOR.textMuted}`}>Members</p>
			<p class={`${TEXT.h2} ${COLOR.textPrimary}`}>{data.stats.memberCount}</p>
		</a>
		<a
			href="/app/explore"
			class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4 ${TRANSITION.all} hover:-translate-y-1 ${ELEVATION.cardHover}`}
		>
			<p class={`${TEXT.small} ${COLOR.textMuted}`}>Courses</p>
			<p class={`${TEXT.h2} ${COLOR.accent}`}>{data.stats.courseCount}</p>
		</a>
		<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4`}>
			<p class={`${TEXT.small} ${COLOR.textMuted}`}>Plan</p>
			<p class={`${TEXT.h3} capitalize ${COLOR.textPrimary}`}>{data.organization.planType}</p>
		</div>
		<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4`}>
			<p class={`${TEXT.small} ${COLOR.textMuted}`}>Created</p>
			<p class={`${TEXT.body} ${COLOR.textPrimary}`}>{formatDate(data.organization.createdAt)}</p>
		</div>
	</div>

	<!-- Quick Actions -->
	<PageSection>
		<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-4`}>Quick Actions</h2>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<a
				href="/app/explore"
				class={`flex flex-col items-center p-6 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${TRANSITION.all} hover:-translate-y-1 ${ELEVATION.cardHover}`}
			>
				<span class="mb-2 text-3xl">📚</span>
				<span class={`${TEXT.body} font-semibold ${COLOR.textPrimary}`}>Browse Courses</span>
			</a>
			{#if isAdmin}
				<a
					href="/app/organizations/{data.organization.id}/members"
					class={`flex flex-col items-center p-6 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${TRANSITION.all} hover:-translate-y-1 ${ELEVATION.cardHover}`}
				>
					<span class="mb-2 text-3xl">👥</span>
					<span class={`${TEXT.body} font-semibold ${COLOR.textPrimary}`}>Manage Members</span>
				</a>
				<a
					href="/app/jobs/new"
					class={`flex flex-col items-center p-6 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${TRANSITION.all} hover:-translate-y-1 ${ELEVATION.cardHover}`}
				>
					<span class="mb-2 text-3xl">💼</span>
					<span class={`${TEXT.body} font-semibold ${COLOR.textPrimary}`}>Post a Job</span>
				</a>
			{/if}
			<a
				href="/app/settings"
				class={`flex flex-col items-center p-6 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${TRANSITION.all} hover:-translate-y-1 ${ELEVATION.cardHover}`}
			>
				<span class="mb-2 text-3xl">⚙️</span>
				<span class={`${TEXT.body} font-semibold ${COLOR.textPrimary}`}>Settings</span>
			</a>
		</div>
	</PageSection>

	<!-- Recent Members -->
	<PageSection>
		<div class="mb-4 flex items-center justify-between">
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary}`}>Recent Members</h2>
			<a
				href="/app/organizations/{data.organization.id}/members"
				class={`${COLOR.accent} ${TEXT.body}`}
			>
				View All →
			</a>
		</div>

		{#if data.recentMembers.length === 0}
			<p class={`${TEXT.body} ${COLOR.textMuted} py-4 text-center`}>No members yet</p>
		{:else}
			<div class="space-y-3">
				{#each data.recentMembers as member}
					<div class="flex items-center justify-between rounded-lg border p-3 {COLOR.cardBorder}">
						<div class="flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-300"
							>
								{member.user.fullName?.charAt(0) || member.user.username.charAt(0).toUpperCase()}
							</div>
							<div>
								<p class={`${TEXT.body} font-semibold ${COLOR.textPrimary}`}>
									{member.user.fullName || member.user.username}
								</p>
								<p class={`${TEXT.small} ${COLOR.textMuted}`}>
									Joined {formatDate(member.createdAt)}
								</p>
							</div>
						</div>
						<span
							class={`rounded-full px-3 py-1 ${TEXT.small} font-semibold capitalize ${roleColors[member.role]}`}
						>
							{member.role}
						</span>
					</div>
				{/each}
			</div>
		{/if}
	</PageSection>
</PageWrapper>
