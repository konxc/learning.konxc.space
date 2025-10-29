<script lang="ts">
	import type { ComponentProps } from 'svelte';

	interface Props {
		title: string;
		subtitle: string;
		children: unknown;
		backButtonLabel?: string;
	}

	let { title, subtitle, children, backButtonLabel = 'Beranda' }: Props = $props();
</script>

<div class="auth-page">
	<a href="/" class="back-to-home" aria-label="Kembali ke Home">
		<span class="back-icon">←</span>
		<span class="back-text">{backButtonLabel}</span>
	</a>

	<div class="auth-container">
		<div class="auth-header">
			<h1>{title}</h1>
			<p>{subtitle}</p>
		</div>

		{@render children()}
	</div>
</div>

<style>
	.auth-page {
		min-height: 100vh;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--color-bg-hero) 0%, var(--color-bg-hero-end) 100%);
		padding: 20px;
		position: relative;
	}

	.back-to-home {
		position: fixed;
		top: 20px;
		left: 20px;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 16px;
		background: white;
		border-radius: 8px;
		text-decoration: none;
		color: var(--color-primary-dark);
		font-weight: 600;
		font-size: 0.95em;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
		z-index: 1000;
	}

	.back-to-home:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.back-icon {
		font-size: 1.2em;
		line-height: 1;
	}

	.back-text {
		font-size: 0.9em;
	}

	.auth-container {
		background: white;
		border-radius: 16px;
		padding: 40px;
		max-width: 500px;
		width: 100%;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
	}

	.auth-header {
		text-align: center;
		margin-bottom: 32px;
	}

	.auth-header h1 {
		font-size: 2em;
		color: var(--color-primary-dark);
		margin-bottom: 8px;
		font-weight: 700;
	}

	.auth-header p {
		color: var(--color-primary-medium);
		font-size: 1em;
		line-height: 1.5;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.auth-page {
			padding: 16px;
		}

		.back-to-home {
			top: 16px;
			right: 16px;
			padding: 8px 12px;
		}

		.back-text {
			display: none;
		}

		.back-icon {
			font-size: 1.4em;
		}

		.auth-container {
			padding: 32px 24px;
		}

		.auth-header h1 {
			font-size: 1.75em;
		}
	}

	@media (max-width: 480px) {
		.auth-container {
			padding: 24px 20px;
		}

		.auth-header h1 {
			font-size: 1.5em;
		}

		.auth-header p {
			font-size: 0.9em;
		}
	}

	/* Landscape mobile orientation */
	@media (max-height: 600px) and (orientation: landscape) {
		.auth-page {
			padding: 12px;
		}

		.auth-container {
			padding: 24px;
		}

		.auth-header {
			margin-bottom: 20px;
		}

		.auth-header h1 {
			font-size: 1.5em;
		}
	}
</style>
