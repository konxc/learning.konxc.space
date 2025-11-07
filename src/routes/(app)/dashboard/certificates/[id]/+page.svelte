<script lang="ts">
	import type { PageData } from './$types';
	import html2canvas from 'html2canvas';
	import jsPDF from 'jspdf';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();
	let certificateElement: HTMLDivElement | undefined;
	let isDownloading = $state(false);

	async function downloadPDF() {
		if (!certificateElement) return;

		isDownloading = true;
		try {
			const canvas = await html2canvas(certificateElement, {
				scale: 2,
				useCORS: true,
				backgroundColor: '#ffffff'
			});

			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF('landscape', 'mm', 'a4');
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();
			const imgWidth = pdfWidth;
			const imgHeight = (canvas.height * pdfWidth) / canvas.width;

			// Center the image if it's smaller than the page
			const yOffset = (pdfHeight - imgHeight) / 2;
			pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
			pdf.save(`Certificate-${data.certificate.serial}.pdf`);
		} catch (error) {
			console.error('Failed to generate PDF:', error);
			alert('Failed to download certificate. Please try again.');
		} finally {
			isDownloading = false;
		}
	}
</script>

<svelte:head>
	<title>Certificate - {data.course.title}</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-5xl">
		<div class="mb-8 flex items-center justify-between gap-4">
			<h1 class={`${TEXT.h1} ${COLOR.textPrimary}`}>Certificate of Completion</h1>
			<button
				onclick={downloadPDF}
				disabled={isDownloading}
				class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-6 py-3 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 ${
					isDownloading ? 'cursor-not-allowed opacity-60' : ''
				}`}
			>
				{isDownloading ? 'Generating PDF...' : 'Download PDF'}
			</button>
		</div>

		<div class="mb-8 bg-linear-to-br from-blue-50/50 to-purple-50/50 p-10 dark:from-blue-950/20 dark:to-purple-950/20 ${RADIUS.card}">
			<div
				bind:this={certificateElement}
				class={`${RADIUS.small} ${COLOR.card} ${ELEVATION.card} overflow-hidden border-4 border-blue-600`}
			>
				<div class="flex min-h-[600px] flex-col justify-between p-16 print:p-16">
					<div class="certificate-header">
						<h2
							class="mb-4 text-center text-5xl font-bold text-blue-600 dark:text-blue-400"
							style="font-size: 3em;"
						>
							Certificate of Completion
						</h2>
						<div
							class="mx-auto mb-10 h-1 w-48 bg-linear-to-r from-transparent via-blue-600 to-transparent"
							style="height: 3px; width: 200px;"
						></div>
					</div>

					<div class="certificate-body flex flex-1 flex-col justify-center gap-5 text-center">
						<p class={`${TEXT.body} text-xl italic ${COLOR.textMuted}`} style="font-size: 1.3em;">
							This is to certify that
						</p>
						<p
							class={`my-5 text-4xl font-bold ${COLOR.textPrimary}`}
							style="font-size: 2.5em; margin: 20px 0;"
						>
							{data.user.fullName || data.user.username}
						</p>
						<p class={`${TEXT.body} text-lg ${COLOR.textMuted}`} style="font-size: 1.2em;">
							has successfully completed the course
						</p>
						<p
							class={`mt-5 text-3xl font-semibold text-blue-600 dark:text-blue-400`}
							style="font-size: 1.8em; margin-top: 20px;"
						>
							{data.course.title}
						</p>
					</div>

					<div class="certificate-footer mt-10 flex items-end justify-between">
						<div class="text-left">
							<p class={`${TEXT.small} mb-1 ${COLOR.textMuted}`} style="font-size: 0.85em;">
								Certificate Serial Number
							</p>
							<p
								class={`${TEXT.body} font-semibold ${COLOR.textPrimary} font-mono`}
								style="font-size: 1.1em; font-family: 'Courier New', monospace;"
							>
								{data.certificate.serial}
							</p>
						</div>
						<div class="text-right">
							<p class={`${TEXT.body} font-semibold ${COLOR.textPrimary}`}>
								{new Date(data.certificate.issuedAt).toLocaleDateString('id-ID', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<PageSection>
			<div class="text-center">
				<p class={`${TEXT.body} ${COLOR.textMuted} mb-4 leading-relaxed`}>
					This certificate verifies that you have successfully completed all course requirements including
					lessons, quizzes, and assessments. Keep this certificate as proof of your achievement.
				</p>
				<a
					href="/dashboard/my-courses"
					class={`inline-flex items-center ${TEXT.button} ${COLOR.accent} font-semibold ${TRANSITION.colors} hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
				>
					← Back to My Courses
				</a>
			</div>
		</PageSection>
	</div>
</PageWrapper>

<style>
	@media print {
		/* Hide download button and info section when printing */
		button,
		:global(.certificate-info),
		:global(.certificate-header > h1),
		:global(.certificate-header > button) {
			display: none !important;
		}

		/* Remove background gradient for print */
		div:has(.certificate-body) {
			background: white !important;
			padding: 0 !important;
		}
	}
</style>

