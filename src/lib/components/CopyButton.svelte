<script lang="ts">
	import { addErrorToast } from '$lib/helpers';
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	interface Props {
		text: string;
	}

	const { text }: Props = $props();

	const originalMessage = 'Copy to Clipboard';
	const copyConfirmation = 'Copied!';
	const timeoutDuration = 1500;

	let reactiveTip: string = $state(originalMessage);
	let timeout: NodeJS.Timeout | null = null;

	const copy: MouseEventHandler<HTMLButtonElement> = async () => {
		const original = reactiveTip;
		// If already showing copyMessage, clear and reset the timeout
		if (original === copyConfirmation) {
			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(() => (reactiveTip = originalMessage), timeoutDuration);
			return;
		}
		try {
			await navigator.clipboard.writeText(text);
			if (timeout) clearTimeout(timeout);
			reactiveTip = copyConfirmation;
		} catch (err) {
			console.error(err);
			addErrorToast('Error copying to clipboard');
		}
		timeout = setTimeout(() => (reactiveTip = originalMessage), timeoutDuration);
	};
</script>

<button
	class="flex cursor-pointer items-baseline justify-center"
	onclick={copy}
	aria-label="Copy to clipboard"
>
	{reactiveTip}
</button>
