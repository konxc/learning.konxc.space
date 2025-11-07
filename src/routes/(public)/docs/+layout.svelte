<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_DOCS_ACCESS_CODE } from '$env/static/public';

	const EXPECTED_CODE = (PUBLIC_DOCS_ACCESS_CODE || '').trim();
	const STORAGE_KEY = 'docs-access-granted';

	let accessGranted = false;
	let modalOpen = true;
	let accessCodeInput = '';
	let errorMessage = '';

	onMount(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored === 'true') {
				accessGranted = true;
				modalOpen = false;
			}
		} catch (error) {
			console.warn('Docs layout: unable to read localStorage', error);
		}
	});

	function verifyAccess() {
		const expected = EXPECTED_CODE || 'NAIKKELAS2025';
		if (accessCodeInput.trim() === expected) {
			accessGranted = true;
			modalOpen = false;
			errorMessage = '';
			try {
				localStorage.setItem(STORAGE_KEY, 'true');
			} catch (error) {
				console.warn('Docs layout: unable to persist access flag', error);
			}
		} else {
			errorMessage = 'Kode akses tidak valid. Silakan coba lagi atau konfirmasi ke tim.';
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			verifyAccess();
		}
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex,nofollow" />
	<meta name="googlebot" content="noindex,nofollow" />
</svelte:head>

<div class="docs-layout">
	{#if modalOpen && !accessGranted}
		<div class="docs-overlay" role="dialog" aria-modal="true" aria-labelledby="docs-modal-title">
			<div class="docs-modal">
				<h2 id="docs-modal-title">Masukkan Kode Akses</h2>
				<p class="docs-modal-description">
					Halaman dokumentasi ini hanya dapat diakses oleh tim internal atau mitra yang memiliki
					kode.
				</p>
				<label for="docs-access-code" class="docs-label">Kode Akses</label>
				<input
					autocomplete="off"
					autofocus
					id="docs-access-code"
					type="password"
					placeholder="Masukkan kode"
					bind:value={accessCodeInput}
					on:keydown={handleKeydown}
					class="docs-input"
				/>
				{#if errorMessage}
					<p class="docs-error" role="alert">{errorMessage}</p>
				{/if}
				<button class="docs-button" type="button" on:click={verifyAccess}>Buka Halaman</button>
			</div>
		</div>
	{/if}

	<div class:docs-blurred={!accessGranted}>
		<slot />
	</div>
</div>

<style lang="postcss">
	@reference "../../../app.css";

	.docs-layout {
		@apply relative min-h-screen bg-(--color-bg-light,#f5f7fb);
	}

	:global(.doc-page) {
		@apply mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 pt-32 pb-16 lg:px-0;
	}

	:global(.doc-hero) {
		@apply flex flex-col gap-4;
	}

	:global(.doc-title),
	:global(.doc-hero h1) {
		@apply text-3xl font-semibold md:text-4xl;
	}

	:global(.doc-summary),
	:global(.doc-hero p) {
		@apply text-base text-(--color-primary-medium,#4a5568) md:text-lg;
	}

	:global(.doc-links) {
		@apply flex flex-wrap gap-3;
	}

	:global(.doc-link) {
		@apply w-fit text-sm font-semibold text-(--color-primary-soft-blue,#667eea) transition-colors duration-200 hover:text-(--color-primary-soft-blue,#4f5ecc);
	}

	:global(.doc-article) {
		@apply rounded-3xl border border-(--color-primary-soft-blue,#667eea)/15 bg-white/80 p-8 shadow-[0_30px_80px_-40px_rgba(15,34,65,0.25)];
		backdrop-filter: blur(14px);
	}

	:global(.doc-content *) {
		@apply text-(--color-primary-dark,#1a202c);
	}

	:global(.doc-content h1),
	:global(.doc-content h2),
	:global(.doc-content h3),
	:global(.doc-content h4) {
		@apply mt-10 font-semibold text-(--color-primary-dark,#1a202c);
	}

	:global(.doc-content h1) {
		@apply text-3xl;
	}

	:global(.doc-content h2) {
		@apply text-2xl;
	}

	:global(.doc-content h3) {
		@apply text-xl;
	}

	:global(.doc-content h4) {
		@apply text-lg;
	}

	:global(.doc-content p) {
		@apply mt-4 leading-relaxed text-(--color-primary-medium,#4a5568);
	}

	:global(.doc-content ul),
	:global(.doc-content ol) {
		@apply mt-4 ml-6 list-disc space-y-2 text-(--color-primary-medium,#4a5568);
	}

	:global(.doc-content table) {
		@apply mt-6 w-full table-auto overflow-hidden rounded-2xl border border-(--color-primary-soft-blue,#667eea)/15;
	}

	:global(.doc-content thead) {
		@apply bg-(--color-primary-soft-blue,#667eea)/10;
	}

	:global(.doc-content th),
	:global(.doc-content td) {
		@apply border border-(--color-primary-soft-blue,#667eea)/10 px-4 py-3 text-left text-sm;
	}

	:global(.doc-content code) {
		@apply rounded bg-(--color-primary-soft-blue,#667eea)/15 px-1.5 py-0.5 text-sm text-(--color-primary-dark,#1a202c);
		font-family: var(--font-mono, 'JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', monospace);
	}

	:global(.doc-content pre) {
		@apply overflow-auto rounded-2xl border border-(--color-primary-dark,#0f172a)/40 bg-(--color-primary-dark,#0f172a) p-4 text-sm text-white shadow-inner;
		font-family: var(--font-mono, 'JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', monospace);
	}

	:global(.doc-content pre code) {
		@apply bg-transparent px-0 text-white;
		font-family: inherit;
	}

	:global(.hljs) {
		@apply text-white;
	}

	:global(.hljs-comment),
	:global(.hljs-quote) {
		@apply text-slate-300 italic;
	}

	:global(.hljs-keyword),
	:global(.hljs-selector-tag),
	:global(.hljs-literal),
	:global(.hljs-type),
	:global(.hljs-built_in) {
		color: #c4b5fd; /* lavender */
	}

	:global(.hljs-title),
	:global(.hljs-name),
	:global(.hljs-section) {
		color: #38bdf8;
	}

	:global(.hljs-number),
	:global(.hljs-attr),
	:global(.hljs-variable),
	:global(.hljs-template-variable),
	:global(.hljs-attribute) {
		color: #fbbf24;
	}

	:global(.hljs-string),
	:global(.hljs-symbol),
	:global(.hljs-bullet),
	:global(.hljs-doctag) {
		color: #4ade80;
	}

	:global(.hljs-meta),
	:global(.hljs-meta .hljs-string) {
		color: #22d3ee;
	}

	:global(.hljs-addition) {
		@apply bg-emerald-500/10 text-emerald-200;
	}

	:global(.hljs-deletion) {
		@apply bg-rose-500/10 text-rose-300;
	}

	:global(.docs-index) {
		@apply mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 pt-32 pb-16 lg:px-0;
	}

	:global(.docs-header) {
		@apply flex flex-col gap-4;
	}

	:global(.docs-header h1) {
		@apply text-3xl font-semibold md:text-4xl;
	}

	:global(.docs-header p) {
		@apply max-w-2xl text-sm text-(--color-primary-medium,#4a5568) md:text-base;
	}

	:global(.docs-grid) {
		@apply grid gap-6 md:grid-cols-2;
	}

	:global(.docs-card) {
		@apply rounded-3xl border border-(--color-primary-soft-blue,#667eea)/15 bg-white/85 p-6 shadow-[0_28px_70px_-50px_rgba(15,34,65,0.35)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_38px_90px_-40px_rgba(15,34,65,0.35)];
		backdrop-filter: blur(12px);
	}

	:global(.docs-card h2) {
		@apply text-xl font-semibold text-(--color-primary-dark,#1a202c);
	}

	:global(.docs-card p) {
		@apply mt-3 text-sm text-(--color-primary-medium,#4a5568);
	}

	@media (max-width: 768px) {
		:global(.doc-page) {
			@apply px-4 pt-28 pb-12;
		}

		:global(.docs-index) {
			@apply gap-8 px-4 pt-28 pb-14;
		}

		:global(.docs-grid) {
			@apply grid-cols-1;
		}
	}

	.docs-overlay {
		@apply fixed inset-0 z-999 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm;
	}

	.docs-modal {
		@apply w-full max-w-md space-y-5 rounded-3xl border border-white/30 bg-white/95 p-8 text-(--color-primary-dark,#1a202c) shadow-[0_35px_85px_-30px_rgba(15,34,65,0.45)];
		backdrop-filter: blur(16px);
	}

	.docs-modal h2 {
		@apply text-2xl font-semibold;
	}

	.docs-modal-description {
		@apply text-sm text-(--color-primary-medium,#4a5568);
	}

	.docs-label {
		@apply block text-xs font-semibold tracking-[0.3em] text-(--color-primary-medium,#4a5568) uppercase;
	}

	.docs-input {
		@apply mt-2 w-full rounded-2xl border border-(--color-primary-soft-blue,#667eea)/30 bg-white px-4 py-3 text-sm focus:border-(--color-primary-soft-blue,#667eea) focus:ring-2 focus:ring-(--color-primary-soft-blue,#667eea)/40 focus:outline-none;
	}

	.docs-button {
		@apply w-full rounded-2xl bg-(--color-primary-soft-blue,#667eea) px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-(--color-primary-soft-blue,#5263c5);
	}

	.docs-error {
		@apply text-sm text-red-500;
	}

	.docs-blurred {
		@apply pointer-events-none blur-md filter select-none;
	}
</style>
