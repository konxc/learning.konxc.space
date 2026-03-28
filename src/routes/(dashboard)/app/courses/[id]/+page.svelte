<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	let { data }: { data: PageData } = $props();
	let expandedModules = $state<Set<string>>(new Set([data.modules?.[0]?.id || '']));

	const features = $derived(
		data.features || { tracks: false, affiliate: false, performance: false }
	);

	function toggleModule(moduleId: string) {
		const newSet = new Set(expandedModules);
		if (newSet.has(moduleId)) {
			newSet.delete(moduleId);
		} else {
			newSet.add(moduleId);
		}
		expandedModules = newSet;
	}
</script>

<svelte:head>
	<title>{data.course?.title || 'Detail Kursus'} - Naik Kelas</title>
</svelte:head>

<div class={`${SPACING.page} mt-6 pb-12`}>
	{#if !data.course}
		<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
			<div class="mb-6 rounded-full bg-red-50 p-4 text-red-500">
				<svg
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line
						x1="12"
						y1="16"
						x2="12.01"
						y2="16"
					/></svg
				>
			</div>
			<h1 class={`${TEXT.h1} ${COLOR.textPrimary} mb-4`}>Kursus Tidak Ditemukan</h1>
			<p class={`${COLOR.textSecondary} mx-auto mb-8 max-w-md`}>
				Maaf, kursus yang Anda cari tidak tersedia atau mungkin telah dihapus dari sistem kami.
			</p>
			<a
				href="/app/courses"
				class={`inline-flex items-center gap-2 no-underline ${RADIUS.button} ${COLOR.accentBg} px-8 py-3.5 text-white ${TEXT.button} font-bold ${TRANSITION.all} ${ELEVATION.base} hover:-translate-y-0.5 hover:shadow-lg`}
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg
				>
				Kembali Cari Kursus
			</a>
		</div>
	{:else}
		<div class="mb-6">
			<a
				href="/app/courses"
				class={`inline-flex items-center gap-2 text-xs font-bold tracking-widest text-blue-600 uppercase no-underline hover:text-blue-700 ${TRANSITION.colors}`}
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg
				>
				Jelajahi Kursus
			</a>
		</div>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
			<div class="space-y-8">
				<!-- Hero Card -->
				<div
					class={`relative overflow-hidden ${RADIUS.card} ${ELEVATION.base} border border-neutral-800 bg-neutral-900`}
				>
					<div class="group relative aspect-video w-full">
						{#if data.course.thumbnailUrl}
							<img
								src={data.course.thumbnailUrl}
								alt={data.course.title}
								class="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
								loading="lazy"
							/>
						{:else}
							<div
								class="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-900 via-indigo-950 to-neutral-950"
							>
								<span class="text-8xl opacity-40">📚</span>
							</div>
						{/if}
						<div
							class="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-neutral-950 via-neutral-950/40 to-transparent p-6 md:p-10"
						>
							<div class="mb-4 flex flex-wrap gap-2">
								<span
									class="rounded-full border border-blue-400/30 bg-blue-600/30 px-3 py-1 text-[10px] font-bold tracking-widest text-blue-100 uppercase backdrop-blur-md"
									>{data.course.duration} Minggu</span
								>
								<span
									class="rounded-full border border-purple-400/30 bg-purple-600/30 px-3 py-1 text-[10px] font-bold tracking-widest text-purple-100 uppercase backdrop-blur-md"
									>{data.modules.length} Modul</span
								>
							</div>
							<h1
								class="mb-4 max-w-2xl text-3xl leading-tight font-black tracking-tight text-white md:text-5xl"
							>
								{data.course.title}
							</h1>
							<div class="flex items-center gap-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/20 font-bold text-white backdrop-blur-sm"
								>
									{data.mentor?.username?.[0].toUpperCase() || 'M'}
								</div>
								<div>
									<p
										class="spacing-widest text-[10px] leading-none font-black text-white/50 uppercase"
									>
										Dibimbing oleh
									</p>
									<p class="text-sm font-bold text-white">
										{data.mentor?.fullName || data.mentor?.username || 'Mentor Naik Kelas'}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Tabs/Sections -->
				<div class="space-y-12">
					<!-- About Section -->
					<section class="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<header class="mb-6 flex items-center gap-3">
							<div class="h-8 w-1 rounded-full bg-blue-600"></div>
							<h2 class={`${TEXT.h2} ${COLOR.textPrimary}`}>About This Course</h2>
						</header>
						<p class={`${TEXT.body} ${COLOR.textSecondary} text-lg leading-relaxed`}>
							{data.course.description}
						</p>
					</section>

					<!-- Curriculum Section -->
					<section class="animate-in fade-in slide-in-from-bottom-4 delay-100 duration-500">
						<header class="mb-6 flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div class="h-8 w-1 rounded-full bg-purple-600"></div>
								<h2 class={`${TEXT.h2} ${COLOR.textPrimary}`}>Course Curriculum</h2>
							</div>
							<span class="text-xs font-bold tracking-widest text-gray-400 uppercase"
								>{data.modules.length} Modules • {data.modules.reduce(
									(acc: number, m: any) => acc + m.lessons.length,
									0
								)} Lessons</span
							>
						</header>

						<div class="space-y-3">
							{#each data.modules as module, i (module.id)}
								<div
									class={`overflow-hidden border ${RADIUS.card} ${COLOR.cardBorder} transition-all duration-300 ${expandedModules.has(module.id) ? 'border-blue-500/20 shadow-lg' : 'hover:border-gray-300'}`}
								>
									<button
										class={`flex w-full items-center justify-between px-6 py-5 ${COLOR.card} text-left transition-colors hover:bg-gray-50`}
										onclick={() => toggleModule(module.id)}
									>
										<div class="flex items-center gap-4">
											<span
												class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600"
												>{i + 1}</span
											>
											<div>
												<h3 class="mb-1 leading-none font-bold text-gray-900">{module.title}</h3>
												<p class="text-xs text-gray-400">{module.lessons.length} Lessons</p>
											</div>
										</div>
										<svg
											class={`h-5 w-5 ${COLOR.textMuted} transition-transform duration-300 ${expandedModules.has(module.id) ? 'rotate-180' : ''}`}
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
												clip-rule="evenodd"
											/>
										</svg>
									</button>
									{#if expandedModules.has(module.id)}
										<div
											class="animate-in slide-in-from-top-2 space-y-1 bg-gray-50/50 p-2 duration-300"
										>
											{#each module.lessons as lesson}
												<div
													class="group flex items-center gap-3 rounded-lg border border-transparent px-8 py-3 transition-all hover:border-gray-200 hover:bg-white hover:shadow-sm"
												>
													<div
														class="h-1.5 w-1.5 rounded-full bg-gray-300 transition-colors group-hover:bg-blue-500"
													></div>
													<span class="text-sm font-medium text-gray-600 group-hover:text-gray-900"
														>{lesson.title}</span
													>
													{#if !data.isEnrolled}
														<svg
															class="ml-auto h-4 w-4 text-gray-300"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="2"
															><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path
																d="M7 11V7a5 5 0 0 1 10 0v4"
															/></svg
														>
													{/if}
												</div>
											{/each}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</section>

					<!-- Reviews Section -->
					<section class="animate-in fade-in slide-in-from-bottom-4 delay-200 duration-500">
						<header class="mb-6 flex items-center gap-3">
							<div class="h-8 w-1 rounded-full bg-yellow-400"></div>
							<h2 class={`${TEXT.h2} ${COLOR.textPrimary}`}>Student Reviews</h2>
						</header>

						{#if data.avgRating > 0}
							<div
								class="mb-6 flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
							>
								<span class="text-4xl font-black text-gray-900">{data.avgRating.toFixed(1)}</span>
								<div class="flex flex-col">
									<div class="mb-1 flex items-center gap-1 text-yellow-400">
										{#each Array(5) as _, i}
											<svg
												class={`h-5 w-5 ${i < Math.round(data.avgRating) ? 'fill-current text-yellow-400' : 'fill-current text-gray-200'}`}
												viewBox="0 0 24 24"
												><path
													d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
												/></svg
											>
										{/each}
									</div>
									<span class="text-xs font-medium text-gray-500"
										>Berdasarkan {data.reviews?.length || 0} ulasan</span
									>
								</div>
							</div>
						{:else}
							<p class="mb-6 text-gray-500 italic">Belum ada ulasan untuk kursus ini.</p>
						{/if}

						<!-- Write Review Form -->
						{#if data.isEnrolled}
							<form
								action="?/submitReview"
								method="POST"
								class="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6"
							>
								<h3 class="mb-4 font-bold text-gray-900">Tulis Ulasan Anda</h3>
								<div class="mb-4">
									<label for="rating" class="mb-2 block text-sm font-bold text-gray-700"
										>Rating</label
									>
									<select
										id="rating"
										name="rating"
										required
										class="w-full rounded-lg border border-gray-300 bg-white p-3"
									>
										<option value="5">5 Bintang - Sangat Bagus</option>
										<option value="4">4 Bintang - Bagus</option>
										<option value="3">3 Bintang - Cukup</option>
										<option value="2">2 Bintang - Kurang</option>
										<option value="1">1 Bintang - Sangat Kurang</option>
									</select>
								</div>
								<div class="mb-4">
									<label for="comment" class="mb-2 block text-sm font-bold text-gray-700"
										>Ulasan</label
									>
									<textarea
										id="comment"
										name="comment"
										rows="3"
										placeholder="Ceritakan pengalaman Anda..."
										class="w-full resize-none rounded-lg border border-gray-300 p-3"
									></textarea>
								</div>
								<button
									type="submit"
									class="rounded-lg bg-blue-600 px-6 py-2 font-bold text-white transition hover:bg-blue-700"
									>Kirim Ulasan</button
								>
							</form>
						{/if}

						<!-- Review List -->
						{#if data.reviews && data.reviews.length > 0}
							<div class="space-y-4">
								{#each data.reviews as review}
									<div class="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
										<div class="mb-3 flex items-center gap-3">
											<div
												class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700"
											>
												{review.user.fullName?.[0] || review.user.username[0] || '?'}
											</div>
											<div>
												<p class="mb-1 text-sm leading-none font-bold text-gray-900">
													{review.user.fullName || review.user.username}
												</p>
												<div class="flex items-center gap-1">
													{#each Array(5) as _, i}
														<svg
															class={`h-3 w-3 ${i < review.rating ? 'fill-current text-yellow-400' : 'fill-current text-gray-200'}`}
															viewBox="0 0 24 24"
															><path
																d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
															/></svg
														>
													{/each}
												</div>
											</div>
											<span class="ml-auto text-xs text-gray-400"
												>{new Date(review.createdAt).toLocaleDateString('id-ID')}</span
											>
										</div>
										{#if review.comment}
											<p class="text-sm text-gray-600 italic">"{review.comment}"</p>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					</section>
				</div>
			</div>

			<!-- Sidebar Sticky Card -->
			<div class="relative">
				<div
					class={`sticky top-24 ${RADIUS.card} ${ELEVATION.card} overflow-hidden border ${COLOR.cardBorder} ${COLOR.card}`}
				>
					<div class="p-8">
						<p class="mb-2 text-[10px] font-black tracking-widest text-gray-400 uppercase">
							Learning Investment
						</p>
						<div class="mb-8 flex items-baseline gap-2">
							<span class="text-3xl font-black tracking-tight text-gray-900"
								>Rp {data.course.price.toLocaleString('id-ID')}</span
							>
							<span class="text-xs font-medium text-gray-400 italic">One-time payment</span>
						</div>

						<ul class="mb-10 space-y-4">
							{#each ['Lifetime Access', 'Certified Graduate', 'Downloadable Materials', 'Direct Mentor Chat'] as feat}
								<li class="flex items-center gap-3">
									<div class="rounded-full bg-green-100 p-1">
										<svg
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="4"
											class="text-green-600"><polyline points="20 6 9 17 4 12"></polyline></svg
										>
									</div>
									<span class="text-sm font-medium text-gray-600">{feat}</span>
								</li>
							{/each}
						</ul>

						{#if data.isEnrolled}
							<div class="space-y-3">
								<div
									class="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4 text-center text-sm font-bold text-blue-700"
								>
									✓ You are enrolled
								</div>
								<a
									href="/app/courses/{data.course.id}/learn"
									class={`block w-full rounded-2xl bg-linear-to-r from-blue-600 to-indigo-700 py-4 text-center font-black text-white no-underline shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-xl`}
								>
									Continue Learning
								</a>
							</div>
						{:else}
							<form action="/app/courses/{data.course.id}/enroll" method="POST" class="space-y-6">
								{#if features.tracks}
									<!-- Track Selection -->
									<div class="animate-in fade-in slide-in-from-bottom-2 duration-500">
										<p class="mb-3 text-[10px] font-black tracking-widest text-gray-400 uppercase">
											Pilih Jalur Specialisasi Kamu
										</p>
										<div class="grid grid-cols-1 gap-2">
											{#each [{ value: 'creator', icon: '🎥', label: 'Konten Kreator', desc: 'Buat konten & bangun audiens' }, { value: 'seller', icon: '🛒', label: 'Seller / Dropshipper', desc: 'Jualan di marketplace' }, { value: 'affiliate', icon: '🔗', label: 'Affiliator', desc: 'Hasilkan komisi dari promosi' }] as track}
												<label
													class="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-gray-100 p-3.5 transition-all hover:border-blue-300 hover:bg-blue-50/50 has-checked:border-blue-500 has-checked:bg-blue-50 has-checked:shadow-sm"
												>
													<input
														type="radio"
														name="track"
														value={track.value}
														class="h-4 w-4 shrink-0 accent-blue-600"
														required
													/>
													<span class="text-xl leading-none">{track.icon}</span>
													<span class="min-w-0 flex-1">
														<span class="mb-0.5 block text-sm leading-none font-bold text-gray-800"
															>{track.label}</span
														>
														<span class="block text-[11px] text-gray-400">{track.desc}</span>
													</span>
												</label>
											{/each}
										</div>
										<p class="mt-3 text-center text-[10px] font-medium text-gray-400">
											Kamu bisa ganti jalur kapan saja setelah mendaftar.
										</p>
									</div>
								{/if}

								<button
									type="submit"
									class="block w-full cursor-pointer rounded-2xl border-none bg-linear-to-r from-blue-600 to-indigo-700 py-4 text-center text-base font-black text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95"
								>
									{data.course.price === 0 ? 'Daftar Gratis Now →' : 'Daftar Sekarang →'}
								</button>
							</form>
						{/if}
					</div>

					<div class="flex items-center justify-between border-t border-gray-100 bg-gray-50 p-6">
						<div>
							<p
								class="mb-1 text-[10px] leading-none font-bold tracking-widest text-gray-400 uppercase"
							>
								Need help?
							</p>
							<p class="text-sm font-bold text-gray-700">Chat with Support</p>
						</div>
						<a
							href="https://wa.me/id"
							title="Chat with Support on WhatsApp"
							aria-label="Chat with Support on WhatsApp"
							class="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-white shadow-lg shadow-green-500/30 transition-transform hover:scale-110"
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								><path
									d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"
								></path></svg
							>
						</a>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
