<script lang="ts">
import type { PageData, ActionData } from './$types';
import AuthContainer from '$lib/components/AuthContainer.svelte';
import AuthFormField from '$lib/components/AuthFormField.svelte';
import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
import AuthMessage from '$lib/components/AuthMessage.svelte';
import { enhance } from '$app/forms';

let { data, form }: { data: PageData; form?: ActionData | null } = $props();

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
    <div class="auth-grid">
        <aside class="auth-aside">
            <h3>Yang kamu dapatkan</h3>
            <ul>
                <li>Roadmap belajar yang jelas</li>
                <li>Feedback mentor dan komunitas</li>
                <li>Akses materi up-to-date</li>
            </ul>
        </aside>

        <section class="auth-main">
            {#if form?.message}
                <AuthMessage type="error" message={form.message} />
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

                    <div class="email-group">
                        <AuthFormField
                            label="Email"
                            type="email"
                            name="email"
                            placeholder="email@example.com atau nama@belajar.id"
                            required={true}
                            autocomplete="email"
                        />
                        <p class="field-hint">Email belajar.id dapat digunakan (contoh: nama@belajar.id)</p>
                    </div>

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
                        />

                        <div class="divider"><span>atau</span></div>
                        <div class="socials">
                            <button type="button" class="social-button" aria-label="Daftar dengan Google">Daftar dengan Google</button>
                            <button type="button" class="social-button alt" aria-label="Daftar dengan GitHub">Daftar dengan GitHub</button>
                        </div>
                    </div>
                </div>
            </form>

            <div class="signin-link">
                <p>
                    Sudah punya akun?
                    <a href="/auth/signin">Masuk di sini</a>
                </p>
            </div>
        </section>
    </div>
</AuthContainer>

<style>
    .auth-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 24px;
    }

    .auth-aside {
        display: none;
        background: rgba(255, 255, 255, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 16px;
        padding: 20px;
    }

    .auth-aside h3 {
        margin: 0 0 8px;
        color: var(--color-primary-dark);
        font-weight: 700;
    }

    .auth-aside ul {
        margin: 0;
        padding-left: 18px;
        color: var(--color-primary-medium);
        line-height: 1.6;
    }

    .auth-main { display: flex; flex-direction: column; gap: 16px; }

    .auth-form {
		display: flex;
		flex-direction: column;
        gap: 16px;
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

    .divider { display:flex; align-items:center; gap:12px; color:var(--color-primary-medium); font-size:.9em; }
    .divider::before, .divider::after { content:''; height:1px; flex:1; background:rgba(0,0,0,0.08); }
    .socials { display:grid; grid-template-columns:1fr; gap:10px; }
    .social-button { padding:10px 14px; border-radius:10px; border:1px solid rgba(0,0,0,0.08); background:rgba(255,255,255,0.8); font-weight:600; cursor:pointer; transition:transform .2s ease; }
    .social-button:hover { transform: translateY(-1px); }
    .social-button.alt { background: rgba(255,255,255,0.9); }

    @media (min-width: 1024px) {
        .auth-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
        .auth-aside { display:block; }
    }
</style>
