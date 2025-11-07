<script lang="ts">
  import type { TypingStats } from './utils/stats.js';
  
  let { stats }: { stats: TypingStats } = $props();
</script>

<div class="stats-panel">
	<div class="stat">
		<span class="stat-value">{stats.wpm}</span>
		<span class="stat-label">WPM</span>
	</div>

	<div class="stat">
		<span class="stat-value">{stats.accuracy}%</span>
		<span class="stat-label">Accuracy</span>
	</div>

	<div class="stat">
		<span class="stat-value">{stats.time}s</span>
		<span class="stat-label">Time</span>
	</div>

	<div class="stat">
		<span class="stat-value {stats.errors > 0 ? 'error' : ''}">{stats.errors}</span>
		<span class="stat-label">Errors</span>
	</div>

	<div class="progress-bar">
		<div
			class="progress-fill"
			style="width: {stats.progress}%"
			role="progressbar"
			aria-valuenow={stats.progress}
			aria-valuemin={0}
			aria-valuemax={100}
		></div>
	</div>
</div>

<style>
	.stats-panel {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.5rem;
		margin-bottom: 2rem;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-gradient-purple-start);
		line-height: 1;
	}

	.stat-value.error {
		color: #ef4444;
	}

	.stat-label {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.progress-bar {
		grid-column: 1 / -1;
		height: 8px;
		background: var(--color-bg-light);
		border-radius: 4px;
		overflow: hidden;
		margin-top: 0.5rem;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		transition: width 0.3s ease;
		border-radius: 4px;
	}

	@media (max-width: 768px) {
		.stats-panel {
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
			padding: 1rem;
		}

		.stat-value {
			font-size: 1.5rem;
		}

		.progress-bar {
			grid-column: 1 / -1;
		}
	}
</style>
