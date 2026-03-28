<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();

	let sending = $state(false);
	let successMessage = $state('');
	let errorMessage = $state('');

	function getTargetLabel(row: any): string {
		if (row.targetCohortId) return 'Cohort';
		if (row.targetCourseId) return 'Course';
		if (row.targetRole) return `Role: ${row.targetRole}`;
		return 'All Learners';
	}
</script>

<svelte:head>
	<title>Broadcast Message — Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="Broadcast Message" description="Send messages to your students" />

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- Send Message Form -->
		<div>
			<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-6`}>
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-6`}>📢 Kirim Pesan</h3>

				<form
					method="POST"
					action="?/send"
					use:enhance={() => {
						sending = true;
						successMessage = '';
						errorMessage = '';
						return async ({ result }) => {
							sending = false;
							if (result.type === 'success') {
								const data = result.data as any;
								if (data.success) {
									successMessage = data.message;
									window.location.reload();
								} else {
									errorMessage = data.error;
								}
							} else {
								errorMessage = 'Failed to send message';
							}
						};
					}}
					class="space-y-4"
				>
					<div>
						<label
							for="title"
							class={`mb-1.5 block text-xs font-black tracking-widest uppercase ${COLOR.textMuted}`}
						>
							Judul Pesan
						</label>
						<input
							type="text"
							id="title"
							name="title"
							required
							placeholder="Contoh: Pengumuman Important!"
							class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} px-4 py-3 ${TEXT.body} outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
						/>
					</div>

					<div>
						<label
							for="content"
							class={`mb-1.5 block text-xs font-black tracking-widest uppercase ${COLOR.textMuted}`}
						>
							Isi Pesan
						</label>
						<textarea
							id="content"
							name="content"
							required
							rows="5"
							placeholder="Tulis pesan Anda di sini..."
							class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} px-4 py-3 ${TEXT.body} resize-none outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
						></textarea>
					</div>

					<div>
						<label
							for="targetType"
							class={`mb-1.5 block text-xs font-black tracking-widest uppercase ${COLOR.textMuted}`}
						>
							Tipe Penerima
						</label>
						<select
							id="targetType"
							name="targetType"
							class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} px-4 py-3 ${TEXT.body} outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
							onchange={(e) => {
								const form = (e.target as HTMLSelectElement).form;
								if (form) {
									const cohortSelect = form.querySelector('#targetCohortId') as HTMLSelectElement;
									const courseSelect = form.querySelector('#targetCourseId') as HTMLSelectElement;
									const roleSelect = form.querySelector('#targetRole') as HTMLSelectElement;
									const value = (e.target as HTMLSelectElement).value;
									if (cohortSelect)
										cohortSelect.style.display = value === 'cohort' ? 'block' : 'none';
									if (courseSelect)
										courseSelect.style.display = value === 'course' ? 'block' : 'none';
									if (roleSelect) roleSelect.style.display = value === 'role' ? 'block' : 'none';
								}
							}}
						>
							<option value="all">Semua Peserta</option>
							<option value="cohort">Cohort/Batch Tertentu</option>
							<option value="course">Kursus Tertentu</option>
							<option value="role">Berdasarkan Role</option>
						</select>
					</div>

					<div>
						<label
							for="targetCohortId"
							class={`mb-1.5 block text-xs font-black tracking-widest uppercase ${COLOR.textMuted}`}
							style="display:none"
						>
							Pilih Cohort
						</label>
						<select
							id="targetCohortId"
							name="targetCohortId"
							style="display:none"
							class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} px-4 py-3 ${TEXT.body} outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
						>
							<option value="">Pilih Cohort</option>
							{#each data.cohorts as cohort}
								<option value={cohort.id}>{cohort.name} - {cohort.courseName}</option>
							{/each}
						</select>
					</div>

					<div>
						<label
							for="targetCourseId"
							class={`mb-1.5 block text-xs font-black tracking-widest uppercase ${COLOR.textMuted}`}
							style="display:none"
						>
							Pilih Kursus
						</label>
						<select
							id="targetCourseId"
							name="targetCourseId"
							style="display:none"
							class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} px-4 py-3 ${TEXT.body} outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
						>
							<option value="">Pilih Kursus</option>
							{#each data.courses as course}
								<option value={course.id}>{course.title}</option>
							{/each}
						</select>
					</div>

					<div>
						<label
							for="sentVia"
							class={`mb-1.5 block text-xs font-black tracking-widest uppercase ${COLOR.textMuted}`}
						>
							Kirim Via
						</label>
						<select
							id="sentVia"
							name="sentVia"
							class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} px-4 py-3 ${TEXT.body} outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
						>
							<option value="notification">Notifikasi Saja</option>
							<option value="email">Email</option>
							<option value="whatsapp">WhatsApp</option>
							<option value="all">Semua Channel</option>
						</select>
					</div>

					{#if successMessage}
						<div class="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600">
							{successMessage}
						</div>
					{/if}

					{#if errorMessage}
						<div class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
							{errorMessage}
						</div>
					{/if}

					<button
						type="submit"
						disabled={sending}
						class={`w-full ${RADIUS.button} ${COLOR.accentBg} py-3.5 ${TEXT.button} font-bold text-white shadow-lg ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50`}
					>
						{sending ? 'Mengirim...' : 'Kirim Pesan'}
					</button>
				</form>
			</div>
		</div>

		<!-- Recent Broadcasts -->
		<div>
			<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-6`}>
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-6`}>📋 Riwayat Pesan</h3>

				{#if data.broadcasts.length === 0}
					<p class={`${COLOR.textSecondary} py-8 text-center`}>Belum ada pesan yang dikirim.</p>
				{:else}
					<div class="max-h-[600px] space-y-4 overflow-y-auto">
						{#each data.broadcasts as broadcast}
							<div class="border-b border-gray-100 pb-4 last:border-0">
								<div class="mb-2 flex items-start justify-between">
									<h4 class={`font-bold ${COLOR.textPrimary}`}>{broadcast.title}</h4>
									<span class={`text-xs ${COLOR.textMuted}`}>
										{broadcast.recipientCount} penerima
									</span>
								</div>
								<p class={`text-sm ${COLOR.textSecondary} mb-2 line-clamp-2`}>
									{broadcast.content}
								</p>
								<div class="flex items-center gap-3 text-xs">
									<span class={`${COLOR.textMuted}`}>
										{new Date(broadcast.createdAt).toLocaleDateString('id-ID', {
											day: 'numeric',
											month: 'short',
											year: 'numeric',
											hour: '2-digit',
											minute: '2-digit'
										})}
									</span>
									<span class="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">
										{broadcast.sentVia}
									</span>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</PageWrapper>
