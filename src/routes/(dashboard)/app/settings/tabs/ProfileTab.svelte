<script lang="ts">
	import { enhance } from '$app/forms';
	import { RADIUS, COLOR, TEXT } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import AuthFormField from '$lib/components/AuthFormField.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import { toast } from '$lib/stores/toastStore';
	import { formToast } from '$lib/utils/formEnhance';

	interface UserData {
		id: string;
		username: string;
		fullName: string | null;
		email: string | null;
		phone: string | null;
		avatarUrl: string | null;
		role: string;
		createdAt: Date;
		isVerified: boolean;
	}

	let { user }: { user: UserData } = $props();

	let avatarForm: HTMLFormElement | undefined = $state();
	let avatarInput: HTMLInputElement | undefined = $state();
	let isUploadingAvatar = $state(false);
</script>

<div class="animate-in grid gap-10 md:grid-cols-3">
	<div class="space-y-6 md:col-span-1">
		<div
			class={`p-8 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} flex flex-col items-center text-center transition-all hover:scale-[1.02]`}
		>
			<div class="relative mb-6">
				<form
					method="POST"
					action="?/uploadAvatar"
					enctype="multipart/form-data"
					bind:this={avatarForm}
					use:enhance={() => {
						isUploadingAvatar = true;
						return async ({ result, update }) => {
							isUploadingAvatar = false;
							if (result.type === 'success') {
								toast.success((result.data as any)?.message || 'Avatar berhasil diperbarui!');
								await update();
							} else if (result.type === 'failure') {
								toast.error((result.data as any)?.error || 'Gagal mengunggah avatar');
							}
						};
					}}
				>
					<input
						type="file"
						name="avatar"
						accept="image/png, image/jpeg, image/webp"
						class="hidden"
						bind:this={avatarInput}
						onchange={() => avatarForm?.requestSubmit()}
					/>
					<button
						type="button"
						onclick={() => avatarInput?.click()}
						disabled={isUploadingAvatar}
						class="group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-blue-500/20 bg-blue-100 p-1 text-blue-600 transition-colors hover:border-blue-500 dark:bg-zinc-800 dark:text-blue-400"
					>
						{#if user.avatarUrl}
							<img
								src={user.avatarUrl}
								alt="Avatar"
								class={`h-full w-full rounded-full object-cover transition-all duration-500 ${isUploadingAvatar ? 'scale-110 opacity-20 blur-sm' : 'opacity-100'}`}
							/>
						{:else}
							<Icon
								name="user"
								size={80}
								class={`opacity-40 transition-all ${isUploadingAvatar ? 'scale-50 opacity-0' : ''}`}
							/>
						{/if}

						{#if isUploadingAvatar}
							<div
								class="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm"
							>
								<Icon
									name="loader-2"
									size={32}
									class="animate-spin text-blue-600 dark:text-blue-400"
								/>
							</div>
						{:else}
							<div
								class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100"
							>
								<Icon
									name="camera"
									size={32}
									class="scale-75 text-white transition-transform group-hover:scale-100"
								/>
							</div>
						{/if}
					</button>
				</form>

				{#if user.isVerified}
					<div
						class="pointer-events-none absolute -right-1 -bottom-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-xl dark:border-zinc-900"
						title="Terverifikasi"
					>
						<Icon name="check" size={18} />
					</div>
				{/if}
			</div>
			<h2 class="mb-1 text-2xl font-black tracking-tighter uppercase italic">
				{user.fullName || user.username}
			</h2>
			<p
				class="rounded-full border border-zinc-200 bg-zinc-100 px-4 py-1.5 text-xs font-bold tracking-widest text-zinc-500 uppercase dark:border-zinc-700 dark:bg-zinc-800"
			>
				{user.role}
			</p>
		</div>

		<div
			class={`p-6 ${RADIUS.card} ${COLOR.card} space-y-4 border border-zinc-100 dark:border-zinc-800`}
		>
			<div
				class="flex items-center justify-between text-xs font-bold tracking-tighter text-zinc-400 uppercase"
			>
				<span>Status Akun</span>
				<span class={user.isVerified ? 'text-green-500' : 'text-orange-500'}>
					{user.isVerified ? 'Institusi' : 'Personal'}
				</span>
			</div>
			<div class="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
				<div class="h-full bg-blue-600" style="width: {user.isVerified ? '100%' : '30%'}"></div>
			</div>
			<p class="text-[10px] leading-relaxed text-zinc-500 italic">
				{#if user.isVerified}
					Anda memiliki akses penuh untuk membuat organisasi dan mendeploy draf agen.
				{:else}
					Verifikasi KTP Anda untuk mengaktifkan fitur Organisasi & Agentic Deployment.
				{/if}
			</p>
		</div>
	</div>

	<div class="md:col-span-2">
		<form
			method="POST"
			action="?/updateProfile"
			use:enhance={formToast({
				success: 'Profil berhasil diperbarui!',
				error: 'Gagal memperbarui profil',
				withUpdate: false
			})}
			class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} relative space-y-8 overflow-hidden shadow-sm`}
		>
			<div class="pointer-events-none absolute top-0 right-0 p-4 opacity-5">
				<Icon name="user" size={120} />
			</div>
			<h3
				class="mb-4 border-l-4 border-blue-600 pl-4 text-xl font-black tracking-widest uppercase italic"
			>
				Informasi Dasar
			</h3>
			<AuthFormField
				label="Nama Lengkap"
				name="fullName"
				value={user.fullName ?? undefined}
				placeholder="Masukkan nama lengkap Anda"
			/>
			<div class="grid gap-6 md:grid-cols-2">
				<AuthFormField
					label="Alamat Email"
					name="email"
					value={user.email ?? undefined}
					placeholder="email@contoh.com"
					required
				/>
				<AuthFormField
					label="Nomor Telepon"
					name="phone"
					value={user.phone ?? undefined}
					placeholder="628..."
				/>
			</div>
			<div class="flex justify-end border-t border-zinc-100 pt-6 dark:border-zinc-800">
				<AuthSubmitButton text="Simpan Perubahan" />
			</div>
		</form>
	</div>
</div>
