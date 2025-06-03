<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		children?: Snippet;
	}

	const { title, children }: Props = $props();
</script>

<fieldset class="bg-base-200 border-base-300 rounded-box fieldset mx-auto w-sm gap-2 border p-4">
	{#if title}
		<legend class="fieldset-legend text-xl">{title}</legend>
	{/if}
	{#if children}
		{@render children()}
	{/if}
</fieldset>
