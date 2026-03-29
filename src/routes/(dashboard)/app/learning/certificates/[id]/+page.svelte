<script lang="ts">
	import type { PageData } from './$types';
	import html2canvas from 'html2canvas';
	import jsPDF from 'jspdf';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION, GRADIENT } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { fade, fly, scale } from 'svelte/transition';

	let { data }: { data: PageData } = $props();
	const brandColor = $derived(data.organization?.brandColor || '#2563eb');
	let certificateElement: HTMLDivElement | undefined = $state();
	let isDownloading = $state(false);

	async function downloadPDF() {
		if (!certificateElement) return;
		isDownloading = true;
		try {
			const canvas = await html2canvas(certificateElement, {
				scale: 3, // High DPI
				useCORS: true,
				backgroundColor: '#ffffff'
			});
			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF('landscape', 'mm', 'a4');
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();
			const imgWidth = pdfWidth;
			const imgHeight = (canvas.height * pdfWidth) / canvas.width;
			const yOffset = (pdfHeight - imgHeight) / 2;
			pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
			pdf.save(`Protocol-Clearance-${data.certificate.serial}.pdf`);
		} catch (error) {
			console.error('Failed to generate PDF:', error);
			alert('Secure node export failed.');
		} finally {
			isDownloading = false;
		}
	}
</script>

<svelte:head>
	<title>Operational Clearance - {data.course.title}</title>
