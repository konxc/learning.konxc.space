<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import { fly } from 'svelte/transition';
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

<div class={`${SPACING.page} pb-12`}>
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
				href="/app/explore"
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
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
			<div class="space-y-8">
				<!-- Hero Card -->
				<div
					class={`relative overflow-hidden ${RADIUS.card} ${ELEVATION.base} group border border-zinc-200 bg-zinc-950 dark:border-neutral-800`}
				>
					<!-- Floating Back Button (Integrated into Hero) -->
					<div class="absolute top-6 left-6 z-20" in:fly={{ x: -20, duration: 800, delay: 400 }}>
						<a
							href="/app/explore"
							class={`inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[10px] font-black tracking-widest text-white uppercase no-underline shadow-2xl backdrop-blur-xl transition-all hover:scale-105 hover:bg-black/60 active:scale-95`}
						>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg
							>
							Explore
						</a>
					</div>

					<div class="relative aspect-video w-full overflow-hidden">
						{#if data.course.thumbnailUrl}
							<img
								src={data.course.thumbnailUrl}
								alt={data.course.title}
								class="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
								loading="lazy"
							/>
						{:else}
							<div
								class="flex h-full w-full items-center justify-center bg-linear-to-br from-zinc-900 via-indigo-950 to-neutral-950 text-8xl"
							>
								📚
							</div>
						{/if}
						
						<!-- Premium Gradient Overlay -->
						<div class="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>

						<div
							class="absolute inset-0 flex flex-col justify-end p-6 md:p-10"
						>
							<div class="mb-5 flex flex-wrap gap-2.5">
								<span
									class="flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-600/20 px-3.5 py-1.5 text-[10px] font-black tracking-widest text-blue-100 uppercase backdrop-blur-md"
								>
									<span class="text-blue-400">⏱</span>
									{data.course.duration} Minggu
								</span>
								<span
									class="flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-600/20 px-3.5 py-1.5 text-[10px] font-black tracking-widest text-purple-100 uppercase backdrop-blur-md"
								>
									<span class="text-purple-400">📦</span>
									{data.modules.length} Module
								</span>
							</div>

							<h1
								class="mb-6 max-w-4xl text-3xl leading-[1.05] font-black tracking-tight text-white md:text-5xl lg:text-6xl"
							>
								{data.course.title}
							</h1>

							<div class="flex items-center gap-4">
								<div
									class="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-lg font-black text-white shadow-xl backdrop-blur-md"
								>
									{data.mentor?.username?.[0].toUpperCase() || 'M'}
								</div>
								<div>
									<p
										class="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase"
									>
										Dibimbing oleh
									</p>
									<p class="text-base font-bold text-white tracking-tight">
										{data.mentor?.fullName || data.mentor?.username || 'Mentor Naik Kelas'}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Tabs/Sections -->
				<div class="space-y-16 py-4">
					<!-- About Section -->
					<section class="animate-in fade-in slide-in-from-bottom-6 duration-700">
						<header class="mb-8 flex items-center gap-4">
							<div class={`h-10 w-1.5 rounded-full ${COLOR.accentBg}`}></div>
							<div>
								<h2 class={`${TEXT.h2} ${COLOR.textPrimary} tracking-tight`}>About This Course</h2>
								<div class="mt-1 h-0.5 w-12 rounded-full bg-linear-to-r from-blue-600/20 to-transparent"></div>
							</div>
						</header>
						<p class={`${TEXT.body} ${COLOR.textSecondary} text-lg leading-relaxed max-w-3xl italic font-medium opacity-90`}>
							"{data.course.description}"
						</p>
					</section>

					<!-- Curriculum Section -->
					<section class="animate-in fade-in slide-in-from-bottom-6 delay-100 duration-700">
						<header class="mb-8 flex items-center justify-between">
							<div class="flex items-center gap-4">
								<div class={`h-10 w-1.5 rounded-full bg-purple-600`}></div>
								<div>
									<h2 class={`${TEXT.h2} ${COLOR.textPrimary} tracking-tight`}>Course Curriculum</h2>
									<div class="mt-1 h-0.5 w-12 rounded-full bg-linear-to-r from-purple-600/20 to-transparent"></div>
								</div>
							</div>
							<div class="flex flex-col items-end">
								<span class="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase"
									>{data.modules.length} Modules</span
								>
								<span class="text-xs font-bold text-gray-400"
									>{data.modules.reduce(
										(acc: number, m: any) => acc + m.lessons.length,
										0
									)} Action Items</span
								>
							</div>
						</header>

						<div class="space-y-4">
							{#each data.modules as module, i (module.id)}
								<div
									class={`group overflow-hidden border ${RADIUS.card} ${COLOR.cardBorder} transition-all duration-300 ${expandedModules.has(module.id) ? 'border-blue-500/30 shadow-xl shadow-blue-500/5' : 'hover:border-gray-300'}`}
								>
									<button
										class={`flex w-full items-center justify-between px-6 py-6 ${COLOR.card} text-left transition-colors hover:bg-zinc-50 dark:hover:bg-white/5`}
										onclick={() => toggleModule(module.id)}
									>
										<div class="flex items-center gap-5">
											<span
												class={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-black transition-all ${expandedModules.has(module.id) ? 'bg-blue-600 text-white rotate-12' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 group-hover:scale-110'}`}
												>{i + 1}</span
											>
											<div>
												<h3 class="mb-0.5 leading-none font-black text-gray-900 dark:text-white">{module.title}</h3>
												<p class="text-[10px] font-black tracking-widest text-gray-400 uppercase">{module.lessons.length} Lessons</p>
											</div>
										</div>
										<div class={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${expandedModules.has(module.id) ? 'bg-blue-100 text-blue-600 rotate-180' : 'text-gray-400 group-hover:bg-gray-100'}`}>
											<svg
												class="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fill-rule="evenodd"
													d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
													clip-rule="evenodd"
												/>
											</svg>
										</div>
									</button>
									{#if expandedModules.has(module.id)}
										<div
											class="animate-in slide-in-from-top-4 space-y-1 bg-zinc-50/50 p-3 py-4 duration-500 dark:bg-white/5"
										>
											{#each module.lessons as lesson}
												<div
													class="group flex items-center gap-4 rounded-xl border border-transparent px-8 py-3.5 transition-all hover:border-zinc-200 hover:bg-white hover:shadow-md dark:hover:border-white/10 dark:hover:bg-zinc-900"
												>
													<div
														class="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-xs text-gray-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-zinc-800"
													>
														📖
													</div>
													<span class="text-sm font-bold text-gray-600 group-hover:text-gray-900 dark:text-neutral-400 dark:group-hover:text-white"
														>{lesson.title}</span
													>
													<div class="ml-auto flex items-center gap-2">
														{#if !data.isEnrolled}
															<span class="text-[10px] font-black tracking-widest text-gray-300 uppercase opacity-0 group-hover:opacity-100 transition-opacity">Locked</span>
															<svg
																class="h-4 w-4 text-gray-300"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																stroke-width="2.5"
																><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path
																	d="M7 11V7a5 5 0 0 1 10 0v4"
																/></svg
															>
														{:else}
															<svg class="h-4 w-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
																<polyline points="20 6 9 17 4 12"></polyline>
															</svg>
														{/if}
													</div>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</section>

					<!-- Reviews Section -->
					<section class="animate-in fade-in slide-in-from-bottom-6 delay-200 duration-700">
						<header class="mb-8 flex items-center gap-4">
							<div class={`h-10 w-1.5 rounded-full bg-amber-400`}></div>
							<div>
								<h2 class={`${TEXT.h2} ${COLOR.textPrimary} tracking-tight`}>Student Reviews</h2>
								<div class="mt-1 h-0.5 w-12 rounded-full bg-linear-to-r from-amber-400/20 to-transparent"></div>
							</div>
						</header>

						{#if data.avgRating > 0}
							<div
								class="mb-10 flex items-center gap-6 rounded-3xl border border-zinc-100 bg-white p-6 shadow-xl shadow-zinc-500/5 dark:border-white/5 dark:bg-zinc-900"
							>
								<div class="flex flex-col items-center border-r border-zinc-100 pr-6 dark:border-white/10">
									<span class="text-5xl font-black text-gray-900 dark:text-white leading-none">{data.avgRating.toFixed(1)}</span>
									<span class="mt-2 text-[10px] font-black tracking-widest text-gray-400 uppercase">Average</span>
								</div>
								<div class="flex flex-col">
									<div class="mb-2 flex items-center gap-1.5 text-amber-400">
										{#each Array(5) as _, i}
											<svg
												class={`h-6 w-6 ${i < Math.round(data.avgRating) ? 'fill-current' : 'fill-zinc-200 dark:fill-zinc-700'}`}
												viewBox="0 0 24 24"
												><path
													d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
												/></svg
											>
										{/each}
									</div>
									<span class="text-xs font-bold text-gray-500"
										>Berdasarkan {data.reviews?.length || 0} ulasan mahasiswa terverifikasi</span
									>
								</div>
							</div>
						{:else}
							<div class="mb-10 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50 p-10 text-center dark:border-white/10 dark:bg-white/2">
								<p class="text-sm font-bold text-gray-400 italic">Belum ada ulasan untuk kursus ini. Selesaikan kursus Anda dan jadilah yang pertama memberikan ulasan!</p>
							</div>
						{/if}

						<!-- Write Review Form -->
						{#if data.isEnrolled}
							<form
								action="?/submitReview"
								method="POST"
								class={`mb-12 overflow-hidden rounded-3xl border ${COLOR.cardBorder} ${COLOR.card} p-8 shadow-2xl shadow-zinc-500/5`}
							>
								<h3 class="mb-6 flex items-center gap-2 font-black text-gray-900 dark:text-white">
									<span class="text-xl">✍️</span>
									Tulis Ulasan Anda
								</h3>
								<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div class="space-y-2">
										<label for="rating" class="text-[10px] font-black tracking-widest text-gray-400 uppercase"
											>Rating</label
										>
										<select
											id="rating"
											name="rating"
											required
											class={`w-full appearance-none rounded-xl border ${COLOR.cardBorder} bg-zinc-50 p-4 text-sm font-bold text-gray-700 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:bg-white/5 dark:text-white`}
										>
											<option value="5">⭐⭐⭐⭐⭐ - Sangat Bagus</option>
											<option value="4">⭐⭐⭐⭐ - Bagus</option>
											<option value="3">⭐⭐⭐ - Cukup</option>
											<option value="2">⭐⭐ - Kurang</option>
											<option value="1">⭐ - Sangat Kurang</option>
										</select>
									</div>
									<div class="space-y-2">
										<label for="comment" class="text-[10px] font-black tracking-widest text-gray-400 uppercase"
											>Ulasan</label
										>
										<textarea
											id="comment"
											name="comment"
											rows="1"
											placeholder="Bagaimana pengalaman belajar Anda?"
											class={`w-full resize-none rounded-xl border ${COLOR.cardBorder} bg-zinc-50 p-4 text-sm font-bold text-gray-700 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:bg-white/5 dark:text-white`}
										></textarea>
									</div>
								</div>
								<button
									type="submit"
									class="mt-6 w-full rounded-2xl bg-zinc-900 py-4 text-sm font-black text-white transition-all hover:-translate-y-1 hover:bg-black active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-gray-200"
									>Kirim Ulasan</button
								>
							</form>
						{/if}

						<!-- Review List -->
						{#if data.reviews && data.reviews.length > 0}
							<div class="space-y-6">
								{#each data.reviews as review}
									<div class={`group rounded-3xl border ${COLOR.cardBorder} ${COLOR.card} p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-zinc-500/5`}>
										<div class="mb-4 flex items-center justify-between">
											<div class="flex items-center gap-4">
												<div
													class="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50 font-black text-blue-700 shadow-sm dark:from-blue-900/30 dark:to-indigo-900/30"
												>
													{review.user.fullName?.[0] || review.user.username[0] || '?'}
												</div>
												<div>
													<p class="mb-0.5 text-sm font-black text-gray-900 dark:text-white">
														{review.user.fullName || review.user.username}
													</p>
													<div class="flex items-center gap-1 text-amber-400">
														{#each Array(5) as _, i}
															<svg
																class={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'fill-zinc-200 dark:fill-zinc-700'}`}
																viewBox="0 0 24 24"
																><path
																	d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
																/></svg
															>
														{/each}
													</div>
												</div>
											</div>
											<span class="text-[10px] font-black tracking-widest text-gray-400 uppercase"
												>{new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(review.createdAt))}</span
											>
										</div>
										{#if review.comment}
											<div class="relative rounded-2xl bg-zinc-50/50 p-4 dark:bg-white/2">
												<svg class="absolute -top-2 -left-2 h-6 w-6 text-zinc-200 dark:text-zinc-800" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM5.017 21V18C5.017 16.8954 5.91243 16 7.017 16H10.017C11.1216 16 12.017 16.8954 12.017 18V21C12.017 22.1046 11.1216 23 10.017 23H7.017C5.91243 23 5.017 22.1046 5.017 21ZM12.017 21V18C12.017 16.8954 11.1216 16 10.017 16H7.017C5.91243 16 5.017 16.8954 5.017 18V21C5.017 22.1046 5.91243 23 7.017 23H10.017C11.1216 23 12.017 22.1046 12.017 21ZM19.017 21V18C19.017 16.8954 20.1216 16 21.2262 16H24.2262C25.3308 16 26.2262 16.8954 26.2262 18V21C26.2262 22.1046 25.3308 23 24.2262 23H21.2262C20.1216 23 19.017 22.1046 19.017 21Z" /></svg>
												<p class="text-sm font-medium leading-relaxed text-gray-600 italic dark:text-neutral-400">"{review.comment}"</p>
											</div>
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
					class={`sticky top-24 ${RADIUS.card} ${ELEVATION.card} overflow-hidden border ${COLOR.cardBorder} ${COLOR.card} shadow-2xl shadow-blue-500/5`}
				>
					<div class="p-8">
						<p class="mb-2 text-[10px] font-black tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase">
							Learning Investment
						</p>
						<div class="mb-8 flex items-baseline gap-2">
							<span class="text-4xl font-black tracking-tight text-neutral-900 dark:text-white"
								>Rp {data.course.price.toLocaleString('id-ID')}</span
							>
							<span class="text-[10px] font-black tracking-widest text-gray-400 uppercase italic">One-time payment</span>
						</div>

						<ul class="mb-10 space-y-4">
							{#each ['Lifetime Access', 'Certified Graduate', 'Downloadable Materials', 'Direct Mentor Chat'] as feat}
								<li class="flex items-center gap-3">
									<div class="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:bg-green-500/20">
										<svg
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="4"
											><polyline points="20 6 9 17 4 12"></polyline></svg
										>
									</div>
									<span class="text-sm font-bold text-gray-600 dark:text-neutral-400">{feat}</span>
								</li>
							{/each}
						</ul>

						{#if data.isEnrolled}
							<div class="space-y-4">
								<div
									class="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-bold text-green-700 dark:border-green-900/30 dark:bg-green-950/30 dark:text-green-400"
								>
									<span class="text-lg">✓</span>
									You are enrolled
								</div>
								<a
									href="/app/explore/{data.course.id}/learn"
									class={`group block w-full rounded-2xl bg-linear-to-r from-blue-600 to-indigo-700 py-4.5 text-center font-black text-white no-underline shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]`}
								>
									Continue Learning
									<span class="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
								</a>
							</div>
						{:else}
							<form action="/app/explore/{data.course.id}/enroll" method="POST" class="space-y-8">
								{#if features.tracks}
									<!-- Track Selection -->
									<div class="animate-in fade-in slide-in-from-bottom-2 duration-500">
										<p class="mb-4 text-[10px] font-black tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase">
											Pilih Jalur Specialisasi Kamu
										</p>
										<div class="grid grid-cols-1 gap-3">
											{#each [{ value: 'creator', icon: '🎥', label: 'Konten Kreator', desc: 'Buat konten & bangun audiens' }, { value: 'seller', icon: '🛒', label: 'Seller / Dropshipper', desc: 'Jualan di marketplace' }, { value: 'affiliate', icon: '🔗', label: 'Affiliator', desc: 'Hasilkan komisi dari promosi' }] as track}
												<label
													class={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-all hover:shadow-md active:scale-[0.98] has-checked:border-blue-500 has-checked:bg-blue-50/50 dark:has-checked:bg-blue-900/20 border-zinc-100 dark:border-white/5 hover:border-blue-200`}
												>
													<input
														type="radio"
														name="track"
														value={track.value}
														class="sr-only"
														required
													/>
													<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm ring-1 ring-zinc-200 transition-all group-has-checked:rotate-6 dark:bg-zinc-800 dark:ring-white/10">
														{track.icon}
													</div>
													<div class="min-w-0 flex-1">
														<span class="mb-0.5 block text-sm leading-none font-black text-gray-900 dark:text-white"
															>{track.label}</span
														>
														<span class="block text-[11px] font-medium text-gray-400 leading-tight">{track.desc}</span>
													</div>
													<div class="h-5 w-5 shrink-0 rounded-full border-2 border-zinc-200 transition-all has-checked:border-blue-500 has-checked:bg-blue-500 flex items-center justify-center">
														<div class="h-2 w-2 rounded-full bg-white opacity-0 has-checked:opacity-100"></div>
													</div>
												</label>
											{/each}
										</div>
										<p class="mt-4 text-center text-[10px] font-bold text-gray-400">
											Kamu bisa ganti jalur kapan saja setelah mendaftar.
										</p>
									</div>
								{/if}

								<button
									type="submit"
									class="block w-full cursor-pointer rounded-2xl border-none bg-linear-to-r from-blue-600 to-indigo-700 py-4.5 text-center text-base font-black text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
								>
									{data.course.price === 0 ? 'Daftar Gratis Now →' : 'Daftar Sekarang →'}
								</button>
							</form>
						{/if}
					</div>

					<div class="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 p-6 dark:border-white/5 dark:bg-white/2">
						<div>
							<p
								class="mb-1 text-[10px] leading-none font-black tracking-widest text-gray-400 dark:text-gray-500 uppercase"
							>
								Need help?
							</p>
							<p class="text-sm font-black text-gray-800 dark:text-neutral-200">Chat with Support</p>
						</div>
						<a
							href="https://wa.me/id"
							target="_blank"
							rel="noopener noreferrer"
							title="Chat with Support on WhatsApp"
							aria-label="Chat with Support on WhatsApp"
							class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-lg shadow-green-500/30 transition-all hover:scale-110 active:scale-95"
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
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
