<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	interface Props {
		label?: string;
		type?: HTMLInputTypeAttribute;
		placeholder?: string;
		value?: string;
		required?: boolean;
	}

	let { label, type, required, placeholder, value = $bindable() }: Props = $props();

	const id = $props.id();
</script>

<div class="flex flex-col gap-1">
	<label for={id} class="label">{label}</label>
	<input {id} {required} {type} bind:value class="input w-full" {placeholder} />
</div>
