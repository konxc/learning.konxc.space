<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';

	let { data }: { data: PageData } = $props();

	const planColors: Record<string, string> = {
		free: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
		pro: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
		enterprise: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
	};

	const roleColors: Record<string, string> = {
		owner: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
		admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
		creator: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
		facilitator: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
		member: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
	};
</script>

<svelte:head>
	<title>Organisasi - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="Organisasi" description="Kelola organisasi dan workspace Anda" />

	<!-- Pending Invitations -->
	{#if data.pendingInvitations.length > 0}
		<div class="mb-8">
			<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>
				Undangan Menunggu ({data.pendingInvitations.length})
			</h2>
			<div class="space-y-3">
				{#each data.pendingInvitations as invite}
					<div
						class={`flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20`}
					>
						<div class="flex items-center gap-4">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-lg dark:bg-blue-900/50"
							>
								{#if invite.organization.logoUrl}
									<img src={invite.organization.logoUrl} alt="" class="h-full w-full rounded-xl" />
								{:else}
									<Icon name="building" size={20} />
								{/if}
							</div>
							<div>
								<p class="font-bold text-blue-900 dark:text-blue-100">
									{invite.organization.name}
								</p>
								<p class="text-xs text-blue-600 dark:text-blue-400">
									Diundang sebagai <span class="font-semibold capitalize">{invite.role}</span>
								</p>
							</div>
						</div>
						<div class="flex gap-2">
							<a
								href="/app/organizations/invitations/{invite.id}/accept"
								class={`${RADIUS.button} bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700`}
							>
								Terima
							</a>
							<button
								class={`${RADIUS.button} border border-blue-200 px-4 py-2 text-xs font-bold text-blue-600 dark:border-blue-800`}
							>
								Tolak
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Organizations Grid -->
	{#if data.memberships.length === 0}
		<div
			class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 py-20 text-center dark:border-zinc-800 dark:bg-zinc-900/30"
		>
			<div
				class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-4xl dark:bg-zinc-800"
			>
				🏢
			</div>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>Belum Ada Organisasi</h3>
			<p class={`${TEXT.body} ${COLOR.textMuted} mb-6 max-w-sm`}>
				Anda belum menjadi anggota organisasi manapun. Buat organisasi baru atau tunggu undangan.
			</p>
			<a
				href="/app/organizations/new"
				class={`${RADIUS.button} ${COLOR.accentBg} px-6 py-3 text-xs font-bold tracking-widest text-white uppercase shadow-lg ${TRANSITION.all} hover:-translate-y-0.5`}
			>
				Buat Organisasi
			</a>
		</div>
	{:else}
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.memberships as membership}
				{@const org = membership.organization}
				<a
					href="/app/organizations/{org.id}"
					class={`group ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} overflow-hidden ${TRANSITION.all} hover:-translate-y-1 hover:shadow-xl ${ELEVATION.cardHover}`}
				>
					<!-- Color Bar -->
					<div class="h-2" style="background-color: {org.brandColor || '#4f46e5'}"></div>

					<div class="p-6">
						<!-- Header -->
						<div class="mb-4 flex items-start gap-4">
							<div
								class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold shadow-sm"
								style="background-color: {org.brandColor || '#4f46e5'}20; color: {org.brandColor ||
									'#4f46e5'}"
							>
								{#if org.logoUrl}
									<img src={org.logoUrl} alt="" class="h-full w-full rounded-2xl object-cover" />
								{:else}
									{org.name.charAt(0).toUpperCase()}
								{/if}
							</div>
							<div class="min-w-0 flex-1">
								<h3
									class={`text-lg leading-tight font-bold tracking-tight ${COLOR.textPrimary} transition-colors group-hover:text-blue-600`}
								>
									{org.name}
								</h3>
								<p class={`text-xs ${COLOR.textMuted}`}>
									@{org.slug}
								</p>
							</div>
						</div>

						<!-- Badges -->
						<div class="mb-4 flex flex-wrap gap-2">
							<span
								class={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase ${planColors[org.planType]}`}
							>
								{org.planType}
							</span>
							<span
								class={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase ${roleColors[membership.role]}`}
							>
								{membership.role}
							</span>
						</div>

						<!-- Stats -->
						<div class="flex items-center gap-4 text-xs">
							<div class="flex items-center gap-1.5">
								<Icon name="users" size={14} class={COLOR.textMuted} />
								<span class={COLOR.textSecondary}>
									{data.orgCounts[org.id] || 0} anggota
								</span>
							</div>
							<div class="flex items-center gap-1.5">
								<Icon name="book-open" size={14} class={COLOR.textMuted} />
								<span class={COLOR.textSecondary}>
									{data.courseCounts[org.id] || 0} kursus
								</span>
							</div>
						</div>
					</div>
				</a>
			{/each}

			<!-- Create New Card -->
			<a
				href="/app/organizations/new"
				class={`group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50 dark:border-zinc-700 dark:bg-zinc-900/30 dark:hover:border-blue-600 dark:hover:bg-blue-950/20`}
			>
				<div
					class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-2xl transition-all group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-zinc-800"
				>
					+
				</div>
				<p class={`text-sm font-bold ${COLOR.textPrimary}`}>Buat Organisasi Baru</p>
				<p class={`mt-1 text-xs ${COLOR.textMuted}`}>Buat workspace untuk tim Anda</p>
			</a>
		</div>
	{/if}
</PageWrapper>
