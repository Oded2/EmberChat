<script lang="ts">
	interface Props {
		label?: string;
		value?: string;
		required?: boolean;
	}

	let { label, value = $bindable(), required }: Props = $props();
</script>

<input
	bind:value
	class="bg-base-100 focus:ring-primary flex w-full grow gap-2 rounded-2xl px-4 py-3 transition-all outline-none focus:ring"
	placeholder={label}
	{required}
/>
