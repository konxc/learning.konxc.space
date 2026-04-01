<script lang="ts">
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const isAdmin = $derived(data.membership && ['owner', 'admin'].includes(data.membership.role));
</script>

{#if data.membership}
	{@render children()}
{:else}
	<div class="flex min-h-[50vh] items-center justify-center">
		<div class="text-center">
			<h2 class="text-xl font-bold">Akses Ditolak</h2>
			<p class="mt-2 text-sm text-zinc-500">Anda bukan anggota organisasi ini.</p>
			<a href="/app/organizations" class="mt-4 inline-block text-blue-600 hover:underline">
				Kembali ke Daftar Organisasi
			</a>
		</div>
	</div>
{/if}
