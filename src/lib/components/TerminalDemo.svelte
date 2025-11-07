<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import DropdownMenu from '$lib/components/DropdownMenu.svelte';

	const { containerEl = null, aboutOpen = false } = $props<{
		containerEl?: HTMLElement | null;
		aboutOpen?: boolean;
	}>();
	const dispatch = createEventDispatcher();

	let codeDisplay = $state('');
	let isTyping = $state(false);
	let codeSection = $state<HTMLElement | null>(null);
	let hasPlayed = $state(false);
	let isRebooting = $state(false);
	let timeouts: number[] = [];
	let isThemeOpen = $state(false);
	// aboutOpen dikelola parent

	// Interactive prompt state (y/n)
	let isAwaitingYesNo = $state(false);
	let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

	type Theme = 'default' | 'robbyrussell' | 'agnoster' | 'p10k';
	let theme = $state<Theme>('p10k');

	const directory = ' ~/Projects/naik-kelas';
	const gitBranch = ' [main]';

	const getThemeColor = (t: Theme) => {
		switch (t) {
			case 'p10k':
				return '#7ee787';
			case 'agnoster':
				return '#8be9fd';
			case 'robbyrussell':
				return '#f1fa8c';
			default:
				return '#4ade80';
		}
	};

	const getPrompt = (t: Theme) => {
		switch (t) {
			case 'p10k':
				return '❯ ';
			case 'agnoster':
				return '➜ ';
			case 'robbyrussell':
				return '➜ ';
			default:
				return '➜ ';
		}
	};

	const getRightArrow = (t: Theme) => {
		switch (t) {
			case 'p10k':
				return ' ❯';
			case 'agnoster':
				return '';
			case 'robbyrussell':
				return '';
			default:
				return ' ❯';
		}
	};

	const jsCode = `import naikkelas from 'koneksi';\n\nif (you.isReady() && you.hasDetermination()) {\n  naikkelas.register(you);\n  return "Welcome to the community! 🎉";\n}`;

	const getFullPrompt = () => `${getPrompt(theme)}${directory}${gitBranch}${getRightArrow(theme)} `;

	const clearAllTimeouts = () => {
		for (const t of timeouts) clearTimeout(t);
		timeouts = [];
	};

	const schedule = (fn: () => void, ms: number) => {
		const id = setTimeout(fn, ms) as unknown as number;
		timeouts.push(id);
		return id;
	};

	const setThemeAndRestart = (t: Theme) => {
		theme = t;
		clearAllTimeouts();
		isTyping = false;
		isRebooting = false;
		codeDisplay = '';
		hasPlayed = false;
		isAwaitingYesNo = false;
		startTyping();
	};

	const openAbout = () => {
		dispatch('aboutOpen');
	};

	const startTyping = () => {
		if (isTyping) return;
		isRebooting = hasPlayed;
		hasPlayed = true;
		isTyping = true;

		const container = codeSection?.closest('.terminal-window') as HTMLElement | null;
		if (container) container.style.setProperty('--terminal-foreground', getThemeColor(theme));

		let currentText = isRebooting ? '[zsh] restarting session… \n\n' : '';
		currentText += getFullPrompt();
		codeDisplay = currentText;

		schedule(() => {
			let cmdIndex = 0;
			const vimCmd = `vim register.js\n`;
			const typeCommand = () => {
				if (cmdIndex < vimCmd.length) {
					currentText += vimCmd[cmdIndex];
					codeDisplay = currentText;
					cmdIndex++;
					schedule(typeCommand, 60);
				} else {
					schedule(() => {
						let codeIndex = 0;
						const typeCode = () => {
							if (codeIndex < jsCode.length) {
								currentText += jsCode[codeIndex];
								codeDisplay = currentText;
								codeIndex++;
								schedule(typeCode, 50);
							} else {
								schedule(() => {
									if (!currentText.endsWith('\n')) {
										currentText += '\n';
										codeDisplay = currentText;
									}
									const exCmd = `:wq\n`;
									let exIndex = 0;
									const typeEx = () => {
										if (exIndex < exCmd.length) {
											currentText += exCmd[exIndex];
											codeDisplay = currentText;
											exIndex++;
											schedule(typeEx, 45);
										} else {
											schedule(() => {
												currentText += `\n${getFullPrompt()}`;
												codeDisplay = currentText;
												const npmCmd = `npm run mulai:belajar\n`;
												let npmIndex = 0;
												const typeNpm = () => {
													if (npmIndex < npmCmd.length) {
														currentText += npmCmd[npmIndex];
														codeDisplay = currentText;
														npmIndex++;
														schedule(typeNpm, 60);
													} else {
														schedule(() => {
															const output = `> naik-kelas@1.0.0 mulai:belajar\n> node register.js\n\nWelcome to the community! 🎉\n`;
															let outIndex = 0;
															const typeOut = () => {
																if (outIndex < output.length) {
																	currentText += output[outIndex];
																	codeDisplay = currentText;
																	outIndex++;
																	schedule(typeOut, 35);
																} else {
																	schedule(() => {
																		const ask = `\nIkuti tantangan rahasia? [y/N] `;
																		currentText += ask;
																		codeDisplay = currentText;
																		isAwaitingYesNo = true;

																		const cleanup = () => {
																			if (keydownHandler) {
																				window.removeEventListener('keydown', keydownHandler);
																				keydownHandler = null;
																			}
																			isAwaitingYesNo = false;
																		};

																		keydownHandler = (e: KeyboardEvent) => {
																			if (!isAwaitingYesNo) return;
																			const k = e.key;
																			if (k === 'y' || k === 'Y') {
																				currentText += 'y\n';
																				codeDisplay = currentText;
																				cleanup();
																				const linkLine = `Membuka portal...\nportal://<a href=\"/typing-challenge\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Buka portal level-0\">Buka Portal</a>\n`;
																				let i = 0;
																				const typeLink = () => {
																					if (i < linkLine.length) {
																						currentText += linkLine[i++];
																						codeDisplay = currentText;
																						schedule(typeLink, 22);
																					} else {
																						isTyping = false;
																						isRebooting = false;
																					}
																				};
																				typeLink();
																			} else if (
																				k === 'n' ||
																				k === 'N' ||
																				k === 'Enter' ||
																				k === 'Escape'
																			) {
																				currentText += k === 'Enter' ? '\n' : 'n\n';
																				codeDisplay = currentText;
																				cleanup();
																				isTyping = false;
																				isRebooting = false;
																			} else {
																				currentText += k.length === 1 ? k : '';
																				codeDisplay = currentText;
																			}
																		};

																		window.addEventListener('keydown', keydownHandler);
																	}, 300);
																}
															};
															typeOut();
														}, 300);
													}
												};
												typeNpm();
											}, 250);
										}
									};
									typeEx();
								}, 350);
							}
						};
						typeCode();
					}, 500);
				}
			};
			typeCommand();
		}, 800);
	};

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
						if (!isTyping) startTyping();
					} else if (!entry.isIntersecting && hasPlayed) {
						clearAllTimeouts();
						isTyping = false;
						codeDisplay = '';
					}
				});
			},
			{ threshold: 0.3, rootMargin: '0px' }
		);

		setTimeout(() => {
			if (codeSection) observer.observe(codeSection);
		}, 0);

		return () => observer.disconnect();
	});
