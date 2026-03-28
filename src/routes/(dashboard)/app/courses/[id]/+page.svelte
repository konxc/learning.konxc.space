<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	let { data }: { data: PageData } = $props();
	let expandedModules = $state<Set<string>>(new Set([data.modules?.[0]?.id || '']));

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
		<div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
			<div class="bg-red-50 text-red-500 p-4 rounded-full mb-6">
				<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
			</div>
			<h1 class={`${TEXT.h1} ${COLOR.textPrimary} mb-4`}>Kursus Tidak Ditemukan</h1>
			<p class={`${COLOR.textSecondary} mb-8 max-w-md mx-auto`}>
				Maaf, kursus yang Anda cari tidak tersedia atau mungkin telah dihapus dari sistem kami.
			</p>
			<a
				href="/app/courses"
				class={`inline-flex items-center gap-2 no-underline ${RADIUS.button} ${COLOR.accentBg} text-white px-8 py-3.5 ${TEXT.button} font-bold ${TRANSITION.all} ${ELEVATION.base} hover:-translate-y-0.5 hover:shadow-lg`}
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
				Kembali Cari Kursus
			</a>
		</div>
	{:else}
		<div class="mb-6">
			<a
				href="/app/courses"
				class={`inline-flex items-center gap-2 text-xs font-bold tracking-widest text-blue-600 uppercase no-underline hover:text-blue-700 ${TRANSITION.colors}`}
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
				Jelajahi Kursus
			</a>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
			<div class="space-y-8">
				<!-- Hero Card -->
				<div class={`relative overflow-hidden ${RADIUS.card} ${ELEVATION.base} bg-neutral-900 border border-neutral-800`}>
					<div class="aspect-video w-full relative group">
						{#if data.course.thumbnailUrl}
							<img
								src={data.course.thumbnailUrl}
								alt={data.course.title}
								class="h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
								loading="lazy"
							/>
						{:else}
							<div class="h-full w-full bg-linear-to-br from-blue-900 via-indigo-950 to-neutral-950 flex items-center justify-center">
								<span class="text-8xl opacity-40">📚</span>
							</div>
						{/if}
						<div class="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/40 to-transparent p-6 md:p-10 flex flex-col justify-end">
							<div class="mb-4 flex flex-wrap gap-2">
								<span class="bg-blue-600/30 backdrop-blur-md border border-blue-400/30 text-blue-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{data.course.duration} Minggu</span>
								<span class="bg-purple-600/30 backdrop-blur-md border border-purple-400/30 text-purple-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{data.modules.length} Modul</span>
							</div>
							<h1 class="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-2xl mb-4">
								{data.course.title}
							</h1>
							<div class="flex items-center gap-3">
								<div class="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white border border-white/20 backdrop-blur-sm">
									{data.mentor?.username?.[0].toUpperCase() || 'M'}
								</div>
								<div>
									<p class="text-[10px] text-white/50 uppercase font-black spacing-widest leading-none">Dibimbing oleh</p>
									<p class="text-sm text-white font-bold">{data.mentor?.fullName || data.mentor?.username || 'Mentor Naik Kelas'}</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Tabs/Sections -->
				<div class="space-y-12">
					<!-- About Section -->
					<section class="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<header class="flex items-center gap-3 mb-6">
							<div class="h-8 w-1 bg-blue-600 rounded-full"></div>
							<h2 class={`${TEXT.h2} ${COLOR.textPrimary}`}>About This Course</h2>
						</header>
						<p class={`${TEXT.body} ${COLOR.textSecondary} leading-relaxed text-lg`}>
							{data.course.description}
						</p>
					</section>

					<!-- Curriculum Section -->
					<section class="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
						<header class="flex items-center justify-between mb-6">
							<div class="flex items-center gap-3">
								<div class="h-8 w-1 bg-purple-600 rounded-full"></div>
								<h2 class={`${TEXT.h2} ${COLOR.textPrimary}`}>Course Curriculum</h2>
							</div>
							<span class="text-xs font-bold text-gray-400 uppercase tracking-widest">{data.modules.length} Modules • {data.modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0)} Lessons</span>
						</header>

						<div class="space-y-3">
							{#each data.modules as module, i (module.id)}
								<div class={`overflow-hidden border ${RADIUS.card} ${COLOR.cardBorder} transition-all duration-300 ${expandedModules.has(module.id) ? 'shadow-lg border-blue-500/20' : 'hover:border-gray-300'}`}>
									<button
										class={`flex w-full items-center justify-between px-6 py-5 ${COLOR.card} transition-colors hover:bg-gray-50 text-left`}
										onclick={() => toggleModule(module.id)}
									>
										<div class="flex items-center gap-4">
											<span class="flex items-center justify-center h-8 w-8 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">{i + 1}</span>
											<div>
												<h3 class="font-bold text-gray-900 leading-none mb-1">{module.title}</h3>
												<p class="text-xs text-gray-400">{module.lessons.length} Lessons</p>
											</div>
										</div>
										<svg class={`h-5 w-5 ${COLOR.textMuted} transition-transform duration-300 ${expandedModules.has(module.id) ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
											<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
										</svg>
									</button>
									{#if expandedModules.has(module.id)}
										<div class="bg-gray-50/50 p-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
											{#each module.lessons as lesson}
												<div class="flex items-center gap-3 px-8 py-3 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-200 group">
													<div class="h-1.5 w-1.5 rounded-full bg-gray-300 group-hover:bg-blue-500 transition-colors"></div>
													<span class="text-sm font-medium text-gray-600 group-hover:text-gray-900">{lesson.title}</span>
													{#if !data.isEnrolled}
														<svg class="ml-auto h-4 w-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
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
					<section class="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
						<header class="flex items-center gap-3 mb-6">
							<div class="h-8 w-1 bg-yellow-400 rounded-full"></div>
							<h2 class={`${TEXT.h2} ${COLOR.textPrimary}`}>Student Reviews</h2>
						</header>

                        {#if data.avgRating > 0}
                            <div class="flex items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <span class="text-4xl font-black text-gray-900">{data.avgRating.toFixed(1)}</span>
                                <div class="flex flex-col">
                                    <div class="flex items-center gap-1 text-yellow-400 mb-1">
                                        {#each Array(5) as _, i}
                                            <svg class={`w-5 h-5 ${i < Math.round(data.avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                        {/each}
                                    </div>
                                    <span class="text-xs text-gray-500 font-medium">Berdasarkan {data.reviews?.length || 0} ulasan</span>
                                </div>
                            </div>
                        {:else}
                            <p class="text-gray-500 italic mb-6">Belum ada ulasan untuk kursus ini.</p>
                        {/if}

                        <!-- Write Review Form -->
                        {#if data.isEnrolled}
                            <form action="?/submitReview" method="POST" class="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                                <h3 class="font-bold text-gray-900 mb-4">Tulis Ulasan Anda</h3>
                                <div class="mb-4">
                                    <label class="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                                    <select name="rating" required class="w-full p-3 rounded-lg border border-gray-300 bg-white">
                                        <option value="5">5 Bintang - Sangat Bagus</option>
                                        <option value="4">4 Bintang - Bagus</option>
                                        <option value="3">3 Bintang - Cukup</option>
                                        <option value="2">2 Bintang - Kurang</option>
                                        <option value="1">1 Bintang - Sangat Kurang</option>
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label class="block text-sm font-bold text-gray-700 mb-2">Ulasan</label>
                                    <textarea name="comment" rows="3" placeholder="Ceritakan pengalaman Anda..." class="w-full p-3 rounded-lg border border-gray-300 resize-none"></textarea>
                                </div>
                                <button type="submit" class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">Kirim Ulasan</button>
                            </form>
                        {/if}

                        <!-- Review List -->
                        {#if data.reviews && data.reviews.length > 0}
                            <div class="space-y-4">
                                {#each data.reviews as review}
                                    <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-sm">
                                        <div class="flex items-center gap-3 mb-3">
                                            <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                                {review.user.fullName?.[0] || review.user.username[0] || '?'}
                                            </div>
                                            <div>
                                                <p class="font-bold text-gray-900 text-sm leading-none mb-1">{review.user.fullName || review.user.username}</p>
                                                <div class="flex items-center gap-1">
                                                    {#each Array(5) as _, i}
                                                        <svg class={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                                    {/each}
                                                </div>
                                            </div>
                                            <span class="ml-auto text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('id-ID')}</span>
                                        </div>
                                        {#if review.comment}
                                            <p class="text-gray-600 text-sm italic">"{review.comment}"</p>
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
				<div class={`sticky top-24 ${RADIUS.card} ${ELEVATION.card} overflow-hidden border ${COLOR.cardBorder} ${COLOR.card}`}>
					<div class="p-8">
						<p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Learning Investment</p>
						<div class="flex items-baseline gap-2 mb-8">
							<span class="text-3xl font-black text-gray-900 tracking-tight">Rp {data.course.price.toLocaleString('id-ID')}</span>
							<span class="text-xs text-gray-400 font-medium italic">One-time payment</span>
						</div>

						<ul class="space-y-4 mb-10">
							{#each ['Lifetime Access', 'Certified Graduate', 'Downloadable Materials', 'Direct Mentor Chat'] as feat}
								<li class="flex items-center gap-3">
									<div class="bg-green-100 rounded-full p-1">
										<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" class="text-green-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
									</div>
									<span class="text-sm font-medium text-gray-600">{feat}</span>
								</li>
							{/each}
						</ul>

						{#if data.isEnrolled}
							<div class="space-y-3">
								<div class="bg-blue-50 text-blue-700 text-center py-4 px-4 rounded-2xl text-sm font-bold border border-blue-100">
									✓ You are enrolled
								</div>
								<a
									href="/app/courses/{data.course.id}/learn"
									class={`block w-full text-center py-4 bg-linear-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-1 transition-all no-underline`}
								>
									Continue Learning
								</a>
							</div>
						{:else}
				<form action="/app/courses/{data.course.id}/enroll" method="POST" class="space-y-5">
					<!-- Track Selection -->
					<div>
						<p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Pilih Jalur Specialisasi Kamu</p>
						<div class="grid grid-cols-1 gap-2">
							{#each [
								{ value: 'creator', icon: '🎥', label: 'Konten Kreator', desc: 'Buat konten & bangun audiens' },
								{ value: 'seller', icon: '🛒', label: 'Seller / Dropshipper', desc: 'Jualan di marketplace' },
								{ value: 'affiliate', icon: '🔗', label: 'Affiliator', desc: 'Hasilkan komisi dari promosi' }
							] as track}
								<label class="flex items-center gap-3 cursor-pointer rounded-xl border-2 border-gray-100 p-3.5 transition-all hover:border-blue-300 hover:bg-blue-50/50 has-checked:border-blue-500 has-checked:bg-blue-50 has-checked:shadow-sm">
									<input type="radio" name="track" value={track.value} class="accent-blue-600 h-4 w-4 shrink-0" required />
									<span class="text-xl leading-none">{track.icon}</span>
									<span class="flex-1 min-w-0">
										<span class="block text-sm font-bold text-gray-800 leading-none mb-0.5">{track.label}</span>
										<span class="block text-[11px] text-gray-400">{track.desc}</span>
									</span>
								</label>
							{/each}
						</div>
					</div>

					<button
						type="submit"
						class="block w-full cursor-pointer border-none text-center py-4 bg-linear-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black text-base shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-1 transition-all"
					>
						Daftar Sekarang →
					</button>
				</form>
				<p class="text-center mt-4 text-[10px] text-gray-400 font-medium">Kamu bisa ganti jalur kapan saja setelah mendaftar.</p>
						{/if}
					</div>
					
					<div class="bg-gray-50 p-6 border-t border-gray-100 flex items-center justify-between">
						<div>
							<p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Need help?</p>
							<p class="text-sm font-bold text-gray-700">Chat with Support</p>
						</div>
						<a href="https://wa.me/id" title="Chat with Support on WhatsApp" aria-label="Chat with Support on WhatsApp" class="h-10 w-10 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-transform">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path></svg>
						</a>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
