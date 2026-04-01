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
		const role = (data.activeRole || data.user.role || 'user').toLowerCase();
		try {
			if (role === 'user' || role === 'learner' || role === 'siswa') {
				const mod = await import('$lib/components/app/roles/DashboardLearner.svelte');
				RoleComponent = mod.default ?? mod;
			} else if (role === 'mentor') {
				const mod = await import('$lib/components/app/roles/DashboardMentor.svelte');
				RoleComponent = mod.default ?? mod;
			} else if (role === 'facilitator') {
				const mod = await import('$lib/components/app/roles/DashboardFacilitator.svelte');
				RoleComponent = mod.default ?? mod;
			} else if (role === 'business' || role === 'bd') {
				const mod = await import('$lib/components/app/roles/DashboardBusiness.svelte');
				RoleComponent = mod.default ?? mod;
			} else if (role === 'admin') {
				const mod = await import('$lib/components/app/roles/DashboardAdmin.svelte');
				RoleComponent = mod.default ?? mod;
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
	<PageWrapper>
		<RoleComponent {data} />
	</PageWrapper>
{/if}
