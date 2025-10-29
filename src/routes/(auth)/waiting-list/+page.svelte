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
	<title>Join Waiting List - Naik Kelas</title>
</svelte:head>

<AuthContainer
	title="Join Waiting List 🎯"
	subtitle="Dapatkan update pembukaan batch dan penawaran khusus untuk kamu yang ingin memulai perjalanan belajar jadi developer profesional!"
>
	{#if form?.error}
		<AuthMessage type="error" message={form.error} />
	{/if}

	{#if form?.success}
		<AuthMessage
			type="success"
			message="Terima kasih! Kamu telah berhasil mendaftar di waiting list. Kami akan menghubungi kamu segera setelah batch dibuka."
		/>
	{/if}

	{#if !form?.success}
		<form method="POST" action="?/join" class="waiting-list-form" use:enhance>
			<AuthFormField
				label="Nama Lengkap"
				name="fullName"
				placeholder="Masukkan nama lengkap kamu"
				required={true}
				autocomplete="name"
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
				label="No. HP (Opsional)"
				name="phone"
				placeholder="081234567890"
				autocomplete="tel"
			/>

			<div class="form-group-wrapper">
				<label for="interest">Minat (Opsional)</label>
				<select id="interest" name="interest" class="select-field">
					<option value="">Pilih minat kamu</option>
					<option value="python">Python Programming</option>
					<option value="web">Web Development</option>
					<option value="fullstack">Full Stack Development</option>
					<option value="career-switch">Career Switch ke Tech</option>
					<option value="upskill">Upskill Development Skills</option>
				</select>
			</div>

			<input type="hidden" name="source" value="landing-cta" />

			<AuthSubmitButton text="Gabung Waiting List" />
		</form>

		<div class="signin-link">
			<p>
				Sudah punya akun?
				<a href="/auth/signin">Masuk di sini</a>
			</p>
		</div>
	{/if}
</AuthContainer>

<style>
	.waiting-list-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.form-group-wrapper {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.form-group-wrapper label {
		font-weight: 600;
		color: var(--color-primary-dark);
		font-size: 0.95em;
	}

	.select-field {
		padding: 12px 16px;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-size: 1em;
		transition: all 0.2s ease;
		font-family: inherit;
		background: white;
	}

	.select-field:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

