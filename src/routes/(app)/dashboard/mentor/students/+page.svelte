<script lang="ts">
	import type { PageData } from './$types';
	import Table from '$lib/components/Table.svelte';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT } from '$lib/config/design';
	let { data }: { data: PageData } = $props();

	let selectedCourse = $state<string>(data.selectedCourse || 'all');
	const columns = [
		{ key: 'student', label: 'Student' },
		{ key: 'email', label: 'Email' },
		{ key: 'course', label: 'Course' },
		{ key: 'status', label: 'Status' },
		{ key: 'enrolled', label: 'Enrolled' },
		{ key: 'completed', label: 'Completed' }
	];
	const filtered = $derived(
		data.students.filter((s) => selectedCourse === 'all' || s.course.id === selectedCourse)
	);
	const rows = $derived(
		filtered.map((s) => ({
			student: s.student.fullName
				? `${s.student.username} — ${s.student.fullName}`
				: s.student.username,
			email: s.student.email ?? '—',
			course: s.course.title,
			status: s.status,
			enrolled: new Date(s.enrolledAt).toLocaleDateString('id-ID'),
			completed: s.completedAt ? new Date(s.completedAt).toLocaleDateString('id-ID') : '—'
		}))
	);
</script>

<svelte:head>
	<title>My Students - Mentor</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="My Students">
		{#if data.courses.length > 0}
			<select
				bind:value={selectedCourse}
				class={`cursor-pointer ${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.button} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
			>
				<option value="all">All Courses</option>
				{#each data.courses as course}
					<option value={course.id}>{course.title}</option>
				{/each}
			</select>
		{/if}
	</PageHeader>

	<PageSection padding={false}>
		<div class="p-2 md:overflow-x-auto">
			<Table {columns} {rows} />
		</div>
	</PageSection>

	{#if data.students.length === 0}
		<PageSection>
			<div class="text-center">
				<p class={COLOR.textSecondary}>No students enrolled in your courses yet</p>
			</div>
		</PageSection>
	{/if}
</PageWrapper>

