<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toastStore';
	import { COLOR, RADIUS, TEXT } from '$lib/config/design';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
</script>

<svelte:head>
	<title>Kursus Baru - Naik Kelas</title>
</svelte:head>

<div class="mx-auto max-w-2xl">
	<div class="mb-8">
		<a
			href="/app/mentor/courses"
			class={`mb-4 inline-flex items-center gap-1 text-sm ${COLOR.accent} hover:underline`}
		>
			← Kembali
		</a>
		<h1 class={`text-2xl font-bold ${COLOR.textPrimary} mt-4`}>Buat Kursus Baru</h1>
		<p class={`mt-1 text-sm ${COLOR.textMuted}`}>Mulai membuat kursus pertama Anda</p>
	</div>

	<form
		method="POST"
		action="?/create"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					toast.success('Kursus berhasil dibuat');
				} else if (result.type === 'failure') {
					toast.error(String(result.data?.error));
				}
			};
		}}
		class={`space-y-6 rounded-2xl border p-6 ${COLOR.card} ${COLOR.cardBorder}`}
	>
		<Input
			label="Judul Kursus"
			name="title"
			placeholder="Contoh: Masterclass Digital Marketing"
			required
		/>

		<div>
			<label for="description" class={`mb-1.5 block text-sm font-medium ${COLOR.textPrimary}`}>
				Deskripsi
			</label>
			<textarea
				name="description"
				rows="4"
				required
				placeholder="Jelaskan tentang kursus ini..."
				class={`w-full ${RADIUS.input} border px-3 py-2 text-sm outline-none focus:border-blue-500 ${COLOR.cardBorder} ${COLOR.card} ${COLOR.textPrimary}`}
			></textarea>
		</div>

		<Input label="Harga (IDR)" name="price" type="number" placeholder="0" />

		<div>
			<label for="category" class={`mb-1.5 block text-sm font-medium ${COLOR.textPrimary}`}>
				Kategori
			</label>
			<select
				name="category"
				class={`w-full ${RADIUS.input} border px-3 py-2 text-sm outline-none focus:border-blue-500 ${COLOR.cardBorder} ${COLOR.card} ${COLOR.textPrimary}`}
			>
				<option value="general">General</option>
				<option value="marketing">Marketing</option>
				<option value="technical">Technical</option>
				<option value="business">Business</option>
				<option value="design">Design</option>
			</select>
		</div>

		<div class="flex justify-end gap-3 pt-4">
			<a
				href="/app/mentor/courses"
				class={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${COLOR.textSecondary} hover:text-zinc-900 dark:hover:text-white`}
			>
				Batal
			</a>
			<Button type="submit" variant="primary">Buat Kursus</Button>
		</div>
	</form>
</div>
