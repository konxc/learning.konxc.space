<script lang="ts">
	import { RADIUS, TEXT, COLOR, SHADOW, SPACING, TRANSITION, ELEVATION } from '$lib/config/design';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import { toast } from '$lib/stores/toast';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const { organization, members, isReadOnly } = data;

	let activeTab = $state<'general' | 'members'>('general');

	function handleAction() {
		return async ({ result }: { result: any }) => {
			if (result.type === 'success') {
				toast.success('Action successfully completed');
			} else if (result.data?.error) {
				toast.error(result.data.error);
			}
		};
	}
</script>

<div class={SPACING.page}>
	<div class="mb-8">
		<h1 class={TEXT.h1}>Organization Settings</h1>
		<p class={TEXT.secondary}>Manage your organization, branding, and team members.</p>
	</div>

	{#if !organization}
		<div class={`p-8 ${COLOR.card} ${RADIUS.card} border ${COLOR.cardBorder} ${SHADOW.base}`}>
			<div class="text-center mb-8">
				<div class="text-4xl mb-4">🏢</div>
				<h2 class={TEXT.h2}>Create Organization</h2>
				<p class={`${TEXT.secondary} mt-2 max-w-md mx-auto`}>Set up an organization to manage your team, courses, and branding in one place.</p>
			</div>
			
			<form method="POST" action="?/createOrganization" use:enhance={handleAction} class="max-w-lg mx-auto space-y-6">
				<div class="space-y-2">
					<label for="orgName" class="text-sm font-bold text-gray-700 dark:text-gray-300">Organization Name</label>
					<input 
						type="text" 
						id="orgName" 
						name="name" 
						required
						placeholder="e.g., PT. Digital Nusantara"
						class={`w-full px-4 py-3 ${RADIUS.input} border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600`}
					/>
				</div>
				
				<div class="space-y-2">
					<label for="orgSlug" class="text-sm font-bold text-gray-700 dark:text-gray-300">Workspace URL</label>
					<div class="flex items-center gap-2">
						<span class="text-sm text-gray-500">naikkelas.id/org/</span>
						<input 
							type="text" 
							id="orgSlug" 
							name="slug" 
							required
							pattern="[a-z0-9-]+"
							placeholder="digital-nusantara"
							class={`flex-1 px-4 py-3 ${RADIUS.input} border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600`}
						/>
					</div>
					<p class="text-xs text-gray-500">Lowercase letters, numbers, and hyphens only</p>
				</div>
				
				<div class="space-y-2">
					<label for="orgBrandColor" class="text-sm font-bold text-gray-700 dark:text-gray-300">Brand Color</label>
					<div class="flex gap-3 items-center">
						<input 
							type="color" 
							id="orgBrandColor" 
							name="brandColor" 
							value="#4f46e5"
							class="h-12 w-16 rounded-lg cursor-pointer border-0"
						/>
						<span class="text-sm text-gray-500">Choose a primary color for your organization</span>
					</div>
				</div>
				
				<div class="pt-4 flex justify-center">
					<button 
						type="submit"
						class={`px-8 py-3 ${RADIUS.button} bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all`}>
						Create Organization
					</button>
				</div>
			</form>
		</div>
	{:else}
		<div class="flex gap-1 mb-6 border-b border-gray-200 dark:border-neutral-800">
			<button 
				onclick={() => activeTab = 'general'}
				class={`px-4 py-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'general' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
				General
			</button>
			<button 
				onclick={() => activeTab = 'members'}
				class={`px-4 py-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'members' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
				Members
			</button>
		</div>

		<div class="max-w-4xl">
			{#if activeTab === 'general'}
				<div class={`${COLOR.card} ${RADIUS.card} border ${COLOR.cardBorder} ${ELEVATION.card} overflow-hidden`}>
					<div class="p-6 border-b border-gray-100 dark:border-neutral-800">
						<h3 class={TEXT.h3}>General Information</h3>
						<p class={TEXT.muted}>Update your organization name and visual identity.</p>
					</div>
					<form method="POST" action="?/updateSettings" use:enhance={handleAction} class="p-6 space-y-4">
						<div class="grid gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<label for="name" class="text-sm font-bold text-gray-700 dark:text-gray-300">Organization Name</label>
								<input 
									type="text" 
									id="name" 
									name="name" 
									value={organization.name} 
									disabled={isReadOnly}
									class={`w-full px-4 py-2 ${RADIUS.input} border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600`}
								/>
							</div>
							<div class="space-y-2">
								<label for="brandColor" class="text-sm font-bold text-gray-700 dark:text-gray-300">Brand Color (Hex)</label>
								<div class="flex gap-2">
									<div class="h-10 w-10 rounded-lg border border-gray-200" style="background-color: {organization.brandColor || '#4f46e5'}"></div>
									<input 
										type="text" 
										id="brandColor" 
										name="brandColor" 
										value={organization.brandColor || '#4f46e5'} 
										disabled={isReadOnly}
										class={`flex-1 px-4 py-2 ${RADIUS.input} border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600`}
									/>
								</div>
							</div>
						</div>

						<div class="pt-4 flex justify-end">
							<button 
								type="submit" 
								disabled={isReadOnly}
								class={`px-6 py-2.5 ${RADIUS.button} bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}>
								Save Changes
							</button>
						</div>
					</form>
				</div>
			{/if}

			{#if activeTab === 'members'}
				<div class="space-y-6">
					<!-- Invite -->
					{#if !isReadOnly}
						<div class={`${COLOR.card} ${RADIUS.card} border ${COLOR.cardBorder} ${ELEVATION.card} p-6`}>
							<h3 class={TEXT.h3}>Invite Member</h3>
							<p class={TEXT.muted}>Invite colleagues to collaborate in your organization.</p>
							
							<form method="POST" action="?/inviteMember" use:enhance={handleAction} class="mt-4 flex flex-col md:flex-row gap-3">
								<input 
									type="email" 
									name="email" 
									required
									placeholder="colleague@example.com" 
									class={`flex-1 px-4 py-2 ${RADIUS.input} border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-indigo-100/50 focus:border-indigo-600`}
								/>
								<select name="role" class={`px-4 py-2 ${RADIUS.input} border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 font-bold text-sm`}>
									<option value="member">Member</option>
									<option value="admin">Admin</option>
								</select>
								<button 
									type="submit" 
									class={`px-6 py-2 ${RADIUS.button} bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all whitespace-nowrap`}>
									Send Invitation
								</button>
							</form>
						</div>
					{/if}

					<!-- Member List -->
					<div class={`${COLOR.card} ${RADIUS.card} border ${COLOR.cardBorder} ${ELEVATION.card} overflow-hidden`}>
						<div class="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center">
							<h3 class={TEXT.h3}>Active Members</h3>
							<span class="px-2 py-0.5 bg-gray-100 rounded text-xs font-black text-gray-500 uppercase">{members.length} Total</span>
						</div>
						<div class="divide-y divide-gray-100 dark:divide-neutral-800">
							{#each members as member}
								<div class="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-all">
									<div class="flex items-center gap-3">
										<div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
											{member.user.fullName?.[0] || member.user.username[0].toUpperCase()}
										</div>
										<div>
											<p class="text-sm font-bold text-gray-900 dark:text-gray-100">
												{member.user.fullName || member.user.username}
												{#if member.user.email === data.user.email}
													<span class="ml-2 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-black uppercase">You</span>
												{/if}
											</p>
											<p class={TEXT.muted}>{member.user.email}</p>
										</div>
									</div>
									<div class="flex items-center gap-4">
										{#if isReadOnly || member.user.id === data.user.id || member.role === 'owner'}
											<span class={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-gray-100 text-gray-600 dark:bg-neutral-800 shrink-0`}>
												{member.role}
											</span>
										{:else}
											<form method="POST" action="?/updateMemberRole" use:enhance={handleAction} class="shrink-0">
												<input type="hidden" name="memberId" value={member.id} />
												<select 
													name="role" 
													value={member.role}
													onchange={(e) => e.currentTarget.form?.requestSubmit()}
													class={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border-none bg-indigo-50 text-indigo-700 cursor-pointer hover:bg-indigo-100 transition-colors`}>
													<option value="member">Member</option>
													<option value="admin">Admin</option>
													<option value="creator">Creator</option>
													<option value="facilitator">Facilitator</option>
												</select>
											</form>
										{/if}
										
										{#if !isReadOnly && member.user.id !== data.user.id && member.role !== 'owner'}
											<form method="POST" action="?/removeMember" use:enhance={handleAction}>
												<input type="hidden" name="memberId" value={member.id} />
												<button 
													type="submit"
													class="text-red-500 hover:text-red-700 p-2 transition-all"
													aria-label="Remove member">
													<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
														<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
													</svg>
												</button>
											</form>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Custom animations */
	.animate-in {
		animation: slide-in 0.3s ease-out;
	}

	@keyframes slide-in {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
