<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toastStore';
	import { COLOR, RADIUS, TEXT, ELEVATION } from '$lib/config/design';
	import Button from '$lib/components/ui/Button.svelte';

	let { data }: { data: PageData } = $props();

	const GOAL_OPTIONS = [
		{ value: 'career', label: 'Karir Digital', icon: '💼' },
		{ value: 'business', label: 'Bisnis Online', icon: '🚀' },
		{ value: 'skill', label: 'Upgrade Skill', icon: '📚' },
		{ value: 'hobby', label: 'Hobi & Eksplorasi', icon: '🎨' }
	];

	const INTEREST_OPTIONS = [
		{ value: 'creator', label: 'Digital Creator', icon: '🎥' },
		{ value: 'seller', label: 'Marketplace Seller', icon: '🛒' },
		{ value: 'affiliate', label: 'Affiliate Marketer', icon: '🔗' },
		{ value: 'smm', label: 'Social Media Manager', icon: '📱' },
		{ value: 'seo', label: 'SEO Specialist', icon: '🔍' }
	];

	const EXPERIENCE_LEVELS = [
		{ value: 'beginner', label: 'Pemula' },
		{ value: 'intermediate', label: 'Menengah' },
		{ value: 'advanced', label: 'Mahir' }
	];

	const SCHEDULE_OPTIONS = [
		{ value: 'morning', label: 'Pagi', icon: '🌅' },
		{ value: 'afternoon', label: 'Siang', icon: '☀️' },
		{ value: 'evening', label: 'Malam', icon: '🌙' },
		{ value: 'flexible', label: 'Fleksibel', icon: '⏰' }
	];

	const NOTIFICATION_OPTIONS = [
		{ value: 'email', label: 'Email' },
		{ value: 'wa', label: 'WhatsApp' },
		{ value: 'push', label: 'Push Notification' }
	];

	let selectedGoals: string[] = $state(JSON.parse(data.preferences.goals ?? '[]'));
	let selectedInterests: string[] = $state(JSON.parse(data.preferences.interests ?? '[]'));
	let experienceLevel = $state(data.preferences.experienceLevel ?? 'beginner');
	let learningSchedule = $state(data.preferences.learningSchedule ?? 'flexible');
	let selectedNotifications: string[] = $state(
		JSON.parse(data.preferences.notificationPrefs ?? '["email"]')
	);
	let focusMode = $state(data.preferences.focusMode ?? true);

	function toggleArrayItem(arr: string[], item: string): string[] {
		return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
	}
</script>

<svelte:head>
	<title>Preferensi Belajar - Naik Kelas</title>
</svelte:head>

