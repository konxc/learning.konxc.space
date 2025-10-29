<script lang="ts">
	// CTA section with buttons instead of form
</script>

<section id="register" class="cta-section">
	<div class="cta-container">
		<div class="cta-badge">🚀 Batch Pertama - Segera Dibuka!</div>

		<h2>Ready to Level Up?</h2>
		<p>
			Jangan lewatkan kesempatan belajar langsung dari industry practitioners. Daftar sekarang dan
			mulai journey kamu jadi developer profesional!
		</p>

		<pre class="code-snippet">
{`> if (you.isReady() && you.hasDetermination()) {
  naikkelas.register(you);
  return "Welcome to the community! 🎉";
}`}
		</pre>

		<div class="cta-buttons">
			<a href="/waiting-list" class="cta-primary"> 🎯 Join Waiting List - Gratis! </a>
			<a href="/marketplace" class="cta-secondary"> 🔍 Lihat Semua Course </a>
		</div>

		<p class="cta-note">
			Sudah punya akun? <a href="/auth/signin">Masuk di sini</a>
		</p>
	</div>
</section>

<style>
	.cta-section {
		padding: 120px 20px;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 50%,
			var(--color-gradient-purple-end) 100%
		);
		position: relative;
		overflow: hidden;
		color: white;
	}

	.cta-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: repeating-linear-gradient(
			45deg,
			transparent,
			transparent 10px,
			rgba(255, 255, 255, 0.03) 10px,
			rgba(255, 255, 255, 0.03) 20px
		);
		pointer-events: none;
	}

	.cta-container {
		max-width: 800px;
		margin: 0 auto;
		text-align: center;
		position: relative;
		z-index: 1;
	}

	.cta-badge {
		display: inline-block;
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		padding: 10px 25px;
		border-radius: 50px;
		color: white;
		font-weight: 600;
		margin-bottom: 30px;
		border: 1px solid rgba(255, 255, 255, 0.3);
		animation: pulse 2s infinite;
	}

	/* Animation keyframes are defined in app.css */

	.cta-section h2 {
		font-size: 3em;
		color: white;
		margin-bottom: 20px;
		text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
	}

	.cta-section p {
		font-size: 1.3em;
		color: rgba(255, 255, 255, 0.95);
		margin-bottom: 50px;
		line-height: 1.8;
	}

	.code-snippet {
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(10px);
		padding: 25px;
		border-radius: 12px;
		font-family: 'Courier New', monospace;
		color: #4ade80;
		margin: 40px auto;
		max-width: 600px;
		text-align: left;
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
	}

	.code-snippet::before {
		content: '> ';
		color: #60a5fa;
	}

	.cta-buttons {
		display: flex;
		gap: 20px;
		justify-content: center;
		margin-bottom: 30px;
		flex-wrap: wrap;
	}

	.cta-primary {
		display: inline-block;
		padding: 18px 40px;
		background: white;
		color: var(--color-gradient-purple-start);
		font-weight: 700;
		font-size: 1.2em;
		border-radius: 50px;
		text-decoration: none;
		transition: all 0.3s ease;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
	}

	.cta-primary:hover {
		transform: translateY(-5px);
		box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
	}

	.cta-secondary {
		display: inline-block;
		padding: 18px 40px;
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		color: white;
		font-weight: 600;
		font-size: 1.2em;
		border: 2px solid white;
		border-radius: 50px;
		text-decoration: none;
		transition: all 0.3s ease;
	}

	.cta-secondary:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-3px);
	}

	.cta-note {
		font-size: 1.1em;
		color: rgba(255, 255, 255, 0.9);
		margin-top: 20px;
	}

	.cta-note a {
		color: white;
		text-decoration: underline;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.cta-note a:hover {
		text-decoration: none;
		opacity: 0.8;
	}

	/* Responsive: Tablet */
	@media (max-width: 1024px) {
		.cta-section {
			padding: 100px 20px;
		}

		.cta-section h2 {
			font-size: 2.5em;
		}

		.cta-section p {
			font-size: 1.2em;
		}
	}

	/* Responsive: Mobile */
	@media (max-width: 768px) {
		.cta-section {
			padding: 80px 20px;
		}

		.cta-section h2 {
			font-size: 2em;
		}

		.cta-section p {
			font-size: 1.1em;
		}

		.code-snippet {
			padding: 20px;
			font-size: 0.85em;
		}

		.cta-buttons {
			flex-direction: column;
			align-items: stretch;
		}

		.cta-primary,
		.cta-secondary {
			width: 100%;
			text-align: center;
			font-size: 1.1em;
			padding: 16px 32px;
		}
	}

	/* Responsive: Small mobile */
	@media (max-width: 480px) {
		.cta-section {
			padding: 60px 15px;
		}

		.cta-badge {
			padding: 8px 20px;
			font-size: 0.9em;
		}

		.cta-section h2 {
			font-size: 1.7em;
		}

		.cta-section p {
			font-size: 1em;
		}

		.code-snippet {
			padding: 15px;
			font-size: 0.8em;
		}
	}
</style>
