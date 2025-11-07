<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form: any } = $props();

	let selectedCourse = $state<any>(null);
	let couponCode = $state('');
	let finalPrice = $state<number | null>(null);
	let discountAmount = $state(0);
	let couponValidated = $state(false);
	let couponError = $state<string | null>(null);
	let isApplying = $state(false);

	async function handleValidateCoupon() {
		if (!selectedCourse || !couponCode) return;

		isApplying = true;
		couponError = null;

		const formData = new FormData();
		formData.append('couponCode', couponCode);
		formData.append('courseId', selectedCourse.id);

		try {
			const response = await fetch('?/validateCoupon', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.type === 'failure') {
				couponError = result.data?.error || 'Invalid coupon code';
				couponValidated = false;
				finalPrice = selectedCourse.price;
				discountAmount = 0;
			} else {
				couponValidated = true;
				finalPrice = result.data.finalPrice;
				discountAmount = result.data.discountAmount;
			}
		} catch (err) {
			couponError = 'Failed to validate coupon';
			couponValidated = false;
		} finally {
			isApplying = false;
		}
	}
</script>

<svelte:head>
	<title>Select Your Course - Naik Kelas</title>
</svelte:head>

<div class="onboarding-container">
	<div class="onboarding-header">
		<h1>Welcome to Naik Kelas! 🎉</h1>
		<p>Select your first course to get started on your learning journey</p>
	</div>

	<div class="courses-section">
		<h2>Available Courses</h2>
		<div class="courses-grid">
			{#each data.courses as course}
				<label class="course-card" class:selected={selectedCourse?.id === course.id}>
					<input
						type="radio"
						name="courseId"
						value={course.id}
						onchange={() => {
							selectedCourse = course;
							finalPrice = course.price;
							couponValidated = false;
							couponCode = '';
							couponError = null;
							discountAmount = 0;
						}}
					/>
					<div class="course-info">
						<h3>{course.title}</h3>
						<p>{course.description}</p>
						<div class="price">Rp {course.price.toLocaleString('id-ID')}</div>
					</div>
				</label>
			{/each}
		</div>
	</div>

	{#if selectedCourse}
		<div class="enrollment-section">
			<form method="POST" action="?/enroll" use:enhance>
				<input type="hidden" name="courseId" value={selectedCourse.id} />
				<input type="hidden" name="couponCode" value={couponCode} />

				<div class="coupon-section">
					<label for="couponCode">Have a coupon code? (Optional)</label>
					<div class="coupon-input-group">
						<input
							type="text"
							id="couponCode"
							bind:value={couponCode}
							placeholder="Enter coupon code"
							class="coupon-input"
						/>
						<button
							type="button"
							onclick={handleValidateCoupon}
							class="validate-btn"
							disabled={isApplying}
						>
							{isApplying ? 'Validating...' : 'Validate'}
						</button>
					</div>

					{#if couponError}
						<div class="error-message">{couponError}</div>
					{/if}

					<div class="price-summary">
						<div class="price-row">
							<span>Original Price:</span>
							<span>Rp {selectedCourse.price.toLocaleString('id-ID')}</span>
						</div>
						{#if couponValidated && discountAmount > 0}
							<div class="price-row discount">
								<span>Discount:</span>
								<span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
							</div>
							<div class="price-row final">
								<span>Final Price:</span>
								<span>Rp {finalPrice?.toLocaleString('id-ID')}</span>
							</div>
						{/if}
					</div>

					<button type="submit" class="enroll-btn">Enroll Now</button>
				</div>
			</form>
		</div>
	{/if}
</div>

<style>
	.onboarding-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 40px 20px;
	}

	.onboarding-header {
		text-align: center;
		margin-bottom: 40px;
	}

	.onboarding-header h1 {
		font-size: 2.5em;
		color: var(--color-primary-dark);
		margin-bottom: 10px;
	}

	.onboarding-header p {
		font-size: 1.2em;
		color: var(--color-primary-medium);
	}

	.courses-section h2 {
		font-size: 1.8em;
		color: var(--color-primary-dark);
		margin-bottom: 24px;
	}

	.courses-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 24px;
		margin-bottom: 40px;
	}

	.course-card {
		background: white;
		border: 3px solid var(--color-bg-hero-end);
		border-radius: 12px;
		padding: 24px;
		cursor: pointer;
		transition: all 0.3s ease;
		position: relative;
	}

	.course-card input[type='radio'] {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.course-card:hover,
	.course-card.selected {
		border-color: var(--color-gradient-purple-start);
		box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
		transform: translateY(-5px);
	}

	.course-info h3 {
		font-size: 1.4em;
		color: var(--color-primary-dark);
		margin-bottom: 12px;
	}

	.course-info p {
		color: var(--color-primary-medium);
		line-height: 1.6;
		margin-bottom: 16px;
		min-height: 60px;
	}

	.price {
		font-size: 1.3em;
		font-weight: 700;
		color: var(--color-gradient-purple-start);
	}

	.enrollment-section {
		margin-top: 40px;
	}

	.coupon-section {
		background: white;
		padding: 30px;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
	}

	.coupon-section label {
		display: block;
		margin-bottom: 10px;
		font-weight: 600;
		color: var(--color-primary-dark);
	}

	.coupon-input-group {
		display: flex;
		gap: 12px;
		margin-bottom: 20px;
	}

	.coupon-input {
		flex: 1;
		padding: 12px;
		border: 2px solid var(--color-bg-hero-end);
		border-radius: 8px;
		font-size: 1em;
	}

	.coupon-input:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
	}

	.validate-btn {
		padding: 12px 24px;
		background: var(--color-gradient-purple-start);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1em;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.validate-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	}

	.validate-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.error-message {
		padding: 12px;
		background: #fee2e2;
		color: #dc2626;
		border-radius: 8px;
		margin-bottom: 20px;
	}

	.price-summary {
		background: var(--color-bg-hero);
		padding: 20px;
		border-radius: 8px;
		margin-bottom: 20px;
	}

	.price-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
		font-size: 1.1em;
	}

	.price-row:last-child {
		margin-bottom: 0;
	}

	.price-row.discount {
		color: #059669;
		font-weight: 600;
	}

	.price-row.final {
		font-size: 1.3em;
		font-weight: 700;
		color: var(--color-gradient-purple-start);
		margin-top: 10px;
		padding-top: 10px;
		border-top: 2px solid var(--color-bg-hero-end);
	}

	.enroll-btn {
		width: 100%;
		padding: 16px;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1.2em;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.enroll-btn:hover {
		transform: translateY(-3px);
		box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
	}
</style>
