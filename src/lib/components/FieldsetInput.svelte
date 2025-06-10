<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import LabelInput from './LabelInput.svelte';
	import FieldsetInputContainer from './FieldsetInputContainer.svelte';

	interface Props {
		label?: string;
		type?: HTMLInputTypeAttribute;
		value?: string;
		required?: boolean;
		disabled?: boolean;
		disabledDisclaimer?: string;
	}

	let {
		label,
		type,
		value = $bindable(),
		required,
		disabled,
		disabledDisclaimer
	}: Props = $props();

	const id = $props.id();
</script>

<FieldsetInputContainer>
	<label for={id} class="label">{label}</label>
	<LabelInput {id} name={label} {required} {type} bind:value {label} {disabled}></LabelInput>
	{#if disabledDisclaimer && disabled}
		<span class="font-light">{disabledDisclaimer}</span>
	{/if}
</FieldsetInputContainer>
