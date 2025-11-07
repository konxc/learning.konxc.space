<script lang="ts">
	import type { TypingStats } from './utils/stats.js';

	let {
		stats,
		mode = 'classic' as 'classic' | 'programming',
		onclose,
		onrestart
	}: {
		stats: TypingStats;
		mode?: 'classic' | 'programming';
		onclose: () => void;
		onrestart: () => void;
	} = $props();
</script>

<div
	class="modal-overlay"
	onclick={onclose}
	role="button"
	tabindex="-1"
	onkeydown={(e) => e.key === 'Enter' && onclose()}
>
	<div
		class="modal-content"
		onclick={(e) => e.stopPropagation()}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="0"
		onkeydown={(e) => {
			if (e.key === 'Escape') onclose();
		}}
	>
		<button class="modal-close" onclick={onclose} aria-label="Close">×</button>

		<div class="modal-header">
			<h2 id="modal-title">Test Complete! 🎉</h2>
		</div>

		<div class="modal-body">
			<div class="results-grid">
				<div class="result-stat">
					<span class="result-value">{stats.wpm}</span>
					<span class="result-label">Words Per Minute</span>
				</div>

				<div class="result-stat">
					<span class="result-value">{stats.accuracy}%</span>
					<span class="result-label">Accuracy</span>
				</div>

				<div class="result-stat">
					<span class="result-value">{stats.time}s</span>
					<span class="result-label">Time</span>
				</div>

				<div class="result-stat">
					<span class="result-value {stats.errors > 0 ? 'has-error' : ''}">{stats.errors}</span>
					<span class="result-label">Errors</span>
				</div>
			</div>

			<div class="encouragement">
				{#if stats.accuracy >= 95}
					<p>Excellent! Amazing accuracy! 🌟</p>
				{:else if stats.accuracy >= 80}
					<p>Good job! Keep practicing! 💪</p>
				{:else}
					<p>Keep going! Practice makes perfect! 🚀</p>
				{/if}
			</div>
		</div>

		<div class="modal-footer">
			<button class="btn btn-primary" onclick={onrestart}> Try Again </button>
			<button class="btn btn-secondary" onclick={onclose}> Close </button>
		</div>
	</div>
</div>

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-content {
		background: white;
		border-radius: 16px;
		padding: 2rem;
		max-width: 500px;
		width: 90%;
		position: relative;
		animation: slideUp 0.3s ease;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	}

	@keyframes slideUp {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.modal-close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 32px;
		height: 32px;
		border: none;
		background: var(--color-bg-light);
		border-radius: 50%;
		cursor: pointer;
		font-size: 1.5rem;
		line-height: 1;
		color: var(--color-text-secondary);
		transition: all 0.3s ease;
	}

	.modal-close:hover {
		background: var(--color-border);
		color: var(--color-text-primary);
	}

	.modal-header h2 {
		margin: 0 0 1.5rem 0;
		color: var(--color-gradient-purple-start);
		font-size: 1.75rem;
	}

	.results-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.result-stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: var(--color-bg-light);
		border-radius: 12px;
	}

	.result-value {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--color-gradient-purple-start);
		line-height: 1;
	}

	.result-value.has-error {
		color: #ef4444;
	}

	.result-label {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		text-align: center;
	}

	.encouragement {
		text-align: center;
		padding: 1rem;
		margin-bottom: 1.5rem;
	}

	.encouragement p {
		margin: 0;
		font-size: 1.1rem;
		color: var(--color-text-primary);
	}

	.modal-footer {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.btn {
		padding: 0.75rem 2rem;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		border: 2px solid transparent;
	}

	.btn-primary {
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		color: white;
		border: none;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
	}

	.btn-secondary {
		background: white;
		color: var(--color-text-secondary);
		border-color: var(--color-border);
	}

	.btn-secondary:hover {
		border-color: var(--color-primary-soft-blue);
		color: var(--color-primary-soft-blue);
	}

	@media (max-width: 768px) {
		.modal-content {
			padding: 1.5rem;
		}

		.results-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.result-value {
			font-size: 2rem;
		}

		.modal-footer {
			flex-direction: column;
		}

		.btn {
			width: 100%;
		}
	}
</style>
