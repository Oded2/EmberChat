<script lang="ts">
	import Fieldset from '$lib/components/Fieldset.svelte';
	import FieldsetInput from '$lib/components/FieldsetInput.svelte';
	import FieldsetTextarea from '$lib/components/FieldsetTextarea.svelte';
	import Title from '$lib/components/Title.svelte';
	import { sendForm } from '$lib/helpers';
	import { t } from '$lib/stores/localization';
	import { addToast } from '$lib/stores/toasts';
	import { user } from '$lib/stores/user';

	let email = $state($user.user?.email ?? '');
	let name = $state($user.user?.displayName ?? '');
	let message = $state('');

	async function handleSubmit() {
		const ok = await sendForm({
			type: 'Message',
			email,
			name: name.trim(),
			message: message.trim()
		});
		if (ok) {
			addToast('success', $t('contact_success'));
			message = '';
		} else addToast('error', $t('contact_error'));
	}
</script>

<div class="my-10">
	<div class="flex justify-center">
		<Fieldset title={$t('contact')} btnText={$t('send')} {handleSubmit}>
			<FieldsetInput type="email" label={$t('email')} required bind:value={email}></FieldsetInput>
			<FieldsetInput label={$t('name')} required bind:value={name}></FieldsetInput>
			<FieldsetTextarea label={$t('message')} required bind:value={message}></FieldsetTextarea>
		</Fieldset>
	</div>
</div>

<Title title={$t('contact')}></Title>
