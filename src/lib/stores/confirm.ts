import { writable, type Writable } from 'svelte/store';

interface ConfirmModal {
	show?: boolean;
	title?: string;
	message?: string;
	confirmText?: string;
	handleConfirm?: () => Promise<void>;
}

export const confirmModal: Writable<ConfirmModal> = writable({ show: false });

export const showModal = (
	handler: () => Promise<void>,
	title?: string,
	message?: string,
	confirmText?: string
) => {
	confirmModal.set({ show: true, handleConfirm: handler, title, message, confirmText });
};
