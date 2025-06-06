<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import { auth } from '$lib/firebase/firebase';
	import { user } from '$lib/stores/user';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	const { children } = $props();

	const protectedRoutes = ['/chat'];

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
			if (!firebaseUser && protectedRoutes.includes(page.url.pathname)) {
				// User has logged out and is in a protected page
				goto('/');
			}
			user.set(firebaseUser);
		});
		return unsubscribe;
	});
</script>

<div class="flex min-h-screen flex-col">
	<Navbar></Navbar>
	<main class="container mx-auto flex grow flex-col py-10">
		{@render children()}
	</main>
</div>
