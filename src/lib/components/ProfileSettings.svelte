<script lang="ts">
	import { db } from '$lib/firebase/firebase';
	import { deleteDocsByQuery, firebaseAuthErrorTypeGaurd } from '$lib/helpers';
	import { t } from '$lib/stores/localization';
	import { addToast } from '$lib/stores/toasts';
	import { updateUser } from '$lib/stores/user';
	import {
		EmailAuthProvider,
		reauthenticateWithCredential,
		sendEmailVerification,
		updateEmail,
		updatePassword,
		updateProfile,
		type User
	} from 'firebase/auth';
	import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
	import Fieldset from './Fieldset.svelte';
	import FieldsetInput from './FieldsetInput.svelte';
	import { showModal } from '$lib/stores/confirm';

	interface Props {
		userData: User;
		show: boolean;
	}

	const { userData, show }: Props = $props();

	let email = $state('');
	let displayName = $state('');
	let newPassword = $state('');
	let confirmNewPassword = $state('');
	let reAuthenticatePassword = $state('');
	let isReauthenticated = $state(false);

	$effect(() => {
		const currentUser = userData;
		email = currentUser?.email ?? '';
		displayName = currentUser?.displayName ?? '';
	});

	async function handleUpdateUser() {
		let isUpdate = false;
		displayName = displayName.trim();
		if (userData.displayName !== displayName) {
			// Update the profile
			await updateProfile(userData, {
				displayName
			});
			updateUser();
			// Change the senderName value in all the chats that the user has sent
			const q = query(collection(db, 'messages'), where('owner', '==', userData.uid));
			const snapshot = await getDocs(q);
			const updates = snapshot.docs.map((doc) => updateDoc(doc.ref, { senderName: displayName }));
			await Promise.all(updates);
			isUpdate = true;
		}
		if (userData.email !== email) {
			await updateEmail(userData, email);
			await sendEmailVerification(userData);
			updateUser();
			isUpdate = true;
		}
		if (newPassword) {
			if (newPassword !== confirmNewPassword) {
				addToast('error', $t('password_mismatch'));
				return;
			}
			await updatePassword(userData, newPassword);
			isUpdate = true;
		}
		if (isUpdate) addToast('success', $t('profile_updated'));
	}

	async function handleReauthentication() {
		if (!reAuthenticatePassword || !userData?.email) return;
		const credential = EmailAuthProvider.credential(userData.email, reAuthenticatePassword);
		try {
			await reauthenticateWithCredential(userData, credential);
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
		deleteUserMessages(false);
		await userData.delete();
	}

	async function deleteUserMessages(interactive: boolean = true) {
		const q = query(collection(db, 'messages'), where('owner', '==', userData?.uid));
		const num = await deleteDocsByQuery(q);
		if (interactive)
			addToast(
				'success',
				$t('purge_messages_success')
					.replace('%NUMBER%', num.toLocaleString())
					.replace('%EMAIL%', userData?.email ?? '')
			);
	}
</script>

{#if userData}
	<div class="flex-wrap justify-center gap-4 pb-10" class:hidden={!show} class:flex={show}>
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
{/if}