<div class="mx-auto max-w-2xl space-y-8">
	<div>
		<h1 class={`text-2xl font-bold ${COLOR.textPrimary}`}>Preferensi Belajar</h1>
		<p class={`mt-1 text-sm ${COLOR.textMuted}`}>
			Sesuaikan pengalaman belajar kamu agar lebih personal
		</p>
	</div>

	<form
		method="POST"
		action="?/save"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					toast.success('Preferensi berhasil disimpan');
				} else {
					toast.error('Gagal menyimpan preferensi');
				}
			};
		}}
		class="space-y-8"
	>
		<!-- Goals -->
		<div>
			<h2 class={`text-lg font-semibold ${COLOR.textPrimary} mb-3`}>Tujuan Belajar</h2>
			<div class="grid grid-cols-2 gap-3">
				{#each GOAL_OPTIONS as goal}
					<button
						type="button"
						onclick={() => (selectedGoals = toggleArrayItem(selectedGoals, goal.value))}
						class={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${selectedGoals.includes(goal.value) ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : `${COLOR.cardBorder} ${COLOR.card} hover:border-blue-300`}`}
					>
						<span class="text-2xl">{goal.icon}</span>
						<span class={`text-sm font-medium ${COLOR.textPrimary}`}>{goal.label}</span>
					</button>
				{/each}
			</div>
			<input type="hidden" name="goals" value={JSON.stringify(selectedGoals)} />
		</div>

		<!-- Interests -->
		<div>
			<h2 class={`text-lg font-semibold ${COLOR.textPrimary} mb-3`}>Minat Track</h2>
			<div class="grid grid-cols-2 gap-3">
				{#each INTEREST_OPTIONS as interest}
					<button
						type="button"
						onclick={() => (selectedInterests = toggleArrayItem(selectedInterests, interest.value))}
						class={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${selectedInterests.includes(interest.value) ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : `${COLOR.cardBorder} ${COLOR.card} hover:border-blue-300`}`}
					>
						<span class="text-2xl">{interest.icon}</span>
						<span class={`text-sm font-medium ${COLOR.textPrimary}`}>{interest.label}</span>
					</button>
				{/each}
			</div>
			<input type="hidden" name="interests" value={JSON.stringify(selectedInterests)} />
		</div>

		<!-- Experience Level -->
		<div>
			<h2 class={`text-lg font-semibold ${COLOR.textPrimary} mb-3`}>Level Pengalaman</h2>
			<div class="flex gap-3">
				{#each EXPERIENCE_LEVELS as level}
					<button
						type="button"
						onclick={() => (experienceLevel = level.value)}
						class={`flex-1 rounded-xl border-2 px-4 py-3 text-center text-sm font-medium transition-all ${experienceLevel === level.value ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300' : `${COLOR.cardBorder} ${COLOR.card} ${COLOR.textPrimary} hover:border-blue-300`}`}
					>
						{level.label}
					</button>
				{/each}
			</div>
			<input type="hidden" name="experienceLevel" value={experienceLevel} />
		</div>

		<!-- Learning Schedule -->
		<div>
			<h2 class={`text-lg font-semibold ${COLOR.textPrimary} mb-3`}>Waktu Belajar</h2>
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{#each SCHEDULE_OPTIONS as schedule}
					<button
						type="button"
						onclick={() => (learningSchedule = schedule.value)}
						class={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${learningSchedule === schedule.value ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : `${COLOR.cardBorder} ${COLOR.card} hover:border-blue-300`}`}
					>
						<span class="text-2xl">{schedule.icon}</span>
						<span class={`text-sm font-medium ${COLOR.textPrimary}`}>{schedule.label}</span>
					</button>
				{/each}
			</div>
			<input type="hidden" name="learningSchedule" value={learningSchedule} />
		</div>

		<!-- Notification Preferences -->
		<div>
			<h2 class={`text-lg font-semibold ${COLOR.textPrimary} mb-3`}>Notifikasi</h2>
			<div class="flex flex-wrap gap-3">
				{#each NOTIFICATION_OPTIONS as notif}
					<button
						type="button"
						onclick={() =>
							(selectedNotifications = toggleArrayItem(selectedNotifications, notif.value))}
						class={`rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all ${selectedNotifications.includes(notif.value) ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300' : `${COLOR.cardBorder} ${COLOR.card} ${COLOR.textPrimary} hover:border-blue-300`}`}
					>
						{notif.label}
					</button>
				{/each}
			</div>
			<input type="hidden" name="notificationPrefs" value={JSON.stringify(selectedNotifications)} />
		</div>

		<!-- Focus Mode -->
		<div class="flex items-center justify-between">
			<div>
				<h2 class={`text-lg font-semibold ${COLOR.textPrimary}`}>Mode Fokus</h2>
				<p class={`mt-1 text-sm ${COLOR.textMuted}`}>
					Sembunyikan sidebar saat belajar untuk pengalaman yang lebih imersif
				</p>
			</div>
			<button
				type="button"
				onclick={() => (focusMode = !focusMode)}
				aria-label={focusMode ? 'Nonaktifkan mode fokus' : 'Aktifkan mode fokus'}
				aria-pressed={focusMode}
				class={`relative h-6 w-11 rounded-full transition-colors ${focusMode ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-600'}`}
			>
				<span
					class={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${focusMode ? 'translate-x-5' : ''}`}
				></span>
			</button>
			<input type="hidden" name="focusMode" value={focusMode.toString()} />
		</div>

		<!-- Submit -->
		<div class="border-t pt-6">
			<Button type="submit" variant="primary">Simpan Preferensi</Button>
		</div>
	</form>
</div>
