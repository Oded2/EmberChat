<script lang="ts">
	import { goto } from '$app/navigation';
	import Fieldset from '$lib/components/Fieldset.svelte';
	import FieldsetInput from '$lib/components/FieldsetInput.svelte';
	import { authHandlers } from '$lib/firebase/firebase';
	import { firebaseAuthErrorTypeGaurd } from '$lib/helpers';
	import { sendPasswordResetEmail } from 'firebase/auth';
	import Title from './Title.svelte';

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
			if (firebaseAuthErrorTypeGaurd(err)) {
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

	async function handlePasswordReset() {
		if (!email) {
			alert('Please enter your email to reset your password');
			return;
		}
		inProgress = true;
		await authHandlers.forgotPassword(email);
		inProgress = false;
		alert(`An email has been sent to ${email} with instructions`);
	}
</script>

<div class="mx-auto">
	<Fieldset
		title={signUp ? 'Sign Up' : 'Login'}
		btnText={signUp ? 'Sign Up' : 'Login'}
		disabled={inProgress}
		handleSubmit={handleAuthenticate}
	>
		<FieldsetInput bind:value={email} label="Email" type="email" required></FieldsetInput>
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
</div>

<Title title={signUp ? 'Sign Up' : 'Login'}></Title>
