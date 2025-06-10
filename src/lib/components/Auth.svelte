<script lang="ts">
	import Fieldset from '$lib/components/Fieldset.svelte';
	import FieldsetInput from '$lib/components/FieldsetInput.svelte';
	import { authHandlers } from '$lib/firebase/firebase';
	import { firebaseAuthErrorTypeGaurd } from '$lib/helpers';
	import Title from './Title.svelte';
	import { addToast } from '$lib/stores/toasts';

	interface Props {
		initialSignUp?: boolean;
	}

	const { initialSignUp }: Props = $props();

	let signUp = $state(initialSignUp);
	let email = $state('');
	let displayName = $state('');
	let password = $state('');
	let confirmPass = $state('');

	$effect(() => {
		signUp = initialSignUp;
	});

	async function handleAuthenticate() {
		try {
			if (signUp) {
				if (password != confirmPass) {
					addToast('error', 'Password does not match confirm password');
					return;
				}
				await authHandlers.signup(email, password, displayName);
			} else await authHandlers.login(email, password);
		} catch (err) {
			console.error(err);
			if (firebaseAuthErrorTypeGaurd(err)) {
				switch (err.code) {
					case 'auth/invalid-credential':
						addToast('error', 'Incorrect password. Please try again.');
						break;
					case 'auth/user-not-found':
						addToast('error', 'No account found with this email.');
						break;
					case 'auth/email-already-in-use':
						addToast('error', 'Email is already registered.');
						break;
					case 'auth/invalid-email':
						addToast('error', 'Invalid email format.');
						break;
					case 'auth/weak-password':
						addToast('error', 'Password is too weak.');
						break;
					default:
						addToast('error', 'Authentication error: ' + err.message);
				}
			} else {
				addToast('error', 'An unexpected error occurred.');
			}
		}
	}

	async function handlePasswordReset() {
		if (!email) {
			addToast('error', 'Please enter your email to reset your password');
			return;
		}
		await authHandlers.forgotPassword(email);
		addToast('info', `An email has been sent to ${email} with instructions`);
	}
</script>

<div class="mx-auto my-10">
	<Fieldset
		title={signUp ? 'Sign Up' : 'Login'}
		btnText={signUp ? 'Sign Up' : 'Login'}
		handleSubmit={handleAuthenticate}
	>
		<FieldsetInput bind:value={email} label="Email" type="email" required></FieldsetInput>
		{#if signUp}
			<FieldsetInput bind:value={displayName} label="Display name" required></FieldsetInput>
		{/if}
		<FieldsetInput bind:value={password} label="Password" type="password" required></FieldsetInput>
		{#if !signUp}
			<button
				type="button"
				onclick={handlePasswordReset}
				class="me-auto cursor-pointer font-extralight underline"
			>
				Forgot Password?
			</button>
		{/if}
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
</div>

<Title title={signUp ? 'Sign Up' : 'Login'}></Title>
