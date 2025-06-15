<script lang="ts">
	interface Props {
		label: string;
		checked?: boolean;
		onchange?: () => void;
	}

	const { label, checked, onchange }: Props = $props();
</script>

<input type="radio" name="profile" class="tab" aria-label={label} {checked} {onchange} />
