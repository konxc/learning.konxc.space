<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import { toast } from '$lib/stores/toastStore';

	let { data }: { data: PageData } = $props();

	let approvingId = $state<string | null>(null);

	function formatRupiah(amount: number): string {
		return `Rp ${amount.toLocaleString('id-ID')}`;
	}
</script>

<svelte:head>
	<title>Payout Management - Admin</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="Payout Management" description="Kelola permintaan payout affiliate">
		<div class="flex gap-6 text-center">
			<div>
				<p class="text-xs font-bold tracking-widest text-zinc-400 uppercase">Pending</p>
				<p class="text-xl font-black text-amber-600">{formatRupiah(data.stats.totalPending)}</p>
			</div>
			<div>
				<p class="text-xs font-bold tracking-widest text-zinc-400 uppercase">Sudah Dibayar</p>
				<p class="text-xl font-black text-emerald-600">{formatRupiah(data.stats.totalPaid)}</p>
			</div>
			<div>
				<p class="text-xs font-bold tracking-widest text-zinc-400 uppercase">Total Akun</p>
				<p class="text-xl font-black text-blue-600">{data.stats.totalAccounts}</p>
			</div>
		</div>
	</PageHeader>

	<!-- Pending Payouts -->
	<PageSection
		title="Menunggu Persetujuan"
		description="Affiliate dengan saldo pending yang siap dicairkan"
	>
		{#if data.pendingAccounts.length === 0}
			<div class="py-12 text-center">
				<p class="text-sm text-zinc-400">Tidak ada permintaan payout yang menunggu.</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead>
						<tr class="border-b border-zinc-200 dark:border-zinc-700">
							<th class="pb-3 text-xs font-bold tracking-widest text-zinc-400 uppercase"
								>Affiliate</th
							>
							<th class="pb-3 text-xs font-bold tracking-widest text-zinc-400 uppercase">Email</th>
							<th class="pb-3 text-xs font-bold tracking-widest text-zinc-400 uppercase">Bank</th>
							<th class="pb-3 text-xs font-bold tracking-widest text-zinc-400 uppercase"
								>Rekening</th
							>
							<th class="pb-3 text-right text-xs font-bold tracking-widest text-zinc-400 uppercase"
								>Pending</th
							>
							<th class="pb-3 text-right text-xs font-bold tracking-widest text-zinc-400 uppercase"
								>Action</th
							>
						</tr>
					</thead>
					<tbody>
						{#each data.pendingAccounts as item}
							<tr class="border-b border-zinc-100 dark:border-zinc-800">
								<td class="py-4 font-bold">{item.user.fullName || item.user.username}</td>
								<td class="py-4 text-zinc-500">{item.user.email}</td>
								<td class="py-4 text-zinc-500">{item.account.bankName || '-'}</td>
								<td class="py-4 font-mono text-xs text-zinc-500">
									{item.account.bankAccountNumber || '-'}
									{#if item.account.bankAccountName}
										<br /><span class="text-zinc-400">{item.account.bankAccountName}</span>
									{/if}
								</td>
								<td class="py-4 text-right font-bold text-amber-600">
									{formatRupiah(item.account.pendingPayout ?? 0)}
								</td>
								<td class="py-4 text-right">
									<form
										method="POST"
										action="?/approvePayout"
										use:enhance={() => {
											approvingId = item.account.id;
											return async ({ result }) => {
												approvingId = null;
												if (result.type === 'success') {
													toast.success('Payout berhasil disetujui');
													await invalidateAll();
												} else {
													toast.error('Gagal approve payout');
												}
											};
										}}
									>
										<input type="hidden" name="accountId" value={item.account.id} />
										<input type="hidden" name="amount" value={item.account.pendingPayout} />
										<button
											type="submit"
											disabled={approvingId === item.account.id}
											class={`${RADIUS.button} bg-emerald-600 px-4 py-2 text-xs font-bold tracking-widest text-white uppercase hover:bg-emerald-700 ${TRANSITION.all} disabled:cursor-not-allowed disabled:opacity-50`}
										>
											{approvingId === item.account.id ? 'Processing...' : 'Approve'}
										</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</PageSection>

	<!-- Recently Processed -->
	<div class="mt-8">
		<PageSection title="Riwayat Payout" description="Payout yang sudah diproses">
			{#if data.processedAccounts.length === 0}
				<div class="py-12 text-center">
					<p class="text-sm text-zinc-400">Belum ada riwayat payout.</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm">
						<thead>
							<tr class="border-b border-zinc-200 dark:border-zinc-700">
								<th class="pb-3 text-xs font-bold tracking-widest text-zinc-400 uppercase"
									>Affiliate</th
								>
								<th class="pb-3 text-xs font-bold tracking-widest text-zinc-400 uppercase">Email</th
								>
								<th
									class="pb-3 text-right text-xs font-bold tracking-widest text-zinc-400 uppercase"
									>Sudah Dibayar</th
								>
								<th
									class="pb-3 text-right text-xs font-bold tracking-widest text-zinc-400 uppercase"
									>Masih Pending</th
								>
							</tr>
						</thead>
						<tbody>
							{#each data.processedAccounts as item}
								<tr class="border-b border-zinc-100 dark:border-zinc-800">
									<td class="py-4 font-bold">{item.user.fullName || item.user.username}</td>
									<td class="py-4 text-zinc-500">{item.user.email}</td>
									<td class="py-4 text-right font-bold text-emerald-600">
										{formatRupiah(item.account.paidOut ?? 0)}
									</td>
									<td class="py-4 text-right text-zinc-500">
										{formatRupiah(item.account.pendingPayout ?? 0)}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</PageSection>
	</div>
</PageWrapper>
