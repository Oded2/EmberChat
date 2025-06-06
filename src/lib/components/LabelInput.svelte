<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label?: string;
		value?: string;
		placeholder?: string;
		required?: boolean;
	}

	let { label, value = $bindable(), placeholder, required }: Props = $props();
</script>

<label
	class="bg-base-100 focus-within:ring-primary flex grow gap-2 rounded-2xl px-4 py-3 transition-all focus-within:ring"
>
	<span class="cursor-auto">{label}</span>
	<input type="text" bind:value class="grow outline-none" {placeholder} {required} />
</label>
