<script lang="ts">
	import { onMount } from 'svelte';
	import { COLOR, RADIUS, ELEVATION } from '$lib/config/design';

	let deferredPrompt: any = $state(null);
	let showPrompt = $state(false);
	let installed = $state(false);

	onMount(() => {
		// Check if already installed
		if (window.matchMedia('(display-mode: standalone)').matches) {
			installed = true;
			return;
		}

		// Listen for beforeinstallprompt
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredPrompt = e;
			// Show prompt after a delay to not interrupt user
			setTimeout(() => {
				showPrompt = true;
			}, 5000);
		});

		// Listen for app installed
		window.addEventListener('appinstalled', () => {
			installed = true;
			showPrompt = false;
			deferredPrompt = null;
		});
	});

	async function install() {
		if (!deferredPrompt) return;

		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;

		if (outcome === 'accepted') {
			installed = true;
		}

		showPrompt = false;
		deferredPrompt = null;
	}

	function dismiss() {
		showPrompt = false;
		localStorage.setItem('pwa-prompt-dismissed', 'true');
	}
</script>

{#if showPrompt && !installed && deferredPrompt}
	<div
		class={`fixed right-4 bottom-4 z-50 max-w-sm ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} animate-in slide-in-from-bottom-4 p-4 shadow-xl`}
	>
		<div class="flex items-start gap-3">
			<div class="text-3xl">📱</div>
			<div class="flex-1">
				<h4 class={`font-bold ${COLOR.textPrimary} mb-1`}>Install App</h4>
				<p class={`text-sm ${COLOR.textSecondary} mb-3`}>
					Tambahkan ke homescreen untuk pengalaman yang lebih baik dan akses offline.
				</p>
				<div class="flex gap-2">
					<button
						onclick={install}
						class={`flex-1 ${RADIUS.button} bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700`}
					>
						Install
					</button>
					<button
						onclick={dismiss}
						class={`${RADIUS.button} border ${COLOR.cardBorder} px-4 py-2 text-sm font-medium ${COLOR.textSecondary}`}
					>
						Nanti
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
