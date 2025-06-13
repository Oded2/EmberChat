<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import { auth } from '$lib/firebase/firebase';
	import { user } from '$lib/stores/user';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Toasts from '$lib/components/Toasts.svelte';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import { confirmModal } from '$lib/stores/confirm';

	const { children } = $props();

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
			const pathname = page.url.pathname;
			if (!firebaseUser && pathname === '/profile') goto('/');
			else if (firebaseUser && pathname === '/auth') goto('/');
			user.set({
				user: firebaseUser,
				loading: false
			});
		});
		return unsubscribe;
	});
</script>

<div class="bg-base-200 flex min-h-screen flex-col" dir="auto">
	<Navbar></Navbar>
	<main class="container mx-auto flex grow flex-col px-2 sm:px-0">
		{@render children()}
	</main>
	<Toasts></Toasts>
</div>

<ConfirmModal
	show={$confirmModal.show}
	message={$confirmModal.message}
	handleConfirm={$confirmModal.handleConfirm}
></ConfirmModal>
