<script lang="ts">
	import { enhance } from '$app/forms';
	import { RADIUS, COLOR, TEXT } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import AuthFormField from '$lib/components/AuthFormField.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import { toast } from '$lib/stores/toastStore';
	import { formToast } from '$lib/utils/formEnhance';

	interface Organization {
		id: string;
		name: string;
		slug: string;
		brandColor: string | null;
		logoUrl: string | null;
	}

	interface OrgApiKey {
		id: string;
		name: string;
		status: string;
		lastUsedAt: Date | null;
		createdAt: Date;
	}

	interface OrgMember {
		id: string;
		role: string;
		user: {
			fullName: string | null;
			username: string;
			email: string | null;
		};
	}

	interface UserData {
		id: string;
		isVerified: boolean;
		role: string;
	}

	interface Props {
		user: UserData;
		organization: Organization | null;
		orgMembers: OrgMember[];
		orgApiKeys: OrgApiKey[];
		isOrgAdmin: boolean;
	}

	let { user, organization, orgMembers, orgApiKeys, isOrgAdmin }: Props = $props();

	let showApiKeyModal = $state(false);
	let generatedKey = $state('');
	let newKeyName = $state('');
	let newOrgName = $state('');
	let newOrgSlug = $state('');
	let submittingLogo = $state(false);
	let showInviteModal = $state(false);
	let inviteEmail = $state('');
	let inviteRole = $state('member');

	function maskKey(key: string): string {
		if (!key || key.length < 12) return key;
		return key.substring(0, 8) + '••••••••••••' + key.substring(key.length - 4);
	}

	$effect(() => {
		if (generatedKey && !showApiKeyModal) {
			showApiKeyModal = true;
		}
	});
</script>

