<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	interface Props {
		id?: string;
		label?: string;
		value?: string;
		required?: boolean;
		disabled?: boolean;
		type?: HTMLInputTypeAttribute;
	}

	let { id, label, value = $bindable(), required, disabled, type }: Props = $props();
</script>

<input
	{type}
	{id}
	bind:value
	class="bg-base-100 focus:ring-primary flex w-full grow gap-2 rounded-2xl px-4 py-3 transition-all outline-none focus:ring disabled:opacity-50"
	placeholder={label}
	{required}
	{disabled}
/>
