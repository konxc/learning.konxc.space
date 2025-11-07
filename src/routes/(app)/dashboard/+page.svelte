<script lang="ts">
	import type { PageData } from './$types';
	import KpiCard from '$lib/components/KpiCard.svelte';
	import { onMount } from 'svelte';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	let { data }: { data: PageData } = $props();

	let RoleComponent = $state<any>(null);
	onMount(async () => {
		if (!data.user) return;
		const role = (data.user.role || 'user').toLowerCase();
		try {
			if (role === 'user' || role === 'learner') {
				RoleComponent = (await import('$lib/components/dashboard/roles/DashboardLearner.svelte'))
					.default;
			} else if (role === 'mentor') {
				RoleComponent = (await import('$lib/components/dashboard/roles/DashboardMentor.svelte'))
					.default;
			} else if (role === 'business') {
				RoleComponent = (await import('$lib/components/dashboard/roles/DashboardBusiness.svelte'))
					.default;
			} else if (role === 'admin') {
				RoleComponent = (await import('$lib/components/dashboard/roles/DashboardAdmin.svelte'))
					.default;
			}
		} catch (e) {
			// fallback silently
		}
	});
</script>

<svelte:head>
	<title>Dashboard - Naik Kelas</title>
</svelte:head>

{#if RoleComponent}
	<RoleComponent {data} />
{/if}
