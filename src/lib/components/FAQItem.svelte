<script lang="ts">
	import type { FAQItem as FAQItemType } from '$lib/config/faq';
	import { trackFAQOpen } from '$lib/utils/analytics';
	import { browser } from '$app/environment';

	interface Props {
		faq: FAQItemType;
		isOpen?: boolean;
	}

	let { faq, isOpen = false }: Props = $props();

	let internalOpen = $state(isOpen);

	$effect(() => {
		internalOpen = isOpen;
	});

	function handleToggle(event: Event) {
		const target = event.currentTarget as HTMLDetailsElement | null;
		const isNowOpen = !!target?.open;
		internalOpen = isNowOpen;
		if (!browser) return;
		if (isNowOpen) {
			trackFAQOpen(faq.id, faq.question);
		}
	}
</script>

<details
	class="faq-item"
	open={isOpen}
	aria-labelledby="faq-question-{faq.id}"
	ontoggle={handleToggle}
>
	<summary id="faq-question-{faq.id}" class="faq-question" aria-expanded={internalOpen}>
		<span class="faq-question-text">{faq.question}</span>
		<span class="faq-icon" aria-hidden="true">{internalOpen ? '−' : '+'}</span>
	</summary>
	<div class="faq-answer" id="faq-answer-{faq.id}">
		{#if faq.category || faq.domain}
			<div class="faq-answer-meta">
				{#if faq.category}
					<span class="faq-chip">{faq.category}</span>
				{/if}
				<span class="faq-chip faq-chip-domain">{faq.domain}</span>
			</div>
		{/if}
		<p>{faq.answer}</p>
	</div>
</details>

<style>
	.faq-item {
		background: var(--color-bg-light, #ffffff);
		border-radius: 12px;
		border: 1px solid var(--color-bg-hero-end, rgba(0, 0, 0, 0.05));
		margin-bottom: 15px;
		overflow: hidden;
		transition: all 0.3s ease;
	}

	.faq-item:hover {
		border-color: var(--color-primary-soft-blue, rgba(102, 126, 234, 0.2));
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
	}

	.faq-item[open] {
		border-color: var(--color-primary-soft-blue, #667eea);
		box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
	}

	.faq-question {
		padding: 20px 25px;
		cursor: pointer;
		list-style: none;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 15px;
		font-weight: 600;
		color: var(--color-primary-dark, #1a202c);
		user-select: none;
		transition: all 0.2s ease;
		position: relative;
		touch-action: manipulation;
	}

	.faq-question::-webkit-details-marker {
		display: none;
	}

	.faq-question::marker {
		display: none;
	}

	.faq-question:hover {
		background: var(--color-bg-lighter, #f8f9fa);
	}

	.faq-item[open] .faq-question {
		background: var(--color-bg-lighter, #f8f9fa);
		border-bottom: 1px solid var(--color-bg-hero-end, rgba(0, 0, 0, 0.05));
	}

	.faq-question-text {
		flex: 1;
		font-size: 1.05em;
		line-height: 1.5;
	}

	.faq-icon {
		flex-shrink: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-primary-soft-blue, #667eea);
		width: 28px;
		height: 28px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		border: 1px solid var(--color-primary-soft-blue, rgba(102, 126, 234, 0.35));
		background: rgba(102, 126, 234, 0.08);
		transition: all 0.2s ease;
	}

	.faq-item[open] .faq-icon {
		background: var(--color-primary-soft-blue, #667eea);
		border-color: transparent;
		color: white;
	}

	.faq-answer {
		padding: 0 25px 25px 25px;
		color: var(--color-primary-medium, #4a5568);
		line-height: 1.7;
		animation: slideDown 0.3s ease;
	}

	.faq-answer-meta {
		margin-bottom: 14px;
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.faq-chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 0 0.75rem;
		height: 1.9rem;
		border-radius: 999px;
		background: rgba(102, 126, 234, 0.1);
		border: 1px solid rgba(102, 126, 234, 0.15);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-primary-soft-blue, #667eea);
	}

	.faq-chip-domain {
		background: rgba(76, 99, 210, 0.1);
		border-color: rgba(76, 99, 210, 0.25);
		color: var(--color-primary-dark, #1a202c);
	}

	.faq-answer p {
		margin: 0;
		font-size: 1em;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Responsive */
	@media (max-width: 768px) {
		.faq-question {
			padding: 16px 18px;
		}

		.faq-question-text {
			font-size: 1rem;
		}

		.faq-answer {
			padding: 0 18px 18px 18px;
		}

		.faq-answer-meta {
			margin-bottom: 12px;
		}

		.faq-chip {
			flex: 0 0 auto;
		}
	}

	/* Reduce motion */
	@media (prefers-reduced-motion: reduce) {
		.faq-item,
		.faq-question,
		.faq-icon,
		.faq-answer {
			transition: none;
			animation: none;
		}
	}
</style>
