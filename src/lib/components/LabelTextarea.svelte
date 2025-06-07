<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label?: string;
		value: string;
		required?: boolean;
		children: Snippet;
	}

	let { label, value = $bindable(), required, children }: Props = $props();

	let textarea: HTMLTextAreaElement;
	let hiddenSubmit: HTMLButtonElement;

	$effect(() => {
		// Run on value change
		if (value.length >= 0) {
			textarea.style.height = 'auto'; // Reset height
			textarea.style.height = textarea.scrollHeight + 'px'; // Set to scroll height
		}
	});
</script>

<div class="bg-base-100 flex w-full flex-col rounded-2xl px-3 pt-1 pb-3">
	<textarea
		bind:this={textarea}
		bind:value
		class="bg-base-100 flex max-h-40 w-full grow resize-none gap-2 rounded-2xl px-4 py-3 outline-none"
		placeholder={label}
		onkeydown={(e) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault(); // Prevent new line
				hiddenSubmit.click();
			}
		}}
		rows="1"
		{required}
	></textarea>
	{@render children()}
</div>
<button bind:this={hiddenSubmit} class="hidden">Hidden Submit</button>
