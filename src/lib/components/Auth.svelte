<script lang="ts">
	import Fieldset from '$lib/components/Fieldset.svelte';
	import FieldsetInput from '$lib/components/FieldsetInput.svelte';
	import { authHandlers } from '$lib/firebase/firebase';
	import { firebaseAuthErrorTypeGaurd } from '$lib/helpers';
	import Title from './Title.svelte';
	import { addToast } from '$lib/stores/toasts';
	import { get } from 'svelte/store';
	import { t } from '$lib/stores/localization';

	interface Props {
		initialSignUp?: boolean;
	}

	const { initialSignUp }: Props = $props();

	let signUp = $state(initialSignUp);
	let email = $state('');
	let displayName = $state('');
	let password = $state('');
	let confirmPass = $state('');

	const title = $derived(signUp ? $t('sign_up') : $t('login'));

	$effect(() => {
		signUp = initialSignUp;
	});

	async function handleAuthenticate() {
		const translations = get(t);
		try {
			if (signUp) {
				if (password != confirmPass) {
					addToast('error', translations('password_mismatch'));
					return;
				}
				await authHandlers.signup(email, password, displayName);
			} else await authHandlers.login(email, password);
		} catch (err) {
			console.error(err);
			if (firebaseAuthErrorTypeGaurd(err)) {
				switch (err.code) {
					case 'auth/invalid-credential':
						addToast('error', translations('invalid_credentials'));
						break;
					case 'auth/user-not-found':
						addToast('error', translations('user_not_found'));
						break;
					case 'auth/email-already-in-use':
						addToast('error', translations('email_already_in_use'));
						break;
					case 'auth/invalid-email':
						addToast('error', translations('invalid_email'));
						break;
					default:
						addToast('error', err.message);
				}
			} else {
				addToast('error', translations('unexpected_error'));
			}
		}
	}

	async function handlePasswordReset() {
		const translations = get(t);
		if (!email) {
			addToast('error', translations('missing_email_forgot_password'));
			return;
		}
		await authHandlers.forgotPassword(email);
		addToast('info', translations('success_forgot_password').replace('%EMAIL%', email));
	}
</script>

<div class="mx-auto my-10">
	<Fieldset {title} btnText={title} handleSubmit={handleAuthenticate}>
		<FieldsetInput bind:value={email} label={$t('email')} type="email" required></FieldsetInput>
		{#if signUp}
			<FieldsetInput bind:value={displayName} label={$t('display_name')} required></FieldsetInput>
		{/if}
		<FieldsetInput bind:value={password} label={$t('password')} type="password" required
		></FieldsetInput>
		{#if !signUp}
			<button
				type="button"
				onclick={handlePasswordReset}
				class="me-auto cursor-pointer font-extralight underline"
			>
				{$t('forgot_password')}
			</button>
		{/if}
		{#if signUp}
			<FieldsetInput
				bind:value={confirmPass}
				label={$t('confirm_password')}
				type="password"
				required
			></FieldsetInput>
		{/if}
		<button
			type="button"
			onclick={() => (signUp = !signUp)}
			class="mt-2 cursor-pointer font-extralight underline"
		>
			{signUp ? $t('switch_login') : $t('switch_signup')}
		</button>
	</Fieldset>
</div>

<Title {title}></Title>
