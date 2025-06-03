<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import { auth, db } from '$lib/firebase/firebase';
	import { goto } from '$app/navigation';
	import { doc, getDoc, setDoc } from 'firebase/firestore';
	import { authStore } from '$lib/stores/fire';

	const { children } = $props();

	const nonAuthRoutes = ['/', '/auth'];

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			const currentPath = window.location.pathname;
			if (!user && !nonAuthRoutes.includes(currentPath)) {
				// The user is trying to access a protected page
				goto('/');
				return;
			}
			if (user) {
				goto('/');
			}
			if (!user) {
				return;
			}
			let dataToSetToStore;
			const docRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(docRef);
			if (!docSnap.exists()) {
				console.log('Creating User');
				const userRef = doc(db, 'users', user.uid);
				dataToSetToStore = {
					email: user.email,
					todos: []
				};
				await setDoc(userRef, dataToSetToStore, { merge: true });
			} else {
				console.log('Fetching User');
				const userData = docSnap.data();
				dataToSetToStore = userData;
			}

			authStore.update((curr) => {
				return {
					...curr,
					user,
					data: dataToSetToStore,
					loading: false
				};
			});
		});
		return unsubscribe;
	});
</script>

<Navbar></Navbar>
<main class="container mx-auto py-10">
	{@render children()}
</main>
