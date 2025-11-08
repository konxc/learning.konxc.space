<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import AboutContent from '$lib/components/AboutContent.svelte';

	interface AboutWindowProps {
		open?: boolean;
		title?: string;
		containerEl?: HTMLElement | null;
		overlayDim?: boolean;
		closeOnOverlayClick?: boolean;
		theme?: string;
		getPrompt?: (t: string) => string;
		getRightArrow?: (t: string) => string;
	}

	let {
		open = false,
		title = 'About',
		containerEl = null as HTMLElement | null,
		overlayDim = false,
		closeOnOverlayClick = false,
		theme = '' as string,
		getPrompt = ((t: string) => '') as (t: string) => string,
		getRightArrow = ((t: string) => '') as (t: string) => string
	}: AboutWindowProps = $props();

	const dispatch = createEventDispatcher();

	let windowEl = $state<HTMLElement | null>(null);
	let top = $state<number | null>(null);
	let left = $state<number | null>(null);
	let dragging = $state(false);
	let offsetX = 0;
	let offsetY = 0;

	function centerInContainer() {
		if (!windowEl || !containerEl) return;
		const s = containerEl.getBoundingClientRect();
		const w = windowEl.getBoundingClientRect();
		const t = (s.height - w.height) / 2;
		const l = (s.width - w.width) / 2;
		top = Math.max(0, Math.min(t, s.height - w.height));
		left = Math.max(0, Math.min(l, s.width - w.width));
	}

	$effect(() => {
		if (open) {
			// Only center on first open (when position not yet set)
			if (top == null || left == null) {
				setTimeout(centerInContainer, 0);
			}
		} else {
			dragging = false;
		}
	});

	function onDragStart(e: MouseEvent) {
		if (!windowEl) return;
		const target = e.target as HTMLElement;
		if (target && target.closest('.aw-buttons')) return;
		dragging = true;
		e.preventDefault(); // Prevent text selection during drag
		if (top == null || left == null) {
			// initialize roughly under cursor
			const s = containerEl?.getBoundingClientRect();
			if (s) {
				top = Math.max(0, Math.min(e.clientY - s.top - 20, s.height));
				left = Math.max(0, Math.min(e.clientX - s.left - 60, s.width));
			} else {
				top = e.clientY - 20;
				left = e.clientX - 60;
			}
		}
		// offsets within the window
		const s = containerEl?.getBoundingClientRect();
		const baseLeft = s ? s.left : 0;
		const baseTop = s ? s.top : 0;
		offsetX = e.clientX - (baseLeft + (left as number));
		offsetY = e.clientY - (baseTop + (top as number));
		window.addEventListener('mousemove', onDragMove);
		window.addEventListener('mouseup', onDragEnd, { once: true });
	}

	function onDragMove(e: MouseEvent) {
		if (!dragging || !containerEl || !windowEl) return;
		e.preventDefault(); // Prevent text selection during drag
		const s = containerEl.getBoundingClientRect();
		const w = windowEl.getBoundingClientRect();
		let nl = e.clientX - offsetX; // viewport coords
		let nt = e.clientY - offsetY;
		// clamp in viewport, then convert to container-local
		nl = Math.max(s.left, Math.min(nl, s.right - w.width));
		nt = Math.max(s.top, Math.min(nt, s.bottom - w.height));
		left = nl - s.left;
		top = nt - s.top;
	}

	function onDragEnd() {
		dragging = false;
		window.removeEventListener('mousemove', onDragMove);
	}

	const close = () => dispatch('close');
</script>

{#if open}
	{#if closeOnOverlayClick}
		<div
			class="aw-overlay {overlayDim ? 'is-dim' : ''} is-clickable"
			role="button"
			tabindex="0"
			onclick={close}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') close();
			}}
			aria-label="Close window"
		></div>
	{:else}
		<div class="aw-overlay {overlayDim ? 'is-dim' : ''}" role="presentation"></div>
	{/if}
	<div
		class="aw-window"
		role="dialog"
		aria-label={title}
		aria-modal="true"
		tabindex="0"
		bind:this={windowEl}
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => {
			if (e.key === 'Escape') close();
		}}
		style={`top:${top ?? 0}px;left:${left ?? 0}px;`}
	>
		<div
			class="aw-titlebar"
			role="button"
			tabindex="0"
			aria-label="Window titlebar"
			onmousedown={onDragStart}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					/* drag not supported via keyboard */
				}
			}}
		>
			<div class="aw-buttons">
				<button
					type="button"
					class="aw-button aw-red"
					aria-label="Close window"
					onclick={close}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') close();
					}}
				></button>
				<span class="aw-button aw-yellow" aria-hidden="true"></span>
				<span class="aw-button aw-green" aria-hidden="true"></span>
			</div>
			<div class="aw-title">{title}</div>
		</div>
		<div class="aw-content">
			<AboutContent {theme} {getPrompt} {getRightArrow} />
		</div>
	</div>
{/if}

<style>
	.aw-overlay {
		position: absolute;
		inset: 0;
		background: transparent;
		z-index: 800;
	}
	.aw-overlay:not(.is-clickable) {
		pointer-events: none;
	}
	.aw-overlay.is-dim {
		background: rgba(0, 0, 0, 0.35);
		backdrop-filter: blur(2px);
	}

	.aw-window {
		position: absolute;
		width: min(520px, 92vw);
		background: rgba(0, 0, 0, 0.35);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 12px;
		box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(12px);
		color: #e5e7eb;
		z-index: 900;
	}

	.aw-titlebar {
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(10px);
		padding: 10px 15px;
		display: flex;
		align-items: center;
		gap: 10px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		border-top-left-radius: 12px;
		border-top-right-radius: 12px;
		cursor: grab;
		user-select: none; /* Prevent text selection while dragging */
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
	}
	.aw-titlebar:active {
		cursor: grabbing;
	}

	.aw-buttons {
		display: flex;
		gap: 6px;
	}
	.aw-button {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		display: inline-block;
		box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.15);
		cursor: pointer;
		transition: all 0.2s ease;
		position: relative;
	}

	.aw-button:hover {
		transform: scale(1.15);
		opacity: 0.9;
	}

	.aw-button:active {
		transform: scale(0.95);
	}

	.aw-red {
		background: #ff5f57;
	}
	.aw-red:hover {
		background: #ff3f34;
		box-shadow: 0 0 8px rgba(255, 95, 87, 0.6);
	}

	.aw-yellow {
		background: #ffbd2e;
	}
	.aw-yellow:hover {
		background: #ffa800;
		box-shadow: 0 0 8px rgba(255, 189, 46, 0.6);
	}

	.aw-green {
		background: #28ca42;
	}
	.aw-green:hover {
		background: #1eb32e;
		box-shadow: 0 0 8px rgba(40, 202, 66, 0.6);
	}

	.aw-title {
		color: rgba(255, 255, 255, 0.6);
		font-size: 0.9em;
		font-weight: 500;
		margin-left: auto;
	}
	.aw-content {
		padding: 16px;
	}
</style>
