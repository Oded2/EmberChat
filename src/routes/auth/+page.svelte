<script lang="ts">
	import Auth from '$lib/components/Auth.svelte';
	import { page } from '$app/state';

	const signUp = $derived(page.url.searchParams.get('action') !== 'login');
</script>

<Auth initialSignUp={signUp}></Auth>
