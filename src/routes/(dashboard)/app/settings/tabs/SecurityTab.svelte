<script lang="ts">
	import { RADIUS, COLOR } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import AuthFormField from '$lib/components/AuthFormField.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { formToast } from '$lib/utils/formEnhance';
</script>

<div class="animate-in mx-auto max-w-2xl">
	<form
		method="POST"
		action="?/changePassword"
		use:enhance={formToast({
			success: 'Password berhasil diubah!',
			error: 'Gagal mengubah password',
			withUpdate: false
		})}
		class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} relative space-y-8 shadow-sm`}
	>
		<div class="pointer-events-none absolute top-0 right-0 p-4 opacity-5">
			<Icon name="shield" size={120} />
		</div>
		<h3
			class="mb-4 border-l-4 border-blue-600 pl-4 text-xl font-black tracking-widest uppercase italic"
		>
			Keamanan Akun
		</h3>
		<AuthFormField
			label="Password Saat Ini"
			name="currentPassword"
			type="password"
			placeholder="••••••••"
			required
		/>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<AuthFormField
				label="Password Baru"
				name="newPassword"
				type="password"
				placeholder="••••••••"
				required
			/>
			<AuthFormField
				label="Konfirmasi Password"
				name="confirmPassword"
				type="password"
				placeholder="••••••••"
				required
			/>
		</div>
		<div class="flex justify-end border-t border-zinc-100 pt-6 dark:border-zinc-800">
			<AuthSubmitButton text="Perbarui Password" />
		</div>
	</form>
</div>
