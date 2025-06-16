<script lang="ts">
	interface Props {
		label: string;
		checked?: boolean;
		onchange?: () => void;
	}

	const { label, checked, onchange }: Props = $props();
	const id = $props.id();
</script>

<div class="w-1/2">
	<input type="radio" {id} name="profile" class="peer hidden" {checked} {onchange} />
	<label for={id} class="btn peer-checked:btn-info w-full">{label}</label>
</div>
