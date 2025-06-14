<script lang="ts">
	import { t } from '$lib/stores/localization';
	import { addToast } from '$lib/stores/toasts';
	import { get } from 'svelte/store';
	import OptionsButton from './OptionsButton.svelte';

	interface Props {
		text: string;
	}

	const { text }: Props = $props();
	const timeoutDuration = 1500;

	let success = $state(false);
	let executed: NodeJS.Timeout | null = null;

	async function copy() {
		const original = success;
		// If already showing copyMessage, clear and reset the timeout
		if (original === true) {
			if (executed) clearTimeout(executed);
			executed = setTimeout(() => (success = false), timeoutDuration);
			return;
		}
		try {
			await navigator.clipboard.writeText(text);
			if (executed) clearTimeout(executed);
			success = true;
		} catch (err) {
			console.error(err);
			addToast('error', $t('copy_error'));
		}
		executed = setTimeout(() => (success = false), timeoutDuration);
	}
</script>

<OptionsButton tooltip={success ? $t('copy_success') : $t('copy_to_clipboard')} onclick={copy}>
	{#if success}
		<i class="fa-solid fa-clipboard-check"></i>
	{:else}
		<i class="fa-solid fa-clipboard"></i>
	{/if}
</OptionsButton>
