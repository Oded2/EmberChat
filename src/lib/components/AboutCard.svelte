<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		children: Snippet;
	}

	const { title, children }: Props = $props();
</script>

<div class="bg-base-100 w-xs rounded-xl px-5 py-3">
	<h2 class="mb-2 text-center text-xl font-semibold underline underline-offset-3">{title}</h2>
	{@render children()}
</div>
