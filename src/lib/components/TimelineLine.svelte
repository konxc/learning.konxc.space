<script lang="ts">
	interface Props {
		/** Class tambahan untuk styling */
		class?: string;
	}
	let { class: className = '' }: Props = $props();
</script>

<div class="timeline-line {className}"></div>

<style>
	.timeline-line {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		z-index: 0;
	}

	.timeline-line::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 2px;
		height: 0%;
		background: linear-gradient(
			to bottom,
			var(--color-bg-hero-end),
			var(--color-primary-soft-blue)
		);
		box-shadow: 0 0 24px rgba(90, 132, 255, 0.25);
		transition: height 1s ease-out;
		animation: drawLine 1.5s ease-out forwards;
	}

	@keyframes drawLine {
		from {
			height: 0%;
		}
		to {
			height: 100%;
		}
	}

	/* Mobile & Tablet positioning */
	@media (max-width: 768px) {
		.timeline-line::before {
			left: 30px;
		}
	}

	@media (max-width: 480px) {
		.timeline-line::before {
			left: 20px;
			width: 1.5px;
		}
	}
</style>

