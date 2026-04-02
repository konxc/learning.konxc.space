<script lang="ts">
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION, STATUS } from '$lib/config/design';

	interface AffiliateLink {
		id: string;
		name: string;
		platform: string;
		url: string;
		clicks: number;
		conversions: number;
		status: string;
	}

	interface Props {
		link: AffiliateLink;
	}

	const { link }: Props = $props();

	let copied = $state(false);

	const platformIcons: Record<string, string> = {
		shopee: '🛒',
		tokopedia: '🛍️',
		tiktok_shop: '🎵',
		lazada: '📦',
		other: '🔗'
	};

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(link.url);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch {
			// fallback: select text
		}
	}
</script>

<div
	class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} flex flex-col gap-4 p-5 ${TRANSITION.all} hover:-translate-y-0.5`}
>
	<!-- Header -->
	<div class="flex items-start justify-between gap-3">
		<div class="flex items-center gap-2">
			<span class="text-2xl">{platformIcons[link.platform] ?? '🔗'}</span>
			<div>
				<p class={`text-sm font-bold ${COLOR.textPrimary} leading-tight`}>{link.name}</p>
				<p class={`text-xs capitalize ${COLOR.textMuted}`}>{link.platform.replace('_', ' ')}</p>
			</div>
		</div>
		<!-- Status badge -->
		<span
			class={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black tracking-wider uppercase ${
				link.status === 'active'
					? `${STATUS.success.bg} ${STATUS.success.text}`
					: `${STATUS.neutral.bg} ${STATUS.neutral.text}`
			}`}
		>
			{link.status}
		</span>
	</div>

	<!-- URL row -->
	<div
		class={`flex items-center gap-2 rounded-lg border ${COLOR.cardBorder} bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50`}
	>
		<span class={`flex-1 truncate text-xs ${COLOR.textMuted} font-mono`}>{link.url}</span>
		<button
			type="button"
			onclick={copyToClipboard}
			aria-label={copied ? 'Tersalin!' : 'Salin URL'}
			class={`shrink-0 rounded-md px-2 py-1 text-xs font-bold ${TRANSITION.colors} ${
				copied
					? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
					: `${COLOR.neutral} ${COLOR.textSecondary} hover:bg-zinc-200 dark:hover:bg-zinc-700`
			}`}
		>
			{copied ? '✓ Tersalin' : 'Salin'}
		</button>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-2 gap-3">
		<div class={`rounded-lg ${COLOR.neutral} p-3 text-center`}>
			<p class={`text-lg font-black ${COLOR.textPrimary}`}>{link.clicks}</p>
			<p class={`text-[10px] font-bold tracking-wider uppercase ${COLOR.textMuted}`}>Clicks</p>
		</div>
		<div class={`rounded-lg ${COLOR.neutral} p-3 text-center`}>
			<p class="text-lg font-black text-emerald-600 dark:text-emerald-400">{link.conversions}</p>
			<p class={`text-[10px] font-bold tracking-wider uppercase ${COLOR.textMuted}`}>Konversi</p>
		</div>
	</div>
</div>
