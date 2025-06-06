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
