<script lang="ts">
	import type { PageData } from './$types';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import { fly, fade } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import Icon from '$lib/components/ui/Icon.svelte';

	let { data }: { data: PageData } = $props();
	let expandedModules = $state<Set<string>>(new Set([data.modules?.[0]?.id || '']));
	let submitting = $state(false);

	const features = $derived(
		data.features || { tracks: false, affiliate: false, performance: false }
	);

	const trackInfo: Record<string, { label: string; icon: string; color: string; desc: string }> = {
		creator: { label: 'Content Creator', icon: '🎥', color: 'text-blue-500', desc: 'Build your audience and influence.' },
		seller: { label: 'E-Commerce Seller', icon: '🛒', color: 'text-emerald-500', desc: 'Master the marketplace and sales.' },
		affiliate: { label: 'Affiliate Pro', icon: '🔗', color: 'text-purple-500', desc: 'Generate passive commission income.' }
	};

	function toggleModule(moduleId: string) {
		const newSet = new Set(expandedModules);
		if (newSet.has(moduleId)) {
			newSet.delete(moduleId);
		} else {
			newSet.add(moduleId);
		}
		expandedModules = newSet;
	}

	const totalPrice = $derived(data.course?.price || 0);
</script>

<svelte:head>
	<title>{data.course?.title || 'Protocol Spec'} - Naik Kelas</title>
</svelte:head>

