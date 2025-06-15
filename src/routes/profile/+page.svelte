<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Fieldset from '$lib/components/Fieldset.svelte';
	import FieldsetInput from '$lib/components/FieldsetInput.svelte';
	import Title from '$lib/components/Title.svelte';
	import { db } from '$lib/firebase/firebase';
	import { firebaseAuthErrorTypeGaurd } from '$lib/helpers';
	import { showModal } from '$lib/stores/confirm';
	import { t } from '$lib/stores/localization';
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
	import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
	import { get } from 'svelte/store';

	const userData = $derived($user.user);

	let email = $state('');
	let displayName = $state('');
	let newPassword = $state('');
	let confirmNewPassword = $state('');
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
		displayName = displayName.trim();
		if (currentUser.displayName !== displayName) {
			// Update the profile
			await updateProfile(currentUser, {
				displayName
			});
			updateUser();
			// Change the senderName value in all the chats that the user has sent
			const q = query(collection(db, 'messages'), where('owner', '==', currentUser.uid));
			const snapshot = await getDocs(q);
			const updates = snapshot.docs.map((doc) => updateDoc(doc.ref, { senderName: displayName }));
			await Promise.all(updates);
			isUpdate = true;
		}
		if (currentUser.email !== email) {
			await updateEmail(currentUser, email);
			await sendEmailVerification(currentUser);
			updateUser();
			isUpdate = true;
		}
		if (newPassword) {
			if (newPassword !== confirmNewPassword) {
				addToast('error', $t('password_mismatch'));
				return;
			}
			await updatePassword(currentUser, newPassword);
			isUpdate = true;
		}
		if (isUpdate) addToast('success', $t('profile_updated'));
	}

	async function handleReauthentication() {
		const currentUser = get(user).user;
		if (!reAuthenticatePassword || !currentUser?.email) return;
		const credential = EmailAuthProvider.credential(currentUser.email, reAuthenticatePassword);
		try {
			await reauthenticateWithCredential(currentUser, credential);
			isReauthenticated = true;
			addToast('success', $t('account_verified'));
		} catch (err) {
			console.error(err);
			if (firebaseAuthErrorTypeGaurd(err)) {
				if (err.code === 'auth/wrong-password') addToast('error', $t('incorrect_password'));
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
		const q = query(collection(db, 'messages'), where('owner', '==', currentUser?.uid));
		const snapshot = await getDocs(q);
		const deletePromises = snapshot.docs.map((docSnap) =>
			deleteDoc(doc(db, 'messages', docSnap.id))
		);
		await Promise.all(deletePromises);
		if (interactive)
			addToast(
				'success',
				$t('purge_messages_success')
					.replace('%NUMBER%', deletePromises.length.toLocaleString())
					.replace('%EMAIL%', currentUser?.email ?? '')
			);
	}
</script>

{#if userData}
	<Container>
		<h1 class="my-10 text-center text-3xl font-bold">
			{$t('personal_greeting').replace('%NAME%', userData.displayName ?? '')}
		</h1>
		<div class="flex flex-wrap justify-center gap-4 pb-10">
			<Fieldset
				title={$t('user_settings')}
				btnText={$t('update_profile')}
				handleSubmit={handleUpdateUser}
			>
				<FieldsetInput
					type="email"
					label={$t('email')}
					bind:value={email}
					required
					disabled={!isReauthenticated}
					disabledDisclaimer={$t('verify_disclaimer')}
				></FieldsetInput>
				<FieldsetInput label={$t('display_name')} bind:value={displayName} required></FieldsetInput>
				<FieldsetInput
					type="password"
					label={$t('new_password')}
					bind:value={newPassword}
					disabled={!isReauthenticated}
					disabledDisclaimer={$t('verify_disclaimer')}
				></FieldsetInput>
				<FieldsetInput
					type="password"
					label={$t('confirm_new_password')}
					bind:value={confirmNewPassword}
					disabled={!isReauthenticated}
					disabledDisclaimer={$t('verify_disclaimer')}
				></FieldsetInput>
				{#if !userData.emailVerified}
					<span class="text-warning">
						{$t('email_unverified')}
					</span>
					<button
						type="button"
						class="btn btn-primary btn-sm btn-outline"
						onclick={() => {
							sendEmailVerification(userData);
							addToast('success', $t('verification_email_sent')).replace(
								'%EMAIL%',
								userData.email ?? ''
							);
						}}
					>
						{$t('send_verification_email')}
					</button>
				{/if}
			</Fieldset>
			<Fieldset title={$t('danger_zone')}>
				<button
					type="button"
					class="btn btn-error"
					onclick={() => showModal(deleteUserMessages, $t('confirm_purge_messages'))}
				>
					{$t('purge_messages')}
				</button>
				<button
					type="button"
					disabled={!isReauthenticated}
					class="btn btn-error mt-2"
					onclick={() => showModal(deleteUser, $t('confirm_delete_account'))}
				>
					{$t('delete_account')}
				</button>
				{#if !isReauthenticated}
					<span>{$t('verify_disclaimer')}</span>
				{/if}
			</Fieldset>
			<Fieldset
				title={$t('verify_account')}
				btnText={$t('authenticate')}
				handleSubmit={handleReauthentication}
			>
				<FieldsetInput type="password" label={$t('password')} bind:value={reAuthenticatePassword}
				></FieldsetInput>
			</Fieldset>
		</div>
	</Container>
{/if}

<Title title={$t('profile')}></Title>
