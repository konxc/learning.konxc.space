<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageQuick from '$lib/components/layouts/PageQuick.svelte';
	import { COLOR, RADIUS, SPACING, TEXT, TRANSITION, ELEVATION } from '$lib/config/design';
	import { toast } from '$lib/stores/toast';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { updateQueryParam } from '$lib/utils/url-params';
	import {
		setToVisibilityRecord,
		isColumnVisible as checkColumnVisible
	} from '$lib/utils/column-visibility';
	import { filterCourses, countCoursesByStatus } from '$lib/utils/course-filters';
	import { COURSE_COLUMNS, getDefaultCourseColumnVisibility } from '$lib/constants/course-columns';
	import { COURSE_STATUSES } from '$lib/constants/courses';
	import CourseFilters from '$lib/components/admin/CourseFilters.svelte';
	import CoursesTable from '$lib/components/admin/CoursesTable.svelte';
	import WaitingListSearchBar from '$lib/components/crm/WaitingListSearchBar.svelte';
	import ResultsSummary from '$lib/components/crm/ResultsSummary.svelte';
	import ColumnFilter from '$lib/components/crm/ColumnFilter.svelte';

	let { data }: { data: PageData } = $props();

	// Filter state
	let searchQuery = $state('');
	let statusFilter = $state<'all' | 'published' | 'draft'>('all');
	let columnFilterRef: ColumnFilter | null = $state(null);

	// Initialize status filter from URL query parameter on mount
	onMount(() => {
		const param = $page.url.searchParams.get('status');
		if (param === 'published' || param === 'draft') {
			statusFilter = param;
		} else {
			statusFilter = 'all';
		}
	});

	// Sync with URL changes (e.g., browser back/forward)
	$effect(() => {
		const param = $page.url.searchParams.get('status');
		if (param === 'published' || param === 'draft') {
			if (statusFilter !== param) {
				statusFilter = param;
			}
		} else if (statusFilter !== 'all') {
			statusFilter = 'all';
		}
	});

	// Function to update URL query parameter when status filter changes
	async function updateStatusFilter(newStatus: 'all' | 'published' | 'draft') {
		statusFilter = newStatus;
		await updateQueryParam($page.url, 'status', newStatus === 'all' ? null : newStatus, goto);
	}

	// Column definitions (from constants)
	const tableColumns = COURSE_COLUMNS;

	// Column visibility state
	let columnVisibility = $state<Record<string, boolean>>(getDefaultCourseColumnVisibility());

	// Callback to update visibility from ColumnFilter
	function handleVisibilityChange(visibleColumns: Set<string>) {
		columnVisibility = setToVisibilityRecord(visibleColumns, tableColumns);
	}

	// Helper to check if column is visible
	function isColumnVisible(key: string): boolean {
		return checkColumnVisible(key, columnVisibility);
	}

	// Filtered courses based on search and status
	const filteredCourses = $derived(filterCourses(data.courses, searchQuery, statusFilter));

	// Count courses by status
	const statusCounts = $derived(countCoursesByStatus(data.courses, COURSE_STATUSES));

	// Delete handler
	async function handleDelete(courseId: string) {
		const response = await fetch(`/dashboard/admin/courses/delete/${courseId}`, {
			method: 'POST'
		});
		if (response.ok) {
			toast.success('Course deleted');
			await goto('/dashboard/admin/courses', { invalidateAll: true });
		} else {
			toast.error('Failed to delete course');
		}
	}
</script>

<svelte:head>
	<title>Course Management - Admin</title>
</svelte:head>

<!-- Status Filter - Outside PageWrapper for full-width control -->
<PageQuick padding={true}>
	<div class="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
		<CourseFilters
			bind:statusFilter
			{statusCounts}
			onStatusFilterChange={(value) => updateStatusFilter(value as 'all' | 'published' | 'draft')}
		/>
		<a
			href="/dashboard/admin/courses/create"
			class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
		>
			+ Create Course
		</a>
	</div>
</PageQuick>

<PageWrapper>
	<PageHeader
		title="Course Management"
		description="Kelola semua course yang tersedia di platform"
	/>

	<!-- Results Summary with Search and Column Filter -->
	<div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
		<div class="min-w-0 flex-1 md:max-w-xs">
			<ResultsSummary filteredCount={filteredCourses.length} totalCount={data.courses.length} />
		</div>

		<WaitingListSearchBar
			bind:searchQuery
			columns={tableColumns}
			bind:columnFilterRef
			storageKey="admin-courses-columns"
			onVisibilityChange={handleVisibilityChange}
			placeholder="Cari course berdasarkan title atau description..."
		/>
	</div>

	<!-- Courses Table -->
	{#if filteredCourses.length === 0 && data.courses.length === 0}
		<div
			class="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900"
		>
			<p class={`mb-4 ${COLOR.textSecondary}`}>No courses found. Create your first course!</p>
			<a
				href="/dashboard/admin/courses/create"
				class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} ${ELEVATION.hover}`}
			>
				+ Create Course
			</a>
		</div>
	{:else}
		<CoursesTable
			entries={filteredCourses}
			columns={tableColumns}
			{columnVisibility}
			{isColumnVisible}
			onDelete={handleDelete}
		/>
	{/if}
</PageWrapper>
