<script lang="ts">
	import { RADIUS, COLOR, SPACING, TEXT, TRANSITION, ELEVATION, FOCUS } from '$lib/config/design';

	interface CreateActionButtonProps {
		href: string;
		label: string;
	}

	let { href, label }: CreateActionButtonProps = $props();
</script>

<a
	{href}
	class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.cardHover} focus:outline-none focus-visible:ring-2 ${FOCUS.accent} focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
>
	+ {label}
</a>
