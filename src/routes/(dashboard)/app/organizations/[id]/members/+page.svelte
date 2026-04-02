<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TABLE, STATUS } from '$lib/config/design';
	import { ORG_ROLES } from '$lib/constants/roles';
	import { ROLE_ALIASES } from '$lib/constants/roles';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Client-side permission helpers (no server imports in .svelte)
	const canUpdateRole = $derived(['owner', 'admin'].includes(data.membership.role));
	const canDeleteMember = $derived(['owner', 'admin'].includes(data.membership.role));
	const canManageInvites = $derived(['owner', 'admin'].includes(data.membership.role));
	const isOwner = $derived(data.membership.role === 'owner');

	// Role badge classes
	const roleBadgeClass: Record<string, string> = {
		owner: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
		admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
		mentor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
		facilitator: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
		member: 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-gray-400'
	};

	function getRoleBadge(role: string): string {
		return roleBadgeClass[role] ?? roleBadgeClass.member;
	}

	function formatDate(date: Date | string) {
		return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(date));
	}
</script>

<svelte:head>
	<title>Members - {data.organization.name} - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="Anggota Organisasi" description="Kelola anggota {data.organization.name}" />

	{#if form?.message}
		<div
			class="mb-4 rounded-xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
		>
			{form.message}
		</div>
	{/if}

	{#if form?.error}
		<div
			class="mb-4 rounded-xl bg-rose-50 p-4 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
		>
			{form.error}
		</div>
	{/if}

	<!-- Members Table -->
	<PageSection>
		<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4`}>
			Anggota ({data.members.length})
		</h3>

		<div
			class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${ELEVATION.card} overflow-hidden`}
		>
			<table class="w-full">
				<thead>
					<tr class={`${TABLE.thead} border-b ${TABLE.theadBorder}`}>
						<th
							class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted} font-semibold tracking-wider uppercase`}
						>
							Anggota
						</th>
						<th
							class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted} font-semibold tracking-wider uppercase`}
						>
							Email
						</th>
						<th
							class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted} font-semibold tracking-wider uppercase`}
						>
							Role
						</th>
						<th
							class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted} font-semibold tracking-wider uppercase`}
						>
							Bergabung
						</th>
						<th
							class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted} font-semibold tracking-wider uppercase`}
						>
							Aksi
						</th>
					</tr>
				</thead>
				<tbody class={`divide-y ${TABLE.divider}`}>
					{#each data.members as member (member.id)}
						<tr class={TABLE.rowHover}>
							<!-- Avatar + Name -->
							<td class="px-4 py-3">
								<div class="flex items-center gap-3">
									{#if member.user.avatarUrl}
										<img
											src={member.user.avatarUrl}
											alt={member.user.fullName ?? member.user.username}
											class="h-9 w-9 rounded-full object-cover"
										/>
									{:else}
										<div
											class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
										>
											{(member.user.fullName ?? member.user.username)[0].toUpperCase()}
										</div>
									{/if}
									<span class={`${TEXT.body} font-medium ${COLOR.textPrimary}`}>
										{member.user.fullName ?? member.user.username}
									</span>
								</div>
							</td>

							<!-- Email -->
							<td class="px-4 py-3">
								<span class={`${TEXT.body} ${COLOR.textSecondary}`}>
									{member.user.email ?? '—'}
								</span>
							</td>

							<!-- Role -->
							<td class="px-4 py-3">
								{#if canUpdateRole && member.role !== 'owner' && member.user.id !== data.membership.userId}
									<form method="POST" action="?/changeRole" use:enhance>
										<input type="hidden" name="userId" value={member.user.id} />
										<select
											name="role"
											class={`${RADIUS.input} border ${COLOR.cardBorder} bg-white px-2 py-1 text-sm ${COLOR.textPrimary} focus:ring-2 focus:ring-blue-500/30 focus:outline-none dark:bg-zinc-800`}
											onchange={(e) => e.currentTarget.form?.requestSubmit()}
										>
											{#each ORG_ROLES.filter((r) => r !== 'owner') as role}
												<option value={role} selected={role === member.role}>
													{ROLE_ALIASES[role] ?? role}
												</option>
											{/each}
										</select>
									</form>
								{:else}
									<span
										class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getRoleBadge(member.role)}`}
									>
										{ROLE_ALIASES[member.role] ?? member.role}
									</span>
								{/if}
							</td>

							<!-- Joined -->
							<td class="px-4 py-3">
								<span class={`${TEXT.small} ${COLOR.textMuted}`}>
									{formatDate(member.createdAt)}
								</span>
							</td>

							<!-- Actions -->
							<td class="px-4 py-3">
								{#if canDeleteMember && member.role !== 'owner' && member.user.id !== data.membership.userId}
									<form method="POST" action="?/removeMember" use:enhance>
										<input type="hidden" name="memberId" value={member.id} />
										<button
											type="submit"
											class={`${RADIUS.button} bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50`}
											onclick={(e) => {
												if (
													!confirm(
														`Hapus ${member.user.fullName ?? member.user.username} dari organisasi?`
													)
												) {
													e.preventDefault();
												}
											}}
										>
											Hapus
										</button>
									</form>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</PageSection>

	<!-- Pending Invitations -->
	{#if data.pendingInvitations.length > 0}
		<PageSection>
			<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4`}>
				Undangan Tertunda ({data.pendingInvitations.length})
			</h3>

			<div
				class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${ELEVATION.card} overflow-hidden`}
			>
				<table class="w-full">
					<thead>
						<tr class={`${TABLE.thead} border-b ${TABLE.theadBorder}`}>
							<th
								class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted} font-semibold tracking-wider uppercase`}
							>
								Email
							</th>
							<th
								class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted} font-semibold tracking-wider uppercase`}
							>
								Role
							</th>
							<th
								class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted} font-semibold tracking-wider uppercase`}
							>
								Kedaluwarsa
							</th>
							{#if canManageInvites}
								<th
									class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted} font-semibold tracking-wider uppercase`}
								>
									Aksi
								</th>
							{/if}
						</tr>
					</thead>
					<tbody class={`divide-y ${TABLE.divider}`}>
						{#each data.pendingInvitations as invitation (invitation.id)}
							<tr class={TABLE.rowHover}>
								<td class="px-4 py-3">
									<span class={`${TEXT.body} ${COLOR.textPrimary}`}>{invitation.email}</span>
								</td>
								<td class="px-4 py-3">
									<span
										class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getRoleBadge(invitation.role)}`}
									>
										{ROLE_ALIASES[invitation.role] ?? invitation.role}
									</span>
								</td>
								<td class="px-4 py-3">
									<span class={`${TEXT.small} ${COLOR.textMuted}`}>
										{formatDate(invitation.expiresAt)}
									</span>
								</td>
								{#if canManageInvites}
									<td class="px-4 py-3">
										<form method="POST" action="?/cancelInvite" use:enhance>
											<input type="hidden" name="invitationId" value={invitation.id} />
											<button
												type="submit"
												class={`${RADIUS.button} bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700`}
												onclick={(e) => {
													if (!confirm(`Batalkan undangan untuk ${invitation.email}?`)) {
														e.preventDefault();
													}
												}}
											>
												Batalkan
											</button>
										</form>
									</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</PageSection>
	{/if}

	<!-- Leave Organization (non-owners) -->
	{#if !isOwner}
		<PageSection>
			<div class="flex items-center justify-between">
				<div>
					<h3 class={`${TEXT.h4} ${COLOR.textPrimary}`}>Keluar Organisasi</h3>
					<p class={`mt-1 ${TEXT.body} ${COLOR.textMuted}`}>
						Anda akan kehilangan akses ke semua sumber daya organisasi.
					</p>
				</div>
				<form method="POST" action="?/leave" use:enhance>
					<button
						type="submit"
						class={`${RADIUS.button} bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700`}
						onclick={(e) => {
							if (!confirm('Yakin ingin keluar dari organisasi ini?')) {
								e.preventDefault();
							}
						}}
					>
						Keluar Organisasi
					</button>
				</form>
			</div>
		</PageSection>
	{/if}
</PageWrapper>
