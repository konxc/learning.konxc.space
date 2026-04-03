<script lang="ts">
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION, SPACING } from '$lib/config/design';
	import { fly, fade } from 'svelte/transition';
	import { redirect } from '@sveltejs/kit';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';

	interface Props {
		orgId: string;
	}

	let { orgId }: Props = $props();

	// Wizard state
	let currentStep = $state(1);
	let isSubmitting = $state(false);

	// Course data
	let courseData = $state({
		title: '',
		description: '',
		track: 'technical',
		category: 'general',
		thumbnailUrl: '',
		price: 0,
		visibility: 'draft'
	});

	// Validation
	const validateStep1 = () => {
		return courseData.title.length >= 3 && courseData.description.length >= 10;
	};

	const validateStep2 = () => {
		// For now, step 2 is optional (modules can be added later)
		return true;
	};

	const validateStep3 = () => {
		return courseData.price >= 0;
	};

	const canProceed = $derived(() => {
		if (currentStep === 1) return validateStep1();
		if (currentStep === 2) return validateStep2();
		if (currentStep === 3) return validateStep3();
		return false;
	});

	// Navigation
	const nextStep = () => {
		if (canProceed && currentStep < 3) {
			currentStep++;
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			currentStep--;
		}
	};

	// Submit
	const handleSubmit = async () => {
		if (!canProceed) return;

		isSubmitting = true;
		try {
			const response = await fetch(`/app/organizations/${orgId}/mentor/courses/new`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(courseData)
			});

			if (response.ok) {
				const result = await response.json();
				if (result.type === 'success' && result.data?.courseId) {
					throw redirect(
						303,
						`/app/organizations/${orgId}/mentor/courses/${result.data.courseId}/settings`
					);
				}
			}
		} catch (error: any) {
			if (error?.status === 303) {
				throw error;
			}
			console.error('Failed to create course:', error);
		} finally {
			isSubmitting = false;
		}
	};

	// Steps configuration
	const steps = [
		{ number: 1, title: 'Basic Info', icon: '📝' },
		{ number: 2, title: 'Modules & Lessons', icon: '📚' },
		{ number: 3, title: 'Pricing & Visibility', icon: '💰' }
	];
</script>

