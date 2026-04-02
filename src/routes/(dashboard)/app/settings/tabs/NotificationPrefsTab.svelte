<script lang="ts">
	import { enhance } from '$app/forms';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import { toast } from '$lib/stores/toastStore';

	interface Props {
		notificationTypes: string[];
		enabledTypes: string[];
	}

	const { notificationTypes, enabledTypes: initialEnabled }: Props = $props();

	const TYPE_LABELS: Record<string, { label: string; desc: string; icon: string }> = {
		enrollment_activated: {
			label: 'Enrollment Diaktifkan',
			desc: 'Notifikasi saat enrollment kamu diaktifkan oleh admin',
			icon: '🎓'
		},
		submission_graded: {
			label: 'Tugas Dinilai',
			desc: 'Notifikasi saat mentor menilai submission kamu',
			icon: '✅'
		},
		checkpoint_due: {
			label: 'Deadline Checkpoint',
			desc: 'Pengingat saat checkpoint mendekati deadline',
			icon: '⏰'
		},
		broadcast_received: {
			label: 'Broadcast Diterima',
			desc: 'Pesan broadcast dari mentor atau admin',
			icon: '📢'
		},
		badge_earned: {
			label: 'Badge Baru',
			desc: 'Notifikasi saat kamu mendapatkan badge baru',
			icon: '🏅'
		},
		payment_confirmed: {
			label: 'Pembayaran Dikonfirmasi',
			desc: 'Konfirmasi saat pembayaran berhasil diproses',
			icon: '💳'
		}
	};

	let enabled = $state<Record<string, boolean>>({});

	$effect(() => {
		const map: Record<string, boolean> = {};
		for (const t of notificationTypes) {
			map[t] = initialEnabled.includes(t);
		}
		enabled = map;
	});

	let saving = $state(false);
</script>

<div class="animate-in grid gap-8 md:grid-cols-3">
	<div class="space-y-6 md:col-span-2">
		<section class={`${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} space-y-6 p-8`}>
			<h3
				class="border-l-4 border-blue-600 pl-4 text-xl font-black tracking-widest uppercase italic"
			>
				Preferensi Notifikasi
			</h3>
			<p class={`text-sm ${COLOR.textSecondary}`}>
				Pilih jenis notifikasi yang ingin kamu terima di platform.
			</p>

			<form
				method="POST"
				action="?/saveNotificationPrefs"
				use:enhance={() => {
					saving = true;
					return async ({ result }) => {
						saving = false;
						if (result.type === 'success') {
							toast.success('Preferensi notifikasi disimpan!');
						} else {
							toast.error('Gagal menyimpan preferensi');
						}
					};
				}}
				class="space-y-4"
			>
				{#each notificationTypes as type}
					{@const info = TYPE_LABELS[type] ?? { label: type, desc: '', icon: '🔔' }}
					<label
						class={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${TRANSITION.colors} ${
							enabled[type]
								? 'border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20'
								: `${COLOR.cardBorder} ${COLOR.card} hover:border-blue-300`
						}`}
					>
						<div class="flex items-center gap-3">
							<span class="text-2xl">{info.icon}</span>
							<div>
								<p class={`text-sm font-semibold ${COLOR.textPrimary}`}>{info.label}</p>
								<p class={`text-xs ${COLOR.textMuted}`}>{info.desc}</p>
							</div>
						</div>
						<div class="relative shrink-0">
							<input
								type="checkbox"
								name="enabledTypes"
								value={type}
								bind:checked={enabled[type]}
								class="sr-only"
								aria-label={info.label}
							/>
							<div
								class={`h-6 w-11 rounded-full ${TRANSITION.colors} ${enabled[type] ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-600'}`}
							></div>
							<div
								class={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow ${TRANSITION.all} ${enabled[type] ? 'translate-x-5' : 'translate-x-0'}`}
							></div>
						</div>
					</label>
				{/each}

				<button
					type="submit"
					disabled={saving}
					class={`w-full py-3 ${RADIUS.button} ${COLOR.accentBg} text-sm font-bold text-white ${TRANSITION.all} hover:-translate-y-0.5 disabled:opacity-60`}
				>
					{saving ? 'Menyimpan...' : 'Simpan Preferensi'}
				</button>
			</form>
		</section>
	</div>

	<div class="space-y-6">
		<div
			class={`${RADIUS.card} bg-linear-to-br from-blue-600 to-indigo-700 p-6 text-white ${ELEVATION.card}`}
		>
			<p class="mb-2 text-2xl">🔔</p>
			<h4 class="mb-2 text-lg font-black">Kontrol Notifikasi</h4>
			<p class="text-xs leading-relaxed opacity-80">
				Matikan jenis notifikasi yang tidak relevan untuk mengurangi gangguan saat belajar.
			</p>
		</div>
	</div>
</div>
