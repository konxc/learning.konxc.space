<script lang="ts">
	const socialLinks = [
		{ name: 'Instagram', href: '#' },
		{ name: 'Facebook', href: '#' },
		{ name: 'Twitter', href: '#' },
		{ name: 'WhatsApp', href: '#' }
	];
</script>

<footer class="footer">
	<div class="footer-content">
		<h3>Naik Kelas</h3>
		<p>Kolaborasi PT Koneksi Jaringan Indonesia × Yayasan Klub Fisika</p>
		<p>Building Indonesia's tech talent, one developer at a time.</p>

		<nav class="social-links" aria-label="Social media links">
			{#each socialLinks as link}
				<a
					href={link.href}
					aria-label={`Visit our ${link.name} page`}
					target="_blank"
					rel="noopener noreferrer"
				>
					{link.name}
				</a>
			{/each}
		</nav>

		<p style="margin-top: 30px; font-size: 0.9em">© 2025 Naik Kelas. All rights reserved.</p>
	</div>
</footer>

<style>
	.footer {
		background: var(--color-primary-dark);
		color: white;
		padding: 50px 20px;
		text-align: center;
	}

	.footer-content {
		max-width: 800px;
		margin: 0 auto;
	}

	.footer h3 {
		margin-bottom: 20px;
		font-size: 1.5em;
	}

	.footer p {
		color: rgba(255, 255, 255, 0.7);
		margin-bottom: 10px;
	}

	.social-links {
		margin-top: 30px;
	}

	.social-links a {
		display: inline-block;
		margin: 0 15px;
		color: rgba(255, 255, 255, 0.7);
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.social-links a:hover {
		color: white;
	}
</style>
