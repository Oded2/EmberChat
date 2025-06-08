import { alphanumericRegex, globalRoomCode } from '$lib/helpers';
import { error } from '@sveltejs/kit';

export function load({ params: { slug } }) {
	if (!alphanumericRegex.test(slug) || slug === globalRoomCode)
		throw error(400, { message: 'Illegal room code' });
	return { chatId: slug };
}
