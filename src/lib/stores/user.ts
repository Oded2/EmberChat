// src/stores/user.ts
import { writable, type Writable } from 'svelte/store';
import { type User } from 'firebase/auth';
import { auth } from '$lib/firebase/firebase';

export const user: Writable<{
	user: User | null;
	loading: boolean;
}> = writable({
	user: null,
	loading: true
});

export const updateUser = async () => {
	await auth.currentUser?.reload();
	user.update((u) => ({ ...u, user: auth.currentUser }));
};
