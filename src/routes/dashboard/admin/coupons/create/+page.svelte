<script lang="ts">
	import type { PageData } from './$types';
	let { data, form }: { data: PageData; form: any } = $props();

	let couponType = $state('discount');
	let discountType = $state('percentage');
	let selectedCourses = $state([]);
	let couponCodeInput: HTMLInputElement;

	async function generateCode() {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let code = '';
		
		// Generate 6-12 character code
		const length = 6 + Math.floor(Math.random() * 7);
		
		for (let i = 0; i < length; i++) {
			code += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		
		// Check if code exists
		try {
			const response = await fetch('/dashboard/admin/coupons/create?action=checkCode', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code })
			});
			
			const result = await response.json();
			
			if (result.exists) {
				// Try again if exists
				generateCode();
			} else {
				couponCodeInput.value = code;
			}
		} catch (error) {
			// Fallback if check fails
			couponCodeInput.value = code;
		}
	}
</script>

<svelte:head>
	<title>Create Coupon - Admin</title>
</svelte:head>

<div class="create-coupon-page">
	<div class="page-header">
		<h1>Create New Coupon</h1>
		<a href="/dashboard/admin/coupons" class="back-btn">← Back to Coupons</a>
	</div>

	{#if form?.error}
		<div class="error-message">{form.error}</div>
	{/if}

	<form method="POST" class="coupon-form">
		<div class="form-group">
			<div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
				<label for="code" style="margin: 0;">Coupon Code *</label>
				<button type="button" class="generate-btn" onclick={generateCode}>🎲 Generate Code</button>
			</div>
			<input
				type="text"
				id="code"
				name="code"
				required
				placeholder="Enter coupon code (e.g., SUMMER2024)"
				style="text-transform: uppercase;"
				bind:this={couponCodeInput}
			/>
		</div>

		<div class="form-group">
			<label for="type">Coupon Type *</label>
			<select id="type" name="type" bind:value={couponType} required>
				<option value="discount">Discount</option>
				<option value="free">Free Course</option>
			</select>
		</div>

		{#if couponType === 'discount'}
			<div class="form-row">
				<div class="form-group">
					<label for="discountType">Discount Type *</label>
					<select id="discountType" name="discountType" bind:value={discountType} required>
						<option value="percentage">Percentage (%)</option>
						<option value="fixed">Fixed Amount (Rp)</option>
					</select>
				</div>

				<div class="form-group">
					<label for="discountValue">Discount Value *</label>
					{#if discountType === 'percentage'}
						<input
							type="number"
							id="discountValue"
							name="discountValue"
							required
							min="1"
							max="100"
							placeholder="e.g., 20"
						/>
					{:else}
						<input
							type="number"
							id="discountValue"
							name="discountValue"
							required
							min="1"
							placeholder="e.g., 50000"
						/>
					{/if}
				</div>
			</div>
		{/if}

		<div class="form-group">
			<label for="description">Description</label>
			<textarea id="description" name="description" rows="3" placeholder="Enter coupon description"
			></textarea>
		</div>

		<div class="form-row">
			<div class="form-group">
				<label for="maxUses">Max Uses (optional)</label>
				<input
					type="number"
					id="maxUses"
					name="maxUses"
					min="1"
					placeholder="Leave empty for unlimited"
				/>
			</div>

			<div class="form-group">
				<label for="minPurchaseAmount">Minimum Purchase (optional)</label>
				<input
					type="number"
					id="minPurchaseAmount"
					name="minPurchaseAmount"
					min="0"
					placeholder="Rp"
				/>
			</div>
		</div>

		<div class="form-row">
			<div class="form-group">
				<label for="validFrom">Valid From *</label>
				<input type="datetime-local" id="validFrom" name="validFrom" required />
			</div>

			<div class="form-group">
				<label for="validUntil">Valid Until (optional)</label>
				<input type="datetime-local" id="validUntil" name="validUntil" />
			</div>
		</div>

		<div class="form-group">
			<label>Applicable Courses (optional)</label>
			<p class="help-text">Select specific courses or leave empty for all courses</p>
			<div class="course-selection">
				{#each data.courses as course}
					<label class="course-checkbox">
						<input type="checkbox" bind:group={selectedCourses} value={course.id} />
						<span>{course.title}</span>
					</label>
				{/each}
			</div>
			<input type="hidden" name="applicableCourses" value={JSON.stringify(selectedCourses)} />
		</div>

		<div class="form-actions">
			<button type="submit" class="submit-btn">Create Coupon</button>
			<a href="/dashboard/admin/coupons" class="cancel-btn">Cancel</a>
		</div>
	</form>
</div>

<style>
	.create-coupon-page {
		max-width: 800px;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
	}

	.page-header h1 {
		font-size: 2em;
		color: var(--color-primary-dark);
	}

	.back-btn {
		padding: 10px 20px;
		background: #f3f4f6;
		color: var(--color-primary-dark);
		text-decoration: none;
		border-radius: 8px;
		font-weight: 500;
		transition: all 0.2s ease;
	}

	.back-btn:hover {
		background: #e5e7eb;
	}

	.error-message {
		padding: 12px 16px;
		background: #fee2e2;
		color: #dc2626;
		border-radius: 8px;
		margin-bottom: 24px;
	}

	.coupon-form {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
	}

	label {
		font-weight: 600;
		color: var(--color-primary-dark);
		font-size: 0.95em;
	}

	.help-text {
		font-size: 0.85em;
		color: var(--color-primary-medium);
		margin: 0;
	}

	input,
	textarea,
	select {
		padding: 12px 16px;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-size: 1em;
		transition: all 0.2s ease;
		font-family: inherit;
	}

	input:focus,
	textarea:focus,
	select:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	textarea {
		resize: vertical;
		min-height: 80px;
	}

	.course-selection {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 12px;
		max-height: 300px;
		overflow-y: auto;
		padding: 12px;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
	}

	.course-checkbox {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		padding: 8px;
		border-radius: 6px;
		transition: all 0.2s ease;
	}

	.course-checkbox:hover {
		background: var(--color-bg-hero);
	}

	.course-checkbox input[type='checkbox'] {
		width: auto;
		cursor: pointer;
	}

	.form-actions {
		display: flex;
		gap: 12px;
		margin-top: 12px;
	}

	.submit-btn {
		padding: 14px 32px;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1em;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.submit-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
	}

	.cancel-btn {
		padding: 14px 32px;
		background: white;
		color: var(--color-primary-dark);
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		text-decoration: none;
		font-size: 1em;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.cancel-btn:hover {
		border-color: var(--color-gradient-purple-start);
		background: var(--color-bg-hero);
	}

	.generate-btn {
		padding: 8px 16px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 0.85em;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.generate-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	}

	@media (max-width: 768px) {
		.page-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
		}

		.form-row {
			grid-template-columns: 1fr;
		}
	}
</style>
