<script lang="ts">
	import Fieldset from '$lib/components/Fieldset.svelte';
	import FieldsetInput from '$lib/components/FieldsetInput.svelte';
	import Title from '$lib/components/Title.svelte';
	import { updateUser, user } from '$lib/stores/user';
	import { sendEmailVerification, updateProfile } from 'firebase/auth';
	import { get } from 'svelte/store';

	let inProgress = $state(false);

	const originalUser = get(user);
	let email: string = $state('');
	let displayName = $state('');

	$effect(() => {
		email = $user?.email ?? '';
		displayName = $user?.displayName ?? '';
	});

	async function handleUpdateUser() {
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
	}
</script>

{#if $user}
	<form
		class="flex flex-col gap-4"
		onsubmit={(e) => {
			e.preventDefault();
			handleUpdateUser();
		}}
	>
		<h1 class="text-3xl font-bold">{`Hello, ${$user.displayName}`}</h1>
		<Fieldset title="User Settings" btnText="Update Profile" disabled={inProgress}>
			<FieldsetInput label="Email" bind:value={email} required disabled></FieldsetInput>
			<FieldsetInput label="Display name" bind:value={displayName} required></FieldsetInput>
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
	</form>
{/if}

<Title title="Profile"></Title>
