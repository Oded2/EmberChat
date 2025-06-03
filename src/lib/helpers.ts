export function addParams(url: string, params: Record<string, string>): string {
	const urlParams = new URLSearchParams(params);
	return `${url}?${urlParams.toString()}`;
}
