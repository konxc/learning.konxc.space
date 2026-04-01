<script lang="ts">
	import { RADIUS, COLOR } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import AuthFormField from '$lib/components/AuthFormField.svelte';
</script>

<div class="animate-in space-y-8">
	<section class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} space-y-6`}>
		<div class="mb-4 flex items-center gap-4">
			<Icon name="credit-card" class="text-blue-600" size={32} />
			<div>
				<h3 class="text-xl font-black tracking-widest uppercase italic">
					Midtrans Snap Configuration
				</h3>
				<p class="text-xs text-zinc-500 italic">Hanya dapat diakses oleh Platform Admin.</p>
			</div>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<AuthFormField
				label="Client Key"
				name="midtransClientKey"
				value="••••••••••••••••••••"
				readonly
			/>
			<AuthFormField
				label="Server Key"
				name="midtransServerKey"
				value="••••••••••••••••••••"
				readonly
			/>
		</div>
		<div
			class="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20"
		>
			<p class="text-xs font-bold text-blue-800 dark:text-blue-300">💡 Integrasi Aktif</p>
			<p class="mt-1 text-[10px] text-blue-700 italic">
				Sistem pembayaran menggunakan Midtrans Snap v1.0. Konfigurasi didefinisikan melalui
				environment variables server.
			</p>
		</div>
	</section>
</div>