</script>

<div class="terminal-window" bind:this={codeSection} class:is-blurred={aboutOpen}>
	<div class="terminal-titlebar">
		<div class="terminal-buttons">
			<span class="terminal-button terminal-button-red"></span>
			<span class="terminal-button terminal-button-yellow"></span>
			<span class="terminal-button terminal-button-green"></span>
		</div>
		<div class="zsh-switcher" role="presentation" onclick={(e) => e.stopPropagation()}>
			<DropdownMenu align="left" minWidth={140} zIndex={1100}>
				{#snippet trigger()}
					<span>Koneksi</span>
				{/snippet}
				<button
					type="button"
					class="dropdown-option w-full"
					role="menuitem"
					tabindex="0"
					onclick={() => openAbout()}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') openAbout();
					}}>About</button
				>
			</DropdownMenu>
		</div>
		<div
			class="theme-switcher"
			aria-label="Switch terminal theme"
			role="presentation"
			onclick={(e) => e.stopPropagation()}
		>
			<DropdownMenu align="left" minWidth={180} zIndex={999}>
				{#snippet trigger()}
					<span>
						{theme === 'p10k'
							? 'Powerlevel10k'
							: theme === 'agnoster'
								? 'Agnoster'
								: theme === 'robbyrussell'
									? 'Robby Russell'
									: 'Default'}
					</span>
				{/snippet}
				<button
					type="button"
					class="dropdown-option w-full {theme === 'p10k' ? 'is-active' : ''}"
					role="option"
					tabindex="0"
					aria-selected={theme === 'p10k'}
					onclick={() => setThemeAndRestart('p10k')}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') setThemeAndRestart('p10k');
					}}
				>
					Powerlevel10k
				</button>
				<button
					type="button"
					class="dropdown-option w-full {theme === 'agnoster' ? 'is-active' : ''}"
					role="option"
					tabindex="0"
					aria-selected={theme === 'agnoster'}
					onclick={() => setThemeAndRestart('agnoster')}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') setThemeAndRestart('agnoster');
					}}
				>
					Agnoster
				</button>
				<button
					type="button"
					class="dropdown-option w-full {theme === 'robbyrussell' ? 'is-active' : ''}"
					role="option"
					tabindex="0"
					aria-selected={theme === 'robbyrussell'}
					onclick={() => setThemeAndRestart('robbyrussell')}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') setThemeAndRestart('robbyrussell');
					}}
				>
					Robby Russell
				</button>
				<button
					type="button"
					class="dropdown-option w-full {theme === 'default' ? 'is-active' : ''}"
					role="option"
					tabindex="0"
					aria-selected={theme === 'default'}
					onclick={() => setThemeAndRestart('default')}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') setThemeAndRestart('default');
					}}
				>
					Default
				</button>
			</DropdownMenu>
		</div>
	</div>
	<pre class="code-snippet">{#if codeDisplay}{@html codeDisplay}{#if isTyping}<span class="cursor"
					>▊</span
				>{/if}{:else}<span class="placeholder">Loading...</span>{/if}</pre>
</div>

<!-- AboutWindow dipindah ke parent CTASection; component ini hanya memicu event -->

<style>
	.terminal-window {
		margin: 40px auto;
		max-width: 600px;
		border-radius: 10px;
		overflow: visible;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.terminal-window.is-blurred {
		filter: blur(2px) saturate(0.95);
	}

	.terminal-titlebar {
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(10px);
		padding: 10px 15px;
		display: flex;
		align-items: center;
		gap: 10px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		position: relative;
		z-index: 1;
	}

	.theme-switcher {
		display: flex;
		gap: 6px;
		margin-left: 6px;
	}
	.dropdown-option {
		padding: 10px 12px;
		font-size: 0.9em;
		color: #e5e7eb;
		cursor: pointer;
	}
	.dropdown-option:hover {
		background: rgba(255, 255, 255, 0.08);
	}
	.dropdown-option.is-active {
		background: rgba(255, 255, 255, 0.12);
		color: #ffffff;
	}

	.terminal-buttons {
		display: flex;
		gap: 6px;
	}
	.terminal-button {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		display: inline-block;
		transition: opacity 0.2s ease;
	}
	.terminal-button-red {
		background: #ff5f57;
		box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.15);
	}
	.terminal-button-yellow {
		background: #ffbd2e;
		box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.15);
	}
	.terminal-button-green {
		background: #28ca42;
		box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.15);
	}

	.zsh-switcher {
		margin-left: auto;
		position: relative;
		display: flex;
		align-items: center;
	}

	.code-snippet {
		background: rgba(0, 0, 0, 0.2);
		padding: 25px;
		font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
		color: var(--terminal-foreground, #4ade80);
		text-align: left;
		margin: 0;
		border-radius: 0;
		border: none;
		box-shadow: none;
		min-height: 120px;
		overflow-x: auto;
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.cursor {
		color: var(--terminal-foreground, #4ade80);
		animation: blink 1s infinite;
	}
	@keyframes blink {
		0%,
		50% {
			opacity: 1;
		}
		51%,
		100% {
			opacity: 0;
		}
	}

	/* About window styling is handled by AboutWindow component */
</style>
