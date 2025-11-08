<script lang="ts">
	interface ModeSelectorProps {
		selectedMode?: 'classic' | 'programming';
		onModeChange?: (mode: 'classic' | 'programming') => void;
	}

	let { selectedMode = $bindable('classic'), onModeChange }: ModeSelectorProps = $props();

	function selectMode(mode: 'classic' | 'programming') {
		selectedMode = mode;
		onModeChange?.(mode);
	}
</script>

<div class="mode-selector">
	<button
		class="mode-btn {selectedMode === 'classic' ? 'active' : ''}"
		onclick={() => selectMode('classic')}
		aria-pressed={selectedMode === 'classic'}
	>
		<span class="mode-icon">📝</span>
		<div class="mode-content">
			<span class="mode-title">Mode Biasa</span>
			<span class="mode-description">Tingkatkan kecepatan mengetik Anda</span>
		</div>
	</button>

	<button
		class="mode-btn {selectedMode === 'programming' ? 'active' : ''}"
		onclick={() => selectMode('programming')}
		aria-pressed={selectedMode === 'programming'}
	>
		<span class="mode-icon">💻</span>
		<div class="mode-content">
			<span class="mode-title">Mode Pemrograman</span>
			<span class="mode-description">Biasakan syntax menjadi natural</span>
		</div>
	</button>
</div>

<style>
	.mode-selector {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
		justify-content: center;
	}

	.mode-btn {
		flex: 1;
		max-width: 300px;
		padding: 1.5rem;
		border: 2px solid var(--color-border, #e5e7eb);
		border-radius: 12px;
		background: white;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		gap: 1rem;
		text-align: left;
	}

	.mode-btn:hover {
		border-color: var(--color-primary-soft-blue);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.mode-btn.active {
		border-color: var(--color-gradient-purple-start);
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		color: white;
		box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
	}

	.mode-icon {
		font-size: 2rem;
		line-height: 1;
	}

	.mode-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.mode-title {
		font-weight: 600;
		font-size: 1.1rem;
	}

	.mode-description {
		font-size: 0.85rem;
		opacity: 0.9;
	}

	.mode-btn:focus-visible {
		outline: 3px solid var(--color-gradient-purple-start);
		outline-offset: 2px;
	}

	@media (max-width: 768px) {
		.mode-selector {
			flex-direction: column;
		}

		.mode-btn {
			max-width: 100%;
		}
	}
</style>
