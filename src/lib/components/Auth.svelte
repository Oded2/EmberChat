<script lang="ts">
	import Fieldset from '$lib/components/Fieldset.svelte';
	import FieldsetInput from '$lib/components/FieldsetInput.svelte';
	import { authHandlers } from '$lib/stores/fire';

	interface Props {
		initialSignUp?: boolean;
	}

	const { initialSignUp }: Props = $props();

	let signUp = $state(initialSignUp);
	let email = $state('');
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
				await authHandlers.signup(email, password);
			} else await authHandlers.login(email, password);
		} catch (err) {
			console.error(err);
		} finally {
			inProgress = false;
		}
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		handleAuthenticate();
	}}
>
	<Fieldset title={signUp ? 'Sign Up' : 'Login'}>
		<FieldsetInput bind:value={email} label="Email" type="email" placeholder="Email" required
		></FieldsetInput>
		<FieldsetInput
			bind:value={password}
			label="Password"
			type="password"
			placeholder="Password"
			required
		></FieldsetInput>
		{#if signUp}
			<FieldsetInput
				bind:value={confirmPass}
				label="Confirm Password"
				type="password"
				placeholder="Confirm Password"
				required
			></FieldsetInput>
		{/if}
		<button
			type="button"
			onclick={() => (signUp = !signUp)}
			class="mt-2 cursor-pointer font-extralight underline"
			>{signUp ? 'Already have an account? Login' : "Don't have an account yet? Sign up"}</button
		>
		<button disabled={inProgress} type="submit" class="btn btn-primary mt-2"
			>{signUp ? 'Sign Up' : 'Login'}</button
		>
	</Fieldset>
</form>
