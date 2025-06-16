<script lang="ts">
	interface Props {
		label: string;
		checked?: boolean;
		onchange?: () => void;
	}

	const { label, checked, onchange }: Props = $props();
	const id = $props.id();
</script>

<div>
	<input type="radio" {id} name="profile" class="peer hidden" {checked} {onchange} />
	<label
		for={id}
		class="bg-base-100/55 peer-checked:bg-base-100 text-base-content/30 peer-checked:text-base-content block cursor-pointer p-2 text-center text-sm transition-all active:translate-y-0.5"
	>
		{label}
	</label>
</div>
