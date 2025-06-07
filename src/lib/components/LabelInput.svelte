<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	interface Props {
		label?: string;
		value?: string;
		required?: boolean;
		type?: HTMLInputTypeAttribute;
		min?: number;
	}

	let { label, value = $bindable(), required, type, min }: Props = $props();
</script>

<input
	{type}
	bind:value
	class="bg-base-100 focus-within:ring-primary flex w-full grow gap-2 rounded-2xl px-4 py-3 transition-all outline-none focus:ring"
	placeholder={label}
	{required}
	{min}
/>
