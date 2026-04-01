<script lang="ts">
	import type { PageData } from './$types';
	import { COLOR, RADIUS, SPACING, TEXT, TRANSITION, ELEVATION } from '$lib/config/design';
	import { toast } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import { useDashboardListState } from '$lib/utils/useDashboardListState';
	import { filterEntities, countByField } from '$lib/utils/filter';
	import { COURSE_COLUMNS } from '$lib/constants/course-columns';
	import DashboardTablePage from '$lib/components/layouts/DashboardTablePage.svelte';
	import StatusFilter from '$lib/components/ui/StatusFilter.svelte';
	import CoursesTable from '$lib/components/admin/CoursesTable.svelte';

	let { data }: { data: PageData } = $props();

	// Dashboard list state management
	const listState = useDashboardListState({
		columns: COURSE_COLUMNS,
		storageKey: 'admin-courses',
		filterParam: 'status',
		defaultFilter: 'all',
		filterStatusField: 'status',
		searchFields: ['title', 'description', 'category']
	});

	// Filtered courses based on search and status
	const filteredCourses = $derived(
		filterEntities(data.courses, listState.searchQuery, listState.filter, {
			searchFields: ['title', 'description', 'category'],
			statusField: 'status'
		})
	);

	// Count courses by status
	const statusCounts = $derived(countByField(data.courses, 'status'));

	// Filter options for StatusFilter component
	const filterOptions = $derived([
		{ value: 'all', label: 'All', count: statusCounts.all ?? 0 },
		{ value: 'published', label: 'Published', count: statusCounts.published ?? 0 },
		{ value: 'draft', label: 'Draft', count: statusCounts.draft ?? 0 }
	]);

	// Delete handler
	async function handleDelete(courseId: string) {
		const response = await fetch(`/app/admin/courses/delete/${courseId}`, {
			method: 'POST'
		});
		if (response.ok) {
			toast.success('Kursus berhasil dihapus');
			await goto('/app/admin/courses', { invalidateAll: true });
		} else {
			toast.error('Gagal menghapus kursus');
		}
	}
</script>

<DashboardTablePage
	title="Course Management"
	description="Manage all courses available on the platform"
	headTitle="Course Management - Admin"
	bind:searchQuery={listState.searchQuery}
	columns={COURSE_COLUMNS}
	onVisibilityChange={listState.handleVisibilityChange}
	storageKey="admin-courses"
	filteredCount={filteredCourses.length}
	totalCount={data.courses.length}
	searchPlaceholder="Cari course berdasarkan title atau description..."
>
	{#snippet filters()}
		<div class="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
			<StatusFilter
				options={filterOptions}
				bind:active={listState.filter}
				onChange={listState.setFilter}
			/>
			<a
				href="/app/admin/courses/create"
				class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.cardHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
			>
				+ Create Course
			</a>
		</div>
	{/snippet}

	{#snippet children()}
		<CoursesTable
			entries={filteredCourses}
			columns={COURSE_COLUMNS}
			columnVisibility={listState.columnVisibility}
			isColumnVisible={listState.isColumnVisible}
			onDelete={handleDelete}
		/>
	{/snippet}
</DashboardTablePage>
