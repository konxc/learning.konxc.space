<script lang="ts">
	import ModeSelector from './ModeSelector.svelte';
	import ClassicTyping from './ClassicTyping.svelte';
	import ProgrammingTyping from './ProgrammingTyping.svelte';
	import GameSettings from './GameSettings.svelte';

	let gameMode = $state<'classic' | 'programming'>('classic');
	let settings = $state({ visible: false });

	function handleModeChange(mode: 'classic' | 'programming') {
		gameMode = mode;
	}

	function toggleSettings() {
		settings.visible = !settings.visible;
	}
</script>

<div class="typing-game">
	<div class="game-header">
		<h1>Typing Challenge</h1>
		<p class="philosophy">
			<strong>Typing adalah skill dasar di era digital.</strong><br />
			Tidak peduli profesi Anda, mengetik cepat membuka potensi produktivitas.
		</p>

		<button class="settings-toggle" onclick={toggleSettings} aria-label="Open settings">
			⚙️ Settings
		</button>
	</div>

	{#if settings.visible}
		<GameSettings onclose={() => (settings.visible = false)} />
	{/if}

	<ModeSelector bind:selectedMode={gameMode} onModeChange={handleModeChange} />

	<div class="game-container">
		{#if gameMode === 'classic'}
			<ClassicTyping />
		{:else}
			<ProgrammingTyping />
		{/if}
	</div>
</div>

<style>
	.typing-game {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.game-header {
		text-align: center;
		margin-bottom: 3rem;
		position: relative;
	}

	.game-header h1 {
		font-size: 2.5rem;
		color: var(--color-gradient-purple-start);
		margin-bottom: 1rem;
	}

	.philosophy {
		font-size: 1.1rem;
		color: var(--color-text-secondary);
		line-height: 1.8;
	}

	.settings-toggle {
		position: absolute;
		top: 0;
		right: 0;
		padding: 0.5rem 1rem;
		background: white;
		border: 2px solid var(--color-border);
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		transition: all 0.3s ease;
	}

	.settings-toggle:hover {
		border-color: var(--color-primary-soft-blue);
		transform: translateY(-2px);
	}

	.game-container {
		margin-top: 2rem;
	}

	@media (max-width: 768px) {
		.typing-game {
			padding: 1rem 0.5rem;
		}

		.game-header h1 {
			font-size: 2rem;
		}

		.philosophy {
			font-size: 1rem;
		}

		.settings-toggle {
			position: static;
			margin-top: 1rem;
		}
	}
</style>
