<script lang="ts">
	import FieldsetInputContainer from './FieldsetInputContainer.svelte';

	interface Props {
		label: string;
		value?: string;
	}

	const { label, value }: Props = $props();

	const id = $props.id();
</script>

<FieldsetInputContainer>
	<label for={id} class="label">{label}</label>
	<textarea
		class="bg-base-100 focus:ring-primary resize-none rounded-2xl px-4 py-3 transition-all outline-none focus:ring"
		{id}
		{value}
		name={label}
		placeholder={label}
		rows="10"
		required
	></textarea>
</FieldsetInputContainer>
