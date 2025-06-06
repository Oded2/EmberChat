<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	interface Props {
		label?: string;
		value?: string;
		placeholder?: string;
		required?: boolean;
		type?: HTMLInputTypeAttribute;
		min?: number;
	}

	let { label, value = $bindable(), placeholder, required, type, min }: Props = $props();
</script>

<label
	class="bg-base-100 focus-within:ring-primary flex grow gap-2 rounded-2xl px-4 py-3 transition-all focus-within:ring"
>
	<span class="cursor-auto">{label}</span>
	<input {type} bind:value class="grow outline-none" {placeholder} {required} {min} />
</label>
