import { authStore } from '$lib/stores/fire';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';

export function load() {
	const user = get(authStore).user;
	console.log('user', user);
	if (!user) redirect(303, '/auth');
}
