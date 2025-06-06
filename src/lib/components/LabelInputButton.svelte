<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		large?: boolean;
		children: Snippet;
	}

	const { large, children }: Props = $props();
</script>

<button type="submit" class="btn btn-primary w-full sm:w-auto" class:btn-lg={large}>
	{@render children()}
</button>
