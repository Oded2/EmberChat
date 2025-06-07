<script lang="ts">
	import { reset } from '$lib/stores/confirm';

	interface Props {
		show?: boolean;
		message?: string;
		handleConfirm?: () => Promise<void>;
	}
	const { show, message, handleConfirm }: Props = $props();

	let modal: HTMLDialogElement;

	$effect(() => {
		if (show) modal.showModal();
	});

	async function confirm(btn: HTMLButtonElement) {
		if (!handleConfirm) return;
		btn.disabled = true;
		await handleConfirm();
		closeModal();
		btn.disabled = false;
	}

	function closeModal() {
		modal.close();
		reset();
	}
</script>

<dialog bind:this={modal} class="modal">
	<div class="modal-box">
		<p class="mb-4 text-lg">{message}</p>
		<div class="flex justify-end gap-2">
			<button class="btn btn-outline" onclick={closeModal}>Cancel</button>
			<button class="btn btn-error" onclick={(e) => confirm(e.currentTarget)}>Confirm</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
