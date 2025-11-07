<script lang="ts">
	const { theme, getPrompt, getRightArrow } = $props<{
		theme: string;
		getPrompt: (t: string) => string;
		getRightArrow: (t: string) => string;
	}>();
</script>

<div class="about-content-wrapper">
	<div class="about-header">
		<a href="https://instagram.com/sandiko.dev" target="_blank" rel="noopener noreferrer">
			<div class="about-avatar">
				<img src="https://avatars.githubusercontent.com/u/33443311?v=4" alt="Sandiko" />
			</div>
		</a>
		<div class="about-title-section">
			<h3>Koneksi • Naik Kelas</h3>
			<p>Kamu menemukan easter egg! Keep leveling up 🚀</p>
		</div>
	</div>

	<div class="about-developer">
		<div class="terminal-header">
			<span class="terminal-user">sandikodev@github</span>
			<span class="terminal-path">~/Projects/naik-kelas</span>
		</div>
		<div class="terminal-line">
			<span class="terminal-prompt">$</span>
			<span class="terminal-command">
				<a
					href="https://www.man7.org/linux/man-pages/man1/whoami.1.html"
					target="_blank"
					rel="noopener noreferrer"
				>
					whoami
				</a>
			</span>
		</div>
		<div class="terminal-output">
			<div class="output-line">👨‍💻 Software Developer</div>
			<div class="output-line">📍 Yogyakarta, Indonesia</div>
			<div class="output-line">💼 PT Koneksi Jaringan Indonesia | konxc.space</div>
			<div class="output-line">🚄 Passionate about open source & linux</div>
		</div>
		<div class="terminal-line">
			<span class="terminal-prompt">$</span>
			<span class="terminal-command">
				<a href="http://linux.die.net/man/1/zsh" target="_blank" rel="noopener noreferrer">
					check profile --github
				</a>
			</span>
		</div>
		<div class="terminal-output">
			<div class="output-line">
				→ <span class="output-text">Opening</span>
				<a href="https://github.com/sandikodev" target="_blank" rel="noopener noreferrer">
					https://github.com/sandikodev
				</a>
			</div>
		</div>
	</div>

	<div class="about-footer">
		<div class="quote-line">
			<span class="quote-mark">❝</span>
			<span class="quote-text">Keep Hacking, Keep Learning</span>
			<span class="quote-mark">❞</span>
		</div>
	</div>
</div>

<style>
	.about-content-wrapper {
		text-align: left;
	}

	.about-header {
		display: flex;
		align-items: center;
		gap: 20px;
		margin-bottom: 24px;
		padding-bottom: 20px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.about-avatar {
		flex-shrink: 0;
	}

	.about-avatar img {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: 3px solid rgba(0, 255, 0, 0.3);
		box-shadow: 0 4px 12px rgba(0, 255, 0, 0.2);
		transition: all 0.3s ease;
		display: block;
	}

	.about-avatar img:hover {
		transform: scale(1.05);
		border-color: rgba(0, 255, 0, 0.6);
		box-shadow: 0 4px 20px rgba(0, 255, 0, 0.4);
	}

	.about-title-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.about-title-section h3 {
		margin: 0;
		font-size: 1.3em;
		color: #ffffff;
		text-align: left;
	}

	.about-title-section p {
		margin: 0;
		color: #e5e7eb;
		text-align: left;
		font-size: 0.95em;
	}

	.about-developer {
		margin: 20px 0;
		padding: 16px;
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(0, 255, 0, 0.2);
		border-radius: 6px;
		font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
		font-size: 0.9em;
		box-shadow:
			0 0 15px rgba(0, 255, 0, 0.1),
			inset 0 0 20px rgba(0, 255, 0, 0.03);
	}

	.terminal-header {
		display: flex;
		gap: 8px;
		margin-bottom: 12px;
		padding-bottom: 8px;
		border-bottom: 1px solid rgba(0, 255, 0, 0.2);
	}

	.terminal-user {
		color: #00ff00;
		font-weight: bold;
		text-shadow: 0 0 8px rgba(0, 255, 0, 0.5);
	}

	.terminal-path {
		color: rgba(255, 255, 255, 0.6);
	}

	.terminal-line {
		display: flex;
		gap: 8px;
		margin-bottom: 8px;
	}

	.terminal-prompt {
		color: #00ff00;
		font-weight: bold;
	}

	.terminal-command {
		color: #ffffff;
	}

	.terminal-command a {
		color: #00ff00;
		text-decoration: underline;
		text-decoration-color: rgba(0, 255, 0, 0.6);
		text-underline-offset: 3px;
		text-decoration: none;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.terminal-command a:hover {
		color: #7ee787;
		text-decoration-color: rgba(126, 231, 135, 1);
		text-shadow: 0 0 8px rgba(0, 255, 0, 0.4);
	}

	.terminal-output {
		margin-left: 16px;
		margin-bottom: 12px;
		padding-left: 12px;
		border-left: 2px solid rgba(0, 255, 0, 0.3);
	}

	.terminal-output a {
		color: #00ff00;
		text-decoration: underline;
		text-decoration-color: rgba(0, 255, 0, 0.6);
		text-underline-offset: 3px;
		text-decoration: none;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.terminal-output a:hover {
		color: #7ee787;
		text-decoration-color: rgba(126, 231, 135, 1);
		text-shadow: 0 0 8px rgba(0, 255, 0, 0.4);
	}

	.output-line {
		color: rgba(255, 255, 255, 0.9);
		margin-bottom: 4px;
		line-height: 1.6;
	}

	.output-text {
		color: rgba(255, 255, 255, 0.9);
	}

	.about-footer {
		margin-top: 24px;
		padding-top: 20px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		text-align: center;
	}

	.quote-line {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		font-style: italic;
	}

	.quote-mark {
		color: rgba(255, 255, 255, 0.3);
		font-size: 1.5em;
		line-height: 1;
	}

	.quote-text {
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.95em;
		font-weight: 500;
	}
</style>
