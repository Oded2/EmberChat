<script lang="ts">
	import { t } from '$lib/stores/localization';
	import { addToast } from '$lib/stores/toasts';
	import { get } from 'svelte/store';
	import DropdownItem from './DropdownItem.svelte';

	interface Props {
		text: string;
	}

	const { text }: Props = $props();
	const timeoutDuration = 1500;

	let reactiveTip: string = $state($t('copy_to_clipboard'));
	let timeout: NodeJS.Timeout | null = null;

	async function copy() {
		const translations = get(t);
		const original = reactiveTip;
		// If already showing copyMessage, clear and reset the timeout
		if (original === translations('copy_confirmation')) {
			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(
				() => (reactiveTip = translations('copy_to_clipboard')),
				timeoutDuration
			);
			return;
		}
		try {
			await navigator.clipboard.writeText(text);
			if (timeout) clearTimeout(timeout);
			reactiveTip = translations('copy_confirmation');
		} catch (err) {
			console.error(err);
			addToast('error', 'Error copying to clipboard');
		}
		timeout = setTimeout(() => (reactiveTip = translations('copy_to_clipboard')), timeoutDuration);
	}
</script>

<DropdownItem onclick={copy}>
	{reactiveTip}
</DropdownItem>
