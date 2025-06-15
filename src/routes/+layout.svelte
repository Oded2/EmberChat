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
	import { locale, localeMap, updateLocale } from '$lib/stores/localization';

	const { children } = $props();

	onMount(() => {
		const currentLocale = localStorage.getItem('locale');
		if (currentLocale) locale.set(currentLocale);
		else {
			const navLocale = navigator.language.slice(0, 2);
			if (Object.keys(localeMap).includes(navLocale)) updateLocale(navLocale);
		}
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
	<main class="flex grow flex-col px-2 sm:px-0">
		{@render children()}
	</main>
	<Toasts></Toasts>
</div>

<ConfirmModal></ConfirmModal>
