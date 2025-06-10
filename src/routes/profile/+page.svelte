<script lang="ts">
	import Fieldset from '$lib/components/Fieldset.svelte';
	import FieldsetInput from '$lib/components/FieldsetInput.svelte';
	import Title from '$lib/components/Title.svelte';
	import { db } from '$lib/firebase/firebase';
	import { firebaseAuthErrorTypeGaurd } from '$lib/helpers';
	import { showModal } from '$lib/stores/confirm';
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

	const userData = $derived($user.user);

	const verifyDisclaimer = 'You must verify your account first';

	let email = $state('');
	let displayName = $state('');
	let newPassword = $state('');
	let reAuthenticatePassword = $state('');
	let isReauthenticated = $state(false);

	$effect(() => {
		const currentUser = $user.user;
		email = currentUser?.email ?? '';
		displayName = currentUser?.displayName ?? '';
	});

	async function handleUpdateUser() {
		const currentUser = get(user).user;
		if (!currentUser) return;
		let isUpdate = false;
		if (currentUser.displayName !== displayName) {
			await updateProfile(currentUser, {
				displayName
			});
			updateUser();
			isUpdate = true;
		}
		if (currentUser.email !== email) {
			await updateEmail(currentUser, email);
			await sendEmailVerification(currentUser);
			updateUser();
			isUpdate = true;
		}
		if (newPassword) {
			await updatePassword(currentUser, newPassword);
			isUpdate = true;
		}
		if (isUpdate) addToast('success', 'Profile updated');
	}

	async function handleReauthentication() {
		const currentUser = get(user).user;
		if (!reAuthenticatePassword || !currentUser?.email) return;
		const credential = EmailAuthProvider.credential(currentUser.email, reAuthenticatePassword);
		try {
			await reauthenticateWithCredential(currentUser, credential);
			isReauthenticated = true;
			addToast('success', 'Account successfully verified');
		} catch (err) {
			console.error(err);
			if (firebaseAuthErrorTypeGaurd(err)) {
				if (err.code === 'auth/wrong-password') addToast('error', 'Incorrect password');
				else addToast('error', `${err.code}: ${err.message}`);
			}
		}
	}

	async function deleteUser() {
		const currentUser = get(user).user;
		if (!currentUser) return;
		deleteUserMessages(false);
		await currentUser.delete();
	}

	async function deleteUserMessages(interactive: boolean = true) {
		const currentUser = get(user).user;
		const q = query(collection(db, 'globalMessages'), where('owner', '==', currentUser?.uid));
		const snapshot = await getDocs(q);
		const deletePromises = snapshot.docs.map((docSnap) =>
			deleteDoc(doc(db, 'globalMessages', docSnap.id))
		);
		await Promise.all(deletePromises);
		if (interactive)
			addToast(
				'success',
				`Deleted ${deletePromises.length} messages for user ${currentUser?.email}`
			);
	}
</script>

{#if userData}
	<h1 class="my-10 text-center text-3xl font-bold">{`Hello, ${userData.displayName}`}</h1>
	<div class="flex flex-wrap justify-center gap-4 pb-10">
		<Fieldset title="User Settings" btnText="Update Profile" handleSubmit={handleUpdateUser}>
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
			{#if !userData.emailVerified}
				<span class="text-warning">
					{`Your email is unverified. Check your inbox at ${userData.email} for a verification email. If you don't see an email click the button below to send one.`}
				</span>
				<button
					type="button"
					class="btn btn-primary btn-sm btn-outline"
					onclick={() => {
						sendEmailVerification(userData);
						addToast('success', `A verification email has been sent to ${userData.email}`);
					}}
				>
					Send verification email
				</button>
			{/if}
		</Fieldset>
		<Fieldset title="Danger Zone">
			<button
				type="button"
				class="btn btn-error"
				onclick={() =>
					showModal(
						deleteUserMessages,
						'This action will delete all of your messages. Are you sure you want to continue?'
					)}>Purge messages</button
			>
			<button
				type="button"
				disabled={!isReauthenticated}
				class="btn btn-error mt-2"
				onclick={() =>
					showModal(deleteUser, 'This action is irreversible. Are you sure you want to continue?')}
			>
				Delete Account
			</button>
			{#if !isReauthenticated}
				<span>{verifyDisclaimer}</span>
			{/if}
		</Fieldset>
		<Fieldset title="Verify Account" btnText="Authenticate" handleSubmit={handleReauthentication}>
			<FieldsetInput type="password" label="Password" bind:value={reAuthenticatePassword}
			></FieldsetInput>
		</Fieldset>
	</div>
{/if}

<Title title="Profile"></Title>
