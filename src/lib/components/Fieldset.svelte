<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		btnText?: string;
		disabled?: boolean;
		handleSubmit?: () => any;
		children?: Snippet;
	}

	const { title, btnText, disabled, handleSubmit, children }: Props = $props();
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		if (handleSubmit) handleSubmit();
	}}
>
	<fieldset class="bg-base-300 border-base-300 rounded-box fieldset w-sm gap-2 border p-4">
		{#if title}
			<legend class="fieldset-legend text-xl">{title}</legend>
		{/if}
		{#if children}
			{@render children()}
		{/if}
		{#if btnText}
			<button {disabled} type="submit" class="btn btn-primary mt-2">
				{btnText}
			</button>
		{/if}
	</fieldset>
</form>