</svelte:head>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 md:py-20 px-6">
	<div class="max-w-6xl mx-auto">
		<!-- Cinematic Achievement Header -->
		<div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16" in:fly={{ y: -20, duration: 600 }}>
			<div class="space-y-4">
				<a href="/app/learning" class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-colors italic">
					<Icon name="arrow-left" size={14} /> Mission Debriefing
				</a>
				<div class="flex items-center gap-3">
					<div class="px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-[10px] font-black uppercase tracking-widest italic border border-blue-600/20 shadow-sm">
						Level 10 Achievement
					</div>
					<div class="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">
						Operational Clearance Verified
					</div>
				</div>
				<h1 class="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic leading-none">Ceremonial Achievement Protocol</h1>
			</div>

			<div class="flex items-center gap-4">
				<button 
					class="flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 text-[11px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 transition-all active:scale-95 shadow-sm"
				>
					Share Spec <Icon name="share" size={16} />
				</button>
				<button
					onclick={downloadPDF}
					disabled={isDownloading}
					class={`group flex items-center gap-3 px-10 py-4 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[11px] font-black uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50`}
				>
					{#if isDownloading}
						<Icon name="loader" size={16} class="animate-spin" /> Exporting Log...
					{:else}
						Download Spec <Icon name="download" size={16} class="transition-transform group-hover:translate-y-1" />
					{/if}
				</button>
			</div>
		</div>

		<!-- Premium Certificate Node -->
		<div class="relative group" in:scale={{ duration: 800, start: 0.95 }}>
			<!-- Background Glows -->
			<div class="absolute -top-20 -left-20 h-64 w-64 bg-blue-600/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
			<div class="absolute -bottom-20 -right-20 h-64 w-64 bg-indigo-600/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

			<div 
				bind:this={certificateElement} 
				class="relative w-full aspect-[1.414/1] bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl border-8 border-zinc-100 p-8 md:p-16 overflow-hidden flex flex-col justify-between"
				style="font-family: 'Inter', sans-serif;"
			>
				<!-- Secure Background watermark -->
				<div class="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
					<Icon name="layers" size={600} />
				</div>

				<!-- Header Section -->
				<div class="flex justify-between items-start relative z-10">
					<div class="space-y-2">
						<div class="h-1.5 w-20 bg-zinc-950 rounded-full"></div>
						<p class="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Security Clearance Log</p>
					</div>
					{#if data.organization?.logoUrl}
						<img src={data.organization.logoUrl} alt={data.organization.name} class="h-16 w-32 object-contain grayscale" />
					{:else}
						<div class="h-16 w-16 bg-zinc-950 rounded-2xl flex items-center justify-center text-white text-3xl">NK</div>
					{/if}
				</div>

				<!-- Main Content -->
				<div class="text-center relative z-10">
					<p class="text-[12px] md:text-[14px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-8 md:mb-12 italic">Certificate of Operational Mastery</p>
					
					<p class="text-[14px] font-medium text-zinc-500 italic mb-4">This hereby certifies that operational excellence was achieved by</p>
					<h2 class="text-4xl md:text-7xl font-black tracking-tighter text-zinc-900 uppercase italic leading-none mb-8 md:mb-12">
						{data.user.fullName || data.user.username}
					</h2>
					
					<div class="mx-auto h-px w-32 bg-zinc-200 mb-8 md:mb-12"></div>
					
					<p class="text-[14px] font-medium text-zinc-500 italic mb-4">Following successful deployment of the protocol</p>
					<h3 class="text-2xl md:text-3xl font-black tracking-tighter text-zinc-900 uppercase italic leading-none">
						{data.course.title}
					</h3>
					
					<p class="mt-8 text-[11px] font-black uppercase tracking-widest text-zinc-400">Awarded by {data.organization?.name || 'Naik Kelas'} Strategic Academy</p>
				</div>

				<!-- Footer Section -->
				<div class="flex justify-between items-end relative z-10">
					<div class="space-y-1">
						<p class="text-[9px] font-black uppercase tracking-widest text-zinc-400">Verification ID</p>
						<p class="text-xs font-black text-zinc-900 font-mono tracking-tighter uppercase">{data.certificate.serial}</p>
					</div>
					
					<div class="px-8 py-6 border-l-2 border-zinc-100 flex flex-col items-center">
						<div class="w-32 h-12 flex items-center justify-center border-b border-zinc-200 mb-2 opacity-60">
							<span class="text-sm font-black italic tracking-tighter text-zinc-900 uppercase opacity-20">Signature Protocol</span>
						</div>
						<p class="text-[9px] font-black uppercase tracking-widest text-zinc-400">Strategic Director</p>
					</div>

					<div class="space-y-1 text-right">
						<p class="text-[9px] font-black uppercase tracking-widest text-zinc-400">Operational Date</p>
						<p class="text-xs font-black text-zinc-900 uppercase">
							{new Date(data.certificate.issuedAt).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'short',
								day: 'numeric'
							})}
						</p>
					</div>
				</div>

				<!-- Corner decorations -->
				<div class="absolute top-0 left-0 p-8">
					<div class="h-2 w-2 rounded-full bg-zinc-950"></div>
				</div>
				<div class="absolute bottom-0 right-0 p-8">
					<div class="h-2 w-2 rounded-full bg-zinc-950"></div>
				</div>
			</div>
		</div>

		<!-- Feedback Area -->
		<div class="mt-20 text-center max-w-2xl mx-auto" in:fly={{ y: 20, duration: 600, delay: 400 }}>
			<div class="flex items-center justify-center gap-4 mb-8">
				<div class="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
				<Icon name="award" size={24} class="text-blue-600" />
				<div class="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
			</div>
			<p class="text-sm font-medium text-zinc-500 dark:text-zinc-400 italic leading-relaxed">
				This certificate is an immutable record of your professional growth and strategic deployment. Verification nodes can be queried using the serial serial number provided above.
			</p>
			
			<div class="mt-12">
				<a href="/app/learning/courses" class="inline-flex items-center gap-3 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 border border-blue-600/20 hover:bg-blue-600/5 transition-all italic">
					Initialize Next Mission <Icon name="arrow-right" size={14} />
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	@media print {
		button { display: none !important; }
		.min-h-screen { padding-top: 0 !important; padding-bottom: 0 !important; }
	}
</style>
