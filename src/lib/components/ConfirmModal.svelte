<script lang="ts">
	import { confirmModal } from '$lib/stores/confirm';
	import { t } from '$lib/stores/localization';
	import { onMount } from 'svelte';

	const { show, title, message, confirmText, handleConfirm } = $derived($confirmModal);

	let modal: HTMLDialogElement;

	onMount(() => {
		const handleClose = () => confirmModal.update((c) => ({ ...c, show: false }));
		modal.addEventListener('close', handleClose);
		return () => modal.removeEventListener('close', handleClose);
	});

	let inProgress = $state(false);

	$effect(() => {
		if (show) modal.showModal();
	});

	async function confirm() {
		if (!handleConfirm) return;
		inProgress = true;
		await handleConfirm();
		closeModal();
		inProgress = false;
	}

	function closeModal() {
		modal.close();
	}
</script>

<dialog bind:this={modal} class="modal">
	<div class="modal-box" dir="auto">
		<h2 class="mb-2 font-semibold">{title}</h2>
		{#if message}
			<p class="mb-4 line-clamp-3 whitespace-pre-line">{message}</p>
		{/if}
		<div class="flex justify-end gap-2">
			<button class="btn" onclick={closeModal}>{$t('cancel')}</button>
			<button class="btn btn-error" disabled={inProgress} onclick={confirm}
				>{confirmText ?? $t('confirm')}</button
			>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
