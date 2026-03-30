<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import { COLOR, TEXT, RADIUS, ELEVATION, TRANSITION, SPACING, GRADIENT } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import AuthFormField from '$lib/components/AuthFormField.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import { toast } from '$lib/stores/toast';

	let { data, form } = $props();

	let activeTab = $derived(data.headerTabs.activeTab);
	let isOrgAdmin = $derived(data.isOrgAdmin);

	// Modals & States
	let showApiKeyModal = $state(false);
	let generatedKey = $state('');
	let newKeyName = $state('');

	let showDeleteModal = $state(false);
	let deleteConfirmText = $state('');

	let newOrgName = $state('');
	let newOrgSlug = $state('');

	$effect(() => {
		if (form?.success && form?.data?.key) {
			generatedKey = form.data.key;
			showApiKeyModal = true;
		}
	});
</script>

<PageWrapper title="Pengaturan Akun">
	<div class="mx-auto max-w-6xl">


		<main>
			<!-- Profile Tab -->
			{#if activeTab === 'profile'}
				<div class="animate-in grid gap-10 md:grid-cols-3">
					<div class="md:col-span-1 space-y-6">
						<div class={`p-8 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} flex flex-col items-center text-center shadow-2xl transition-all hover:scale-[1.02]`}>
							<div class="relative mb-6">
								<div class="h-32 w-32 overflow-hidden rounded-full border-4 border-blue-500/20 bg-blue-100 p-1 dark:bg-zinc-800 flex items-center justify-center">
									<Icon name="user" size={80} class="text-blue-600 dark:text-blue-400 opacity-40" />
								</div>
								{#if data.user.isVerified}
									<div class="absolute -right-1 -bottom-1 h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center border-4 border-white dark:border-zinc-900 shadow-xl" title="Terverifikasi">
										<Icon name="check" size={18} />
									</div>
								{/if}
							</div>
							<h2 class="mb-1 text-2xl font-black italic tracking-tighter uppercase">{data.user.fullName || data.user.username}</h2>
							<p class="text-xs font-bold text-zinc-500 uppercase tracking-widest px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700">{data.user.role}</p>
						</div>

						<div class={`p-6 ${RADIUS.card} ${COLOR.card} border border-zinc-100 dark:border-zinc-800 space-y-4`}>
							<div class="flex items-center justify-between text-xs font-bold uppercase tracking-tighter text-zinc-400">
								<span>Status Akun</span>
								<span class={data.user.isVerified ? 'text-green-500' : 'text-orange-500'}>
									{data.user.isVerified ? 'Institusi' : 'Personal'}
								</span>
							</div>
							<div class="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
								<div class="h-full bg-blue-600" style="width: {data.user.isVerified ? '100%' : '30%'}"></div>
							</div>
							<p class="text-[10px] leading-relaxed text-zinc-500 italic">
								{#if data.user.isVerified}
									Anda memiliki akses penuh untuk membuat organisasi dan mendeploy draf agen.
								{:else}
									Verifikasi KTP Anda untuk mengaktifkan fitur Organisasi & Agentic Deployment.
								{/if}
							</p>
						</div>
					</div>

					<div class="md:col-span-2">
						<form method="POST" action="?/updateProfile" use:enhance class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} space-y-8 shadow-sm relative overflow-hidden`}>
							<div class="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Icon name="user" size={120} /></div>
							<h3 class="text-xl font-black italic uppercase tracking-widest border-l-4 border-blue-600 pl-4 mb-4">Informasi Dasar</h3>
							<AuthFormField label="Nama Lengkap" name="fullName" value={data.user.fullName ?? undefined} placeholder="Masukkan nama lengkap Anda" />
							<div class="grid gap-6 md:grid-cols-2">
								<AuthFormField label="Alamat Email" name="email" value={data.user.email ?? undefined} placeholder="email@contoh.com" required />
								<AuthFormField label="Nomor Telepon" name="phone" value={data.user.phone ?? undefined} placeholder="628..." />
							</div>
							<div class="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
								<AuthSubmitButton text="Simpan Perubahan" />
							</div>
						</form>
					</div>
				</div>
			{/if}

			<!-- Security Tab -->
			{#if activeTab === 'security'}
				<div class="animate-in mx-auto max-w-2xl">
					<form method="POST" action="?/changePassword" use:enhance class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} space-y-8 shadow-sm relative`}>
						<div class="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Icon name="shield" size={120} /></div>
						<h3 class="text-xl font-black italic uppercase tracking-widest border-l-4 border-blue-600 pl-4 mb-4">Keamanan Akun</h3>
						<AuthFormField label="Password Saat Ini" name="currentPassword" type="password" placeholder="••••••••" required />
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<AuthFormField label="Password Baru" name="newPassword" type="password" placeholder="••••••••" required />
							<AuthFormField label="Konfirmasi Password" name="confirmPassword" type="password" placeholder="••••••••" required />
						</div>
						<div class="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
							<AuthSubmitButton text="Perbarui Password" />
						</div>
					</form>
				</div>
			{/if}

			<!-- Organization Tab -->
			{#if activeTab === 'organization'}
				<div class="animate-in space-y-10">
					{#if !data.organization}
						<div class={`mx-auto max-w-3xl border-2 border-dashed ${COLOR.cardBorder} ${RADIUS.card} p-12 text-center`}>
							<div class="mb-6 flex justify-center"><div class="rounded-full bg-zinc-100 p-6 dark:bg-zinc-800"><Icon name="layout" size={48} class="text-zinc-400" /></div></div>
							<h3 class="mb-2 text-2xl font-black italic uppercase tracking-tight">Belum Ada Organisasi</h3>
							<p class="mx-auto mb-10 max-w-md text-zinc-500">Buat organisasi untuk mulai mendeploy kurikulum melalui AI Agent dan mengelola tim Anda secara profesional.</p>
							
							{#if data.user.isVerified || data.user.role === 'admin'}
								<form method="POST" action="?/createOrganization" use:enhance class="mx-auto max-w-lg space-y-4 text-left p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
									<AuthFormField label="Nama Organisasi" name="name" bind:value={newOrgName} placeholder="Contoh: Yayasan Klub Fisika" required />
									<div>
										<label for="org-slug" class={`${TEXT.small} mb-1 block font-bold transition-all duration-300`}>Workspace URL</label>
										<div class="flex items-center gap-2">
											<span class="text-xs text-zinc-400">naikkelas.id/org/</span>
											<input id="org-slug" type="text" name="slug" bind:value={newOrgSlug} required pattern="[a-z0-9-]+" placeholder="klub-fisika" class={`flex-1 border-b-2 border-zinc-200 bg-transparent py-2 text-sm font-black outline-none transition-all focus:border-blue-600 dark:border-zinc-800`} />
										</div>
									</div>
									<div class="pt-4">
										<AuthSubmitButton text="Buat Organisasi Sekarang" />
									</div>
								</form>
							{:else}
								<div class="bg-orange-50 border border-orange-200 p-6 rounded-2xl dark:bg-orange-950/20 dark:border-orange-900">
									<Icon name="alert-triangle" class="mx-auto mb-2 text-orange-600" />
									<p class="text-sm font-bold text-orange-800 dark:text-orange-300 uppercase italic tracking-widest">Verifikasi Diperlukan</p>
									<p class="text-xs text-orange-700 mt-2">Silakan hubungi administrator untuk melakukan verifikasi KTP sebelum Anda dapat membuat organisasi.</p>
								</div>
							{/if}
						</div>
					{:else}
						<!-- Organization Info & Settings -->
						<div class="grid gap-8 lg:grid-cols-2">
							<section class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} shadow-sm space-y-6`}>
								<div class="flex items-center justify-between">
									<h3 class="text-xl font-black italic uppercase tracking-widest border-l-4 border-blue-600 pl-4">Pengaturan Organisasi</h3>
									<div class="h-10 w-10 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-blue-600">
										{data.organization.name?.[0]?.toUpperCase()}
									</div>
								</div>
								<form method="POST" action="?/updateOrgSettings" use:enhance class="space-y-6">
									<AuthFormField label="Nama Institusi" name="name" value={data.organization.name} required />
									<div class="space-y-2">
										<label class="text-xs font-bold uppercase tracking-widest text-zinc-400">Branding Color</label>
										<div class="flex items-center gap-4">
											<input type="color" name="brandColor" value={data.organization.brandColor} class="h-12 w-12 rounded-xl cursor-pointer bg-transparent border-none" />
											<span class="font-mono text-sm uppercase">{data.organization.brandColor}</span>
										</div>
									</div>
									{#if isOrgAdmin}
										<div class="pt-6 border-t border-zinc-100 dark:border-zinc-800">
											<AuthSubmitButton text="Update Organisasi" />
										</div>
									{/if}
								</form>
							</section>

							<!-- API Key Section -->
							<section class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} shadow-sm space-y-6 flex flex-col`}>
								<div class="flex items-center justify-between">
									<h3 class="text-xl font-black italic uppercase tracking-widest border-l-4 border-green-600 pl-4">Agent Deployment API</h3>
									<Icon name="key" class="text-green-600" />
								</div>
								<p class="text-sm text-zinc-500 mb-4">Gunakan API Key untuk mengizinkan AI Agent (naikkelas-agent) melakukan deployment kurikulum secara otomatis.</p>
								
								<div class="flex-1 space-y-4">
									{#each data.orgApiKeys as key}
										<div class="flex items-center justify-between rounded-xl bg-zinc-50 p-4 border border-zinc-100 dark:bg-zinc-800/50 dark:border-zinc-800">
											<div>
												<p class="text-sm font-bold">{key.name}</p>
												<p class="text-[10px] text-zinc-400 font-mono italic">Terakhir digunakan: {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Belum pernah'}</p>
											</div>
											{#if key.status === 'active'}
												<form method="POST" action="?/revokeApiKey">
													<input type="hidden" name="keyId" value={key.id} />
													<button class="text-xs font-bold text-red-600 hover:underline uppercase tracking-widest">Revoke</button>
												</form>
											{:else}
												<span class="text-xs font-bold text-zinc-400 uppercase tracking-widest">Revoked</span>
											{/if}
										</div>
									{:else}
										<div class="flex flex-col items-center justify-center h-40 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
											<p class="text-xs font-bold text-zinc-400 uppercase italic">Belum ada API Key</p>
										</div>
									{/each}
								</div>

								{#if isOrgAdmin}
									<button onclick={() => (showApiKeyModal = true)} class={`mt-4 w-full py-4 ${RADIUS.button} bg-zinc-900 text-white font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg`}>
										Buat API Key Baru
									</button>
								{/if}
							</section>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Preferences Tab -->
			{#if activeTab === 'preferences'}
				<div class="animate-in grid gap-8 md:grid-cols-3">
					<div class="md:col-span-2 space-y-8">
						<section class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} space-y-6 relative`}>
							<h3 class="text-xl font-black italic uppercase tracking-widest border-l-4 border-blue-600 pl-4 mb-4">Pengaturan Aplikasi</h3>
							
							<div class="space-y-6">
								<div class="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-800">
									<div>
										<h4 class="font-bold">Notifikasi Email</h4>
										<p class="text-xs text-zinc-500 italic">Terima laporan mingguan progres belajar peserta.</p>
									</div>
									<div class="relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full bg-blue-600">
										<span class="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition"></span>
									</div>
								</div>
								
								<div class="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-800">
									<div>
										<h4 class="font-bold">Notifikasi WhatsApp</h4>
										<p class="text-xs text-zinc-500 italic">Terima alert instan saat ada tugas baru dikirim.</p>
									</div>
									<div class="relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full bg-zinc-200 dark:bg-zinc-700">
										<span class="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition"></span>
									</div>
								</div>

								<div class="flex items-center justify-between py-4">
									<div>
										<h4 class="font-bold">Modus Fokus (LMS)</h4>
										<p class="text-xs text-zinc-500 italic">Sembunyikan sidebar otomatis saat sedang belajar.</p>
									</div>
									<div class="relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full bg-blue-600">
										<span class="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition"></span>
									</div>
								</div>
							</div>
						</section>
					</div>

					<div class="space-y-6">
						<div class={`p-8 ${RADIUS.card} bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl relative overflow-hidden group`}>
							<Icon name="zap" class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-150 transition-transform duration-1000" size={140} />
							<h4 class="text-lg font-black italic uppercase tracking-tighter mb-2">Tips</h4>
							<p class="text-xs leading-relaxed opacity-80 italic font-medium">Pengaturan ini membantu Anda mengatur kenyamanan saat berinteraksi dengan platform Naik Kelas.</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Payment Gateway (Admin Only) -->
			{#if activeTab === 'payments' && data.user.role === 'admin'}
				<div class="animate-in space-y-8">
					<section class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} space-y-6`}>
						<div class="flex items-center gap-4 mb-4">
							<Icon name="credit-card" class="text-blue-600" size={32} />
							<div>
								<h3 class="text-xl font-black italic uppercase tracking-widest">Midtrans Snap Configuration</h3>
								<p class="text-xs text-zinc-500 italic">Hanya dapat diakses oleh Platform Admin.</p>
							</div>
						</div>
						
						<div class="grid gap-6 md:grid-cols-2">
							<AuthFormField label="Client Key" name="midtransClientKey" value="••••••••••••••••••••" readonly />
							<AuthFormField label="Server Key" name="midtransServerKey" value="••••••••••••••••••••" readonly />
						</div>
						<div class="bg-blue-50 border border-blue-100 p-4 rounded-xl dark:bg-blue-900/20 dark:border-blue-900">
							<p class="text-xs font-bold text-blue-800 dark:text-blue-300">💡 Integrasi Aktif</p>
							<p class="text-[10px] text-blue-700 mt-1 italic">Sistem pembayaran menggunakan Midtrans Snap v1.0. Konfigurasi didefinisikan melalui environment variables server.</p>
						</div>
					</section>
				</div>
			{/if}

			<!-- Account / Danger Tab -->
			{#if activeTab === 'account'}
				<div class="animate-in mx-auto max-w-2xl">
					<div class={`p-10 ${RADIUS.card} border-2 border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30 space-y-6 relative overflow-hidden`}>
						<div class="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-red-600"><Icon name="trash-2" size={120} /></div>
						<div class="flex items-start gap-4">
							<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-600 shadow-lg"><Icon name="alert-triangle" size={24} /></div>
							<div class="flex-1">
								<h3 class="mb-2 text-xl font-black italic tracking-widest text-red-800 dark:text-red-300 uppercase">Hapus Seluruh Data</h3>
								<p class="mb-6 text-sm text-red-700 dark:text-red-400 leading-relaxed italic">Penghapusan akun bersifat final. Semua riwayat belajar, sertifikat, dan akses ke organisasi akan hilang selamanya dan tidak dapat dipulihkan oleh tim support.</p>
								<button onclick={() => (showDeleteModal = true)} class={`w-full md:w-auto ${RADIUS.button} bg-red-600 px-10 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl hover:bg-red-700 transition-all hover:scale-105 active:scale-95`}>Mulai Penghapusan Akun</button>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</main>
	</div>

	<!-- API Key Modal -->
	{#if showApiKeyModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in">
			<div class={`w-full max-w-lg ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} p-10 shadow-2xl relative`}>
				<div class="mb-8 flex items-center justify-between">
					<h3 class="text-2xl font-black italic tracking-tighter uppercase border-l-4 border-green-600 pl-4">Agent Secret Key</h3>
					<button onclick={() => { showApiKeyModal = false; generatedKey = ''; }} class="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"><Icon name="x" size={24} /></button>
				</div>

				{#if generatedKey}
					<div class="space-y-6">
						<div class="bg-green-50 border border-green-200 p-4 rounded-xl dark:bg-green-950/20 dark:border-green-900">
							<p class="text-xs text-green-700 font-bold uppercase italic tracking-widest flex items-center gap-2">
								<Icon name="alert-circle" size={14} />
								Sangat Penting!
							</p>
							<p class="text-[10px] text-green-600 mt-1">Salin key ini sekarang. Demi keamanan, kami tidak akan menampilkannya lagi setelah Anda menutup jendela ini.</p>
						</div>
						
						<div class="flex items-center gap-4 rounded-xl border-2 border-zinc-200 bg-zinc-50 p-6 font-mono text-lg dark:bg-zinc-800 dark:border-zinc-700 group relative">
							<span class="flex-1 truncate tracking-tighter">{generatedKey}</span>
							<button onclick={() => { navigator.clipboard.writeText(generatedKey); toast.success('Key disalin ke clipboard!'); }} class="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm border border-zinc-200 text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all dark:bg-zinc-900 dark:border-zinc-600">
								<Icon name="copy" size={16} />
							</button>
						</div>

						<button onclick={() => { showApiKeyModal = false; generatedKey = ''; }} class={`w-full py-4 ${RADIUS.button} bg-zinc-900 text-white font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all dark:bg-white dark:text-black`}>
							Saya Sudah Mendokumentasikan Key Ini
						</button>
					</div>
				{:else}
					<form method="POST" action="?/createApiKey" use:enhance class="space-y-6">
						<AuthFormField label="Identitas Key" name="name" bind:value={newKeyName} placeholder="Contoh: Production Agent ASIB" required />
						<p class="text-[10px] text-zinc-400 italic">Key ini akan memberikan akses penuh bagi agen untuk mengelola kurikulum di organisasi {data.organization?.name}.</p>
						<div class="pt-4 flex justify-end">
							<AuthSubmitButton text="Generate Secret Key" />
						</div>
					</form>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Delete Modal -->
	{#if showDeleteModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in">
			<div class={`w-full max-w-md ${RADIUS.card} bg-white p-10 shadow-2xl dark:bg-zinc-950 border-2 border-red-200 dark:border-red-900`}>
				<div class="flex flex-col items-center text-center mb-8">
					<div class="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 mb-6 border-2 border-red-200 dark:border-red-800">
						<Icon name="alert-triangle" size={40} />
					</div>
					<h3 class="text-2xl font-black italic tracking-tighter uppercase text-red-600">Konfirmasi Final</h3>
					<p class="text-sm text-zinc-500 mt-2 font-medium">Buktikan bahwa Anda serius menghapus masa depan digital Anda di platform ini.</p>
				</div>

				<p class="mb-6 text-xs text-zinc-600 dark:text-zinc-400 text-center italic">
					Ketik kata kunci <span class="font-black text-red-600 uppercase border-b-2 border-red-600">HAPUS</span> di bawah ini untuk mengonfirmasi.
				</p>

				<form method="POST" action="?/deleteAccount" use:enhance class="space-y-6">
					<input
						type="text"
						name="confirmText"
						bind:value={deleteConfirmText}
						placeholder="MASUKKAN KATAKUNCI"
						class={`w-full p-4 border-2 ${deleteConfirmText === 'HAPUS' ? 'border-red-500 bg-red-50/50' : 'border-zinc-200'} rounded-2xl text-center font-black tracking-[0.2em] outline-none transition-all dark:bg-zinc-900 dark:border-zinc-800`}
						required
					/>
					
					<div class="flex gap-4">
						<button type="button" onclick={() => { showDeleteModal = false; deleteConfirmText = ''; }} class="flex-1 p-4 text-xs font-black uppercase tracking-widest border-2 border-zinc-200 rounded-2xl hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 transition-all">Batal</button>
						<button 
							type="submit" 
							disabled={deleteConfirmText !== 'HAPUS'} 
							class="flex-1 p-4 text-xs font-black uppercase tracking-widest bg-red-600 text-white rounded-2xl shadow-xl hover:bg-red-700 disabled:opacity-30 disabled:grayscale transition-all active:scale-95"
						>
							Hapus Permanen
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</PageWrapper>

<style>
	:global(.animate-in) {
		animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}
	@keyframes slide-up {
		from { opacity: 0; transform: translateY(30px) scale(0.98); }
		to { opacity: 1; transform: translateY(0) scale(1); }
	}
</style>
