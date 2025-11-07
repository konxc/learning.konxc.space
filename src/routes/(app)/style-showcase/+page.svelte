<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import ThemeTest from '$lib/components/ThemeTest.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import { toast } from '$lib/stores/toast';

	const columns = [
		{ key: 'name', label: 'Name', width: '40%' },
		{ key: 'role', label: 'Role' },
		{ key: 'status', label: 'Status' }
	];
	const rows = [
		{ name: 'Ari Widodo', role: 'Mentor', status: 'Active' },
		{ name: 'Bima Putra', role: 'Siswa', status: 'Invited' },
		{ name: 'Citra Dewi', role: 'Admin', status: 'Active' }
	];
</script>

<svelte:head>
	<title>Style Showcase - Design System Preview</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Style Showcase"
		description="Preview komponen dan design tokens dari sistem design Naik Kelas"
	/>

	<div class="space-y-3">
		<!-- Theme Test Component -->
		<PageSection noCard={true} padding={false}>
			<ThemeTest />
		</PageSection>

		<!-- Glass Morphism -->
		<PageSection noCard={true} padding={false}>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-1.5`}>Glass Morphism</h2>
			<div
				class={`${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} p-3 backdrop-blur-md ${ELEVATION.base} opacity-90`}
			>
				<p class={`${TEXT.body} ${COLOR.textPrimary}`}>
					Ini adalah surface glass dengan blur dan border translucent. Menggunakan backdrop-blur
					untuk efek frosted glass.
				</p>
			</div>
		</PageSection>

		<!-- Buttons -->
		<PageSection noCard={true} padding={false}>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-1.5`}>Buttons</h2>
			<div class="flex flex-wrap items-center gap-3">
				<button
					class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
				>
					Primary
				</button>
				<button
					class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.button} ${COLOR.textPrimary} ${TRANSITION.colors} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
				>
					Secondary
				</button>
				<button
					class={`inline-flex items-center ${RADIUS.button} ${SPACING.button} ${TEXT.button} ${COLOR.textSecondary} ${TRANSITION.colors} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
				>
					Ghost
				</button>
				<button
					disabled
					class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} ${SPACING.button} ${TEXT.button} font-semibold text-white opacity-60 ${TRANSITION.all} cursor-not-allowed focus:outline-none`}
				>
					Disabled
				</button>
			</div>
		</PageSection>

		<!-- Badges -->
		<PageSection noCard={true} padding={false}>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-1.5`}>Badges</h2>
			<div class="flex flex-wrap items-center gap-3">
				<span
					class={`inline-block ${RADIUS.badge} px-3 py-1 ${TEXT.small} font-semibold ${COLOR.successBg}`}
					>Success</span
				>
				<span
					class={`inline-block ${RADIUS.badge} px-3 py-1 ${TEXT.small} font-semibold ${COLOR.warningBg}`}
					>Warning</span
				>
				<span
					class={`inline-block ${RADIUS.badge} px-3 py-1 ${TEXT.small} font-semibold ${COLOR.errorBg}`}
					>Error</span
				>
				<span
					class={`inline-block ${RADIUS.badge} px-3 py-1 ${TEXT.small} font-semibold ${COLOR.infoBg}`}
					>Info</span
				>
				<span
					class={`inline-block ${RADIUS.badge} px-3 py-1 ${TEXT.small} font-semibold ${COLOR.neutral} ${COLOR.textSecondary}`}
					>Neutral</span
				>
			</div>
		</PageSection>

		<!-- Form Elements -->
		<PageSection noCard={true} padding={false}>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-1.5`}>Form Elements</h2>
			<div class="space-y-2.5">
				<div class="flex flex-col gap-2">
					<label
						for="example-input"
						class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
					>
						Input Field
					</label>
					<input
						id="example-input"
						type="text"
						placeholder="Enter text..."
						class={`${RADIUS.input} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.input} ${TEXT.body} ${COLOR.textPrimary} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label
						for="example-textarea"
						class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
					>
						Textarea
					</label>
					<textarea
						id="example-textarea"
						placeholder="Enter text..."
						rows="3"
						class={`${RADIUS.input} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.input} ${TEXT.body} ${COLOR.textPrimary} outline-none ${TRANSITION.all} resize-y focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					></textarea>
				</div>
				<div class="flex flex-col gap-2">
					<label
						for="example-select"
						class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
					>
						Select
					</label>
					<select
						id="example-select"
						class={`${RADIUS.input} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.input} ${TEXT.body} ${COLOR.textPrimary} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					>
						<option value="">Choose an option...</option>
						<option value="1">Option 1</option>
						<option value="2">Option 2</option>
						<option value="3">Option 3</option>
					</select>
				</div>
			</div>
		</PageSection>

		<!-- Table -->
		<PageSection noCard={true} padding={false}>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-1.5`}>Table Component</h2>
			<Table {columns} {rows} />
		</PageSection>

		<!-- Cards -->
		<PageSection noCard={true} padding={false}>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-1.5`}>Cards</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				<div
					class={`${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.base}`}
				>
					<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>Card Title</h3>
					<p class={`${TEXT.body} ${COLOR.textSecondary}`}>
						Ini adalah contoh card dengan elevation dan border radius yang konsisten.
					</p>
				</div>
				<div
					class={`${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.card} ${TRANSITION.all} hover:${ELEVATION.cardHover}`}
				>
					<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>Interactive Card</h3>
					<p class={`${TEXT.body} ${COLOR.textSecondary}`}>
						Card ini memiliki hover effect dengan elevation yang berubah.
					</p>
				</div>
				<div
					class={`${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.base}`}
				>
					<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>Gradient Card</h3>
					<p class={`${TEXT.body} ${COLOR.textSecondary}`}>
						Card dengan gradient background yang halus.
					</p>
				</div>
			</div>
		</PageSection>

		<!-- Typography -->
		<PageSection noCard={true} padding={false}>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-1.5`}>Typography</h2>
			<div class="space-y-2.5">
				<div>
					<h1 class={`${TEXT.h1} ${COLOR.textPrimary} mb-1.5`}>Heading 1</h1>
					<p class={`${TEXT.secondary} ${COLOR.textSecondary}`}>
						Font size dari design token TEXT.h1
					</p>
				</div>
				<div>
					<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-2`}>Heading 2</h2>
					<p class={`${TEXT.secondary} ${COLOR.textSecondary}`}>
						Font size dari design token TEXT.h2
					</p>
				</div>
				<div>
					<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>Heading 3</h3>
					<p class={`${TEXT.secondary} ${COLOR.textSecondary}`}>
						Font size dari design token TEXT.h3
					</p>
				</div>
				<div>
					<p class={`${TEXT.body} ${COLOR.textPrimary} mb-2`}>Body Text</p>
					<p class={`${TEXT.secondary} ${COLOR.textSecondary}`}>
						Font size dari design token TEXT.body
					</p>
				</div>
				<div>
					<p class={`${TEXT.small} ${COLOR.textPrimary} mb-2`}>Small Text</p>
					<p class={`${TEXT.secondary} ${COLOR.textSecondary}`}>
						Font size dari design token TEXT.small
					</p>
				</div>
			</div>
		</PageSection>

		<!-- Alerts / Messages -->
		<PageSection noCard={true} padding={false}>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-1.5`}>Alerts & Messages</h2>
			<div class="space-y-2.5">
				<div
					class={`${RADIUS.button} ${SPACING.cardPadding} ${COLOR.success} ${ELEVATION.base}`}
					role="alert"
				>
					<span class="font-semibold">✓ Success:</span> Operasi berhasil dilakukan!
				</div>
				<div
					class={`${RADIUS.button} ${SPACING.cardPadding} ${COLOR.warning} ${ELEVATION.base}`}
					role="alert"
				>
					<span class="font-semibold">⚠ Warning:</span> Perhatian! Ada sesuatu yang perlu diperhatikan.
				</div>
				<div
					class={`${RADIUS.button} ${SPACING.cardPadding} ${COLOR.error} ${ELEVATION.base}`}
					role="alert"
				>
					<span class="font-semibold">✗ Error:</span> Terjadi kesalahan saat memproses permintaan.
				</div>
				<div
					class={`${RADIUS.button} ${SPACING.cardPadding} ${COLOR.info} ${ELEVATION.base}`}
					role="alert"
				>
					<span class="font-semibold">ℹ Info:</span> Informasi penting untuk pengguna.
				</div>
			</div>
		</PageSection>

		<!-- Toast Testing -->
		<PageSection noCard={true} padding={false}>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-1.5`}>Toast Notifications</h2>
			<p class={`${TEXT.body} ${COLOR.textSecondary} mb-4`}>
				Test toast notifications yang muncul di pojok kanan bawah
			</p>
			<div class="flex flex-wrap items-center gap-3">
				<button
					type="button"
					onclick={() => toast.success('Ini adalah pesan sukses!')}
					class={`inline-flex items-center ${RADIUS.button} ${COLOR.successBg} ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:opacity-90 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
				>
					✓ Test Success Toast
				</button>
				<button
					type="button"
					onclick={() => toast.error('Ini adalah pesan error!')}
					class={`inline-flex items-center ${RADIUS.button} ${COLOR.errorBg} ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:opacity-90 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
				>
					✗ Test Error Toast
				</button>
				<button
					type="button"
					onclick={() => toast.info('Ini adalah pesan informasi!')}
					class={`inline-flex items-center ${RADIUS.button} ${COLOR.infoBg} ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:opacity-90 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
				>
					ℹ Test Info Toast
				</button>
			</div>
		</PageSection>

		<!-- Design Tokens Reference -->
		<PageSection noCard={true} padding={false}>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-1.5`}>Design Tokens Reference</h2>
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
				<div>
					<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-1.5`}>Colors</h3>
					<div class={`${RADIUS.small} ${SPACING.input} ${COLOR.cardBorder} ${COLOR.neutral}`}>
						<code class={`${TEXT.small} ${COLOR.textPrimary} font-mono`}>COLOR.card</code>
					</div>
					<div class={`${RADIUS.small} ${SPACING.input} ${COLOR.accentBg} mt-2`}>
						<code class={`${TEXT.small} font-mono font-semibold text-white`}>COLOR.accentBg</code>
					</div>
					<div class={`${RADIUS.small} ${SPACING.input} ${COLOR.successBg} mt-2`}>
						<code class={`${TEXT.small} font-mono font-semibold text-white`}>COLOR.successBg</code>
					</div>
				</div>
				<div>
					<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-1.5`}>Radius</h3>
					<div class="space-y-2">
						<div class={`${RADIUS.card} ${SPACING.input} ${COLOR.cardBorder} ${COLOR.card} border`}>
							<code class={`${TEXT.small} ${COLOR.textPrimary} font-mono`}>RADIUS.card</code>
						</div>
						<div
							class={`${RADIUS.button} ${SPACING.input} ${COLOR.cardBorder} ${COLOR.card} border`}
						>
							<code class={`${TEXT.small} ${COLOR.textPrimary} font-mono`}>RADIUS.button</code>
						</div>
						<div
							class={`${RADIUS.badge} ${SPACING.input} ${COLOR.cardBorder} ${COLOR.card} border`}
						>
							<code class={`${TEXT.small} ${COLOR.textPrimary} font-mono`}>RADIUS.badge</code>
						</div>
					</div>
				</div>
				<div>
					<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-1.5`}>Spacing</h3>
					<div class="space-y-2">
						<div class={`${SPACING.cardPadding} ${COLOR.cardBorder} ${COLOR.card} rounded border`}>
							<code class={`${TEXT.small} ${COLOR.textPrimary} font-mono`}>SPACING.cardPadding</code
							>
						</div>
						<div class={`${SPACING.button} ${COLOR.cardBorder} ${COLOR.card} rounded border`}>
							<code class={`${TEXT.small} ${COLOR.textPrimary} font-mono`}>SPACING.button</code>
						</div>
						<div class={`${SPACING.input} ${COLOR.cardBorder} ${COLOR.card} rounded border`}>
							<code class={`${TEXT.small} ${COLOR.textPrimary} font-mono`}>SPACING.input</code>
						</div>
					</div>
				</div>
			</div>
		</PageSection>
	</div>
</PageWrapper>
