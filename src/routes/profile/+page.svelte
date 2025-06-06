<script lang="ts">
	import Fieldset from '$lib/components/Fieldset.svelte';
	import FieldsetInput from '$lib/components/FieldsetInput.svelte';
	import Title from '$lib/components/Title.svelte';
	import { firebaseAuthErrorTypeGaurd } from '$lib/helpers';
	import { updateUser, user } from '$lib/stores/user';
	import {
		EmailAuthProvider,
		reauthenticateWithCredential,
		sendEmailVerification,
		updateEmail,
		updatePassword,
		updateProfile
	} from 'firebase/auth';
	import { get } from 'svelte/store';

	const verifyDisclaimer = 'You must verify your account first';

	let inProgress = $state({
		userSettings: false,
		reauthentication: false
	});

	let email = $state('');
	let displayName = $state('');
	let newPassword = $state('');
	let reAuthenticatePassword = $state('');

	let isReauthenticated = $state(false);

	$effect(() => {
		const currentUser = $user;
		email = currentUser?.email ?? '';
		displayName = currentUser?.displayName ?? '';
	});

	async function handleUpdateUser() {
		if (checkInProgress()) return;
		const currentUser = get(user);
		if (!currentUser) return;
		if (currentUser.displayName !== displayName) {
			inProgress.userSettings = true;
			await updateProfile(currentUser, {
				displayName
			});
			updateUser();
			inProgress.userSettings = false;
		}
		if (currentUser.email !== email) {
			inProgress.userSettings = true;
			await updateEmail(currentUser, email);
			updateUser();
			inProgress.userSettings = false;
		}
		if (newPassword) {
			inProgress.userSettings = true;
			await updatePassword(currentUser, newPassword);
			inProgress.userSettings = false;
		}
	}

	async function handleReauthentication() {
		if (checkInProgress()) return;
		const currentUser = get(user);
		if (!currentUser?.email) return;
		inProgress.reauthentication = true;
		const credential = EmailAuthProvider.credential(currentUser.email, reAuthenticatePassword);
		try {
			await reauthenticateWithCredential(currentUser, credential);
			isReauthenticated = true;
		} catch (err) {
			console.error(err);
			if (firebaseAuthErrorTypeGaurd(err)) {
				if (err.code === 'auth/invalid-credential') alert('Incorrect password');
			}
		}
		inProgress.reauthentication = false;
	}

	function checkInProgress(): boolean {
		return Object.values(inProgress).some((val) => val);
	}
</script>

{#if $user}
	<h1 class="mb-4 text-3xl font-bold">{`Hello, ${$user.displayName}`}</h1>
	<div class="flex flex-col gap-4 md:flex-row">
		<Fieldset
			title="User Settings"
			btnText="Update Profile"
			disabled={inProgress.userSettings}
			handleSubmit={handleUpdateUser}
		>
			<FieldsetInput
				type="email"
				label="Email"
				bind:value={email}
				required
				disabled={!isReauthenticated}
				disabledDisclaimer={verifyDisclaimer}
			></FieldsetInput>
			<FieldsetInput label="Display name" bind:value={displayName} required></FieldsetInput>
			<FieldsetInput
				type="password"
				label="New password"
				bind:value={newPassword}
				disabled={!isReauthenticated}
				disabledDisclaimer={verifyDisclaimer}
			></FieldsetInput>
			{#if !$user.emailVerified}
				<span class="text-warning">
					{`Your email is unverified. Check your inbox at ${$user.email} for a verification email. If you don't see an email click the button below to send one.`}
				</span>
				<button
					type="button"
					class="btn btn-primary btn-sm btn-outline"
					onclick={() => sendEmailVerification($user)}
				>
					Send verification email
				</button>
			{/if}
		</Fieldset>
		<Fieldset
			title="Verify Account"
			btnText="Authenticate"
			disabled={inProgress.reauthentication}
			handleSubmit={handleReauthentication}
		>
			<FieldsetInput type="password" label="Password" bind:value={reAuthenticatePassword} required
			></FieldsetInput>
		</Fieldset>
	</div>
{/if}

<Title title="Profile"></Title>
