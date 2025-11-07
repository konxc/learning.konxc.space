<script lang="ts">
	interface Props {
		icon: string;
		title: string;
		description: string;
		value?: string;
		features?: string[];
		badge?: string;
		link?: {
			text: string;
			href: string;
		};
	}
	let { icon, title, description, value, features, badge, link }: Props = $props();
</script>

<article class="benefit-item" aria-labelledby="benefit-{title}">
	<span class="benefit-icon" aria-hidden="true">{icon}</span>
	<div class="benefit-content">
		{#if badge}
			<span class="benefit-badge">{badge}</span>
		{/if}
		<h3 id="benefit-{title}" class="benefit-title">{title}</h3>
		{#if value}
			<div class="benefit-value">{value}</div>
		{/if}
		<p class="benefit-description">{description}</p>
		{#if features && features.length > 0}
			<ul class="benefit-features">
				{#each features as feature}
					<li>{feature}</li>
				{/each}
			</ul>
		{/if}
		{#if link}
			<a href={link.href} class="benefit-link">
				{link.text}
				<span aria-hidden="true">→</span>
			</a>
		{/if}
	</div>
</article>

<style lang="postcss">
	@reference "../../app.css";

	.benefit-item {
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.92) 0%,
			rgba(244, 247, 255, 0.96) 55%,
			rgba(232, 239, 255, 0.94) 100%
		);
		@apply relative overflow-visible rounded-2xl border px-7 py-7;
		border-color: rgba(102, 126, 234, 0.28);
		box-shadow:
			0 18px 44px rgba(102, 126, 234, 0.18),
			0 0 0 1px rgba(255, 255, 255, 0.55);
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.benefit-item::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			rgba(102, 126, 234, 0.08) 0%,
			rgba(139, 92, 246, 0.08) 45%,
			rgba(59, 130, 246, 0.08) 100%
		);
		opacity: 0.85;
		transition: opacity 0.4s ease;
		border-radius: inherit;
	}

	.benefit-item::after {
		content: '';
		position: absolute;
		top: -35%;
		right: -20%;
		width: 60%;
		height: 70%;
		background: radial-gradient(
			circle at 30% 30%,
			rgba(255, 255, 255, 0.45) 0%,
			rgba(255, 255, 255, 0.12) 45%,
			transparent 75%
		);
		opacity: 0;
		transition: opacity 0.45s ease;
		pointer-events: none;
		border-radius: inherit;
	}

	.benefit-content {
		@apply relative z-1 flex flex-col gap-3;
		/* padding-right: clamp(64px, 12vw, 96px); */
		/* padding-bottom: clamp(56px, 12vw, 88px); */
	}

	.benefit-badge {
		@apply absolute -top-6 -left-2 w-fit rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm;
		transform: translate(-10px, -10px);
		background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(139, 92, 246, 0.9));
		color: white;
		border: 1px solid rgba(102, 126, 234, 0.5);
		box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
	}

	.benefit-icon {
		@apply shrink-0 rounded-full text-3xl;
		position: absolute;
		right: clamp(20px, 4vw, 28px);
		bottom: clamp(24px, 8vw, 36px);
		top: auto;
		padding: 0.6rem;
		background: linear-gradient(135deg, rgba(102, 126, 234, 0.18), rgba(139, 92, 246, 0.2));
		border: 1px solid rgba(102, 126, 234, 0.35);
		box-shadow: 0 10px 28px rgba(102, 126, 234, 0.22);
		transform: translate(0, 0);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.benefit-title {
		@apply mb-1 text-xl font-semibold md:text-2xl;
		color: var(--color-primary-dark, #1a202c);
	}

	.benefit-value {
		@apply mb-2 text-2xl font-bold md:text-3xl;
		background: linear-gradient(135deg, #667eea, #8b5cf6);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.benefit-description {
		@apply mb-3 text-base leading-relaxed md:text-lg;
		color: var(--color-primary-medium, #4a5568);
		flex-grow: 1;
	}

	.benefit-features {
		@apply mb-4 list-none space-y-2 p-0;
	}

	.benefit-features li {
		@apply flex items-center text-sm md:text-base;
		color: var(--color-primary-medium, #4a5568);
	}

	.benefit-features li::before {
		content: '✓';
		@apply mr-2 text-lg font-bold;
		color: #667eea;
	}

	.benefit-link {
		@apply inline-flex items-center gap-2 text-sm font-medium no-underline transition-all duration-300 hover:gap-3 md:text-base;
		color: #667eea;
	}

	.benefit-link:hover {
		color: #8b5cf6;
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.benefit-item {
			transition: none;
		}

		.benefit-link {
			transition: none;
		}
	}

	@media (width >= theme('screens.md')) {
		.benefit-content {
			/* padding-bottom: clamp(60px, 8vw, 96px); */
		}
	}

	@media (width >= theme('screens.lg')) {
		.benefit-content {
			/* padding-right: clamp(70px, 10vw, 100px); */
			/* padding-bottom: clamp(56px, 6vw, 80px); */
		}

		.benefit-icon {
			right: clamp(20px, 3vw, 28px);
			top: clamp(20px, 3vw, 28px);
			bottom: auto;
		}
	}
</style>
