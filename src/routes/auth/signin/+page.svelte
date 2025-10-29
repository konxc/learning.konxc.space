<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<h1>Login/Register</h1>
<form method="post" action="?/login" use:enhance>
	<label>
		Username
		<input
			name="username"
			class="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		/>
	</label>
	<label>
		Password
		<input
			type="password"
			name="password"
			class="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		/>
	</label>
	<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
		>Login</button
	>
</form>
<p style="color: red">{form?.message ?? ''}</p>
<div class="register-link">
	<p>
		Belum punya akun?
		<a href="/auth/signup" class="text-blue-600 underline hover:text-blue-700">Daftar di sini</a>
	</p>
</div>

<style>
	.register-link {
		margin-top: 16px;
		text-align: center;
	}
	.register-link p {
		color: #6b7280;
		font-size: 0.9em;
	}
</style>
