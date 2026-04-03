<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { formToast } from '$lib/utils/formEnhance';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	// Parse existing featuresConfig
	let features = $state({ affiliate: false, discussion: true, performance: true });
	$effect(() => {
		if (data.course.featuresConfig) {
			try {
				const parsed = JSON.parse(data.course.featuresConfig) as Record<string, boolean>;
				features = {
					affiliate: parsed.affiliate ?? false,
					discussion: parsed.discussion ?? true,
					performance: parsed.performance ?? true
				};
			} catch {
				// keep defaults
			}
		}
	});

	let visibility = $state(data.course.visibility || 'draft');

	const visibilityOptions = [
		{ value: 'draft', label: 'Draft', desc: 'Hanya terlihat oleh mentor' },
		{ value: 'public', label: 'Public', desc: 'Terlihat oleh semua orang' },
		{ value: 'internal', label: 'Internal', desc: 'Hanya untuk anggota organisasi' },
		{ value: 'invite_only', label: 'Invite Only', desc: 'Hanya dengan undangan' }
	];
</script>

<svelte:head>
	<title>Course Settings - {data.course.title}</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-2xl">
		<div class="mb-6">
			<a
				href="/app/organizations/{data.membership?.orgId}/mentor/courses/{data.course.id}/materials"
				class={`mb-3 inline-flex items-center ${TEXT.small} ${COLOR.accent} font-semibold ${TRANSITION.colors} hover:underline`}
			>
				← Back to Materials
			</a>
			<PageHeader title="Course Settings: {data.course.title}" />
		</div>

		<PageSection>
			<form
				method="post"
				action="?/updateSettings"
				use:enhance={formToast({ success: 'Pengaturan disimpan', error: 'Gagal menyimpan' })}
				class="space-y-8"
			>
				<!-- Visibility -->
				<div>
					<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4`}>Visibility</h3>
					<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{#each visibilityOptions as opt}
							<label
								class={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${TRANSITION.colors} ${
									visibility === opt.value
										? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
										: `${COLOR.cardBorder} ${COLOR.card} hover:border-blue-300`
								}`}
							>
								<input
									type="radio"
									name="visibility"
									value={opt.value}
									bind:group={visibility}
									class="mt-0.5 accent-blue-600"
								/>
								<div>
									<p class={`text-sm font-semibold ${COLOR.textPrimary}`}>{opt.label}</p>
									<p class={`text-xs ${COLOR.textMuted}`}>{opt.desc}</p>
								</div>
							</label>
						{/each}
					</div>
				</div>

				<!-- Features toggles -->
				<div>
					<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4`}>Features</h3>
					<div class="space-y-3">
						{#each [{ key: 'affiliate' as const, label: 'Affiliate Program', desc: 'Izinkan student mempromosikan kursus ini' }, { key: 'discussion' as const, label: 'Discussion Forum', desc: 'Aktifkan forum diskusi per lesson' }, { key: 'performance' as const, label: 'Performance Tracking', desc: 'Tampilkan analytics performa student' }] as feat}
							<label
								class={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${COLOR.card} ${COLOR.cardBorder} ${TRANSITION.colors} hover:border-blue-300`}
							>
								<div>
									<p class={`text-sm font-semibold ${COLOR.textPrimary}`}>{feat.label}</p>
									<p class={`text-xs ${COLOR.textMuted}`}>{feat.desc}</p>
								</div>
								<!-- Toggle switch -->
								<div class="relative">
									<input
										type="checkbox"
										name={feat.key}
										bind:checked={features[feat.key]}
										class="sr-only"
										aria-label={feat.label}
									/>
									<div
										class={`h-6 w-11 rounded-full ${TRANSITION.colors} ${features[feat.key] ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-600'}`}
									></div>
									<div
										class={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow ${TRANSITION.all} ${features[feat.key] ? 'translate-x-5' : 'translate-x-0'}`}
									></div>
								</div>
							</label>
						{/each}
					</div>
				</div>

				<button
					type="submit"
					class={`w-full py-3 ${RADIUS.button} ${COLOR.accentBg} ${COLOR.accentHover} text-sm font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5`}
				>
					Simpan Pengaturan
				</button>
			</form>
		</PageSection>
	</div>
</PageWrapper>
