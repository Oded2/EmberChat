<script lang="ts">
	import FieldsetInputContainer from './FieldsetInputContainer.svelte';

	interface Props {
		label: string;
	}

	const { label }: Props = $props();

	const id = $props.id();
</script>

<FieldsetInputContainer>
	<label for={id} class="label">{label}</label>
	<textarea
		class="bg-base-100 focus:ring-primary rounded-2xl px-4 py-3 transition-all outline-none focus:ring"
		{id}
		name={label}
		placeholder={label}
		rows="10"
		required
	></textarea>
</FieldsetInputContainer>
