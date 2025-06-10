import { writable, type Writable } from 'svelte/store';

interface ConfirmModal {
	show?: boolean;
	message?: string;
	handleConfirm?: () => Promise<void>;
}

export const confirmModal: Writable<ConfirmModal> = writable({ show: false });

export const showModal = (handler: () => Promise<void>, message?: string) => {
	confirmModal.set({ show: true, handleConfirm: handler, message });
};
