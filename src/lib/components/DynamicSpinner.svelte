<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		inProgress: boolean;
		children: Snippet;
	}

	const { inProgress, children }: Props = $props();
</script>

{#if inProgress}
	<span class="loading loading-spinner"></span>
{:else}
	{@render children()}
{/if}
