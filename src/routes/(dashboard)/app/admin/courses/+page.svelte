<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { toast } from '$lib/stores/toastStore';
	import { useDashboardListState } from '$lib/utils/useDashboardListState';
	import { filterEntities, countByField, buildFilterOptions } from '$lib/utils/filter';
	import { COURSE_COLUMNS } from '$lib/constants/course-columns';
	import DashboardTablePage from '$lib/components/layouts/DashboardTablePage.svelte';
	import StatusFilter from '$lib/components/ui/StatusFilter.svelte';
	import CoursesTable from '$lib/components/admin/CoursesTable.svelte';

	let { data }: { data: PageData } = $props();

	let showCreateModal = $state(false);

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
	const filterOptions = $derived(
		buildFilterOptions(statusCounts, { all: 'All', published: 'Published', draft: 'Draft' })
	);

	// Delete handler using form element for use:enhance
	let deleteForm: HTMLFormElement;
	let courseIdToDelete = $state('');

	async function handleDeleteRequest(id: string): Promise<void> {
		if (confirm('Are you sure you want to delete this course and all its content?')) {
			courseIdToDelete = id;
			// Trigger the hidden form
			setTimeout(() => deleteForm.requestSubmit(), 0);
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
			<Button variant="primary" onclick={() => (showCreateModal = true)}>
				<Icon name="plus" size={16} class="mr-2" /> Create Course
			</Button>
		</div>
	{/snippet}

	{#snippet children()}
		<CoursesTable
			entries={filteredCourses}
			columns={COURSE_COLUMNS}
			columnVisibility={listState.columnVisibility}
			isColumnVisible={listState.isColumnVisible}
			onDelete={handleDeleteRequest}
		/>

		<!-- Hidden form for deletion -->
		<form
			method="POST"
			action="?/deleteCourse"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						toast.success('Course deleted');
						await invalidateAll();
					} else {
						toast.error('Failed to delete course');
					}
				};
			}}
			bind:this={deleteForm}
			class="hidden"
		>
			<input type="hidden" name="courseId" value={courseIdToDelete} />
		</form>
	{/snippet}
</DashboardTablePage>

<!-- Create Course Modal -->
<Modal isOpen={showCreateModal} title="Create New Course" onClose={() => (showCreateModal = false)}>
	<form
		method="POST"
		action="?/createCourse"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'failure' && result.data?.error) {
					toast.error(String(result.data.error));
				} else if (result.type === 'error') {
					toast.error('An unexpected error occurred');
				}
			};
		}}
		class="space-y-4"
	>
		<Input label="Course Title" name="title" required placeholder="e.g. Masterclass Web Dev" />
		<div class="flex justify-end gap-3 pt-4">
			<Button variant="ghost" onclick={() => (showCreateModal = false)}>Cancel</Button>
			<Button type="submit" variant="primary">Create & Edit</Button>
		</div>
	</form>
</Modal>
