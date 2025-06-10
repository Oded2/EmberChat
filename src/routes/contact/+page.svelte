<script lang="ts">
	import Fieldset from '$lib/components/Fieldset.svelte';
	import FieldsetInput from '$lib/components/FieldsetInput.svelte';
	import FieldsetTextarea from '$lib/components/FieldsetTextarea.svelte';
	import Title from '$lib/components/Title.svelte';
	import { sendForm } from '$lib/helpers';
	import { addToast } from '$lib/stores/toasts';
	import { user } from '$lib/stores/user';

	let email = $state($user.user?.email ?? '');
	let name = $state($user.user?.displayName ?? '');
	let message = $state('');

	async function handleSubmit() {
		const ok = await sendForm({ type: 'Message', email, name, message });
		if (ok) {
			addToast('success', 'Your message has been sent');
			message = '';
		} else addToast('error', 'There was an error in sending the form');
	}
</script>

<div class="my-10">
	<div class="flex justify-center">
		<Fieldset title="Contact" btnText="Send" {handleSubmit}>
			<FieldsetInput type="email" label="Email" required bind:value={email}></FieldsetInput>
			<FieldsetInput label="Name" required bind:value={name}></FieldsetInput>
			<FieldsetTextarea label="Message" required bind:value={message}></FieldsetTextarea>
		</Fieldset>
	</div>
</div>

<Title title="Contact"></Title>
