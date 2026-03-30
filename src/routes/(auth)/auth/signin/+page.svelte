<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toastStore';
	import type { ActionData } from './$types';
	import AuthContainer from '$lib/components/AuthContainer.svelte';
	import AuthFormField from '$lib/components/AuthFormField.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import { TEXT, COLOR, RADIUS, TRANSITION, SPACING } from '$lib/config/design';

	let { form }: { form: ActionData } = $props();

	let username = $state('');
	let password = $state('');
	let isLoading = $state(false);

	// Show toast when form error message changes
	$effect(() => {
		if (form?.message) {
			toast.error(form.message);
		}
	});
</script>

<svelte:head>
	<title>Masuk - Naik Kelas</title>
</svelte:head>

<AuthContainer
	title="Selamat Datang Kembali"
	subtitle="Masuk untuk melanjutkan perjalanan belajar kamu ke level berikutnya."
>
	<form
		method="post"
		action="?/login"
		use:enhance={() => {
			isLoading = true;
			return async ({ update }) => {
				await update();
				isLoading = false;
			};
		}}
		class="space-y-6"
	>
		<div class="space-y-4">
			<AuthFormField
				label="Username"
				name="username"
				bind:value={username}
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
				bind:value={password}
				placeholder="Masukkan password kamu"
				required={true}
				autocomplete="current-password"
				minlength={6}
			/>
		</div>

		<div class="flex items-center justify-between py-2">
			<label class="group flex cursor-pointer items-center gap-2">
				<div class="relative flex items-center">
					<input
						type="checkbox"
						name="remember"
						class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-zinc-300 bg-white transition-all checked:border-blue-600 checked:bg-blue-600 dark:border-zinc-700 dark:bg-zinc-800"
					/>
					<svg
						class="absolute top-1/2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="4"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
				</div>
				<span
					class={`${TEXT.small} ${COLOR.textSecondary} transition-colors group-hover:text-zinc-900 dark:group-hover:text-white`}
					>Ingat saya</span
				>
			</label>

			<a
				href="/auth/forgot"
				class={`${TEXT.small} font-bold text-blue-600 transition-colors hover:text-blue-700`}
			>
				Lupa password?
			</a>
		</div>

		<AuthSubmitButton text="Masuk ke Akun" loading={isLoading} />

		<div class="relative flex items-center py-4">
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
			Belum punya akun?
			<a
				href="/auth/signup"
				class="ml-1 font-bold text-blue-600 transition-colors hover:text-blue-700"
			>
				Daftar di sini
			</a>
		</p>
	</form>
</AuthContainer>
