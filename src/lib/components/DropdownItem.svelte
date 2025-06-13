<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		onclick?: () => any;
		children: Snippet;
	}

	const { onclick, children }: Props = $props();
</script>

<li>
	<button class="flex cursor-pointer items-baseline justify-center" {onclick}>
		{@render children()}
	</button>
</li>
