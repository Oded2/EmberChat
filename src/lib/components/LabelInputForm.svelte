<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		handleSubmit: () => any;
		children: Snippet;
	}

	const { handleSubmit, children }: Props = $props();
</script>

<form
	class="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 sm:flex-row"
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit();
	}}
>
	{@render children()}
</form>
