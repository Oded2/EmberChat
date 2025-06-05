<script lang="ts">
	interface Props {
		label?: string;
		value?: string;
		placeholder?: string;
		required?: boolean;
	}

	const { label, value = $bindable(), placeholder, required }: Props = $props();
</script>

<label class="input w-full">
	{label}
	<input type="text" {value} class="grow" {placeholder} {required} />
</label>
