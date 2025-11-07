<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { getRandomText } from './utils/text-snippets.js';
	import { calculateStats, type TypingStats } from './utils/stats.js';
	import StatsPanel from './StatsPanel.svelte';
	import ResultsModal from './ResultsModal.svelte';

	let currentText = $state(getRandomText());
	let typedText = $state('');
	let isActive = $state(false);
	let isComplete = $state(false);
	let errors = $state<number[]>([]);
	let startTime = $state<number>(0);
	let currentTime = $state(0);
	let timerInterval: ReturnType<typeof setInterval> | null = null;
	let showResults = $state(false);

	let stats = $derived(
		calculateStats(typedText.length, errors.length, currentTime, currentText.text.length)
	);

	function handleKeyPress(e: KeyboardEvent) {
		if (showResults) return;

		// Ignore special keys
		if (e.key === 'Tab' || e.key === 'Escape' || e.key === 'Meta' || e.key === 'Control') {
			if (e.key === 'Escape') {
				resetGame();
			}
			return;
		}

		if (!isActive) {
			isActive = true;
			startTime = Date.now();
			startTimer();
		}

		if (e.key === 'Backspace') {
			if (typedText.length > 0) {
				typedText = typedText.slice(0, -1);
				// Remove last error if exists
				const lastIndex = errors.findIndex((e) => e === typedText.length);
				if (lastIndex !== -1) {
					errors = errors.filter((_, i) => i !== lastIndex);
				}
			}
			return;
		}

		const currentIndex = typedText.length;

		if (e.key === currentText.text[currentIndex]) {
			typedText += e.key;
		} else {
			errors = [...errors, currentIndex];
		}

		// Check if complete
		if (typedText.length >= currentText.text.length) {
			completeGame();
		}
	}

	function startTimer() {
		timerInterval = setInterval(() => {
			currentTime = Math.floor((Date.now() - startTime) / 1000);
		}, 1000);
	}

	function completeGame() {
		isComplete = true;
		if (timerInterval) {
			clearInterval(timerInterval);
		}
		setTimeout(() => {
			showResults = true;
		}, 500);
	}

	function resetGame() {
		currentText = getRandomText();
		typedText = '';
		isActive = false;
		isComplete = false;
		errors = [];
		startTime = 0;
		currentTime = 0;
		showResults = false;

		if (timerInterval) {
			clearInterval(timerInterval);
		}
	}

	function restartCurrent() {
		typedText = '';
		isActive = false;
		isComplete = false;
		errors = [];
		startTime = 0;
		currentTime = 0;
		showResults = false;

		if (timerInterval) {
			clearInterval(timerInterval);
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeyPress);
		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	});

	onDestroy(() => {
		if (timerInterval) {
			clearInterval(timerInterval);
		}
	});
</script>

<div class="classic-typing">
	<StatsPanel {stats} />

	<div class="text-container">
		<div class="text-display">
			{#each currentText.text.split('') as char, i}
				{@const isTyped = i < typedText.length}
				{@const isError = errors.includes(i)}
				{@const isCurrent = i === typedText.length}

				<span
					class="char {isTyped ? (isError ? 'error' : 'correct') : ''}"
					class:current={isCurrent}
				>
					{char === ' ' ? '·' : char}
				</span>
			{/each}
		</div>

		<div class="controls">
			<button class="btn btn-secondary" onclick={restartCurrent}> ↻ Restart </button>
			<button class="btn btn-secondary" onclick={resetGame}> ♻️ New Text </button>
		</div>
	</div>

	<div class="instructions">
		<p>Mulai ketik untuk memulai tes. Tekan Escape untuk reset.</p>
	</div>
</div>

{#if showResults}
	<ResultsModal
		onclose={() => (showResults = false)}
		onrestart={resetGame}
		{stats}
		mode="classic"
	/>
{/if}

<style>
	.classic-typing {
		max-width: 900px;
		margin: 0 auto;
	}

	.text-container {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}

	.text-display {
		font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
		font-size: 1.5rem;
		line-height: 2;
		color: var(--color-text-primary);
		margin-bottom: 2rem;
		min-height: 150px;
	}

	.char {
		transition: all 0.1s ease;
		padding: 2px 1px;
	}

	.char.current {
		background: var(--color-gradient-purple-start);
		color: white;
		border-radius: 3px;
	}

	.char.correct {
		color: #10b981;
	}

	.char.error {
		color: #ef4444;
		background: #fee2e2;
		border-radius: 3px;
	}

	.controls {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: 2px solid var(--color-border);
		border-radius: 8px;
		background: white;
		cursor: pointer;
		font-size: 1rem;
		transition: all 0.3s ease;
	}

	.btn:hover {
		border-color: var(--color-primary-soft-blue);
		background: var(--color-bg-light);
	}

	.btn-secondary {
		color: var(--color-text-secondary);
	}

	.instructions {
		text-align: center;
		color: var(--color-text-secondary);
		font-size: 0.9rem;
	}

	@media (max-width: 768px) {
		.text-display {
			font-size: 1.2rem;
			line-height: 1.8;
		}

		.text-container {
			padding: 1.5rem;
		}
	}
</style>
