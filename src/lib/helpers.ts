import {
	deleteDoc,
	getDocs,
	Query,
	QuerySnapshot,
	Timestamp,
	type DocumentData
} from 'firebase/firestore';

export interface Message {
	id: string;
	chatId: string;
	text?: string;
	senderName?: string;
	timestamp: Timestamp;
	owner?: string;
	edit?: boolean;
}

export const alphanumericRegex = /^[a-z0-9]+$/;
export const globalRoomCode = 'global';

export function addParams(url: string, params: Record<string, string>): string {
	const urlParams = new URLSearchParams(params);
	return `${url}?${urlParams.toString()}`;
}

export function formatDate(date: Date) {
	return date.toLocaleString(undefined, {
		minute: 'numeric',
		hour: 'numeric',
		day: 'numeric',
		month: 'numeric'
	});
}

export function handleMessages(snapshot: QuerySnapshot<DocumentData, DocumentData>): Message[] {
	return snapshot.docs
		.map((doc) => ({ ...doc.data(), id: doc.id }))
		.filter((doc) => messageTypeGaurd(doc));
}

export async function deleteDocsByQuery(q: Query<DocumentData, DocumentData>): Promise<number> {
	const snapshot = await getDocs(q);
	const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
	await Promise.all(deletePromises);
	return deletePromises.length;
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

function messageTypeGaurd(obj: any): obj is Message {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		typeof obj.id === 'string' &&
		typeof obj.chatId === 'string' &&
		obj.timestamp instanceof Timestamp &&
		(typeof obj.text === 'undefined' || typeof obj.text === 'string') &&
		(typeof obj.senderName === 'undefined' || typeof obj.senderName === 'string') &&
		(typeof obj.owner === 'undefined' || typeof obj.owner === 'string') &&
		(typeof obj.edit === 'undefined' || typeof obj.edit === 'boolean')
	);
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
