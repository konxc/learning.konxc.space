<script lang="ts">
	const { data } = $props<{
		data: {
			courseId: string;
			clientKey: string;
			success?: boolean;
			snapToken?: string;
			redirect_url?: string;
			enrollmentId?: string;
			error?: string;
		};
	}>();

	// When action returns snapToken, trigger Snap pay
	$effect(() => {
		if (data?.success && data?.snapToken && typeof window !== 'undefined' && (window as any).snap) {
			(window as any).snap.pay(data.snapToken, {
				onSuccess: function () {
					location.href = '/dashboard';
				},
				onPending: function () {
					location.href = '/dashboard';
				},
				onError: function () {
					alert('Transaksi gagal. Silakan coba lagi.');
				}
			});
		}
	});
</script>

<svelte:head>
	{#if data.clientKey}
		<script
			src="https://app.sandbox.midtrans.com/snap/snap.js"
			data-client-key={data.clientKey}
		></script>
	{/if}
</svelte:head>

<div class="mx-auto max-w-xl p-6">
	<h1 class="mb-4 text-2xl font-semibold">Checkout</h1>
	{#if data.error}
		<p class="mb-4 text-red-600">{data.error}</p>
	{/if}
	<form method="post" class="space-y-4">
		<input type="hidden" name="courseId" value={data.courseId} />
		<div>
			<label for="couponCode" class="mb-1 block text-sm">Kode Kupon (opsional)</label>
			<input
				id="couponCode"
				name="couponCode"
				class="w-full rounded border px-3 py-2"
				placeholder="COUPON"
			/>
		</div>
		<button class="rounded bg-black px-4 py-2 text-white">Bayar sekarang</button>
	</form>
</div>
