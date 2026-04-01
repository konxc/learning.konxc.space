<script lang="ts">
	import { enhance } from '$app/forms';
	import { RADIUS, COLOR } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { toast } from '$lib/stores/toastStore';

	interface Props {
		emailNotif: boolean;
		waNotif: boolean;
		focusMode: boolean;
	}

	let { emailNotif: initialEmail, waNotif: initialWa, focusMode: initialFocus }: Props = $props();

	let emailNotif = $state(initialEmail);
	let waNotif = $state(initialWa);
	let focusMode = $state(initialFocus);
	let submittingPref = $state<string | null>(null);

	function toggleEmail() {
		if (submittingPref) return;
		emailNotif = !emailNotif;
		submittingPref = 'email';
		(document.getElementById('emailNotifForm') as HTMLFormElement)?.requestSubmit();
	}

	function toggleWA() {
		if (submittingPref) return;
		waNotif = !waNotif;
		submittingPref = 'wa';
		(document.getElementById('waNotifForm') as HTMLFormElement)?.requestSubmit();
	}

	function toggleFocus() {
		if (submittingPref) return;
		focusMode = !focusMode;
		submittingPref = 'focus';
		(document.getElementById('focusModeForm') as HTMLFormElement)?.requestSubmit();
	}
</script>

<!-- Hidden forms for preference updates -->
<form
	method="POST"
	action="?/updatePreferences"
	id="emailNotifForm"
	use:enhance={() => {
		return async ({ result }) => {
			submittingPref = null;
			if (result.type === 'failure') {
				emailNotif = !emailNotif;
				toast.error('Gagal menyimpan preferensi');
			} else {
				toast.success('Notifikasi email ' + (emailNotif ? 'diaktifkan' : 'dinonaktifkan'));
			}
		};
	}}
	class="hidden"
>
	<input type="hidden" name="emailNotif" value={emailNotif.toString()} />
</form>
<form
	method="POST"
	action="?/updatePreferences"
	id="waNotifForm"
	use:enhance={() => {
		return async ({ result }) => {
			submittingPref = null;
			if (result.type === 'failure') {
				waNotif = !waNotif;
				toast.error('Gagal menyimpan preferensi');
			} else {
				toast.success('Notifikasi WhatsApp ' + (waNotif ? 'diaktifkan' : 'dinonaktifkan'));
			}
		};
	}}
	class="hidden"
>
	<input type="hidden" name="waNotif" value={waNotif.toString()} />
</form>
<form
	method="POST"
	action="?/updatePreferences"
	id="focusModeForm"
	use:enhance={() => {
		return async ({ result }) => {
			submittingPref = null;
			if (result.type === 'success') {
				toast.success(focusMode ? 'Modus Fokus diaktifkan' : 'Modus Fokus dinonaktifkan');
			} else if (result.type === 'failure') {
				focusMode = !focusMode;
				toast.error('Gagal menyimpan preferensi');
			}
		};
	}}
	class="hidden"
>
	<input type="hidden" name="focusMode" value={focusMode.toString()} />
</form>

<div class="animate-in grid gap-8 md:grid-cols-3">
	<div class="space-y-8 md:col-span-2">
		<section
			class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} relative space-y-6`}
		>
			<h3
				class="mb-4 border-l-4 border-blue-600 pl-4 text-xl font-black tracking-widest uppercase italic"
			>
				Pengaturan Aplikasi
			</h3>

			<div class="space-y-6">
				<div
					class="flex items-center justify-between border-b border-zinc-100 py-4 dark:border-zinc-800"
				>
					<div>
						<h4 class="font-bold">Notifikasi Email</h4>
						<p class="text-xs text-zinc-500 italic">
							Terima laporan mingguan progres belajar peserta.
						</p>
					</div>
					<button
						onclick={toggleEmail}
						aria-label={emailNotif ? 'Nonaktifkan notifikasi email' : 'Aktifkan notifikasi email'}
						disabled={submittingPref !== null}
						class={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${emailNotif ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'} ${submittingPref !== null ? 'cursor-not-allowed opacity-50' : ''}`}
					>
						<span
							class={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${emailNotif ? 'translate-x-6' : 'translate-x-1'}`}
						></span>
					</button>
				</div>

				<div
					class="flex items-center justify-between border-b border-zinc-100 py-4 dark:border-zinc-800"
				>
					<div>
						<h4 class="font-bold">Notifikasi WhatsApp</h4>
						<p class="text-xs text-zinc-500 italic">
							Terima alert instan saat ada tugas baru dikirim.
						</p>
					</div>
					<button
						onclick={toggleWA}
						aria-label={waNotif
							? 'Nonaktifkan notifikasi WhatsApp'
							: 'Aktifkan notifikasi WhatsApp'}
						disabled={submittingPref !== null}
						class={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${waNotif ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'} ${submittingPref !== null ? 'cursor-not-allowed opacity-50' : ''}`}
					>
						<span
							class={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${waNotif ? 'translate-x-6' : 'translate-x-1'}`}
						></span>
					</button>
				</div>

				<div class="flex items-center justify-between py-4">
					<div>
						<h4 class="font-bold">Modus Fokus (LMS)</h4>
						<p class="text-xs text-zinc-500 italic">
							Sembunyikan sidebar otomatis saat sedang belajar.
						</p>
					</div>
					<button
						onclick={toggleFocus}
						aria-label={focusMode ? 'Nonaktifkan modus fokus' : 'Aktifkan modus fokus'}
						disabled={submittingPref !== null}
						class={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${focusMode ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'} ${submittingPref !== null ? 'cursor-not-allowed opacity-50' : ''}`}
					>
						<span
							class={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${focusMode ? 'translate-x-6' : 'translate-x-1'}`}
						></span>
					</button>
				</div>
			</div>
		</section>
	</div>

	<div class="space-y-6">
		<div
			class={`p-8 ${RADIUS.card} group relative overflow-hidden bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-xl`}
		>
			<Icon
				name="zap"
				class="absolute -right-4 -bottom-4 opacity-10 transition-transform duration-1000 group-hover:scale-150"
				size={140}
			/>
			<h4 class="mb-2 text-lg font-black tracking-tighter uppercase italic">Tips</h4>
			<p class="text-xs leading-relaxed font-medium italic opacity-80">
				Pengaturan ini membantu Anda mengatur kenyamanan saat berinteraksi dengan platform Naik
				Kelas.
			</p>
		</div>
	</div>
</div>
