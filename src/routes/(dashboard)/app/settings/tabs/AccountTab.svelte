<script lang="ts">
	import { RADIUS } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toastStore';

	let showDeleteModal = $state(false);
	let deleteConfirmText = $state('');
</script>

<div class="animate-in mx-auto max-w-2xl">
	<div
		class={`p-10 ${RADIUS.card} relative space-y-6 overflow-hidden border-2 border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30`}
	>
		<div class="pointer-events-none absolute top-0 right-0 p-4 text-red-600 opacity-10">
			<Icon name="trash-2" size={120} />
		</div>
		<div class="flex items-start gap-4">
			<div
				class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-600 shadow-lg"
			>
				<Icon name="alert-triangle" size={24} />
			</div>
			<div class="flex-1">
				<h3
					class="mb-2 text-xl font-black tracking-widest text-red-800 uppercase italic dark:text-red-300"
				>
					Hapus Seluruh Data
				</h3>
				<p class="mb-6 text-sm leading-relaxed text-red-700 italic dark:text-red-400">
					Penghapusan akun bersifat final. Semua riwayat belajar, sertifikat, dan akses ke
					organisasi akan hilang selamanya dan tidak dapat dipulihkan oleh tim support.
				</p>
				<button
					onclick={() => (showDeleteModal = true)}
					class={`w-full md:w-auto ${RADIUS.button} bg-red-600 px-10 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl transition-all hover:scale-105 hover:bg-red-700 active:scale-95`}
					>Mulai Penghapusan Akun</button
				>
			</div>
		</div>
	</div>
</div>

<!-- Delete Modal -->
{#if showDeleteModal}
	<div
		class="animate-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
	>
		<div
			class={`w-full max-w-md ${RADIUS.card} border-2 border-red-200 bg-white p-10 shadow-2xl dark:border-red-900 dark:bg-zinc-950`}
		>
			<div class="mb-8 flex flex-col items-center text-center">
				<div
					class="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-200 bg-red-100 text-red-600 dark:border-red-800 dark:bg-red-900/30"
				>
					<Icon name="alert-triangle" size={40} />
				</div>
				<h3 class="text-2xl font-black tracking-tighter text-red-600 uppercase italic">
					Konfirmasi Final
				</h3>
				<p class="mt-2 text-sm font-medium text-zinc-500">
					Buktikan bahwa Anda serius menghapus masa depan digital Anda di platform ini.
				</p>
			</div>

			<p class="mb-6 text-center text-xs text-zinc-600 italic dark:text-zinc-400">
				Ketik kata kunci <span class="border-b-2 border-red-600 font-black text-red-600 uppercase"
					>HAPUS</span
				> di bawah ini untuk mengonfirmasi.
			</p>

			<form
				method="POST"
				action="?/deleteAccount"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'failure') {
							const errorMsg = (result.data as any)?.error || 'Gagal menghapus akun';
							toast.error(errorMsg);
						}
					};
				}}
				class="space-y-6"
			>
				<input
					type="text"
					name="confirmText"
					bind:value={deleteConfirmText}
					placeholder="MASUKKAN KATAKUNCI"
					class={`w-full border-2 p-4 ${deleteConfirmText === 'HAPUS' ? 'border-red-500 bg-red-50/50' : 'border-zinc-200'} rounded-2xl text-center font-black tracking-[0.2em] transition-all outline-none dark:border-zinc-800 dark:bg-zinc-900`}
					required
				/>

				<div class="flex gap-4">
					<button
						type="button"
						onclick={() => {
							showDeleteModal = false;
							deleteConfirmText = '';
						}}
						class="flex-1 rounded-2xl border-2 border-zinc-200 p-4 text-xs font-black tracking-widest uppercase transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
						>Batal</button
					>
					<button
						type="submit"
						disabled={deleteConfirmText !== 'HAPUS'}
						class="flex-1 rounded-2xl bg-red-600 p-4 text-xs font-black tracking-widest text-white uppercase shadow-xl transition-all hover:bg-red-700 active:scale-95 disabled:opacity-30 disabled:grayscale"
					>
						Hapus Permanen
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
