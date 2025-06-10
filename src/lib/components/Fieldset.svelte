<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		btnText?: string;
		handleSubmit?: () => Promise<void>;
		children: Snippet;
	}

	const { title, btnText, handleSubmit, children }: Props = $props();

	let inProgress = $state(false);
</script>

<form
	onsubmit={async (e) => {
		e.preventDefault();
		if (!inProgress && handleSubmit) {
			inProgress = true;
			await handleSubmit();
			inProgress = false;
		}
	}}
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
