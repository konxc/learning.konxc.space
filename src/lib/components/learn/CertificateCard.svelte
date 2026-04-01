<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	interface CertificateCardProps {
		progressPercent: number;
		courseId: string;
		certificateId?: string;
	}

	let { progressPercent, courseId, certificateId }: CertificateCardProps = $props();

	let claiming = $state(false);

	async function handleClaim() {
		claiming = true;
		try {
			const response = await fetch(`/app/explore/${courseId}/learn/complete`, {
				method: 'POST'
			});
			const result = await response.json();
			if (result.success) {
				window.location.href = `/app/learning/certificates/${result.certificateId}`;
			} else {
				alert(result.message || 'Node incomplete.');
			}
		} catch (err) {
			console.error(err);
		} finally {
			claiming = false;
		}
	}
</script>

<div
	class={`relative overflow-hidden rounded-[3rem] p-12 text-white shadow-2xl transition-all duration-1000 ${progressPercent === 100 ? 'bg-linear-to-br from-emerald-600 to-teal-700' : 'bg-linear-to-br from-zinc-900 to-black'}`}
>
	<div class="absolute top-0 right-0 p-12 opacity-10">
		<Icon name="award" size={200} />
	</div>

	<div class="relative z-10 max-w-2xl">
		<div class="mb-6 h-1 w-20 rounded-full bg-white/40"></div>
		<h3 class="mb-4 text-3xl leading-none font-black tracking-tighter uppercase italic md:text-5xl">
			Operational Maturity
		</h3>
		<p class="mb-10 text-sm leading-relaxed font-medium text-white/70 italic">
			Complete all protocols within this node to unlock your verified diplomatic seal and
			professional clearance. Current progress: {progressPercent}%.
		</p>

		<button
			class={`inline-flex items-center gap-4 rounded-2xl px-12 py-5 text-lg font-black tracking-widest uppercase transition-all ${progressPercent === 100 && !claiming ? 'bg-white text-emerald-600 hover:-translate-y-1 hover:shadow-2xl' : 'cursor-not-allowed border border-white/10 bg-white/10 text-white/40'}`}
			disabled={progressPercent < 100 || claiming}
			onclick={handleClaim}
		>
			{#if claiming}
				Claiming...
			{:else}
				Claim Verified Seal <Icon name="award" size={20} />
			{/if}
		</button>
	</div>
</div>
