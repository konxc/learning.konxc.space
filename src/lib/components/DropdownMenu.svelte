<script lang="ts">
	import { onMount, createEventDispatcher, type Snippet } from 'svelte';

	const {
		align = 'right',
		minWidth = 160,
		zIndex = 1000,
		trigger,
		children
	} = $props<{
		align?: 'left' | 'right';
		minWidth?: number;
		zIndex?: number;
		trigger?: Snippet;
		children?: Snippet;
	}>();

	let open = $state(false);
	const dispatch = createEventDispatcher();
	const instanceId = Math.random().toString(36).slice(2);

	const toggle = () => {
		open = !open;
		if (open) {
			dispatch('open');
			window.dispatchEvent(new CustomEvent('dropdown:open', { detail: instanceId }));
		} else {
			dispatch('close');
		}
	};
	const close = () => {
		if (!open) return;
		open = false;
		dispatch('close');
	};

	onMount(() => {
		const onDocClick = () => {
			if (open) close();
		};
		const onAnyDropdownOpen = (e: Event) => {
			const evt = e as CustomEvent<string>;
			if (evt.detail !== instanceId) close();
		};
		document.addEventListener('click', onDocClick);
		window.addEventListener('dropdown:open', onAnyDropdownOpen as EventListener);
		return () => {
			document.removeEventListener('click', onDocClick);
			window.removeEventListener('dropdown:open', onAnyDropdownOpen as EventListener);
		};
	});
</script>

<div class="dropdown" onclick={(e) => e.stopPropagation()} role="presentation">
	<button class="dropdown-trigger" aria-haspopup="menu" aria-expanded={open} onclick={toggle}>
		{@render trigger?.()}
		<span class="chevron" aria-hidden="true">▾</span>
	</button>

	{#if open}
		<div
			class="dropdown-menu"
			role="menu"
			tabindex="-1"
			style={`min-width:${minWidth}px;z-index:${zIndex};${align === 'right' ? 'right:0' : 'left:0'}`}
			onclick={() => setTimeout(close, 0)}
			onkeydown={(e) => {
				if (e.key === 'Escape') close();
			}}
		>
			{@render children?.()}
		</div>
	{/if}
</div>

<style>
	.dropdown {
		position: relative;
		display: inline-flex;
		align-items: center;
	}

	.dropdown-trigger {
		font-size: 0.85em;
		padding: 6px 10px;
		background: rgba(0, 0, 0, 0.25);
		color: rgba(255, 255, 255, 0.85);
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 8px;
		cursor: pointer;
		backdrop-filter: blur(6px);
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.dropdown-trigger:focus-visible {
		outline: none;
		box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25);
	}

	.chevron {
		opacity: 0.8;
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + 4px);
		background: rgba(17, 24, 39, 0.95);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 10px;
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(8px);
		overflow: hidden;
	}

	:global(.dropdown-option) {
		padding: 10px 12px;
		font-size: 0.9em;
		color: #e5e7eb;
		cursor: pointer;
		white-space: nowrap;
	}

	:global(.dropdown-option:hover) {
		background: rgba(255, 255, 255, 0.08);
	}

	:global(.dropdown-option.is-active) {
		background: rgba(255, 255, 255, 0.12);
		color: #ffffff;
	}
</style>
