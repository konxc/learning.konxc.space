<script lang="ts">
	import { enhance } from '$app/forms';
	import { RADIUS, COLOR, TEXT } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import AuthFormField from '$lib/components/AuthFormField.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import { formToast } from '$lib/utils/formEnhance';

	interface Verification {
		ktpName?: string | null;
		ktpNumber?: string | null;
		ktpDob?: Date | null;
		ktpAddress?: string | null;
		verifiedAt?: Date | null;
		status?: string | null;
		rejectionReason?: string | null;
	}

	let { user, verification }: { user: { isVerified: boolean }; verification: Verification | null } =
		$props();

	let ktpFileName = $state<string | null>(null);
	let selfieFileName = $state<string | null>(null);
</script>

<div class="animate-in mx-auto max-w-3xl space-y-8">
	{#if user.isVerified}
		<div
			class={`p-10 ${RADIUS.card} ${COLOR.card} flex flex-col items-center border-2 border-green-200 text-center shadow-xl dark:border-green-900/50`}
		>
			<div
				class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30"
			>
				<Icon name="shield-check" size={48} />
			</div>
			<h3
				class="mb-2 text-2xl font-black tracking-tighter text-green-700 uppercase italic dark:text-green-400"
			>
				Identitas Terverifikasi
			</h3>
			<p class="mb-6 max-w-md text-sm font-medium text-zinc-500">
				Terima kasih! Akun Anda telah lolos standar KYC institusional platform Naik Kelas. Anda
				sekarang memiliki akses penuh untuk menjadi Mentor, Fasilitator, dan mengelola agen
				organisasi.
			</p>
			<div class="grid w-full max-w-sm grid-cols-2 gap-4 text-left">
				<div
					class="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800/50 dark:bg-zinc-800/50"
				>
					<p class="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
						Nama Sesuai KTP
					</p>
					<p class="mt-1 text-sm font-bold">{verification?.ktpName || '-'}</p>
				</div>
				<div
					class="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800/50 dark:bg-zinc-800/50"
				>
					<p class="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
						Tanggal Disetujui
					</p>
					<p class="mt-1 text-sm font-bold">
						{verification?.verifiedAt
							? new Date(verification.verifiedAt).toLocaleDateString('id-ID')
							: '-'}
					</p>
				</div>
			</div>
		</div>
	{:else if verification?.status === 'pending'}
		<div
			class={`p-10 ${RADIUS.card} ${COLOR.card} flex flex-col items-center border-2 border-blue-200 text-center shadow-xl dark:border-blue-900/50`}
		>
			<div
				class="mb-6 flex h-24 w-24 animate-pulse items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30"
			>
				<Icon name="clock" size={48} />
			</div>
			<h3
				class="mb-2 text-2xl font-black tracking-tighter text-blue-700 uppercase italic dark:text-blue-400"
			>
				Menunggu Peninjauan
			</h3>
			<p class="max-w-md text-sm font-medium text-zinc-500">
				Data KYC Anda telah kami terima dan sedang diproses oleh Tim Kepatuhan. Proses verifikasi
				biasanya memakan waktu 1x24 jam kerja.
			</p>
		</div>
	{:else}
		<form
			method="POST"
			action="?/submitVerification"
			enctype="multipart/form-data"
			use:enhance={formToast({
				success: 'Data verifikasi berhasil dikirim!',
				error: 'Gagal mengirim verifikasi',
				withUpdate: false
			})}
			class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} relative space-y-8 shadow-sm`}
		>
			<div class="pointer-events-none absolute top-0 right-0 p-4 opacity-5">
				<Icon name="shield-check" size={120} />
			</div>

			<div>
				<h3
					class="mb-2 border-l-4 border-blue-600 pl-4 text-xl font-black tracking-widest uppercase italic"
				>
					Verifikasi KTP (KYC)
				</h3>
				<p class="mb-6 max-w-lg text-sm text-zinc-500">
					Informasi ini wajib dilengkapi untuk standar kepatuhan platform SaaS. Data Anda dienkripsi
					dan diproses sesuai kebijakan privasi kami.
				</p>

				{#if verification?.status === 'rejected'}
					<div
						class="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30"
					>
						<p class="mb-1 flex items-center gap-2 font-bold">
							<Icon name="alert-triangle" size={16} /> Verifikasi Ditolak
						</p>
						<p class="text-xs opacity-90">
							{verification?.rejectionReason ||
								'Data KTP tidak valid atau foto buram. Silakan gunakan kartu identitas fisik asli dan coba kembali.'}
						</p>
					</div>
				{/if}
			</div>

			<div class="grid gap-6 md:grid-cols-2">
				<AuthFormField
					label="Nomor Induk Kependudukan (NIK)"
					name="ktpNumber"
					placeholder="16 Digit Angka"
					value={verification?.ktpNumber ?? undefined}
					required
				/>
				<AuthFormField
					label="Nama Sesuai KTP"
					name="ktpName"
					placeholder="HURUF KAPITAL"
					value={verification?.ktpName ?? undefined}
					required
				/>
			</div>

			<div class="grid gap-6 md:grid-cols-2">
				<AuthFormField
					label="Tanggal Lahir"
					name="ktpDob"
					type="date"
					value={verification?.ktpDob
						? new Date(verification.ktpDob).toISOString().split('T')[0]
						: ''}
					required
				/>
				<div class="col-span-1 md:col-span-2">
					<AuthFormField
						label="Alamat Sesuai KTP"
						name="ktpAddress"
						placeholder="Jl. Merdeka No. 1..."
						value={verification?.ktpAddress ?? undefined}
						required
					/>
				</div>
			</div>

			<div class="grid gap-6 border-t border-zinc-100 pt-4 md:grid-cols-2 dark:border-zinc-800">
				<div class="space-y-2">
					<label
						for="ktpPhoto"
						class="block text-xs font-black tracking-widest text-zinc-400 uppercase"
						>Foto KTP Asli</label
					>
					<div
						class="group relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition-colors hover:border-blue-500 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50"
					>
						<Icon
							name="upload"
							class="mb-2 text-zinc-400 transition-colors group-hover:text-blue-500"
						/>
						<span
							class="text-xs font-bold transition-colors {ktpFileName
								? 'text-blue-600'
								: 'text-zinc-500 group-hover:text-blue-600'}"
							>{ktpFileName || 'Pilih File KTP'}</span
						>
						<input
							id="ktpPhoto"
							type="file"
							name="ktpPhoto"
							accept="image/png, image/jpeg, image/jpg"
							required
							class="absolute inset-0 cursor-pointer opacity-0"
							onchange={(e) => {
								const files = (e.target as HTMLInputElement).files;
								ktpFileName = files && files.length > 0 ? files[0].name : null;
							}}
						/>
					</div>
					<p class="text-[10px] text-zinc-400">Maks. 5MB, format JPG/PNG/JPEG.</p>
				</div>

				<div class="space-y-2">
					<label
						for="selfiePhoto"
						class="block text-xs font-black tracking-widest text-zinc-400 uppercase"
						>Selfie dengan KTP</label
					>
					<div
						class="group relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition-colors hover:border-blue-500 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50"
					>
						<Icon
							name="upload"
							class="mb-2 text-zinc-400 transition-colors group-hover:text-blue-500"
						/>
						<span
							class="text-xs font-bold transition-colors {selfieFileName
								? 'text-blue-600'
								: 'text-zinc-500 group-hover:text-blue-600'}"
							>{selfieFileName || 'Pilih File Selfie'}</span
						>
						<input
							id="selfiePhoto"
							type="file"
							name="selfiePhoto"
							accept="image/png, image/jpeg, image/jpg"
							required
							class="absolute inset-0 cursor-pointer opacity-0"
							onchange={(e) => {
								const files = (e.target as HTMLInputElement).files;
								selfieFileName = files && files.length > 0 ? files[0].name : null;
							}}
						/>
					</div>
					<p class="text-[10px] text-zinc-400">Pastikan wajah dan KTP terlihat jelas.</p>
				</div>
			</div>

			<div
				class="flex items-center justify-end gap-4 border-t border-zinc-100 pt-6 dark:border-zinc-800"
			>
				<p
					class="mr-4 max-w-xs text-right text-xs leading-relaxed tracking-tight text-zinc-500 italic"
				>
					Dengan menekan tombol submit, Anda menyetujui validasi identitas dan ketentuan layanan
					kami.
				</p>
				<AuthSubmitButton text="Submit Dokumen" />
			</div>
		</form>
	{/if}
</div>
