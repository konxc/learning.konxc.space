<script lang="ts">
	import type { ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	import ProfileTab from './tabs/ProfileTab.svelte';
	import VerificationTab from './tabs/VerificationTab.svelte';
	import SecurityTab from './tabs/SecurityTab.svelte';
	import OrganizationTab from './tabs/OrganizationTab.svelte';
	import PreferencesTab from './tabs/PreferencesTab.svelte';
	import PaymentsTab from './tabs/PaymentsTab.svelte';
	import AccountTab from './tabs/AccountTab.svelte';

	interface PageData {
		user: {
			id: string;
			username: string;
			fullName: string | null;
			email: string | null;
			phone: string | null;
			avatarUrl: string | null;
			role: string;
			createdAt: Date;
			isVerified: boolean;
		};
		verification: any;
		organization: {
			id: string;
			name: string;
			slug: string;
			brandColor: string | null;
			logoUrl: string | null;
		} | null;
		orgMembers: unknown[];
		orgApiKeys: Array<{
			id: string;
			name: string;
			status: string;
			lastUsedAt: Date | null;
			createdAt: Date;
		}>;
		isOrgAdmin: boolean;
		headerTabs: {
			tabs: Array<{ label: string; id: string; icon: string }>;
			activeTab: string;
		};
		preferences: {
			emailNotif: boolean;
			waNotif: boolean;
			focusMode: boolean;
		};
	}

	let { data, form }: { data: PageData; form?: ActionData } = $props();

	let activeTab = $derived(data.headerTabs.activeTab);
	let isOrgAdmin = $derived(data.isOrgAdmin);
</script>

<PageWrapper>
	<PageHeader title="Pengaturan Akun" />
	<div class="mx-auto max-w-6xl">
		<main>
			{#if activeTab === 'profile'}
				<ProfileTab user={data.user} />
			{/if}

			{#if activeTab === 'verification'}
				<VerificationTab user={data.user} verification={data.verification} />
			{/if}

			{#if activeTab === 'security'}
				<SecurityTab />
			{/if}

			{#if activeTab === 'organization'}
				<OrganizationTab
					user={data.user}
					organization={data.organization}
					orgMembers={data.orgMembers as any[]}
					orgApiKeys={data.orgApiKeys}
					isOrgAdmin={data.isOrgAdmin}
				/>
			{/if}

			{#if activeTab === 'preferences'}
				<PreferencesTab
					emailNotif={data.preferences.emailNotif}
					waNotif={data.preferences.waNotif}
					focusMode={data.preferences.focusMode}
				/>
			{/if}

			{#if activeTab === 'payments' && data.user.role === 'admin'}
				<PaymentsTab />
			{/if}

			{#if activeTab === 'account'}
				<AccountTab />
			{/if}
		</main>
	</div>
</PageWrapper>

<style>
	:global(.animate-in) {
		animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}
	@keyframes slide-up {
		from {
			opacity: 0;
			transform: translateY(30px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
</style>
