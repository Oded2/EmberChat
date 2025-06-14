<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		tooltip: string;
		onclick: () => any;
		children: Snippet;
	}

	const { tooltip, onclick, children }: Props = $props();
</script>

<div class="pointer-fine:tooltip flex max-h-fit" data-tip={tooltip}>
	<button class="btn btn-xs" {onclick} aria-label={tooltip}>
		{@render children()}
	</button>
</div>
