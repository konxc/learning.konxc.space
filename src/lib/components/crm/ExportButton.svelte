<script lang="ts">
	import { COLOR, RADIUS, SPACING, TEXT, TRANSITION, ELEVATION } from '$lib/config/design';

	let { href = '?/export', label = '📥 Export CSV' }: { href?: string; label?: string } = $props();
</script>

<a
	{href}
	class={`export-btn inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
>
	{label}
</a>