<div class={`mx-auto max-w-4xl ${SPACING.page}`}>
	<!-- Progress Steps -->
	<div class="mb-12">
		<div class="flex items-center justify-between">
			{#each steps as step, index}
				<div class="flex flex-1 items-center">
					<!-- Step Circle -->
					<div class="relative flex flex-col items-center">
						<button
							type="button"
							onclick={() => {
								if (step.number < currentStep) currentStep = step.number;
							}}
							disabled={step.number > currentStep}
							class={`flex h-12 w-12 items-center justify-center rounded-full text-xl transition-all ${
								currentStep === step.number
									? `${COLOR.accentBg} text-white ${ELEVATION.card} scale-110`
									: currentStep > step.number
										? `${COLOR.successBg} text-white`
										: `${COLOR.neutral} ${COLOR.textMuted}`
							} ${step.number < currentStep ? 'cursor-pointer hover:scale-105' : ''}`}
						>
							{#if currentStep > step.number}
								✓
							{:else}
								{step.icon}
							{/if}
						</button>
						<span
							class={`mt-2 text-xs font-semibold ${
								currentStep === step.number ? COLOR.accent : COLOR.textMuted
							}`}
						>
							{step.title}
						</span>
					</div>

					<!-- Connector Line -->
					{#if index < steps.length - 1}
						<div class="mx-4 h-0.5 flex-1 ${COLOR.neutral}">
							<div
								class={`h-full ${COLOR.accentBg} ${TRANSITION.all}`}
								style={`width: ${currentStep > step.number ? '100%' : '0%'}`}
							></div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- Step Content -->
	<div class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${ELEVATION.card} p-8`}>
		{#if currentStep === 1}
			<div in:fly={{ x: 20, duration: 300 }} out:fly={{ x: -20, duration: 300 }}>
				<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-2`}>Basic Information</h2>
				<p class={`${TEXT.secondary} mb-8`}>
					Let's start with the basics. Give your course a compelling title and description.
				</p>

				<div class="space-y-6">
					<Input
						label="Course Title"
						bind:value={courseData.title}
						placeholder="e.g., Complete Digital Marketing Masterclass"
						required
					/>

					<div>
						<label
							for="description"
							class={`mb-1.5 block text-sm font-medium ${COLOR.textPrimary}`}
						>
							Description
						</label>
						<textarea
							bind:value={courseData.description}
							rows="5"
							required
							placeholder="Describe what students will learn in this course..."
							class={`w-full ${RADIUS.input} border px-4 py-3 text-sm outline-none ${COLOR.cardBorder} ${COLOR.card} ${COLOR.textPrimary} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						></textarea>
						<p class={`mt-1 text-xs ${COLOR.textMuted}`}>
							{courseData.description.length} / 500 characters
						</p>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="track" class={`mb-1.5 block text-sm font-medium ${COLOR.textPrimary}`}>
								Track
							</label>
							<select
								bind:value={courseData.track}
								class={`w-full ${RADIUS.input} border px-4 py-3 text-sm outline-none ${COLOR.cardBorder} ${COLOR.card} ${COLOR.textPrimary} focus:border-blue-500`}
							>
								<option value="technical">Technical</option>
								<option value="business">Business</option>
								<option value="hybrid">Hybrid (Digital Marketing)</option>
							</select>
						</div>

						<div>
							<label for="category" class={`mb-1.5 block text-sm font-medium ${COLOR.textPrimary}`}>
								Category
							</label>
							<select
								bind:value={courseData.category}
								class={`w-full ${RADIUS.input} border px-4 py-3 text-sm outline-none ${COLOR.cardBorder} ${COLOR.card} ${COLOR.textPrimary} focus:border-blue-500`}
							>
								<option value="general">General</option>
								<option value="marketing">Marketing</option>
								<option value="technical">Technical</option>
								<option value="business">Business</option>
								<option value="design">Design</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		{:else if currentStep === 2}
			<div in:fly={{ x: 20, duration: 300 }} out:fly={{ x: -20, duration: 300 }}>
				<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-2`}>Modules & Lessons</h2>
				<p class={`${TEXT.secondary} mb-8`}>
					You can add modules and lessons after creating the course. Click "Next" to continue.
				</p>

				<div class={`${COLOR.neutral} ${RADIUS.card} p-8 text-center`}>
					<div class="mb-4 text-6xl">📚</div>
					<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>Modules Coming Soon</h3>
					<p class={`${TEXT.secondary}`}>
						After creating your course, you'll be able to add modules, lessons, and materials from
						the course management page.
					</p>
				</div>
			</div>
		{:else if currentStep === 3}
			<div in:fly={{ x: 20, duration: 300 }} out:fly={{ x: -20, duration: 300 }}>
				<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-2`}>Pricing & Visibility</h2>
				<p class={`${TEXT.secondary} mb-8`}>Set your course price and choose who can see it.</p>

				<div class="space-y-6">
					<div>
						<label for="price" class={`mb-1.5 block text-sm font-medium ${COLOR.textPrimary}`}>
							Price (IDR)
						</label>
						<input
							type="number"
							bind:value={courseData.price}
							min="0"
							placeholder="0"
							class={`w-full ${RADIUS.input} border px-4 py-3 text-sm outline-none ${COLOR.cardBorder} ${COLOR.card} ${COLOR.textPrimary} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						/>
						<p class={`mt-1 text-xs ${COLOR.textMuted}`}>Set to 0 for free courses</p>
					</div>

					<div>
						<label for="visibility" class={`mb-1.5 block text-sm font-medium ${COLOR.textPrimary}`}>
							Visibility
						</label>
						<select
							bind:value={courseData.visibility}
							class={`w-full ${RADIUS.input} border px-4 py-3 text-sm outline-none ${COLOR.cardBorder} ${COLOR.card} ${COLOR.textPrimary} focus:border-blue-500`}
						>
							<option value="draft">Draft (Only you can see)</option>
							<option value="internal">Internal (Only org members)</option>
							<option value="public">Public (Everyone can see)</option>
						</select>
					</div>

					<!-- Summary -->
					<div class={`${COLOR.neutral} ${RADIUS.card} space-y-3 p-6`}>
						<h4 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4`}>Course Summary</h4>
						<div class="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span class={COLOR.textMuted}>Title:</span>
								<p class={`${COLOR.textPrimary} font-medium`}>{courseData.title || '-'}</p>
							</div>
							<div>
								<span class={COLOR.textMuted}>Track:</span>
								<p class={`${COLOR.textPrimary} font-medium capitalize`}>{courseData.track}</p>
							</div>
							<div>
								<span class={COLOR.textMuted}>Price:</span>
								<p class={`${COLOR.textPrimary} font-medium`}>
									{courseData.price === 0
										? 'Free'
										: `Rp ${courseData.price.toLocaleString('id-ID')}`}
								</p>
							</div>
							<div>
								<span class={COLOR.textMuted}>Visibility:</span>
								<p class={`${COLOR.textPrimary} font-medium capitalize`}>{courseData.visibility}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Navigation Buttons -->
		<div class="mt-8 flex items-center justify-between border-t pt-6 ${COLOR.cardBorder}">
			<button
				type="button"
				onclick={prevStep}
				disabled={currentStep === 1}
				class={`${RADIUS.button} px-6 py-2.5 text-sm font-semibold ${COLOR.textSecondary} hover:${COLOR.textPrimary} disabled:cursor-not-allowed disabled:opacity-30 ${TRANSITION.colors}`}
			>
				← Previous
			</button>

			<div class="flex gap-3">
				{#if currentStep < 3}
					<Button type="button" variant="primary" onclick={nextStep} disabled={!canProceed}>
						Next →
					</Button>
				{:else}
					<Button
						type="button"
						variant="primary"
						onclick={handleSubmit}
						disabled={!canProceed || isSubmitting}
					>
						{isSubmitting ? 'Creating...' : 'Create Course'}
					</Button>
				{/if}
			</div>
		</div>
	</div>
</div>