<div class="animate-in space-y-10">
	{#if !organization}
		<div
			class={`mx-auto max-w-3xl border-2 border-dashed ${COLOR.cardBorder} ${RADIUS.card} p-12 text-center`}
		>
			<div class="mb-6 flex justify-center">
				<div class="rounded-full bg-zinc-100 p-6 dark:bg-zinc-800">
					<Icon name="layout" size={48} class="text-zinc-400" />
				</div>
			</div>
			<h3 class="mb-2 text-2xl font-black tracking-tight uppercase italic">Belum Ada Organisasi</h3>
			<p class="mx-auto mb-10 max-w-md text-zinc-500">
				Buat organisasi untuk mulai mendeploy kurikulum melalui AI Agent dan mengelola tim Anda
				secara profesional.
			</p>

			{#if user.isVerified || user.role === 'admin'}
				<form
					method="POST"
					action="?/createOrganization"
					use:enhance={formToast({
						success: 'Organisasi berhasil dibuat!',
						error: 'Gagal membuat organisasi',
						withUpdate: false
					})}
					class="mx-auto max-w-lg space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-left dark:border-zinc-800 dark:bg-zinc-900/50"
				>
					<AuthFormField
						label="Nama Organisasi"
						name="name"
						bind:value={newOrgName}
						placeholder="Contoh: Yayasan Klub Fisika"
						required
					/>
					<div>
						<label
							for="org-slug"
							class={`${TEXT.small} mb-1 block font-bold transition-all duration-300`}
							>Workspace URL</label
						>
						<div class="flex items-center gap-2">
							<span class="text-xs text-zinc-400">naikkelas.id/org/</span>
							<input
								id="org-slug"
								type="text"
								name="slug"
								bind:value={newOrgSlug}
								required
								pattern="[a-z0-9-]+"
								placeholder="klub-fisika"
								class={`flex-1 border-b-2 border-zinc-200 bg-transparent py-2 text-sm font-black transition-all outline-none focus:border-blue-600 dark:border-zinc-800`}
							/>
						</div>
					</div>
					<div class="pt-4">
						<AuthSubmitButton text="Buat Organisasi Sekarang" />
					</div>
				</form>
			{:else}
				<div
					class="animate-pulse-slow relative mx-auto max-w-lg overflow-hidden rounded-2xl border-2 border-dashed border-zinc-200 bg-white/50 p-10 text-center dark:border-zinc-800 dark:bg-zinc-900/30"
				>
					<div
						class="pointer-events-none absolute inset-0 z-0 bg-blue-500/5 backdrop-blur-3xl"
					></div>
					<div class="relative z-10">
						<div
							class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-inner dark:bg-blue-900/30"
						>
							<Icon name="lock" size={32} />
						</div>
						<h4
							class="mb-3 text-2xl font-black tracking-tight text-zinc-900 uppercase italic dark:text-white"
						>
							Akses Terkunci
						</h4>
						<p class="mx-auto mb-8 max-w-xs text-sm leading-relaxed font-medium text-zinc-500">
							Demi kepatuhan standar <span class="font-bold text-zinc-800 dark:text-zinc-200"
								>Naik Kelas Enterprise</span
							>, manajemen Workspace diwajibkan melakukan validasi *Know Your Customer* (KYC).
						</p>
						<a
							href="?tab=verification"
							class={`inline-block ${RADIUS.button} bg-black px-10 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl transition-all hover:scale-105 hover:bg-blue-600 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-blue-500 dark:hover:text-white`}
						>
							Verifikasi Akun Sekarang <Icon name="arrow-right" size={14} class="ml-1 inline" />
						</a>
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Organization Info & Settings -->
		<div class="grid gap-8 lg:grid-cols-2">
			<section
				class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} space-y-6 shadow-sm`}
			>
				<h3
					class="mb-4 border-l-4 border-indigo-600 pl-4 text-xl font-black tracking-widest uppercase italic"
				>
					Identitas Organisasi
				</h3>

				<div class="mb-8 flex items-center gap-8">
					<div class="group relative">
						<div
							class={`flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl border-4 ${COLOR.cardBorder} bg-zinc-50 shadow-inner transition-all group-hover:scale-105 dark:bg-zinc-900`}
						>
							{#if organization?.logoUrl}
								<img src={organization.logoUrl} alt="Org Logo" class="h-full w-full object-cover" />
							{:else}
								<div class="flex flex-col items-center gap-1 opacity-20">
									<Icon name="building" size={48} />
									<span class="text-[10px] font-black tracking-widest uppercase">No Logo</span>
								</div>
							{/if}
						</div>
						<form
							method="POST"
							action="?/uploadOrgLogo"
							enctype="multipart/form-data"
							use:enhance={() => {
								submittingLogo = true;
								return async ({ result }) => {
									submittingLogo = false;
									if (result.type === 'success') {
										toast.success('Logo diperbarui!');
									} else if (result.type === 'failure') {
										toast.error((result.data as any)?.error || 'Gagal unggah logo');
									}
								};
							}}
							class="absolute -right-2 -bottom-2"
						>
							<label
								class={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-zinc-900 text-white shadow-xl transition-all hover:scale-110 active:scale-95 dark:bg-white dark:text-black`}
							>
								<input
									type="file"
									name="logo"
									accept="image/*"
									class="hidden"
									onchange={(e) => e.currentTarget.form?.requestSubmit()}
								/>
								{#if submittingLogo}
									<Icon name="loading" size={18} class="animate-spin" />
								{:else}
									<Icon name="upload" size={18} />
								{/if}
							</label>
						</form>
					</div>
					<div class="flex-1">
						<p class="text-[10px] font-black tracking-widest text-indigo-600 uppercase italic">
							Workspace Owner
						</p>
						<h4 class="max-w-[200px] truncate text-2xl font-black tracking-tighter">
							{organization?.name}
						</h4>
						<p class="font-mono text-[10px] text-zinc-500 italic opacity-60">
							ID: {organization?.id}
						</p>
					</div>
				</div>

				<form
					method="POST"
					action="?/updateOrgSettings"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') toast.success('Pengaturan organisasi disimpan');
						};
					}}
					class="space-y-6"
				>
					<AuthFormField label="Nama Institusi" name="name" value={organization?.name} required />
					<AuthFormField label="URL Workspace" name="slug" value={organization?.slug} readonly />

					<div class="space-y-2">
						<label
							class="text-[10px] font-black tracking-widest text-zinc-500 uppercase italic"
							for="brandColor"
						>
							Branding Color
						</label>
						<div class="flex items-center gap-4">
							<div
								class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border-2 border-zinc-200 dark:border-zinc-800"
								style={`background-color: ${organization?.brandColor}`}
							>
								<input
									type="color"
									name="brandColor"
									value={organization?.brandColor}
									class="h-20 w-20 cursor-pointer opacity-0"
								/>
							</div>
							<span class="font-mono text-sm font-bold uppercase">{organization?.brandColor}</span>
						</div>
					</div>

					{#if isOrgAdmin}
						<div class="pt-4">
							<AuthSubmitButton text="Update Organisasi" />
						</div>
					{/if}
				</form>
			</section>

			<div class="grid gap-8">
				<!-- Members Section -->
				<section
					class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} flex flex-col space-y-6 shadow-sm`}
				>
					<div class="flex items-center justify-between">
						<h3
							class="border-l-4 border-blue-600 pl-4 text-xl font-black tracking-widest uppercase italic"
						>
							Anggota Tim
						</h3>
						<button
							onclick={() => (showInviteModal = true)}
							class={`flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-[10px] font-black tracking-widest text-white uppercase shadow-lg transition-all hover:scale-105 active:scale-95`}
						>
							<Icon name="plus" size={14} />
							Undang
						</button>
					</div>

					<div class="overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800">
						<div
							class="max-h-[300px] divide-y divide-zinc-100 overflow-y-auto dark:divide-zinc-800"
						>
							{#each orgMembers as member}
								<div
									class="flex items-center justify-between p-4 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
								>
									<div class="flex items-center gap-3">
										<div
											class={`flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-zinc-100 to-zinc-200 font-black text-zinc-600 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-400`}
										>
											{member.user.fullName?.charAt(0) ||
												member.user.username.charAt(0).toUpperCase()}
										</div>
										<div>
											<p class="text-sm font-bold">
												{member.user.fullName || member.user.username}
											</p>
											<p class="max-w-[120px] truncate text-[10px] text-zinc-500 italic opacity-60">
												{member.user.email}
											</p>
										</div>
									</div>
									<div class="flex items-center gap-4">
										<form
											method="POST"
											action="?/updateMemberRole"
											use:enhance={() => {
												return async ({ result }) => {
													if (result.type === 'success') toast.success('Role diperbarui');
												};
											}}
										>
											<input type="hidden" name="memberId" value={member.id} />
											<select
												name="role"
												onchange={(e) => e.currentTarget.form?.requestSubmit()}
												disabled={member.role === 'owner' || !isOrgAdmin}
												class="rounded-lg border-2 border-zinc-100 bg-white px-2 py-1 text-[10px] font-black tracking-widest uppercase transition-all outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
											>
												<option value="owner" selected={member.role === 'owner'}>Owner</option>
												<option value="admin" selected={member.role === 'admin'}>Admin</option>
												<option value="creator" selected={member.role === 'creator'}>Creator</option
												>
												<option value="facilitator" selected={member.role === 'facilitator'}
													>Facilitator</option
												>
												<option value="member" selected={member.role === 'member'}>Member</option>
											</select>
										</form>

										{#if member.role !== 'owner' && isOrgAdmin}
											<form
												method="POST"
												action="?/removeMember"
												use:enhance={() => {
													return async ({ result }) => {
														if (result.type === 'success') toast.success('Anggota dihapus');
													};
												}}
											>
												<input type="hidden" name="memberId" value={member.id} />
												<button
													type="submit"
													class="text-zinc-300 transition-colors hover:text-red-500"
													aria-label="Hapus Anggota"
												>
													<Icon name="trash-2" size={16} />
												</button>
											</form>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</section>

				<!-- API Key Section -->
				<section
					class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} flex flex-col space-y-6 shadow-sm`}
				>
					<div class="flex items-center justify-between">
						<h3
							class="border-l-4 border-green-600 pl-4 text-xl font-black tracking-widest uppercase italic"
						>
							Agent API Keys
						</h3>
						<Icon name="key" class="text-green-600" />
					</div>
					<p class="text-xs text-zinc-500 italic opacity-80">
						Gunakan API Key untuk mengintegrasikan kurikulum dengan Agentic AI platform.
					</p>

					<div class="flex-1 space-y-4">
						{#each orgApiKeys as key}
							<div
								class="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-4 transition-all hover:border-green-200 dark:border-zinc-800 dark:bg-zinc-800/50"
							>
								<div>
									<p class="text-sm font-bold">{key.name}</p>
									<p class="mt-1 font-mono text-[9px] tracking-tighter text-zinc-400 uppercase">
										Status: <span
											class={key.status === 'active' ? 'text-green-600' : 'text-red-600'}
											>{key.status}</span
										>
									</p>
								</div>
								{#if key.status === 'active' && isOrgAdmin}
									<form method="POST" action="?/revokeApiKey" use:enhance>
										<input type="hidden" name="keyId" value={key.id} />
										<button
											class="text-[10px] font-black tracking-widest text-red-600 uppercase transition-colors hover:text-red-700"
											>Revoke</button
										>
									</form>
								{/if}
							</div>
						{:else}
							<div
								class="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl"
							>
								<Icon name="key" size={32} class="mb-2 text-zinc-200" />
								<p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">
									Belum ada API Key
								</p>
							</div>
						{/each}
					</div>

					{#if isOrgAdmin}
						<button
							onclick={() => (showApiKeyModal = true)}
							class={`mt-4 w-full py-4 ${RADIUS.button} bg-zinc-900 text-[10px] font-black tracking-widest text-white uppercase shadow-lg transition-all hover:scale-[1.02] active:scale-95`}
						>
							Generate API Key
						</button>
					{/if}
				</section>
			</div>
		</div>
	{/if}
</div>

<!-- API Key Modal -->
{#if showApiKeyModal}
	<div
		class="animate-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
	>
		<div
			class={`w-full max-w-lg ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} relative p-10 shadow-2xl`}
		>
			<div class="mb-8 flex items-center justify-between">
				<h3
					class="border-l-4 border-green-600 pl-4 text-2xl font-black tracking-tighter uppercase italic"
				>
					Agent Secret Key
				</h3>
				<button
					onclick={() => {
						showApiKeyModal = false;
						generatedKey = '';
					}}
					class="text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
					><Icon name="x" size={24} /></button
				>
			</div>

			{#if generatedKey}
				<div class="space-y-6">
					<div
						class="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20"
					>
						<p
							class="flex items-center gap-2 text-xs font-bold tracking-widest text-green-700 uppercase italic"
						>
							<Icon name="alert-circle" size={14} />
							Sangat Penting!
						</p>
						<p class="mt-1 text-[10px] text-green-600">
							Salin key ini sekarang. Demi keamanan, kami tidak akan menampilkannya lagi setelah
							Anda menutup jendela ini.
						</p>
					</div>

					<div
						class="group relative flex items-center gap-4 rounded-xl border-2 border-zinc-200 bg-zinc-50 p-6 font-mono text-lg dark:border-zinc-700 dark:bg-zinc-800"
					>
						<span class="flex-1 truncate tracking-tighter select-all">{maskKey(generatedKey)}</span>
						<button
							onclick={() => {
								navigator.clipboard.writeText(generatedKey);
								toast.success('Key disalin ke clipboard!');
							}}
							class="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 shadow-sm transition-all hover:bg-zinc-900 hover:text-white dark:border-zinc-600 dark:bg-zinc-900"
						>
							<Icon name="copy" size={16} />
						</button>
					</div>

					<button
						onclick={() => {
							showApiKeyModal = false;
							generatedKey = '';
						}}
						class={`w-full py-4 ${RADIUS.button} bg-zinc-900 text-xs font-black tracking-widest text-white uppercase shadow-xl transition-all active:scale-95 dark:bg-white dark:text-black`}
					>
						Saya Sudah Mendokumentasikan Key Ini
					</button>
				</div>
			{:else}
				<form
					method="POST"
					action="?/createApiKey"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'failure') {
								const errorMsg = (result.data as any)?.error || 'Gagal membuat API Key';
								toast.error(errorMsg);
							} else if (result.type === 'success') {
								const key = (result.data as any)?.key;
								if (key) generatedKey = key;
							}
						};
					}}
					class="space-y-6"
				>
					<AuthFormField
						label="Identitas Key"
						name="name"
						bind:value={newKeyName}
						placeholder="Contoh: Production Agent ASIB"
						required
					/>
					<p class="text-[10px] text-zinc-400 italic">
						Key ini akan memberikan akses penuh bagi agen untuk mengelola kurikulum di organisasi {organization?.name}.
					</p>
					<div class="flex justify-end pt-4">
						<AuthSubmitButton text="Generate Secret Key" />
					</div>
				</form>
			{/if}
		</div>
	</div>
{/if}

<!-- Invite Member Modal -->
{#if showInviteModal}
	<div
		class="animate-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
	>
		<div
			class={`w-full max-w-lg ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} relative p-10 shadow-2xl`}
		>
			<div class="mb-8 flex items-center justify-between">
				<h3
					class="border-l-4 border-blue-600 pl-4 text-2xl font-black tracking-tighter uppercase italic"
				>
					Undang Anggota Tim
				</h3>
				<button
					onclick={() => (showInviteModal = false)}
					class="text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
					><Icon name="x" size={24} /></button
				>
			</div>

			<form
				method="POST"
				action="?/inviteMember"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							toast.success('Undangan berhasil dikirim');
							showInviteModal = false;
							inviteEmail = '';
						} else if (result.type === 'failure') {
							toast.error((result.data as any)?.error || 'Gagal mengirim undangan');
						}
					};
				}}
				class="space-y-6"
			>
				<AuthFormField
					label="Alamat Email"
					name="email"
					bind:value={inviteEmail}
					placeholder="email@contoh.com"
					required
				/>
				<div class="space-y-2">
					<label
						class="text-[10px] font-black tracking-widest text-zinc-500 uppercase italic"
						for="inviteRole"
					>
						Role Anggota
					</label>
					<select
						name="role"
						id="inviteRole"
						bind:value={inviteRole}
						class="w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-4 text-sm font-bold transition-all outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900"
					>
						<option value="admin">Admin (Akses Penuh)</option>
						<option value="creator">Creator (Course Builder)</option>
						<option value="facilitator">Facilitator (Mentor Batch)</option>
						<option value="member">Member (Akses Belajar)</option>
					</select>
				</div>
				<p class="text-[10px] text-zinc-400 italic">
					Email undangan akan dikirimkan ke alamat di atas. Pastikan alamat email tersebut sudah
					terdaftar di platform Naik Kelas.
				</p>
				<div class="flex justify-end pt-4">
					<AuthSubmitButton text="Kirim Undangan" />
				</div>
			</form>
		</div>
	</div>
{/if}
