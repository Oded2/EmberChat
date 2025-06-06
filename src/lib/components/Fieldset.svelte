<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		btnText: string;
		disabled?: boolean;

		children?: Snippet;
	}

	const { title, btnText, disabled, children }: Props = $props();
</script>

<fieldset class="bg-base-300 border-base-300 rounded-box fieldset w-sm gap-2 border p-4">
	{#if title}
		<legend class="fieldset-legend text-xl">{title}</legend>
	{/if}
	{#if children}
		{@render children()}
	{/if}
	<button {disabled} type="submit" class="btn btn-primary mt-2">
		{btnText}
	</button>
</fieldset>
