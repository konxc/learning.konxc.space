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
	<form method="post" action="?/login" use:enhance>
		<div class="auth-form compact">
			{#if form?.message}
				<AuthMessage type="error" message={form.message} />
			{/if}

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

			<div class="extras-row">
				<label class="remember">
					<input type="checkbox" name="remember" />
					<span>Ingat saya</span>
				</label>
				<a class="forgot" href="/auth/forgot">Lupa password?</a>
			</div>

			<AuthSubmitButton text="Masuk" />

			<div class="divider"><span>atau</span></div>
			<div class="socials">
				<button type="button" class="social-button" aria-label="Masuk dengan Google"
					>Masuk dengan Google</button
				>
				<button type="button" class="social-button alt" aria-label="Masuk dengan GitHub"
					>Masuk dengan GitHub</button
				>
			</div>

			<div class="signup-link">
				<p>Belum punya akun? <a href="/auth/signup">Daftar di sini</a></p>
			</div>
		</div>
	</form>
</AuthContainer>

<style>
	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
		max-width: 520px;
		margin: 0 auto;
	}

	.extras-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.9em;
		color: var(--color-primary-medium);
	}

	.remember {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.forgot {
		color: var(--color-gradient-purple-start);
		text-decoration: none;
		font-weight: 600;
	}

	.divider {
		display: flex;
		align-items: center;
		gap: 12px;
		color: var(--color-primary-medium);
		font-size: 0.9em;
		margin-top: 8px;
	}
	.divider::before,
	.divider::after {
		content: '';
		height: 1px;
		flex: 1;
		background: rgba(0, 0, 0, 0.08);
	}

	.socials {
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
	}
	.social-button {
		padding: 10px 14px;
		border-radius: 10px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		background: rgba(255, 255, 255, 0.8);
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s ease;
	}
	.social-button:hover {
		transform: translateY(-1px);
	}
	.social-button.alt {
		background: rgba(255, 255, 255, 0.9);
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

	@media (min-width: 1024px) {
		.auth-form.compact {
			max-width: 520px;
		}
	}
</style>
