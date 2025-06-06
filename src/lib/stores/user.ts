// src/stores/user.ts
import { writable, type Writable } from 'svelte/store';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '$lib/firebase/firebase';

export const user: Writable<User | null> = writable(null);

onAuthStateChanged(auth, (firebaseUser) => {
	user.set(firebaseUser);
});
