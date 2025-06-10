<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		btnText?: string;
		inProgress?: boolean;
		action?: string;
		method?: 'POST';
		handleSubmit?: () => any;
		children: Snippet;
	}

	const { title, btnText, inProgress, action, method, handleSubmit, children }: Props = $props();
</script>

<form
	{method}
	{action}
	onsubmit={handleSubmit
		? (e) => {
				e.preventDefault();
				if (!inProgress) handleSubmit();
			}
		: undefined}
>
	<fieldset class="bg-base-300 border-base-300 rounded-box fieldset w-sm gap-2 border p-4">
		{#if title}
			<legend class="fieldset-legend text-xl">{title}</legend>
		{/if}
		{@render children()}
		{#if btnText}
			<button type="submit" class="btn btn-primary mt-2">
				{#if inProgress}
					<span class="loading loading-spinner"></span>
				{:else}
					{btnText}
				{/if}
			</button>
		{/if}
	</fieldset>
</form>
