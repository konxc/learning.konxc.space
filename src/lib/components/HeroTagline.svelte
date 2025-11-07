<script lang="ts">
	interface Props {
		tagline?: string;
	}

	let { tagline = 'by Koneksi × Yayasan Klub Fisika' }: Props = $props();
</script>

<p
	class="mt-2 text-sm leading-snug font-light text-primary-medium max-[480px]:mt-1.5 max-[480px]:text-xs min-[640px]:mt-2 min-[640px]:text-base"
>
	{tagline}
</p>
