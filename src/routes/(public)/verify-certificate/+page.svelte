<script lang="ts">
	import type { PageData } from './$types';
	import { COLOR, RADIUS, SPACING, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();

	let searchSerial = $state($page.url.searchParams.get('serial') || '');

	function handleSearch(e: Event) {
		e.preventDefault();
		if (searchSerial.trim()) {
			window.location.href = `?serial=${encodeURIComponent(searchSerial.trim())}`;
		}
	}
</script>

<svelte:head>
	<title>Verify Certificate — Naik Kelas</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-16">
	<div class="mx-auto max-w-2xl">
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-black text-gray-900">🎓 Certificate Verification</h1>
			<p class="text-lg text-gray-600">
				Verify the authenticity of certificates issued by Naik Kelas
			</p>
		</div>

		<!-- Search Form -->
		<form
			onsubmit={handleSearch}
			class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} mb-8 p-8`}
		>
			<label for="serial" class="mb-2 block text-sm font-bold text-gray-700">
				Enter Certificate Serial Number
			</label>
			<div class="flex gap-4">
				<input
					type="text"
					id="serial"
					bind:value={searchSerial}
					placeholder="e.g., NK-2026-XXXXX"
					class={`flex-1 ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
				/>
				<button
					type="submit"
					class={`${RADIUS.button} ${COLOR.accentBg} px-8 py-3 text-sm font-bold text-white ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-lg`}
				>
					Verify
				</button>
			</div>
		</form>

		<!-- Result -->
		{#if data.certificate}
			<div
				class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} animate-in fade-in border-2 border-green-200 p-8`}
			>
				<div class="mb-6 flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl"
					>
						✅
					</div>
					<div>
						<h2 class="text-xl font-bold text-green-700">Certificate Verified</h2>
						<p class="text-sm text-green-600">This certificate is authentic</p>
					</div>
				</div>

				<div class="space-y-4 border-t border-gray-100 pt-6">
					<div class="grid grid-cols-3 gap-4">
						<div>
							<p class="text-xs font-black tracking-widest text-gray-400 uppercase">Name</p>
							<p class="font-bold text-gray-900">
								{data.certificate.user.fullName || data.certificate.user.username}
							</p>
						</div>
						<div>
							<p class="text-xs font-black tracking-widest text-gray-400 uppercase">Course</p>
							<p class="font-semibold text-gray-700">{data.certificate.course.title}</p>
						</div>
						<div>
							<p class="text-xs font-black tracking-widest text-gray-400 uppercase">Issued Date</p>
							<p class="font-semibold text-gray-700">
								{new Date(data.certificate.issuedAt).toLocaleDateString('id-ID', {
									day: 'numeric',
									month: 'long',
									year: 'numeric'
								})}
							</p>
						</div>
					</div>
					<div class="pt-4">
						<p class="text-xs font-black tracking-widest text-gray-400 uppercase">Serial Number</p>
						<p class="font-mono text-sm text-gray-600">{data.certificate.serial}</p>
					</div>
				</div>
			</div>
		{:else if data.error}
			<div
				class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} animate-in fade-in border-2 border-red-200 p-8`}
			>
				<div class="flex items-center gap-3">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl">
						❌
					</div>
					<div>
						<h2 class="text-xl font-bold text-red-700">Certificate Not Found</h2>
						<p class="text-sm text-red-600">{data.error}</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Info -->
		<div class="mt-8 text-center">
			<p class="text-sm text-gray-500">
				Issued by <strong>Naik Kelas by Koneksi</strong> in partnership with
				<strong>Yayasan ASIB</strong>
			</p>
			<p class="mt-2 text-xs text-gray-400">
				<a href="/" class="text-blue-600 hover:underline">Return to homepage</a>
			</p>
		</div>
	</div>
</div>
