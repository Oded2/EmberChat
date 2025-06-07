import { writable, type Writable } from 'svelte/store';

export type ToastType = 'success' | 'info' | 'error';

interface UserToast {
	duration: number;
	type: ToastType;
	text: string;
}
interface Toast extends UserToast {
	id: string;
}

export const toasts: Writable<Toast[]> = writable([]);

export const addToast = (type: ToastType, duration: number, text: string): string => {
	const id = Math.floor(Math.random() * 10000).toString();
	const toast: Toast = {
		id,
		type,
		duration,
		text
	};
	toasts.update((all) => [toast, ...all]);
	if (toast.duration > 0) setTimeout(() => dismissToast(id), toast.duration);
	return id;
};

export const dismissToast = (id: string): void => {
	toasts.update((all) => all.filter((toast) => toast.id !== id));
};
