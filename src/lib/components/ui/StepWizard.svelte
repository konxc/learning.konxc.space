<script lang="ts">
	import { COLOR, RADIUS, TEXT, TRANSITION, SPACING } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';

	interface Step {
		id: string;
		label: string;
		icon: string;
	}

	interface Props {
		currentStep: number;
		steps: Step[];
		maxCompletedStep?: number;
	}

	let { currentStep = $bindable(0), steps = [], maxCompletedStep = -1 }: Props = $props();

	const totalSteps = $derived(steps.length);

	// Progress is based on max completed step, not current step
	// We use totalSteps - 1 to align with labels in justify-between layout
	const progressWidth = $derived(
		`${maxCompletedStep >= 0 ? (Math.min(maxCompletedStep + 1, totalSteps - 1) / Math.max(1, totalSteps - 1)) * 100 : 0}%`
	);

	function goToStep(index: number) {
		// Allow navigation to any step (free navigation)
		currentStep = index;
	}
</script>

<div class="space-y-6">
	<!-- Progress Bar -->
	<div class="flex flex-col gap-3">
		<!-- Step Labels -->
		<div class="flex items-center justify-between text-xs">
			{#each steps as step, index}
				<button
					type="button"
					class={`flex cursor-pointer flex-col items-center gap-1 px-2 transition-all hover:opacity-80 ${
						index <= maxCompletedStep
							? 'text-zinc-900 dark:text-zinc-100'
							: 'text-zinc-400 dark:text-zinc-600'
					}`}
					onclick={() => goToStep(index)}
				>
					<span class="flex items-center gap-1.5 font-medium">
						{#if index <= maxCompletedStep}
							<Icon name="check" size={12} class="text-emerald-500" />
						{:else if index === maxCompletedStep + 1}
							<span class="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
								<span class="text-[10px] font-bold text-white">{index + 1}</span>
							</span>
						{:else}
							<span
								class="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700"
							>
								<span class="text-[10px] text-zinc-500 dark:text-zinc-400">{index + 1}</span>
							</span>
						{/if}
						<span class="hidden sm:inline">{step.label}</span>
					</span>
				</button>
			{/each}
		</div>

		<!-- Progress Track - based on completed steps -->
		<div class="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
			<div
				class="h-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
				style={`width: ${progressWidth}`}
			></div>
		</div>

		<!-- Step Counter -->
		<p class={`${TEXT.muted} text-center`}>
			Step {currentStep + 1} dari {totalSteps}
		</p>
	</div>
</div>
