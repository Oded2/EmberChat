<script lang="ts">
	import { goto } from '$app/navigation';
	import Fieldset from '$lib/components/Fieldset.svelte';
	import FieldsetInput from '$lib/components/FieldsetInput.svelte';
	import { authHandlers } from '$lib/firebase/firebase';

	interface Props {
		initialSignUp?: boolean;
	}

	const { initialSignUp }: Props = $props();

	let signUp = $state(initialSignUp);
	let email = $state('');
	let displayName = $state('');
	let password = $state('');
	let confirmPass = $state('');
	let inProgress = $state(false);

	$effect(() => {
		signUp = initialSignUp;
	});

	async function handleAuthenticate() {
		inProgress = true;
		try {
			if (signUp) {
				if (password != confirmPass) {
					alert('Password does not match confirm password');
					return;
				}
				await authHandlers.signup(email, password, displayName);
			} else await authHandlers.login(email, password);
			goto('/');
		} catch (err) {
			console.error(err);
			inProgress = false;
			if (isFirebaseAuthError(err)) {
				switch (err.code) {
					case 'auth/invalid-credential':
						alert('Incorrect password. Please try again.');
						break;
					case 'auth/user-not-found':
						alert('No account found with this email.');
						break;
					case 'auth/email-already-in-use':
						alert('Email is already registered.');
						break;
					case 'auth/invalid-email':
						alert('Invalid email format.');
						break;
					case 'auth/weak-password':
						alert('Password is too weak.');
						break;
					default:
						alert('Authentication error: ' + err.message);
				}
			} else {
				alert('An unexpected error occurred.');
			}
		}
	}

	// Type guard to check if error is a Firebase Auth error
	function isFirebaseAuthError(error: unknown): error is { code: string; message: string } {
		return (
			typeof error === 'object' &&
			error !== null &&
			'code' in error &&
			typeof (error as any).code === 'string' &&
			'message' in error &&
			typeof (error as any).message === 'string'
		);
	}
</script>

<form
	class="mx-auto"
	onsubmit={(e) => {
		e.preventDefault();
		handleAuthenticate();
	}}
>
	<Fieldset
		title={signUp ? 'Sign Up' : 'Login'}
		btnText={signUp ? 'Sign Up' : 'Login'}
		disabled={inProgress}
	>
		<FieldsetInput bind:value={email} label="Email" type="email" required></FieldsetInput>
		{#if signUp}
			<FieldsetInput bind:value={displayName} label="Display name" required></FieldsetInput>
		{/if}
		<FieldsetInput bind:value={password} label="Password" type="password" required></FieldsetInput>
		{#if signUp}
			<FieldsetInput bind:value={confirmPass} label="Confirm Password" type="password" required
			></FieldsetInput>
		{/if}
		<button
			type="button"
			onclick={() => (signUp = !signUp)}
			class="mt-2 cursor-pointer font-extralight underline"
		>
			{signUp ? 'Already have an account? Login' : "Don't have an account yet? Sign up"}
		</button>
	</Fieldset>
</form>
