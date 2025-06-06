<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		handleSubmit: () => any;
		children: Snippet;
	}

	const { handleSubmit, children }: Props = $props();
</script>

<form
	class="flex items-center gap-4"
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit();
	}}
>
	{@render children()}
</form>
