<script lang="ts">
	interface Props {
		type: 'error' | 'success';
		message: string;
	}

	let { type, message }: Props = $props();
</script>

<div class="message" class:error={type === 'error'} class:success={type === 'success'}>
	<strong>{type === 'error' ? '⚠️ Error:' : '✓'}</strong>
	{message}
</div>

<style>
	.message {
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 24px;
	}

	.message.error {
		background: #fee2e2;
		color: #dc2626;
	}

	.message.success {
		background: #d1fae5;
		color: #065f46;
	}
</style>

