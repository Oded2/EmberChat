// src/stores/user.ts
import { writable, type Writable } from 'svelte/store';
import { type User } from 'firebase/auth';
import { auth } from '$lib/firebase/firebase';

export const user: Writable<User | null> = writable(null);

export const updateUser = async () => {
	await auth.currentUser?.reload();
	user.set(auth.currentUser);
};
