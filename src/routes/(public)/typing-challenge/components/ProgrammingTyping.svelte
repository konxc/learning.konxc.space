<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { getRandomSnippet, type CodeSnippet } from './utils/code-snippets.js';
	import { calculateStats, type TypingStats } from './utils/stats.js';
	import { getTheme, type Theme } from './utils/themes.js';
	import StatsPanel from './StatsPanel.svelte';
	import ResultsModal from './ResultsModal.svelte';

	let currentSnippet = $state(getRandomSnippet());
	let typedText = $state('');
	let isActive = $state(false);
	let isComplete = $state(false);
	let errors = $state<number[]>([]);
	let startTime = $state<number>(0);
	let currentTime = $state(0);
	let showLineNumbers = $state(true);
	let timerInterval: ReturnType<typeof setInterval> | null = null;
	let showResults = $state(false);
	let currentTheme = $state<Theme>(getTheme('monokai'));

	let stats = $derived(
		calculateStats(typedText.length, errors.length, currentTime, currentSnippet.code.length)
	);

	// Simple syntax highlighting based on character patterns
	function getCharType(char: string, index: number, code: string): string {
		const prevChar = index > 0 ? code[index - 1] : '';
		const nextChar = index < code.length - 1 ? code[index + 1] : '';

		// Strings
		if (
			prevChar === '"' ||
			prevChar === "'" ||
			prevChar === '`' ||
			(code.includes('"') && index >= code.indexOf('"') && index <= code.lastIndexOf('"'))
		) {
			return 'string';
		}

		// Numbers
		if (/\d/.test(char)) {
			return 'number';
		}

		// Operators and punctuation
		if (/[{}()\[\]=;:<>!&\|+\-*\/%]/.test(char)) {
			return 'operator';
		}

		return 'text';
	}

	function handleKeyPress(e: KeyboardEvent) {
		if (showResults) return;

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
				const lastIndex = errors.findIndex((e) => e === typedText.length);
				if (lastIndex !== -1) {
					errors = errors.filter((_, i) => i !== lastIndex);
				}
			}
			return;
		}

		const currentIndex = typedText.length;

		if (e.key === currentSnippet.code[currentIndex]) {
			typedText += e.key;
		} else {
			errors = [...errors, currentIndex];
		}

		if (typedText.length >= currentSnippet.code.length) {
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
		currentSnippet = getRandomSnippet();
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

	function toggleLineNumbers() {
		showLineNumbers = !showLineNumbers;
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

<div
	class="programming-typing"
	style="--theme-bg: {currentTheme.background}; --theme-text: {currentTheme.text}; --theme-correct: {currentTheme.correct}; --theme-error: {currentTheme.error};"
>
	<StatsPanel {stats} />

	<div class="code-info">
		<span class="language-badge">{currentSnippet.language}</span>
		<span class="difficulty-badge">{currentSnippet.difficulty}</span>
	</div>

	<div class="code-container" style="background: var(--theme-bg);">
		<div class="code-display">
			<div class="code-lines">
				{#each currentSnippet.code.split('\n') as line, lineNum}
					<div class="code-line">
						{#if showLineNumbers}
							<span class="line-number">{lineNum + 1}</span>
						{/if}
						<span class="line-content">
							{#each line.split('') as char, charIndex}
								{@const globalIndex =
									currentSnippet.code.split('\n').slice(0, lineNum).join('\n').length +
									(lineNum > 0 ? 1 : 0) +
									charIndex}
								{@const isTyped = globalIndex < typedText.length}
								{@const isError = errors.includes(globalIndex)}
								{@const isCurrent = globalIndex === typedText.length}

								<span
									class="char {isTyped ? (isError ? 'error' : 'correct') : 'untouched'}"
									class:current={isCurrent}
									style="color: {!isTyped
										? getCharType(char, charIndex, line) === 'text'
											? currentTheme.text
											: currentTheme.string
										: isTyped && !isError
											? currentTheme.correct
											: currentTheme.error}"
								>
									{char === ' ' ? '·' : char}
								</span>
							{/each}
						</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="controls">
			<button class="btn btn-secondary" onclick={restartCurrent}> ↻ Restart </button>
			<button class="btn btn-secondary" onclick={resetGame}> ♻️ New Code </button>
			<button class="btn btn-secondary" onclick={toggleLineNumbers}>
				{showLineNumbers ? '👁️ Hide Lines' : '🔢 Show Lines'}
			</button>
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
		mode="programming"
	/>
{/if}

<style>
	.programming-typing {
		max-width: 1000px;
		margin: 0 auto;
	}

	.code-info {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.language-badge,
	.difficulty-badge {
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.language-badge {
		background: var(--color-gradient-purple-start);
		color: white;
	}

	.difficulty-badge {
		background: var(--color-bg-light);
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border);
	}

	.code-container {
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}

	.code-display {
		font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
		font-size: 1.2rem;
		line-height: 1.8;
		color: var(--theme-text);
		margin-bottom: 2rem;
		min-height: 200px;
	}

	.code-lines {
		display: flex;
		flex-direction: column;
	}

	.code-line {
		display: flex;
		align-items: flex-start;
	}

	.line-number {
		display: inline-block;
		width: 40px;
		text-align: right;
		padding-right: 1rem;
		color: var(--theme-text);
		opacity: 0.5;
		user-select: none;
		flex-shrink: 0;
	}

	.line-content {
		flex: 1;
		display: inline-block;
	}

	.char {
		transition: all 0.1s ease;
		padding: 2px 1px;
	}

	.char.current {
		background: var(--theme-text);
		color: var(--theme-bg);
		border-radius: 3px;
	}

	.char.correct {
		color: var(--theme-correct);
	}

	.char.error {
		background: #fee2e2;
		border-radius: 3px;
	}

	.char.untouched {
		opacity: 0.8;
	}

	.controls {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
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
		.code-display {
			font-size: 1rem;
		}

		.code-container {
			padding: 1.5rem;
		}

		.line-number {
			width: 30px;
			padding-right: 0.75rem;
		}
	}
</style>
