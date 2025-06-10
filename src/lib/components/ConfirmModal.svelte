<script lang="ts">
	interface Props {
		show?: boolean;
		message?: string;
		handleConfirm?: () => Promise<void>;
	}
	const { show, message, handleConfirm }: Props = $props();

	let modal: HTMLDialogElement;

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
	<div class="modal-box">
		<p class="mb-4 whitespace-pre-line">{message}</p>
		<div class="flex justify-end gap-2">
			<button class="btn" onclick={closeModal}>Cancel</button>
			<button class="btn btn-error" disabled={inProgress} onclick={confirm}>Confirm</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
