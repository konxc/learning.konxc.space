<script lang="ts">
	import DropdownMenu from '$lib/components/DropdownMenu.svelte';
	import { themes, type ThemeName } from './utils/themes.js';
	import { type Language } from './utils/code-snippets.js';

	let { onclose }: { onclose: () => void } = $props();

	let selectedTheme = $state<ThemeName>('monokai');
	let selectedLanguage = $state<Language>('javascript');
	let selectedDifficulty = $state<'beginner' | 'intermediate' | 'advanced'>('beginner');

	const languages: Language[] = ['javascript', 'python', 'typescript', 'go', 'rust', 'java'];

	function handleThemeChange(theme: ThemeName) {
		selectedTheme = theme;
		// Apply theme to localStorage or emit event
		localStorage.setItem('typing-theme', theme);
	}

	function handleLanguageChange(lang: Language) {
		selectedLanguage = lang;
		localStorage.setItem('typing-language', lang);
	}

	function handleDifficultyChange(difficulty: 'beginner' | 'intermediate' | 'advanced') {
		selectedDifficulty = difficulty;
		localStorage.setItem('typing-difficulty', difficulty);
	}
</script>

<div
	class="settings-overlay"
	role="button"
	tabindex="0"
	aria-label="Close settings"
	onclick={onclose}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') onclose();
	}}
>
	<div
		class="settings-modal"
		role="dialog"
		aria-modal="true"
		aria-label="Game settings"
		tabindex="0"
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => {
			if (e.key === 'Escape') onclose();
		}}
	>
		<div class="settings-header">
			<h2>Settings</h2>
			<button class="close-btn" onclick={onclose}>×</button>
		</div>

		<div class="settings-body">
			<div class="setting-group">
				<span class="setting-label">Color Theme</span>
				<DropdownMenu align="right" minWidth={200}>
					{#snippet trigger()}
						<span>{themes.find((t) => t.name === selectedTheme)?.displayName || 'Monokai'}</span>
					{/snippet}
					{#each themes as theme}
						<button
							type="button"
							class="dropdown-option {selectedTheme === theme.name ? 'is-active' : ''}"
							role="option"
							aria-selected={selectedTheme === theme.name}
							tabindex="0"
							onclick={() => handleThemeChange(theme.name)}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') handleThemeChange(theme.name);
							}}
						>
							{theme.displayName}
						</button>
					{/each}
				</DropdownMenu>
			</div>

			<div class="setting-group">
				<span class="setting-label">Programming Language</span>
				<DropdownMenu align="right" minWidth={200}>
					{#snippet trigger()}
						<span>{selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}</span>
					{/snippet}
					{#each languages as lang}
						<button
							type="button"
							class="dropdown-option {selectedLanguage === lang ? 'is-active' : ''}"
							role="option"
							aria-selected={selectedLanguage === lang}
							tabindex="0"
							onclick={() => handleLanguageChange(lang)}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') handleLanguageChange(lang);
							}}
						>
							{lang.charAt(0).toUpperCase() + lang.slice(1)}
						</button>
					{/each}
				</DropdownMenu>
			</div>

			<div class="setting-group">
				<span class="setting-label">Difficulty Level</span>
				<div class="difficulty-selector">
					<button
						class="difficulty-btn {selectedDifficulty === 'beginner' ? 'active' : ''}"
						onclick={() => handleDifficultyChange('beginner')}
					>
						Beginner
					</button>
					<button
						class="difficulty-btn {selectedDifficulty === 'intermediate' ? 'active' : ''}"
						onclick={() => handleDifficultyChange('intermediate')}
					>
						Intermediate
					</button>
					<button
						class="difficulty-btn {selectedDifficulty === 'advanced' ? 'active' : ''}"
						onclick={() => handleDifficultyChange('advanced')}
					>
						Advanced
					</button>
				</div>
			</div>
		</div>

		<div class="settings-footer">
			<button class="btn btn-primary" onclick={onclose}> Done </button>
		</div>
	</div>
</div>

<style>
	.settings-overlay {
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

	.settings-modal {
		background: white;
		border-radius: 16px;
		padding: 0;
		max-width: 500px;
		width: 90%;
		max-height: 90vh;
		overflow: hidden;
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

	.settings-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.settings-header h2 {
		margin: 0;
		font-size: 1.5rem;
		color: var(--color-gradient-purple-start);
	}

	.close-btn {
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

	.close-btn:hover {
		background: var(--color-border);
		color: var(--color-text-primary);
	}

	.settings-body {
		padding: 1.5rem;
		overflow-y: auto;
	}

	.setting-group {
		margin-bottom: 2rem;
	}

	.setting-label {
		display: block;
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: 0.75rem;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.difficulty-selector {
		display: flex;
		gap: 0.5rem;
	}

	.difficulty-btn {
		flex: 1;
		padding: 0.75rem;
		border: 2px solid var(--color-border);
		border-radius: 8px;
		background: white;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		transition: all 0.3s ease;
		color: var(--color-text-secondary);
	}

	.difficulty-btn:hover {
		border-color: var(--color-primary-soft-blue);
		color: var(--color-primary-soft-blue);
	}

	.difficulty-btn.active {
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		color: white;
		border-color: transparent;
	}

	.settings-footer {
		padding: 1.5rem;
		border-top: 1px solid var(--color-border);
		display: flex;
		justify-content: flex-end;
	}

	.btn {
		padding: 0.75rem 2rem;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		border: none;
	}

	.btn-primary {
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		color: white;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
	}

	@media (max-width: 768px) {
		.settings-modal {
			width: 95%;
			max-height: 95vh;
		}

		.difficulty-selector {
			flex-direction: column;
		}
	}
</style>
