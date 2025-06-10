export const alphanumericRegex = /^[a-z0-9]+$/;
export const globalRoomCode = 'global';

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

export async function sendForm(record: Record<string, string>): Promise<boolean> {
	const response = await fetch('https://formspree.io/f/xwpblapz', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(record)
	});
	return response.ok;
}
