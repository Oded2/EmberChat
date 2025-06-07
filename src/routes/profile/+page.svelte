<script lang="ts">
	import Fieldset from '$lib/components/Fieldset.svelte';
	import FieldsetInput from '$lib/components/FieldsetInput.svelte';
	import Title from '$lib/components/Title.svelte';
	import { db } from '$lib/firebase/firebase';
	import { addErrorToast, firebaseAuthErrorTypeGaurd } from '$lib/helpers';
	import { addToast } from '$lib/stores/toasts';
	import { updateUser, user } from '$lib/stores/user';
	import {
		EmailAuthProvider,
		reauthenticateWithCredential,
		sendEmailVerification,
		updateEmail,
		updatePassword,
		updateProfile
	} from 'firebase/auth';
	import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
	import { get } from 'svelte/store';

	const verifyDisclaimer = 'You must verify your account first';

	let inProgress = $state(false);

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
		if (inProgress) return;
		const currentUser = get(user);
		if (!currentUser) return;
		if (currentUser.displayName !== displayName) {
			inProgress = true;
			await updateProfile(currentUser, {
				displayName
			});
			updateUser();
			inProgress = false;
		}
		if (currentUser.email !== email) {
			inProgress = true;
			await updateEmail(currentUser, email);
			await sendEmailVerification(currentUser);
			updateUser();
			inProgress = false;
		}
		if (newPassword) {
			inProgress = true;
			await updatePassword(currentUser, newPassword);
			inProgress = false;
		}
	}

	async function handleReauthentication() {
		if (inProgress) return;
		const currentUser = get(user);
		if (!currentUser?.email) return;
		inProgress = true;
		const credential = EmailAuthProvider.credential(currentUser.email, reAuthenticatePassword);
		try {
			await reauthenticateWithCredential(currentUser, credential);
			isReauthenticated = true;
			addToast('success', 5000, 'Account successfully verified');
		} catch (err) {
			console.error(err);
			if (firebaseAuthErrorTypeGaurd(err)) {
				if (err.code === 'auth/invalid-credential') addErrorToast('Incorrect password');
			}
		}
		inProgress = false;
	}

	async function deleteUser() {
		const currentUser = get(user);
		if (
			inProgress ||
			!confirm('This action is irreversible, are you sure you want to continue?') ||
			!currentUser
		)
			return;
		deleteUserMessages();
		await currentUser.delete();
	}

	async function deleteUserMessages(interactive?: boolean) {
		if (
			inProgress ||
			(interactive &&
				!confirm(
					'This will delete all of your chat messages across every chat. Would you like to continue?'
				))
		)
			return;
		const currentUser = get(user);
		const q = query(collection(db, 'globalMessages'), where('owner', '==', currentUser?.uid));
		const snapshot = await getDocs(q);
		const deletePromises = snapshot.docs.map((docSnap) =>
			deleteDoc(doc(db, 'globalMessages', docSnap.id))
		);
		await Promise.all(deletePromises);
		if (interactive)
			addToast(
				'success',
				5000,
				`Deleted ${deletePromises.length} messages for user ${currentUser?.email}`
			);
	}
</script>

{#if $user}
	<h1 class="mb-4 text-3xl font-bold">{`Hello, ${$user.displayName}`}</h1>
	<div class="flex flex-wrap gap-4">
		<Fieldset
			title="User Settings"
			btnText="Update Profile"
			disabled={inProgress}
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
					onclick={() => {
						sendEmailVerification($user);
						addToast('success', 5000, `A verification email has been sent to ${$user.email}`);
					}}
				>
					Send verification email
				</button>
			{/if}
		</Fieldset>
		<Fieldset title="Danger Zone">
			<button class="btn btn-error" onclick={() => deleteUserMessages(true)}>Purge messages</button>
			<button disabled={!isReauthenticated} class="btn btn-error mt-2" onclick={deleteUser}>
				Delete Account
			</button>
			{#if !isReauthenticated}
				<span>{verifyDisclaimer}</span>
			{/if}
		</Fieldset>
		<Fieldset
			title="Verify Account"
			btnText="Authenticate"
			disabled={inProgress}
			handleSubmit={handleReauthentication}
		>
			<FieldsetInput type="password" label="Password" bind:value={reAuthenticatePassword} required
			></FieldsetInput>
		</Fieldset>
	</div>
{/if}

<Title title="Profile"></Title>
