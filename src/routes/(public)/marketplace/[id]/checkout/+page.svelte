<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION, GRADIENT } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { fade, fly } from 'svelte/transition';

	interface CheckoutPageProps {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: CheckoutPageProps = $props();

	let couponCode = $state('');
	let isProcessing = $state(false);

	// When action returns snapToken, trigger Snap pay
	$effect(() => {
		const transaction = form?.data;
		if (form?.success && transaction?.snapToken && typeof window !== 'undefined' && (window as any).snap) {
			(window as any).snap.pay(transaction.snapToken, {
				onSuccess: () => location.href = '/app',
				onPending: () => location.href = '/app',
				onError: () => {
					isProcessing = false;
					alert('Secure node connection failed. Please retry.');
				},
				onClose: () => isProcessing = false
			});
		} else if (form?.error) {
			isProcessing = false;
		}
	});

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(price);
	};
</script>

<svelte:head>
	<title>Secure Checkout Protocol | Naik Kelas</title>
	{#if data.clientKey}
		<script
			src="https://app.sandbox.midtrans.com/snap/snap.js"
			data-client-key={data.clientKey}
		></script>
	{/if}
</svelte:head>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 md:py-20 px-6">
	<div class="max-w-4xl mx-auto">
		<!-- Secure Header -->
		<div class="flex items-center justify-between mb-12">
			<a href="/marketplace/{data.course.id}" class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-colors italic">
				<Icon name="arrow-left" size={14} /> Back to Briefing
			</a>
			<div class="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase tracking-widest italic shadow-sm">
				<Icon name="lock" size={12} /> Secure Transaction Node
			</div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
			<!-- Left: Order Summary -->
			<div class="space-y-8" in:fly={{ y: 20, duration: 600 }}>
				<div class="p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl">
					<div class="flex flex-col md:flex-row gap-8 items-start">
						{#if data.course.thumbnailUrl}
							<div class="w-full md:w-48 aspect-video md:aspect-square rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-inner group">
								<img src={data.course.thumbnailUrl} alt={data.course.title} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
							</div>
						{/if}
						<div class="flex-1">
							<div class="flex items-center gap-3 mb-3">
								<span class="text-[9px] font-black uppercase tracking-widest text-blue-600 italic">Target Acquisition</span>
							</div>
							<h1 class="text-3xl md:text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic leading-none mb-4">
								{data.course.title}
							</h1>
							<p class="text-sm font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 italic">
								{data.course.description}
							</p>
						</div>
					</div>

					<div class="mt-10 pt-10 border-t border-dashed border-zinc-100 dark:border-zinc-800 space-y-4">
						<div class="flex items-center justify-between text-sm">
							<span class="font-black uppercase tracking-widest text-zinc-400 italic">Operational Value</span>
							<span class="font-black text-zinc-900 dark:text-white italic">{formatPrice(data.course.price)}</span>
						</div>
						<div class="flex items-center justify-between text-sm">
							<span class="font-black uppercase tracking-widest text-zinc-400 italic">Strategic Protocols</span>
							<span class="font-black text-zinc-900 dark:text-white italic">Included</span>
						</div>
						<div class="h-px w-full bg-zinc-100 dark:bg-zinc-800 my-4"></div>
						<div class="flex items-center justify-between">
							<span class="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 italic">Total Clearance Amount</span>
							<span class="text-3xl font-black tracking-tighter text-blue-600 dark:text-blue-400 italic leading-none">
								{formatPrice(data.course.price)}
							</span>
						</div>
					</div>
				</div>

				<!-- Trust Protocol -->
				<div class="grid grid-cols-2 md:grid-cols-3 gap-6">
					{#each ['Midtrans Verified', 'SSL Protected', 'Cloud Synced'] as badge}
						<div class="flex items-center justify-center gap-2 p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 opacity-60">
							<div class="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
							<span class="text-[9px] font-black uppercase tracking-widest text-zinc-500 italic">{badge}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Right: Form Area -->
			<aside class="space-y-6" in:fly={{ x: 20, duration: 600, delay: 200 }}>
				<div class="p-8 rounded-[2rem] bg-zinc-950 text-white shadow-2xl relative overflow-hidden border border-zinc-800">
					<!-- Glow effect -->
					<div class="absolute -top-24 -right-24 h-48 w-48 bg-blue-600/20 rounded-full blur-3xl"></div>
					
					<div class="relative z-10">
						<h3 class="text-xl font-black tracking-tighter uppercase italic mb-8">Transaction Hub</h3>
						
						{#if form?.error}
							<div class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest italic mb-6 animate-pulse">
								Error: {form.error}
							</div>
						{/if}

						<form method="post" class="space-y-8" onsubmit={() => isProcessing = true}>
							<input type="hidden" name="courseId" value={data.course.id} />
							
							<div class="space-y-3">
								<label for="couponCode" class="text-[9px] font-black uppercase tracking-widest text-zinc-400 italic">Strategic Token (Coupon)</label>
								<div class="relative group">
									<Icon name="tag" size={14} class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
									<input
										id="couponCode"
										name="couponCode"
										bind:value={couponCode}
										class="w-full bg-zinc-900 border-2 border-zinc-800 rounded-xl px-12 py-4 text-xs font-black uppercase tracking-widest text-white placeholder-zinc-700 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all italic"
										placeholder="ENTER_TAC_TOKEN"
									/>
								</div>
							</div>

							<button 
								class={`group relative w-full overflow-hidden rounded-2xl py-5 text-sm font-black uppercase tracking-widest transition-all ${isProcessing ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-white text-zinc-950 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] shadow-xl active:scale-95'}`}
								disabled={isProcessing}
							>
								<div class="relative z-10 flex items-center justify-center gap-3">
									{#if isProcessing}
										<Icon name="loader" size={16} class="animate-spin" /> Initializing Node...
									{:else}
										Initialize Payment <Icon name="arrow-right" size={16} class="transition-transform group-hover:translate-x-1" />
									{/if}
								</div>
							</button>
						</form>

						<p class="mt-8 text-[9px] font-medium text-zinc-500 text-center leading-relaxed italic uppercase tracking-wider">
							By initializing, you agree to the <br/> <span class="text-zinc-400 underline cursor-pointer hover:text-white transition-colors">Strategic Learning Protocols</span>
						</p>
					</div>
				</div>

				<!-- Safety Info -->
				<div class="p-6 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 text-center">
					<p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic mb-2">Powered By</p>
					<div class="flex justify-center grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
						<img src="https://static.midtrans.com/logo/midtrans-color.svg" alt="Midtrans" class="h-6" />
					</div>
				</div>
			</aside>
		</div>
	</div>
</div>
