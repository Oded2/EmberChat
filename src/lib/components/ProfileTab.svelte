<script lang="ts">
	interface Props {
		label: string;
		checked?: boolean;
		onchange?: () => void;
	}

	const { label, checked, onchange }: Props = $props();
	const id = $props.id();
</script>

<div class="w-full">
	<input type="radio" {id} name="profile" class="peer hidden" {checked} {onchange} />
	<label
		for={id}
		class="bg-base-100/70 peer-checked:bg-base-100 text-base-content/50 peer-checked:text-base-content block cursor-pointer rounded-2xl p-2 text-center text-sm transition-transform active:translate-y-0.5"
	>
		{label}
	</label>
</div>
