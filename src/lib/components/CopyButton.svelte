<script lang="ts">
	import { addToast } from '$lib/stores/toasts';
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	interface Props {
		text: string;
		children: Snippet;
	}

	const { text, children }: Props = $props();

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
			addToast({
				text: 'Error Copying to Clipboard',
				duration: 5000,
				type: 'error'
			});
		}
		timeout = setTimeout(() => (reactiveTip = originalMessage), timeoutDuration);
	};
</script>

<div class="tooltip w-full" data-tip={reactiveTip}>
	<button class="btn btn-sm" onclick={copy} aria-label="Copy to clipboard">
		{@render children()}
	</button>
</div>
