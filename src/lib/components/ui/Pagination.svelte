<script lang="ts">
	import { COLOR, RADIUS, TEXT, TRANSITION } from '$lib/config/design';

	interface PaginationProps {
		currentPage: number;
		totalPages: number;
		totalItems?: number;
		itemsPerPage?: number;
		onPageChange: (page: number) => void;
		showInfo?: boolean;
	}

	let {
		currentPage,
		totalPages,
		totalItems,
		itemsPerPage = 10,
		onPageChange,
		showInfo = true
	}: PaginationProps = $props();

	function getPageNumbers(): (number | 'ellipsis')[] {
		const pages: (number | 'ellipsis')[] = [];
		const maxVisible = 7;

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
			return pages;
		}

		// Always show first page
		pages.push(1);

		if (currentPage > 3) {
			pages.push('ellipsis');
		}

		// Pages around current
		const start = Math.max(2, currentPage - 1);
		const end = Math.min(totalPages - 1, currentPage + 1);

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		if (currentPage < totalPages - 2) {
			pages.push('ellipsis');
		}

		// Always show last page
		pages.push(totalPages);

		return pages;
	}

	const startItem = $derived((currentPage - 1) * itemsPerPage + 1);
	const endItem = $derived(
		Math.min(currentPage * itemsPerPage, totalItems ?? currentPage * itemsPerPage)
	);
</script>

<div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
	{#if showInfo && totalItems !== undefined}
		<p class={`text-sm ${COLOR.textMuted}`}>
			Menampilkan {startItem}-{endItem} dari {totalItems} data
		</p>
	{:else}
		<div></div>
	{/if}

	<nav class="flex items-center gap-1" aria-label="Pagination">
		<!-- Previous -->
		<button
			class={`flex h-9 w-9 items-center justify-center ${RADIUS.button} text-sm ${TRANSITION.all} ${currentPage === 1 ? 'cursor-not-allowed opacity-40' : `${COLOR.neutralHover} ${COLOR.textPrimary}`}`}
			disabled={currentPage === 1}
			onclick={() => onPageChange(currentPage - 1)}
			aria-label="Previous page"
		>
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<!-- Page numbers -->
		{#each getPageNumbers() as page}
			{#if page === 'ellipsis'}
				<span class={`flex h-9 w-9 items-center justify-center text-sm ${COLOR.textMuted}`}
					>...</span
				>
			{:else}
				<button
					class={`flex h-9 w-9 items-center justify-center ${RADIUS.button} text-sm font-medium ${TRANSITION.all} ${page === currentPage ? `${COLOR.accentBg} text-white` : `${COLOR.neutralHover} ${COLOR.textPrimary}`}`}
					onclick={() => onPageChange(page as number)}
					aria-current={page === currentPage ? 'page' : undefined}
				>
					{page}
				</button>
			{/if}
		{/each}

		<!-- Next -->
		<button
			class={`flex h-9 w-9 items-center justify-center ${RADIUS.button} text-sm ${TRANSITION.all} ${currentPage === totalPages ? 'cursor-not-allowed opacity-40' : `${COLOR.neutralHover} ${COLOR.textPrimary}`}`}
			disabled={currentPage === totalPages}
			onclick={() => onPageChange(currentPage + 1)}
			aria-label="Next page"
		>
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</nav>
</div>
