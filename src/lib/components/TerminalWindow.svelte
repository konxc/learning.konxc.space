<script lang="ts">
	import type { Snippet } from 'svelte';

	interface TerminalWindowProps {
		open?: boolean;
		title?: string;
		overlayDim?: boolean;
		onClose?: () => void;
		children?: Snippet;
		actions?: Snippet;
		overlays?: Snippet;
	}

	let {
		open = false,
		title = 'Terminal',
		overlayDim = false,
		onClose,
		children,
		actions,
		overlays
	}: TerminalWindowProps = $props();
</script>

<div class="terminal-window">
	<div class="terminal-titlebar">
		<div class="terminal-buttons">
			<span class="terminal-button terminal-button-red"></span>
			<span class="terminal-button terminal-button-yellow"></span>
			<span class="terminal-button terminal-button-green"></span>
		</div>
		<div class="terminal-title">{title}</div>
		<div class="terminal-actions">
			{@render actions?.()}
		</div>
	</div>
	<div class="terminal-body">
		{@render children?.()}
	</div>
	{@render overlays?.()}
	<!-- overlays for popovers/dropdowns that need to be siblings -->
</div>

<style>
	.terminal-window {
		border-radius: 10px;
		overflow: visible;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		position: relative;
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
	.terminal-button:hover {
		opacity: 0.8;
	}

	.terminal-title {
		color: rgba(255, 255, 255, 0.5);
		font-size: 0.85em;
		font-weight: 500;
	}

	.terminal-actions {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 8px;
		position: relative;
	}

	.terminal-body {
		background: rgba(0, 0, 0, 0.2);
		padding: 0;
	}
</style>
