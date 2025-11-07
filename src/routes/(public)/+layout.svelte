<script lang="ts">
    import '../../app.css';
    import PublicShell from '$lib/components/layouts/PublicShell.svelte';
    let { children } = $props();
</script>

<PublicShell>
    {@render children?.()}
</PublicShell>
