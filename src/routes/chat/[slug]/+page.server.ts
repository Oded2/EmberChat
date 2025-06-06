import { alphanumericRegex, globalRoomCode } from '$lib/helpers';
import { redirect } from '@sveltejs/kit';

export function load({ params: { slug } }) {
	if (!alphanumericRegex.test(slug) || slug === globalRoomCode) throw redirect(303, '/chat');
	return { chatId: slug };
}
