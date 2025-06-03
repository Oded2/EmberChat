import { auth } from '$lib/firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { writable, type Writable } from 'svelte/store';

interface AuthStore {
	user: any;
	loading: boolean;
	data: { [key: string]: any };
}

export const authStore: Writable<AuthStore> = writable({
	user: null,
	loading: true,
	data: {}
});

export const authHandlers = {
	signup: async (email: string, password: string) =>
		await createUserWithEmailAndPassword(auth, email, password),
	login: async (email: string, password: string) =>
		await signInWithEmailAndPassword(auth, email, password),
	signout: async () => signOut(auth)
};
