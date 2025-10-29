<script lang="ts">
	interface Props {
		text: string;
		disabled?: boolean;
		loading?: boolean;
		type?: 'submit' | 'button';
	}

	let { text, disabled = false, loading = false, type = 'submit' }: Props = $props();
</script>

<button type={type} class="submit-btn" {disabled}>
	{#if loading}
		Loading...
	{:else}
		{text}
	{/if}
</button>

<style>
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
		margin-top: 8px;
		width: 100%;
	}

	.submit-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
	}

	.submit-btn:disabled {
		background: #e5e7eb;
		color: #9ca3af;
		cursor: not-allowed;
	}
</style>

