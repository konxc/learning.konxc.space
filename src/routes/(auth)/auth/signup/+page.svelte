<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { toast } from '$lib/stores/toastStore';
	import AuthContainer from '$lib/components/AuthContainer.svelte';
	import AuthFormField from '$lib/components/AuthFormField.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { TEXT, COLOR, RADIUS, TRANSITION, SPACING } from '$lib/config/design';

	let { data, form }: { data: PageData; form?: ActionData | null } = $props();

	let username = $state('');
	let email = $state('');
	let fullName = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let isLoading = $state(false);

	// Show toast when form error message changes
	$effect(() => {
		if (form?.message) {
			toast.error(form.message);
		}
	});

	function validatePasswordStrength(password: string): { valid: boolean; message: string } {
		if (password.length < 6) {
			return { valid: false, message: 'Password minimal 6 karakter' };
		}
		return { valid: true, message: '' };
	}

	function validatePasswordMatch(password: string, confirmPassword: string): boolean {
		return password === confirmPassword;
	}

	const isFormValid = $derived(
		username.length >= 3 &&
			email.includes('@') &&
			fullName.length > 0 &&
			password.length >= 6 &&
			password === confirmPassword
	);
</script>

<svelte:head>
	<title>Daftar - Naik Kelas</title>
</svelte:head>

<AuthContainer
	title="Buat Akun Baru"
	subtitle="Mulai perjalanan transformatif kamu hari ini dan bergabunglah dengan ribuan builder lainnya."
>
	<div class="space-y-8">
		<form
			method="POST"
			use:enhance={() => {
				isLoading = true;
				return async ({ update }) => {
					await update();
					isLoading = false;
				};
			}}
			class="space-y-5"
		>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<AuthFormField
					label="Username"
					name="username"
					bind:value={username}
					placeholder="username"
					pattern="[a-z0-9_-]+"
					required={true}
					autocomplete="username"
					minlength={3}
					maxlength={31}
					hint="Huruf kecil, angka, _ atau -"
				/>

				<div class="space-y-1">
					<AuthFormField
						label="Email"
						type="email"
						name="email"
						bind:value={email}
						placeholder="nama@email.com"
						required={true}
						autocomplete="email"
					/>
				</div>
			</div>

			<AuthFormField
				label="Nama Lengkap"
				name="fullName"
				bind:value={fullName}
				placeholder="Masukkan nama lengkap kamu"
				autocomplete="name"
				required={true}
			/>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div class="space-y-2">
					<AuthFormField
						label="Password"
						type="password"
						name="password"
						bind:value={password}
						placeholder="Minimal 6 karakter"
						required={true}
						autocomplete="new-password"
						minlength={6}
					/>
					{#if password}
						<div class={`${TEXT.small} flex items-center gap-1.5 px-1`}>
							{#if validatePasswordStrength(password).valid}
								<span class="font-bold text-green-600 dark:text-green-400">✓ Kuat</span>
							{:else}
								<span class="font-bold text-red-500"
									>{validatePasswordStrength(password).message}</span
								>
							{/if}
						</div>
					{/if}
				</div>

				<div class="space-y-2">
					<AuthFormField
						label="Konfirmasi"
						type="password"
						name="confirmPassword"
						bind:value={confirmPassword}
						placeholder="Ulangi password"
						required={true}
						autocomplete="new-password"
					/>
					{#if confirmPassword}
						<div class={`${TEXT.small} flex items-center gap-1.5 px-1`}>
							{#if validatePasswordMatch(password, confirmPassword)}
								<span class="font-bold text-green-600 dark:text-green-400">✓ Cocok</span>
							{:else}
								<span class="font-bold text-red-500">Tidak cocok</span>
							{/if}
						</div>
					{/if}
				</div>
			</div>

			<div class="pt-2">
				<AuthSubmitButton text="Daftar Sekarang" disabled={!isFormValid} loading={isLoading} />
			</div>

			<div class="relative flex items-center py-2">
				<div class="grow border-t border-zinc-200 dark:border-zinc-800"></div>
				<span class={`mx-4 shrink ${TEXT.small} ${COLOR.textMuted} tracking-widest uppercase`}
					>Atau</span
				>
				<div class="grow border-t border-zinc-200 dark:border-zinc-800"></div>
			</div>

			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<button
					type="button"
					class={`flex items-center justify-center gap-2 px-4 py-3 ${RADIUS.button} border ${COLOR.cardBorder} bg-white text-xs font-bold dark:bg-zinc-800 ${TRANSITION.all} hover:bg-zinc-50 active:scale-95 dark:hover:bg-zinc-700`}
				>
					<img
						src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png"
						alt="Google"
						class="h-4 w-4"
					/>
					Google
				</button>
				<button
					type="button"
					class={`flex items-center justify-center gap-2 px-4 py-3 ${RADIUS.button} border ${COLOR.cardBorder} bg-white text-xs font-bold dark:bg-zinc-800 ${TRANSITION.all} hover:bg-zinc-50 active:scale-95 dark:hover:bg-zinc-700`}
				>
					<svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
						<path
							d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
						/>
					</svg>
					GitHub
				</button>
			</div>

			<p class={`pt-4 text-center ${TEXT.small} ${COLOR.textSecondary}`}>
				Sudah punya akun?
				<a
					href="/auth/signin"
					class="ml-1 font-bold text-blue-600 transition-colors hover:text-blue-700"
				>
					Masuk di sini
				</a>
			</p>
		</form>
	</div>
</AuthContainer>
