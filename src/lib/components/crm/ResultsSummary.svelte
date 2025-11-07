<script lang="ts">
	import { COLOR, TEXT } from '$lib/config/design';

	let {
		filteredCount,
		totalCount
	}: {
		filteredCount: number;
		totalCount: number;
	} = $props();
</script>

<div class={`${COLOR.textSecondary} ${TEXT.body} whitespace-nowrap`}>
	Menampilkan <strong class={COLOR.textPrimary}>{filteredCount}</strong> dari
	<strong class={COLOR.textPrimary}>{totalCount}</strong> entries
</div>

