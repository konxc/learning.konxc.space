<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data, form }: { data: PageData; form: any } = $props();

	let couponType = $state(data.coupon.type);
	let discountType = $state(data.coupon.discountType || 'percentage');
	let selectedCourses = $state<string[]>(
		data.coupon.applicableCourses ? JSON.parse(data.coupon.applicableCourses) : []
	);
	let couponCodeInput: HTMLInputElement;

	async function generateCode() {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let code = '';

		const length = 6 + Math.floor(Math.random() * 7);

		for (let i = 0; i < length; i++) {
			code += chars.charAt(Math.floor(Math.random() * chars.length));
		}

		try {
			const response = await fetch(
				`/dashboard/admin/coupons/edit/${data.coupon.id}?action=checkCode`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ code, currentId: data.coupon.id })
				}
			);

			const result = await response.json();

			if (result.exists) {
				generateCode();
			} else {
				couponCodeInput.value = code;
			}
		} catch (error) {
			couponCodeInput.value = code;
		}
	}
</script>

<svelte:head>
	<title>Edit Coupon - Admin</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-3xl">
		<div class="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
			<PageHeader title="Edit Coupon" />
			<a
				href="/dashboard/admin/coupons"
				class={`inline-flex items-center ${RADIUS.button} ${COLOR.neutral} px-5 py-2.5 ${TEXT.button} ${COLOR.textPrimary} font-medium ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600/70 focus-visible:ring-offset-1`}
			>
				← Back to Coupons
			</a>
		</div>

		{#if form?.error}
			<PageSection>
				<div class={`${RADIUS.button} ${SPACING.cardPadding} ${COLOR.error} ${ELEVATION.base}`} role="alert">
					{form.error}
				</div>
			</PageSection>
		{/if}

		<PageSection>
			<form method="POST" class="flex flex-col gap-6">
				<div class="flex flex-col gap-2">
					<div class="flex items-center justify-between gap-3">
						<label for="code" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
							Coupon Code *
						</label>
						<button
							type="button"
							onclick={generateCode}
							class={`inline-flex items-center ${RADIUS.button} bg-linear-to-r from-blue-600 to-purple-600 px-4 py-2 ${TEXT.small} font-semibold text-white whitespace-nowrap ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
						>
							🎲 Generate Code
						</button>
					</div>
					<input
						type="text"
						id="code"
						name="code"
						required
						value={data.coupon.code}
						placeholder="Enter coupon code (e.g., SUMMER2024)"
						bind:this={couponCodeInput}
						class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} uppercase outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label for="type" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
						Coupon Type *
					</label>
					<select
						id="type"
						name="type"
						bind:value={couponType}
						required
						class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					>
						<option value="discount" selected={couponType === 'discount'}>Discount</option>
						<option value="free" selected={couponType === 'free'}>Free Course</option>
					</select>
				</div>

				{#if couponType === 'discount'}
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="flex flex-col gap-2">
							<label for="discountType" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
								Discount Type *
							</label>
							<select
								id="discountType"
								name="discountType"
								bind:value={discountType}
								required
								class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
							>
								<option value="percentage" selected={discountType === 'percentage'}>Percentage (%)</option>
								<option value="fixed" selected={discountType === 'fixed'}>Fixed Amount (Rp)</option>
							</select>
						</div>

						<div class="flex flex-col gap-2">
							<label for="discountValue" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
								Discount Value *
							</label>
							{#if discountType === 'percentage'}
								<input
									type="number"
									id="discountValue"
									name="discountValue"
									required
									min="1"
									max="100"
									placeholder="e.g., 20"
									value={data.coupon.discountValue || ''}
									class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
								/>
							{:else}
								<input
									type="number"
									id="discountValue"
									name="discountValue"
									required
									min="1"
									placeholder="e.g., 50000"
									value={data.coupon.discountValue || ''}
									class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
								/>
							{/if}
						</div>
					</div>
				{/if}

				<div class="flex flex-col gap-2">
					<label for="description" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
						Description
					</label>
					<textarea
						id="description"
						name="description"
						rows="3"
						placeholder="Enter coupon description"
						class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} resize-y min-h-[80px] focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					>{data.coupon.description || ''}</textarea>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="flex flex-col gap-2">
						<label for="maxUses" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
							Max Uses (optional)
						</label>
						<input
							type="number"
							id="maxUses"
							name="maxUses"
							min="1"
							placeholder="Leave empty for unlimited"
							value={data.coupon.maxUses || ''}
							class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						/>
					</div>

					<div class="flex flex-col gap-2">
						<label
							for="minPurchaseAmount"
							class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}
						>
							Minimum Purchase (optional)
						</label>
						<input
							type="number"
							id="minPurchaseAmount"
							name="minPurchaseAmount"
							min="0"
							placeholder="Rp"
							value={data.coupon.minPurchaseAmount || ''}
							class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						/>
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="flex flex-col gap-2">
						<label for="validFrom" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
							Valid From *
						</label>
						<input
							type="datetime-local"
							id="validFrom"
							name="validFrom"
							required
							value={new Date(data.coupon.validFrom).toISOString().slice(0, 16)}
							class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						/>
					</div>

					<div class="flex flex-col gap-2">
						<label for="validUntil" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
							Valid Until (optional)
						</label>
						<input
							type="datetime-local"
							id="validUntil"
							name="validUntil"
							value={data.coupon.validUntil
								? new Date(data.coupon.validUntil).toISOString().slice(0, 16)
								: ''}
							class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						/>
					</div>
				</div>

				<div class="flex flex-col gap-2">
					<fieldset class={`${RADIUS.small} ${COLOR.cardBorder} border p-4`}>
						<legend class={`${TEXT.button} ${COLOR.textPrimary} font-semibold px-2`}>
							Applicable Courses (optional)
						</legend>
						<p class={`${TEXT.small} ${COLOR.textMuted} mb-3`}>
							Select specific courses or leave empty for all courses
						</p>
						<div
							class="grid max-h-[300px] grid-cols-1 gap-3 overflow-y-auto p-3 md:grid-cols-2"
							style="grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));"
						>
							{#each data.courses as course}
								<label
									class={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 ${TRANSITION.all} hover:${COLOR.neutralHover} focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/50`}
								>
									<input
										type="checkbox"
										bind:group={selectedCourses}
										value={course.id}
										checked={selectedCourses.includes(course.id)}
										class="h-5 w-5 cursor-pointer accent-blue-600"
									/>
									<span class={`${TEXT.body} ${COLOR.textPrimary}`}>{course.title}</span>
								</label>
							{/each}
						</div>
					</fieldset>
					<input type="hidden" name="applicableCourses" value={JSON.stringify(selectedCourses)} />
				</div>

				<div class="flex items-center gap-3 pt-2">
					<button
						type="submit"
						class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-8 py-3.5 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
					>
						Update Coupon
					</button>
					<a
						href="/dashboard/admin/coupons"
						class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} px-8 py-3.5 ${TEXT.button} font-semibold ${COLOR.card} ${COLOR.textPrimary} ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
					>
						Cancel
					</a>
				</div>
			</form>
		</PageSection>
	</div>
</PageWrapper>

