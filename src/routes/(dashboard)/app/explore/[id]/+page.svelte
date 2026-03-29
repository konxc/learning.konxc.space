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
		creator: {
			label: 'Content Creator',
			icon: '🎥',
			color: 'text-blue-500',
			desc: 'Build your audience and influence.'
		},
		seller: {
			label: 'E-Commerce Seller',
			icon: '🛒',
			color: 'text-emerald-500',
			desc: 'Master the marketplace and sales.'
		},
		affiliate: {
			label: 'Affiliate Pro',
			icon: '🔗',
			color: 'text-purple-500',
			desc: 'Generate passive commission income.'
		}
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
			<div
				class="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] border border-red-500/20 bg-red-500/10 text-red-500 shadow-sm"
			>
				<Icon name="x" size={40} />
			</div>
			<h1
				class="mb-4 text-4xl font-black tracking-tighter text-zinc-900 uppercase italic dark:text-white"
			>
				Node Offset Error
			</h1>
			<p
				class="mx-auto mb-10 max-w-sm text-xs leading-loose font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400"
			>
				The requested protocol node is not available in the central repository. Access denied.
			</p>
			<a
				href="/app/explore"
				class={`px-10 py-4 ${RADIUS.button} bg-zinc-950 text-[11px] font-black tracking-widest text-white uppercase dark:bg-white dark:text-zinc-950 ${ELEVATION.base} ${TRANSITION.all} shadow-2xl hover:-translate-y-1`}
			>
				Return to Global Nexus
			</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
			<div class="">
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
								class="flex h-full w-full items-center justify-center bg-linear-to-br from-zinc-900 via-indigo-950/20 to-neutral-950 text-8xl opacity-20 grayscale"
							>
								💎
							</div>
						{/if}

						<!-- Cinematic Overlays -->
						<div
							class="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent"
						></div>
						<div
							class="absolute inset-0 bg-linear-to-r from-zinc-950/80 via-transparent to-transparent"
						></div>

						<div
							class="absolute inset-0 flex flex-col justify-end p-8 md:p-16"
							in:fade={{ duration: 1000 }}
						>
							<div class="mb-6 flex flex-wrap gap-3">
								<div
									class="flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-[9px] font-black tracking-widest text-blue-400 uppercase shadow-xl backdrop-blur-3xl"
								>
									<Icon name="clock" size={12} />
									{data.course.duration} Cycles
								</div>
								<div
									class="flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-[9px] font-black tracking-widest text-indigo-400 uppercase shadow-xl backdrop-blur-3xl"
								>
									<Icon name="layers" size={12} />
									{data.modules.length} Protocols
								</div>
								{#if data.isEnrolled}
									<div
										class="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-[9px] font-black tracking-widest text-emerald-400 uppercase shadow-xl shadow-emerald-500/5 backdrop-blur-3xl"
									>
										<Icon name="check-circle" size={12} /> Verified Clearance
									</div>
								{/if}
							</div>

							<h1
								class="mb-8 max-w-5xl text-4xl leading-[0.9] font-black tracking-tighter text-white uppercase italic md:text-6xl lg:text-7xl"
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
										class="mb-1 text-[9px] font-black tracking-[0.3em] text-white/40 uppercase italic"
									>
										Chief Strategist
									</p>
									<p
										class="text-xl leading-none font-black tracking-tighter text-white uppercase italic"
									>
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
							<div
								class="h-10 w-2 rounded-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
							></div>
							<div>
								<h2
									class="text-3xl leading-none font-black tracking-tighter text-zinc-900 uppercase italic dark:text-white"
								>
									Tactical Briefing
								</h2>
								<p class="mt-1 text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">
									Operational Summary
								</p>
							</div>
						</header>
						<p
							class="ml-1 max-w-4xl border-l-2 border-zinc-100 px-2 py-1 text-xl leading-relaxed font-medium text-zinc-600 italic dark:border-zinc-800 dark:text-zinc-300"
						>
							"{data.course.description ||
								'Initialize your professional deployment through this high-performance curriculum node. Full operational clearance required for protocol execution.'}"
						</p>
					</section>

					<!-- Protocol Mapping (Curriculum) -->
					<section in:fly={{ y: 20, duration: 800, delay: 100 }}>
						<header class="mb-10 flex items-center justify-between">
							<div class="flex items-center gap-5">
								<div
									class="h-10 w-2 rounded-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]"
								></div>
								<div>
									<h2
										class="text-3xl leading-none font-black tracking-tighter text-zinc-900 uppercase italic dark:text-white"
									>
										Protocol Mapping
									</h2>
									<p class="mt-1 text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase">
										Curriculum Architecture
									</p>
								</div>
							</div>
							<div class="flex flex-col items-end text-right">
								<span
									class="mb-1 text-[9px] leading-none font-black tracking-widest text-zinc-400 uppercase"
									>Deployment Cycles</span
								>
								<span
									class="text-xl font-black tracking-tighter text-zinc-900 uppercase italic dark:text-white"
									>{data.modules.length} Modules / {data.modules.reduce(
										(acc: number, m: any) => acc + m.lessons.length,
										0
									)} Nodes</span
								>
							</div>
						</header>

						<div class="space-y-6">
							{#each data.modules as module, i (module.id)}
								<div
									class={`group overflow-hidden ${RADIUS.card} border-2 ${expandedModules.has(module.id) ? 'border-blue-500/20 bg-blue-500/5' : 'border-current opacity-60 hover:border-zinc-300 hover:opacity-100 dark:hover:border-zinc-700'} transition-all duration-500 ${expandedModules.has(module.id) ? 'shadow-2xl' : 'shadow-sm'}`}
								>
									<button
										class={`flex w-full items-center justify-between p-8 text-left transition-colors duration-500`}
										onclick={() => toggleModule(module.id)}
									>
										<div class="flex items-center gap-8">
											<div
												class={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border text-2xl font-black shadow-inner transition-all duration-700 ${expandedModules.has(module.id) ? 'rotate-6 border-blue-400 bg-blue-600 text-white' : 'border-zinc-200 bg-zinc-100 text-zinc-400 group-hover:scale-110 dark:border-zinc-700 dark:bg-zinc-800'}`}
											>
												{(i + 1).toString().padStart(2, '0')}
											</div>
											<div>
												<h3
													class="mb-1 text-2xl leading-none font-black tracking-tighter text-zinc-900 uppercase transition-colors group-hover:text-blue-600 dark:text-white"
												>
													{module.title}
												</h3>
												<p
													class="text-[10px] leading-none font-black tracking-widest text-zinc-400 uppercase italic"
												>
													{module.lessons.length} Learning Nodes
												</p>
											</div>
										</div>
										<div
											class={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-700 ${expandedModules.has(module.id) ? 'rotate-180 border-blue-500/20 bg-white/10 text-blue-600 dark:bg-white/5' : 'border-zinc-200 text-zinc-300 group-hover:bg-zinc-100 dark:border-zinc-800'}`}
										>
											<Icon name="chevron-down" size={24} />
										</div>
									</button>

									{#if expandedModules.has(module.id)}
										<div
											class="animate-in slide-in-from-top-6 space-y-2 px-8 pt-0 pb-8 duration-500"
										>
											<div class="mb-6 h-px w-full bg-blue-500/10"></div>
											{#each module.lessons as lesson, j}
												<div
													class="group flex items-center gap-6 rounded-[1.5rem] border border-transparent px-8 py-5 transition-all hover:-translate-y-1 hover:border-blue-500/20 hover:bg-white hover:shadow-xl dark:hover:bg-zinc-900"
												>
													<div
														class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-50 text-[10px] font-black text-zinc-400 shadow-inner transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white dark:bg-zinc-800/50"
													>
														{(j + 1).toString().padStart(2, '0')}
													</div>
													<div class="flex-1">
														<span
															class="text-sm font-black tracking-tight text-zinc-700 uppercase italic group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-white"
															>{lesson.title}</span
														>
													</div>
													<div class="flex items-center gap-3">
														{#if !data.isEnrolled}
															<span
																class="text-[9px] font-black tracking-widest text-zinc-300 uppercase italic opacity-0 transition-all group-hover:opacity-100"
																>Node Secured</span
															>
															<Icon name="lock" size={16} class="text-zinc-300" />
														{:else}
															<Icon
																name="check-circle"
																size={18}
																class="text-emerald-500 opacity-60 transition-all group-hover:opacity-100"
															/>
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
							<div
								class="h-10 w-2 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
							></div>
							<div>
								<h2
									class="text-3xl leading-none font-black tracking-tighter text-zinc-900 uppercase italic dark:text-white"
								>
									Human Verification
								</h2>
								<p class="mt-1 text-[10px] font-black tracking-[0.2em] text-amber-500 uppercase">
									Student Intelligence
								</p>
							</div>
						</header>

						{#if data.avgRating > 0}
							<div class="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4">
								<div
									class={`p-10 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} flex flex-col items-center justify-center text-center shadow-2xl shadow-zinc-500/5`}
								>
									<span
										class="mb-3 text-7xl leading-none font-black tracking-tighter text-zinc-900 italic dark:text-white"
										>{data.avgRating.toFixed(1)}</span
									>
									<div class="mb-2 flex items-center gap-1.5 text-amber-500">
										{#each Array(5) as _, i}
											<Icon
												name="star"
												size={16}
												class={i < Math.round(data.avgRating)
													? 'fill-current'
													: 'text-zinc-200 dark:text-zinc-800'}
											/>
										{/each}
									</div>
									<span class="text-[9px] font-black tracking-widest text-zinc-400 uppercase italic"
										>Consensus Rating</span
									>
								</div>

								<div class="space-y-6 md:col-span-3">
									{#each data.reviews?.slice(0, 3) || [] as review}
										<div
											class={`p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} group shadow-sm hover:-translate-y-1 hover:shadow-xl ${TRANSITION.all}`}
										>
											<div class="mb-4 flex items-center justify-between">
												<div class="flex items-center gap-4">
													<div
														class="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-lg font-black text-zinc-900 shadow-inner dark:bg-zinc-800 dark:text-white"
													>
														{review.user.fullName?.[0] || review.user.username[0] || '?'}
													</div>
													<div>
														<p
															class="mb-1 text-sm leading-none font-black text-zinc-900 uppercase italic dark:text-white"
														>
															{review.user.fullName || review.user.username}
														</p>
														<div class="flex items-center gap-1.5 text-amber-500">
															{#each Array(5) as _, i}
																<Icon
																	name="star"
																	size={10}
																	class={i < review.rating
																		? 'fill-current'
																		: 'text-zinc-100 dark:text-zinc-800'}
																/>
															{/each}
														</div>
													</div>
												</div>
												<span
													class="text-[9px] font-black tracking-widest text-zinc-400 uppercase italic"
													>{new Intl.DateTimeFormat('id-ID', {
														day: 'numeric',
														month: 'short',
														year: 'numeric'
													}).format(new Date(review.createdAt))}</span
												>
											</div>
											<p
												class="text-sm leading-relaxed font-medium text-zinc-600 italic dark:text-zinc-400"
											>
												"{review.comment}"
											</p>
										</div>
									{/each}
								</div>
							</div>
						{:else}
							<div
								class="mb-12 rounded-[3rem] border border-dashed border-zinc-200 bg-zinc-50 py-20 text-center dark:border-zinc-800 dark:bg-zinc-900/50"
							>
								<p class="text-[10px] font-black tracking-widest text-zinc-300 uppercase italic">
									Awaiting Human Feedback Node Deployment
								</p>
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
					<div
						class="h-1.5 w-full bg-linear-to-r from-blue-600 via-indigo-600 to-transparent p-1 px-8"
					></div>
					<div class="p-10">
						<p
							class="mb-4 text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase italic dark:text-zinc-500"
						>
							Operational Investment
						</p>
						<div class="mb-10 flex flex-col gap-1">
							<span
								class="text-5xl leading-none font-black tracking-tighter text-zinc-900 italic dark:text-white"
								>Rp {totalPrice.toLocaleString('id-ID')}</span
							>
							<div class="mt-2 flex items-center gap-2">
								<div class="h-1 w-8 rounded-full bg-emerald-500"></div>
								<span
									class="text-[9px] font-black tracking-[0.2em] text-emerald-600 uppercase italic"
									>One-Time Asset Transfer</span
								>
							</div>
						</div>

						<div class="mb-12 space-y-4">
							{#each [{ feat: 'Lifetime Protocol Access', icon: 'zap' }, { feat: 'Graduate Seal Generation', icon: 'award' }, { feat: 'Strategic Asset Downloads', icon: 'download' }, { feat: 'Chief Strategist Support', icon: 'message-circle' }] as item}
								<div class="group flex items-center gap-4">
									<div
										class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-500/20"
									>
										<Icon name={item.icon as any} size={16} />
									</div>
									<span
										class="text-[11px] font-black tracking-widest text-zinc-600 uppercase italic dark:text-zinc-300"
										>{item.feat}</span
									>
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
										<p class="mb-1 text-[10px] leading-none font-black tracking-widest uppercase">
											Clearance Active
										</p>
										<p class="text-[11px] leading-none font-medium">Access protocols restored.</p>
									</div>
								</div>
								<a
									href="/app/explore/{data.course.id}/learn"
									class={`group flex w-full items-center justify-center gap-3 rounded-2xl bg-zinc-950 py-5 text-center text-[11px] font-black tracking-widest text-white uppercase no-underline shadow-2xl transition-all hover:-translate-y-1 active:scale-[0.98] dark:bg-white dark:text-zinc-950`}
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
										<p
											class="mb-6 text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase italic dark:text-zinc-500"
										>
											Initialize Career Specialization
										</p>
										<div class="space-y-4">
											{#each Object.entries(trackInfo) as [key, info]}
												<label
													class={`group has-checked:bg-blue-60 flex cursor-pointer items-center gap-5 rounded-3xl border-2 border-current p-6 opacity-60 shadow-sm transition-all hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl active:scale-[0.98] has-checked:border-blue-600 has-checked:opacity-100 dark:hover:border-zinc-700 dark:has-checked:bg-blue-900/10`}
												>
													<input type="radio" name="track" value={key} class="sr-only" required />
													<div
														class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-50 text-3xl shadow-inner transition-all duration-700 group-has-checked:scale-110 group-has-checked:rotate-12 dark:bg-zinc-800"
													>
														{info.icon}
													</div>
													<div class="min-w-0 flex-1">
														<span
															class="block text-sm font-black tracking-tight text-zinc-900 uppercase italic dark:text-white"
															>{info.label}</span
														>
														<span
															class="block text-[10px] leading-tight font-medium text-zinc-400 italic"
															>{info.desc}</span
														>
													</div>
													<div
														class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-zinc-200 shadow-inner transition-all has-checked:border-blue-600 has-checked:bg-blue-600"
													>
														<div
															class="h-2 w-2 rounded-full bg-white opacity-0 has-checked:opacity-100"
														></div>
													</div>
												</label>
											{/each}
										</div>
										<p
											class="mt-6 text-center text-[9px] leading-relaxed font-black tracking-widest text-zinc-300 uppercase italic"
										>
											Specialization track can be reconfigured post-initialization.
										</p>
									</div>
								{/if}

								<button
									type="submit"
									disabled={submitting}
									class="flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-none bg-linear-to-r from-blue-600 via-blue-700 to-indigo-700 py-6 text-center text-[12px] font-black tracking-widest text-white uppercase shadow-2xl shadow-blue-500/40 transition-all hover:-translate-y-1 hover:shadow-blue-500/60 active:scale-[0.98] disabled:opacity-50"
								>
									{#if submitting}
										Initializing... <Icon name="refresh-ccw" size={16} class="animate-spin" />
									{:else}
										Initialize Deployment <Icon name="arrow-right" size={16} />
									{/if}
								</button>
							</form>
						{/if}

						<div
							class="-m-10 mt-12 flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 p-10 dark:border-white/5 dark:bg-white/5"
						>
							<div>
								<p
									class="mb-1 text-[9px] font-black tracking-[0.3em] text-zinc-400 uppercase italic dark:text-zinc-500"
								>
									Support Nexus
								</p>
								<p class="text-sm font-black text-zinc-900 uppercase italic dark:text-white">
									Strategic Link
								</p>
							</div>
							<a
								href="https://wa.me/id"
								target="_blank"
								rel="noopener noreferrer"
								class="group flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-2xl transition-all hover:scale-110 active:scale-95 dark:bg-white dark:text-zinc-950"
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
