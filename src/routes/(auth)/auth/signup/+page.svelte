<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import AuthContainer from '$lib/components/AuthContainer.svelte';
	import AuthFormField from '$lib/components/AuthFormField.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import AuthMessage from '$lib/components/AuthMessage.svelte';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let password = $state('');
	let confirmPassword = $state('');

	function validatePasswordStrength(password: string): { valid: boolean; message: string } {
		if (password.length < 6) {
			return { valid: false, message: 'Password minimal 6 karakter' };
		}
		return { valid: true, message: '' };
	}

	function validatePasswordMatch(password: string, confirmPassword: string): boolean {
		return password === confirmPassword;
	}
</script>

<svelte:head>
	<title>Daftar - Naik Kelas</title>
</svelte:head>

<AuthContainer
	title="Daftar Akun"
	subtitle="Bergabunglah dengan Naik Kelas dan mulailah perjalanan belajar kamu!"
>
	{#if form?.error}
		<AuthMessage type="error" message={form.error} />
	{/if}

	{#if form?.message}
		<AuthMessage type="success" message={form.message} />
	{/if}

	<form
		method="POST"
		use:enhance
		onsubmit={(e) => {
			const formData = new FormData(e.currentTarget as HTMLFormElement);
			password = (formData.get('password') as string) || '';
			confirmPassword = (formData.get('confirmPassword') as string) || '';
		}}
	>
		<div class="auth-form">
			<AuthFormField
				label="Username"
				name="username"
				placeholder="contoh: johndoe123"
				pattern="[a-z0-9_-]+"
				required={true}
				autocomplete="username"
				minlength={3}
				maxlength={31}
				hint="Minimal 3 karakter, huruf kecil, angka, underscore atau tanda hubung"
			/>

			<AuthFormField
				label="Email"
				type="email"
				name="email"
				placeholder="email@example.com"
				required={true}
				autocomplete="email"
			/>

			<AuthFormField
				label="Nama Lengkap"
				name="fullName"
				placeholder="Masukkan nama lengkap kamu"
				autocomplete="name"
			/>

			<div class="form-group-wrapper">
				<AuthFormField
					label="Password"
					type="password"
					name="password"
					placeholder="Minimal 6 karakter"
					required={true}
					autocomplete="new-password"
					minlength={6}
				/>
				{#if password}
					<div class="validation-hint">
						{#if validatePasswordStrength(password).valid}
							<span class="text-success">✓ Password kuat</span>
						{:else}
							<span class="text-error">{validatePasswordStrength(password).message}</span>
						{/if}
					</div>
				{/if}
			</div>

			<div class="form-group-wrapper">
				<AuthFormField
					label="Konfirmasi Password"
					type="password"
					name="confirmPassword"
					placeholder="Masukkan password lagi"
					required={true}
					autocomplete="new-password"
				/>
				{#if confirmPassword}
					<div class="validation-hint">
						{#if validatePasswordMatch(password, confirmPassword)}
							<span class="text-success">✓ Password cocok</span>
						{:else}
							<span class="text-error">Password tidak cocok</span>
						{/if}
					</div>
				{/if}

				<AuthSubmitButton
					text="Daftar"
					disabled={!password ||
						!confirmPassword ||
						!validatePasswordMatch(password, confirmPassword)}
					loading={form?.loading}
				/>
			</div>
		</div>
	</form>

	<div class="signin-link">
		<p>
			Sudah punya akun?
			<a href="/auth/signin">Masuk di sini</a>
		</p>
	</div>
</AuthContainer>

<style>
	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.form-group-wrapper {
		display: flex;
		flex-direction: column;
	}

	.validation-hint {
		font-size: 0.85em;
		padding-left: 4px;
		margin-top: -12px;
	}

	.text-success {
		color: #059669;
	}

	.text-error {
		color: #dc2626;
	}

	.signin-link {
		margin-top: 24px;
		text-align: center;
	}

	.signin-link p {
		color: var(--color-primary-medium);
		font-size: 0.95em;
	}

	.signin-link a {
		color: var(--color-gradient-purple-start);
		text-decoration: none;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.signin-link a:hover {
		text-decoration: underline;
	}
</style>
