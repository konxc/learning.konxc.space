<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import AuthContainer from '$lib/components/AuthContainer.svelte';
	import AuthFormField from '$lib/components/AuthFormField.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import AuthMessage from '$lib/components/AuthMessage.svelte';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Masuk - Naik Kelas</title>
</svelte:head>

<AuthContainer
	title="Masuk ke Akun"
	subtitle="Selamat datang kembali! Masuk untuk melanjutkan pembelajaran kamu."
>
	{#if form?.message}
		<AuthMessage type="error" message={form.message} />
	{/if}

	<form method="post" action="?/login" use:enhance>
		<div class="auth-form">
			<AuthFormField
				label="Username"
				name="username"
				placeholder="Masukkan username kamu"
				required={true}
				autocomplete="username"
				minlength={3}
				maxlength={31}
			/>

			<AuthFormField
				label="Password"
				type="password"
				name="password"
				placeholder="Masukkan password kamu"
				required={true}
				autocomplete="current-password"
				minlength={6}
			/>

			<AuthSubmitButton text="Masuk" />
		</div>
	</form>

	<div class="signup-link">
		<p>
			Belum punya akun?
			<a href="/auth/signup">Daftar di sini</a>
		</p>
	</div>
</AuthContainer>

<style>
	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.signup-link {
		margin-top: 24px;
		text-align: center;
	}

	.signup-link p {
		color: var(--color-primary-medium);
		font-size: 0.95em;
	}

	.signup-link a {
		color: var(--color-gradient-purple-start);
		text-decoration: none;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.signup-link a:hover {
		text-decoration: underline;
	}
</style>
