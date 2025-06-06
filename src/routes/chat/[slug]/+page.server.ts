import { redirect } from '@sveltejs/kit';

export function load({ params: { slug } }) {
	const chatId = +slug;
	if (isNaN(chatId) || chatId <= 0) throw redirect(303, '/chat');
	return { chatId };
}
