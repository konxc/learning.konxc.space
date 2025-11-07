<script lang="ts">
  import KpiCard from '$lib/components/KpiCard.svelte';
  import OverviewGraph from '$lib/components/dashboard/OverviewGraph.svelte';
  import RoleSwitcher from '$lib/components/dashboard/RoleSwitcher.svelte';
  import Table from '$lib/components/ui/Table.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import PageSection from '$lib/components/layouts/PageSection.svelte';
  import { COLOR, TEXT, SPACING } from '$lib/config/design';
  const { data } = $props<{ data: any }>();

  const columns = [
    { key: 'title', label: 'Course' },
    { key: 'students', label: 'Students' },
    { key: 'status', label: 'Status' }
  ];
  const rows = (data.mentorCourses?.slice(0, 5) ?? []).map((c: any) => ({
    title: c.title,
    students: c.students ?? 0,
    status: c.published ? 'Published' : 'Draft'
  }));
</script>

<div class={SPACING.section}>
  <div class="mb-8 flex items-center justify-between gap-4">
    <div>
      <h1 class={`${TEXT.h1} ${COLOR.textPrimary} mb-2`}>Mentor Center</h1>
      <p class={`${TEXT.body} ${COLOR.textSecondary}`}>Kelola kursus dan siswa Anda</p>
    </div>
    <div class="w-40"><RoleSwitcher /></div>
  </div>

  <div class="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
    <KpiCard label="My Courses" value={data.stats.myCourses || 0} />
    <KpiCard label="Total Students" value={data.stats.totalStudents || 0} accent />
    <KpiCard label="Pending Submissions" value={data.stats.pendingSubmissions || 0} />
    <KpiCard label="Reviews Needed" value={data.stats.pendingSubmissions || 0} />
  </div>

  <PageSection>
    <OverviewGraph title="Teaching Overview" description="Aktivitas mengajar 30 hari terakhir" />
  </PageSection>

  <PageSection>
    <div class="mb-4 flex items-center justify-between">
      <h2 class={`${TEXT.h3} ${COLOR.textPrimary}`}>My Courses</h2>
      <a href="/dashboard/mentor/courses"><Button variant="ghost">Kelola</Button></a>
    </div>
    <Table columns={columns} rows={rows} />
  </PageSection>
</div>


