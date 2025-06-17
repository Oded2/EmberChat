<script lang="ts">
	import FieldsetInputContainer from './FieldsetInputContainer.svelte';

	interface Props {
		label: string;
		value?: string;
		required?: boolean;
	}

	let { label, value = $bindable(), required }: Props = $props();

	const id = $props.id();
</script>

<FieldsetInputContainer>
	<label for={id} class="label">{label}</label>
	<textarea
		class="bg-base-100 focus:ring-neutral-content resize-none rounded-2xl px-4 py-3 transition-all outline-none focus:ring"
		{id}
		bind:value
		name={label}
		placeholder={label}
		rows="10"
		{required}
	></textarea>
</FieldsetInputContainer>
