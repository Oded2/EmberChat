<script lang="ts">
	import { goto } from '$app/navigation';
	import Fieldset from '$lib/components/Fieldset.svelte';
	import FieldsetInput from '$lib/components/FieldsetInput.svelte';
	import { authHandlers } from '$lib/firebase/firebase';
	import { addErrorToast, firebaseAuthErrorTypeGaurd } from '$lib/helpers';
	import { sendPasswordResetEmail } from 'firebase/auth';
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
	let inProgress = $state(false);

	$effect(() => {
		signUp = initialSignUp;
	});

	async function handleAuthenticate() {
		inProgress = true;
		try {
			if (signUp) {
				if (password != confirmPass) {
					addErrorToast('Password does not match confirm password');
					return;
				}
				await authHandlers.signup(email, password, displayName);
			} else await authHandlers.login(email, password);
		} catch (err) {
			console.error(err);
			inProgress = false;
			if (firebaseAuthErrorTypeGaurd(err)) {
				switch (err.code) {
					case 'auth/invalid-credential':
						addErrorToast('Incorrect password. Please try again.');
						break;
					case 'auth/user-not-found':
						addErrorToast('No account found with this email.');
						break;
					case 'auth/email-already-in-use':
						addErrorToast('Email is already registered.');
						break;
					case 'auth/invalid-email':
						addErrorToast('Invalid email format.');
						break;
					case 'auth/weak-password':
						addErrorToast('Password is too weak.');
						break;
					default:
						addErrorToast('Authentication error: ' + err.message);
				}
			} else {
				addErrorToast('An unexpected error occurred.');
			}
		}
	}

	async function handlePasswordReset() {
		if (inProgress) return;
		if (!email) {
			addErrorToast('Please enter your email to reset your password');
			return;
		}
		inProgress = true;
		await authHandlers.forgotPassword(email);
		inProgress = false;
		addToast('info', 5000, `An email has been sent to ${email} with instructions`);
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
