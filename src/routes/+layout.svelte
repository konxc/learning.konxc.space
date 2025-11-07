<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';

	let { children } = $props();

	const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
	const SITE_NAME = 'Naik Kelas by Koneksi';
	const SITE_DESCRIPTION =
		'Platform pembelajaran berbasis komunitas untuk developer, desainer, dan kreator digital di Indonesia.';
	const BASE_URL = 'https://konxc.space';
	const OG_IMAGE = `${BASE_URL}/favicon.png`;
	let trackingInitialized = false;

	$effect(() => {
		if (!browser || !GA_ID || trackingInitialized) return;
		trackingInitialized = true;

		window.dataLayer = window.dataLayer || [];
		if (typeof window.gtag !== 'function') {
			window.gtag = function () {
				window.dataLayer?.push(arguments);
			};
		}
		window.gtag('js', new Date());
		window.gtag('config', GA_ID, {
			anonymize_ip: true,
			send_page_view: false
		});

		const sendPageView = () => {
			const url = new URL(window.location.href);
			window.gtag?.('event', 'page_view', {
				page_title: document.title,
				page_location: url.href,
				page_path: url.pathname + url.search
			});
		};

		sendPageView();
		afterNavigate(() => {
			sendPageView();
		});
	});
</script>

<svelte:head>
	<meta name="author" content={SITE_NAME} />
	<meta name="description" content={SITE_DESCRIPTION} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={SITE_NAME} />
	<meta property="og:description" content={SITE_DESCRIPTION} />
	<meta property="og:url" content={BASE_URL} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={SITE_NAME} />
	<meta name="twitter:description" content={SITE_DESCRIPTION} />
	<meta name="twitter:image" content={OG_IMAGE} />
	{#if GA_ID}
		<script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
	{/if}
</svelte:head>

{@render children?.()}
