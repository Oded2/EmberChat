import { user } from '$lib/stores/user';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';

export function load() {
	const currentUser = get(user);
	if (!currentUser) {
		throw redirect(302, '/auth'); // redirect to login page
	}
}
