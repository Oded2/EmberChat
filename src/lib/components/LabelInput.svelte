<script lang="ts">
	import type { ChangeEventHandler, HTMLInputTypeAttribute } from 'svelte/elements';

	interface Props {
		id?: string;
		label?: string;
		value?: string;
		required?: boolean;
		disabled?: boolean;
		type?: HTMLInputTypeAttribute;
		autocorrect?: 'off' | 'on';
		autocapitalize?: 'off' | 'on';
		spellcheck?: boolean;
		oninput?: ChangeEventHandler<HTMLInputElement>;
	}

	let {
		id,
		label,
		value = $bindable(),
		required,
		disabled,
		type,
		autocorrect,
		autocapitalize,
		spellcheck
	}: Props = $props();
</script>

<input
	{type}
	{id}
	bind:value
	dir="auto"
	class="bg-base-100 focus:ring-neutral-content grow rounded-2xl px-4 py-3 transition-all duration-200 outline-none focus:ring disabled:opacity-50"
	placeholder={label}
	minlength={type === 'password' ? 8 : undefined}
	maxlength={type === 'password' ? 4096 : undefined}
	{required}
	{disabled}
	{autocorrect}
	{autocapitalize}
	{spellcheck}
/>
