<script lang="ts">
	import TypingGame from './components/TypingGame.svelte';
</script>

<svelte:head>
	<title>Typing Challenge - Naik Kelas</title>
	<meta
		name="description"
		content="Improve your typing speed and familiarize yourself with programming syntax through interactive typing challenges"
	/>
</svelte:head>

<main class="typing-challenge-page">
	<TypingGame />
</main>

<style>
	.typing-challenge-page {
		min-height: calc(100vh - 70px);
		background: linear-gradient(135deg, var(--color-bg-light) 0%, var(--color-bg-hero) 100%);
		padding: 2rem 0;
	}
</style>
