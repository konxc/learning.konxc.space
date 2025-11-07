<script lang="ts">
	// Placeholder settings; hook into real config later
	let orgName = 'Naik Kelas';
	let timezone = 'Asia/Jakarta';
</script>

<form class="max-w-2xl space-y-4 rounded-lg border bg-white p-4 dark:bg-neutral-900">
	<h1 class="font-semibold">Pengaturan Admin</h1>
	<label class="block">
		<div class="text-sm text-neutral-600">Nama Organisasi</div>
		<input class="mt-1 w-full rounded border bg-transparent px-3 py-2" bind:value={orgName} />
	</label>
	<label class="block">
		<div class="text-sm text-neutral-600">Zona Waktu</div>
		<input class="mt-1 w-full rounded border bg-transparent px-3 py-2" bind:value={timezone} />
	</label>
	<div class="pt-2">
		<button
			type="submit"
			class="rounded border px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
			>Simpan</button
		>
	</div>
</form>
