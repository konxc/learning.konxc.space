<script lang="ts">
	import type { PageData, ActionData } from './$types';
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

	$effect(() => {
		// Reset form state
		if (form?.success) {
			// Redirect will happen server-side
		}
	});
</script>

<svelte:head>
	<title>Daftar - Naik Kelas</title>
</svelte:head>

<div class="register-page">
	<div class="register-container">
		<div class="register-header">
			<h1>Daftar Akun</h1>
			<p>Bergabunglah dengan Naik Kelas dan mulailah perjalanan belajar kamu!</p>
		</div>

		{#if form?.error}
			<div class="error-message">
				<strong>⚠️ Error:</strong>
				{form.error}
			</div>
		{/if}

		{#if form?.message}
			<div class="success-message">
				<strong>✓</strong>
				{form.message}
			</div>
		{/if}

		<form method="POST" class="register-form">
			<div class="form-group">
				<label for="username">Username *</label>
				<input
					type="text"
					id="username"
					name="username"
					required
					autocomplete="username"
					placeholder="contoh: johndoe123"
					pattern="[a-z0-9_-]+"
					minlength="3"
					maxlength="31"
				/>
				<small>Minimal 3 karakter, huruf kecil, angka, underscore atau tanda hubung</small>
			</div>

			<div class="form-group">
				<label for="email">Email *</label>
				<input
					type="email"
					id="email"
					name="email"
					required
					autocomplete="email"
					placeholder="email@example.com"
				/>
			</div>

			<div class="form-group">
				<label for="fullName">Nama Lengkap</label>
				<input
					type="text"
					id="fullName"
					name="fullName"
					autocomplete="name"
					placeholder="Masukkan nama lengkap kamu"
				/>
			</div>

			<div class="form-group">
				<label for="password">Password *</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					autocomplete="new-password"
					placeholder="Minimal 6 karakter"
					minlength="6"
					bind:value={password}
				/>
				{#if password}
					<small>
						{#if validatePasswordStrength(password).valid}
							<span class="text-success">✓ Password kuat</span>
						{:else}
							<span class="text-error">{validatePasswordStrength(password).message}</span>
						{/if}
					</small>
				{/if}
			</div>

			<div class="form-group">
				<label for="confirmPassword">Konfirmasi Password *</label>
				<input
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					required
					autocomplete="new-password"
					placeholder="Masukkan password lagi"
					bind:value={confirmPassword}
				/>
				{#if confirmPassword}
					<small>
						{#if validatePasswordMatch(password, confirmPassword)}
							<span class="text-success">✓ Password cocok</span>
						{:else}
							<span class="text-error">Password tidak cocok</span>
						{/if}
					</small>
				{/if}
			</div>

			<button
				type="submit"
				class="submit-btn"
				disabled={!password ||
					!confirmPassword ||
					!validatePasswordMatch(password, confirmPassword)}
			>
				{#if form?.loading}
					Loading...
				{:else}
					Daftar
				{/if}
			</button>
		</form>

		<div class="login-link">
			<p>
				Sudah punya akun?
				<a href="/auth/signin">Masuk di sini</a>
			</p>
		</div>
	</div>
</div>

<style>
	.register-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--color-bg-hero) 0%, var(--color-bg-hero-end) 100%);
		padding: 20px;
	}

	.register-container {
		background: white;
		border-radius: 16px;
		padding: 40px;
		max-width: 500px;
		width: 100%;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
	}

	.register-header {
		text-align: center;
		margin-bottom: 32px;
	}

	.register-header h1 {
		font-size: 2em;
		color: var(--color-primary-dark);
		margin-bottom: 8px;
	}

	.register-header p {
		color: var(--color-primary-medium);
		font-size: 1em;
	}

	.error-message,
	.success-message {
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 24px;
	}

	.error-message {
		background: #fee2e2;
		color: #dc2626;
	}

	.success-message {
		background: #d1fae5;
		color: #065f46;
	}

	.register-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	label {
		font-weight: 600;
		color: var(--color-primary-dark);
		font-size: 0.95em;
	}

	input {
		padding: 12px 16px;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-size: 1em;
		transition: all 0.2s ease;
		font-family: inherit;
	}

	input:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	small {
		font-size: 0.85em;
		color: var(--color-primary-medium);
	}

	.text-success {
		color: #059669;
	}

	.text-error {
		color: #dc2626;
	}

	.submit-btn {
		padding: 14px 32px;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1em;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		margin-top: 8px;
	}

	.submit-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
	}

	.submit-btn:disabled {
		background: #e5e7eb;
		color: #9ca3af;
		cursor: not-allowed;
	}

	.login-link {
		margin-top: 24px;
		text-align: center;
	}

	.login-link p {
		color: var(--color-primary-medium);
	}

	.login-link a {
		color: var(--color-gradient-purple-start);
		text-decoration: none;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.login-link a:hover {
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		.register-container {
			padding: 24px;
		}

		.register-header h1 {
			font-size: 1.75em;
		}
	}
</style>
