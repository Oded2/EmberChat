<script lang="ts">
	import Auth from '$lib/components/Auth.svelte';
	import { page } from '$app/state';

	const initialSignUp = $derived(page.url.searchParams.get('action') !== 'login');
</script>

<Auth {initialSignUp}></Auth>
