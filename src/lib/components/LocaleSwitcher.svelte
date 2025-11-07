<script lang="ts">
	import { setLocale, getLocale } from '$lib/paraglide/runtime.js';
	let current = 'id';
	function init() {
		try {
			current = getLocale();
		} catch {
			current = 'id';
		}
	}
	function switchTo(locale: string) {
		// setLocale akan mengatur cookie PARAGLIDE_LOCALE dan reload by default
		if (locale === 'id' || locale === 'en' || locale === 'jp') {
			setLocale(locale);
		}
	}
</script>

<div class="relative">
	<details class="group" ontoggle={init}>
		<summary
			class="inline-flex cursor-pointer list-none items-center gap-2 rounded border px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
			>{current.toUpperCase()}</summary
		>
		<div
			class="absolute right-0 mt-1 min-w-32 rounded border bg-white p-1 shadow dark:bg-neutral-900"
		>
			<button
				type="button"
				class="block w-full rounded px-3 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
				onclick={() => switchTo('id')}>Indonesia</button
			>
			<button
				type="button"
				class="block w-full rounded px-3 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
				onclick={() => switchTo('en')}>English</button
			>
		</div>
	</details>
</div>
