import { addToast } from './stores/toasts';

export const alphanumericRegex = /^[a-z0-9]+$/;
export const globalRoomCode = 'global';
export const addErrorToast = (text: string) => addToast('error', 5000, text);

export function addParams(url: string, params: Record<string, string>): string {
	const urlParams = new URLSearchParams(params);
	return `${url}?${urlParams.toString()}`;
}

export function firebaseAuthErrorTypeGaurd(
	error: unknown
): error is { code: string; message: string } {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		typeof (error as any).code === 'string' &&
		'message' in error &&
		typeof (error as any).message === 'string'
	);
}

export function getRandomInt(min: number, max: number): number {
	const lower = Math.ceil(min);
	const upper = Math.floor(max);
	return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}