<div class={`${SPACING.page} pb-24`}>
	{#if !data.course}
		<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
			<div class="mb-6 h-20 w-20 rounded-[2rem] bg-red-500/10 flex items-center justify-center text-red-500 shadow-sm border border-red-500/20">
				<Icon name="x" size={40} />
			</div>
			<h1 class="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic mb-4">Node Offset Error</h1>
			<p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mx-auto mb-10 max-w-sm uppercase tracking-widest leading-loose">
				The requested protocol node is not available in the central repository. Access denied.
			</p>
			<a
				href="/app/explore"
				class={`px-10 py-4 ${RADIUS.button} bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[11px] font-black uppercase tracking-widest ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-1 shadow-2xl`}
			>
				Return to Global Nexus
			</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
			<div class="space-y-12">
				<!-- Cinematic Specification Header -->
				<div
					class={`relative overflow-hidden ${RADIUS.card} ${ELEVATION.card} border ${COLOR.cardBorder} bg-zinc-950`}
				>
					<!-- Nodal Navigation -->
					<div class="absolute top-8 left-8 z-20">
						<a
							href="/app/explore"
							class={`inline-flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-5 py-2.5 text-[10px] font-black tracking-[0.2em] text-white uppercase no-underline shadow-2xl backdrop-blur-2xl transition-all hover:scale-105 hover:bg-black/60`}
						>
							<Icon name="arrow-left" size={14} /> Spec Search
						</a>
					</div>

					<div class="relative aspect-video w-full overflow-hidden">
						{#if data.course.thumbnailUrl}
							<img
								src={data.course.thumbnailUrl}
								alt={data.course.title}
								class="h-full w-full object-cover opacity-60 transition-transform duration-3000 hover:scale-110"
								loading="lazy"
							/>
						{:else}
							<div
								class="flex h-full w-full items-center justify-center bg-linear-to-br from-zinc-900 via-indigo-950/20 to-neutral-950 text-8xl grayscale opacity-20"
							>
								💎
							</div>
						{/if}
						
						<!-- Cinematic Overlays -->
						<div class="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
						<div class="absolute inset-0 bg-linear-to-r from-zinc-950/80 via-transparent to-transparent"></div>

						<div
							class="absolute inset-0 flex flex-col justify-end p-8 md:p-16"
							in:fade={{ duration: 1000 }}
						>
							<div class="mb-6 flex flex-wrap gap-3">
								<div class="flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-[9px] font-black tracking-widest text-blue-400 uppercase backdrop-blur-3xl shadow-xl">
									<Icon name="clock" size={12} /> {data.course.duration} Cycles
								</div>
								<div class="flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-[9px] font-black tracking-widest text-indigo-400 uppercase backdrop-blur-3xl shadow-xl">
									<Icon name="layers" size={12} /> {data.modules.length} Protocols
								</div>
								{#if data.isEnrolled}
									<div class="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-[9px] font-black tracking-widest text-emerald-400 uppercase backdrop-blur-3xl shadow-xl shadow-emerald-500/5">
										<Icon name="check-circle" size={12} /> Verified Clearance
									</div>
								{/if}
							</div>

							<h1
								class="mb-8 max-w-5xl text-4xl leading-[0.9] font-black tracking-tighter text-white md:text-6xl lg:text-7xl uppercase italic"
							>
								{data.course.title}
							</h1>

							<div class="flex items-center gap-6">
								<div
									class="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl font-black text-white shadow-2xl backdrop-blur-md"
								>
									{data.mentor?.username?.[0].toUpperCase() || 'M'}
								</div>
								<div>
									<p
										class="text-[9px] font-black tracking-[0.3em] text-white/40 uppercase mb-1 italic"
									>
										Chief Strategist
									</p>
									<p class="text-xl font-black text-white tracking-tighter uppercase italic leading-none">
										{data.mentor?.fullName || data.mentor?.username || 'System Analyst'}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Track Specification Sections -->
				<div class="space-y-24 py-8">
					<!-- Tactical Briefing -->
					<section in:fly={{ y: 20, duration: 800 }}>
						<header class="mb-10 flex items-center gap-5">
							<div class="h-10 w-2 rounded-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
							<div>
								<h2 class="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none uppercase italic">Tactical Briefing</h2>
								<p class="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1">Operational Summary</p>
							</div>
						</header>
						<p class="text-xl font-medium leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-4xl italic px-2 border-l-2 border-zinc-100 dark:border-zinc-800 ml-1 py-1">
							"{data.course.description || 'Initialize your professional deployment through this high-performance curriculum node. Full operational clearance required for protocol execution.'}"
						</p>
					</section>

					<!-- Protocol Mapping (Curriculum) -->
					<section in:fly={{ y: 20, duration: 800, delay: 100 }}>
						<header class="mb-10 flex items-center justify-between">
							<div class="flex items-center gap-5">
								<div class="h-10 w-2 rounded-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]"></div>
								<div>
									<h2 class="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none uppercase italic">Protocol Mapping</h2>
									<p class="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-1">Curriculum Architecture</p>
								</div>
							</div>
							<div class="text-right flex flex-col items-end">
								<span class="text-[9px] font-black tracking-widest text-zinc-400 uppercase leading-none mb-1"
									>Deployment Cycles</span
								>
								<span class="text-xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase italic"
									>{data.modules.length} Modules / {data.modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0)} Nodes</span
								>
							</div>
						</header>

						<div class="space-y-6">
							{#each data.modules as module, i (module.id)}
								<div
									class={`group overflow-hidden ${RADIUS.card} border-2 ${expandedModules.has(module.id) ? 'border-blue-500/20 bg-blue-500/5' : 'border-current opacity-60 hover:opacity-100 hover:border-zinc-300 dark:hover:border-zinc-700'} transition-all duration-500 ${expandedModules.has(module.id) ? 'shadow-2xl' : 'shadow-sm'}`}
								>
									<button
										class={`flex w-full items-center justify-between p-8 text-left transition-colors duration-500`}
										onclick={() => toggleModule(module.id)}
									>
										<div class="flex items-center gap-8">
											<div
												class={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-black transition-all duration-700 shadow-inner border ${expandedModules.has(module.id) ? 'bg-blue-600 text-white border-blue-400 rotate-6' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700 group-hover:scale-110'}`}
											>
												{(i + 1).toString().padStart(2, '0')}
											</div>
											<div>
												<h3 class="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none mb-1 uppercase group-hover:text-blue-600 transition-colors">{module.title}</h3>
												<p class="text-[10px] font-black tracking-widest text-zinc-400 uppercase italic leading-none">{module.lessons.length} Learning Nodes</p>
											</div>
										</div>
										<div class={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-700 border ${expandedModules.has(module.id) ? 'bg-white/10 dark:bg-white/5 text-blue-600 rotate-180 border-blue-500/20' : 'text-zinc-300 border-zinc-200 dark:border-zinc-800 group-hover:bg-zinc-100'}`}>
											<Icon name="chevron-down" size={24} />
										</div>
									</button>

									{#if expandedModules.has(module.id)}
										<div
											class="animate-in slide-in-from-top-6 space-y-2 px-8 pb-8 pt-0 duration-500"
										>
											<div class="h-px w-full bg-blue-500/10 mb-6"></div>
											{#each module.lessons as lesson, j}
												<div
													class="group flex items-center gap-6 rounded-[1.5rem] border border-transparent px-8 py-5 transition-all hover:border-blue-500/20 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-xl hover:-translate-y-1"
												>
													<div
														class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-[10px] font-black text-zinc-400 transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white shadow-inner"
													>
														{(j + 1).toString().padStart(2, '0')}
													</div>
													<div class="flex-1">
														<span class="text-sm font-black tracking-tight text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white uppercase italic"
															>{lesson.title}</span
														>
													</div>
													<div class="flex items-center gap-3">
														{#if !data.isEnrolled}
															<span class="text-[9px] font-black tracking-widest text-zinc-300 uppercase opacity-0 group-hover:opacity-100 transition-all italic">Node Secured</span>
															<Icon name="lock" size={16} class="text-zinc-300" />
														{:else}
															<Icon name="check-circle" size={18} class="text-emerald-500 opacity-60 group-hover:opacity-100 transition-all" />
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

					<!-- Verified Feedback (Reviews) -->
					<section in:fly={{ y: 20, duration: 800, delay: 200 }}>
						<header class="mb-10 flex items-center gap-5">
							<div class="h-10 w-2 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]"></div>
							<div>
								<h2 class="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none uppercase italic">Human Verification</h2>
								<p class="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mt-1">Student Intelligence</p>
							</div>
						</header>

						{#if data.avgRating > 0}
							<div
								class="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8"
							>
								<div class={`p-10 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} flex flex-col items-center justify-center text-center shadow-2xl shadow-zinc-500/5`}>
									<span class="text-7xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none mb-3 italic">{data.avgRating.toFixed(1)}</span>
									<div class="flex items-center gap-1.5 text-amber-500 mb-2">
										{#each Array(5) as _, i}
											<Icon name="star" size={16} class={i < Math.round(data.avgRating) ? 'fill-current' : 'text-zinc-200 dark:text-zinc-800'} />
										{/each}
									</div>
									<span class="text-[9px] font-black tracking-widest text-zinc-400 uppercase italic">Consensus Rating</span>
								</div>

								<div class="md:col-span-3 space-y-6">
									{#each data.reviews?.slice(0, 3) || [] as review}
										<div class={`p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} shadow-sm group hover:shadow-xl hover:-translate-y-1 ${TRANSITION.all}`}>
											<div class="mb-4 flex items-center justify-between">
												<div class="flex items-center gap-4">
													<div class="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-lg font-black text-zinc-900 dark:text-white shadow-inner">
														{review.user.fullName?.[0] || review.user.username[0] || '?'}
													</div>
													<div>
														<p class="text-sm font-black text-zinc-900 dark:text-white uppercase italic leading-none mb-1">
															{review.user.fullName || review.user.username}
														</p>
														<div class="flex items-center gap-1.5 text-amber-500">
															{#each Array(5) as _, i}
																<Icon name="star" size={10} class={i < review.rating ? 'fill-current' : 'text-zinc-100 dark:text-zinc-800'} />
															{/each}
														</div>
													</div>
												</div>
												<span class="text-[9px] font-black tracking-widest text-zinc-400 uppercase italic"
													>{new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(review.createdAt))}</span
												>
											</div>
											<p class="text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400 italic">"{review.comment}"</p>
										</div>
									{/each}
								</div>
							</div>
						{:else}
							<div class="py-20 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800 mb-12">
								<p class="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic">Awaiting Human Feedback Node Deployment</p>
							</div>
						{/if}
					</section>
				</div>
			</div>

			<!-- Nodal Command Sidebar (Investment) -->
			<div class="relative">
				<div
					class={`sticky top-28 ${RADIUS.card} ${ELEVATION.card} overflow-hidden border-2 ${COLOR.cardBorder} ${COLOR.card} shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]`}
				>
					<div class="p-1 px-8 bg-linear-to-r from-blue-600 via-indigo-600 to-transparent h-1.5 w-full"></div>
					<div class="p-10">
						<p class="mb-4 text-[10px] font-black tracking-[0.2em] text-zinc-400 dark:text-zinc-500 uppercase italic">
							Operational Investment
						</p>
						<div class="mb-10 flex flex-col gap-1">
							<span class="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white italic leading-none"
								>Rp {totalPrice.toLocaleString('id-ID')}</span
							>
							<div class="flex items-center gap-2 mt-2">
								<div class="h-1 w-8 bg-emerald-500 rounded-full"></div>
								<span class="text-[9px] font-black tracking-[0.2em] text-emerald-600 uppercase italic">One-Time Asset Transfer</span>
							</div>
						</div>

						<div class="space-y-4 mb-12">
							{#each [
								{ feat: 'Lifetime Protocol Access', icon: 'zap' },
								{ feat: 'Graduate Seal Generation', icon: 'award' },
								{ feat: 'Strategic Asset Downloads', icon: 'download' },
								{ feat: 'Chief Strategist Support', icon: 'message-circle' }
							] as item}
								<div class="flex items-center gap-4 group">
									<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 group-hover:scale-110 transition-transform">
										<Icon name={item.icon as any} size={16} />
									</div>
									<span class="text-[11px] font-black text-zinc-600 dark:text-zinc-300 uppercase tracking-widest italic">{item.feat}</span>
								</div>
							{/each}
						</div>

						{#if data.isEnrolled}
							<div class="space-y-6">
								<div
									class="flex items-center gap-4 rounded-2xl border-2 border-emerald-500/20 bg-emerald-500/5 p-6 text-emerald-600 shadow-sm"
								>
									<Icon name="check-circle" size={24} />
									<div>
										<p class="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Clearance Active</p>
										<p class="text-[11px] font-medium leading-none">Access protocols restored.</p>
									</div>
								</div>
								<a
									href="/app/explore/{data.course.id}/learn"
									class={`group flex w-full items-center justify-center gap-3 rounded-2xl bg-zinc-950 py-5 text-center text-[11px] font-black text-white no-underline shadow-2xl transition-all hover:-translate-y-1 active:scale-[0.98] uppercase tracking-widest dark:bg-white dark:text-zinc-950`}
								>
									Resume Deployment <Icon name="zap" size={14} />
								</a>
							</div>
						{:else}
							<form 
								action="/app/explore/{data.course.id}/enroll" 
								method="POST" 
								class="space-y-10"
								use:enhance={() => {
									submitting = true;
									return async ({ update }) => {
										submitting = false;
										update();
									};
								}}
							>
								{#if features.tracks}
									<!-- Track Initialization -->
									<div class="animate-in fade-in slide-in-from-bottom-4 duration-1000">
										<p class="mb-6 text-[10px] font-black tracking-[0.2em] text-zinc-400 dark:text-zinc-500 uppercase italic">
											Initialize Career Specialization
										</p>
										<div class="space-y-4">
											{#each Object.entries(trackInfo) as [key, info]}
												<label
													class={`flex cursor-pointer items-center gap-5 rounded-3xl border-2 p-6 transition-all shadow-sm group hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] has-checked:border-blue-600 has-checked:bg-blue-60 dark:has-checked:bg-blue-900/10 border-current opacity-60 has-checked:opacity-100 hover:border-zinc-300 dark:hover:border-zinc-700`}
												>
													<input
														type="radio"
														name="track"
														value={key}
														class="sr-only"
														required
													/>
													<div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-3xl shadow-inner transition-all duration-700 group-has-checked:rotate-12 group-has-checked:scale-110">
														{info.icon}
													</div>
													<div class="min-w-0 flex-1">
														<span class="block text-sm font-black text-zinc-900 dark:text-white uppercase italic tracking-tight"
															>{info.label}</span
														>
														<span class="block text-[10px] font-medium text-zinc-400 leading-tight italic">{info.desc}</span>
													</div>
													<div class="h-6 w-6 shrink-0 rounded-full border-2 border-zinc-200 transition-all has-checked:border-blue-600 has-checked:bg-blue-600 flex items-center justify-center shadow-inner">
														<div class="h-2 w-2 rounded-full bg-white opacity-0 has-checked:opacity-100"></div>
													</div>
												</label>
											{/each}
										</div>
										<p class="mt-6 text-center text-[9px] font-black text-zinc-300 uppercase tracking-widest italic leading-relaxed">
											Specialization track can be reconfigured post-initialization.
										</p>
									</div>
								{/if}

								<button
									type="submit"
									disabled={submitting}
									class="flex w-full items-center justify-center gap-3 cursor-pointer rounded-2xl border-none bg-linear-to-r from-blue-600 via-blue-700 to-indigo-700 py-6 text-center text-[12px] font-black text-white shadow-2xl shadow-blue-500/40 transition-all hover:-translate-y-1 hover:shadow-blue-500/60 active:scale-[0.98] uppercase tracking-widest disabled:opacity-50"
								>
									{#if submitting}
										Initializing... <Icon name="refresh-ccw" size={16} class="animate-spin" />
									{:else}
										Initialize Deployment <Icon name="arrow-right" size={16} />
									{/if}
								</button>
							</form>
						{/if}

						<div class="mt-12 flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 -m-10 p-10 dark:border-white/5 dark:bg-white/5">
							<div>
								<p
									class="mb-1 text-[9px] font-black tracking-[0.3em] text-zinc-400 dark:text-zinc-500 uppercase italic"
								>
									Support Nexus
								</p>
								<p class="text-sm font-black text-zinc-900 dark:text-white uppercase italic">Strategic Link</p>
							</div>
							<a
								href="https://wa.me/id"
								target="_blank"
								rel="noopener noreferrer"
								class="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-2xl transition-all hover:scale-110 active:scale-95 group dark:bg-white dark:text-zinc-950"
							>
								<Icon name="message-circle" size={28} />
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
