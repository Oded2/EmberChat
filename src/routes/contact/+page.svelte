<script lang="ts">
	import { page } from '$app/state';
	import Fieldset from '$lib/components/Fieldset.svelte';
	import FieldsetInput from '$lib/components/FieldsetInput.svelte';
	import FieldsetTextarea from '$lib/components/FieldsetTextarea.svelte';
	import Title from '$lib/components/Title.svelte';
	import { user } from '$lib/stores/user';

	const params = page.url.searchParams;
	const id = params.get('id');
	const chatId = params.get('chatId');
	const text = params.get('text');
	const reportMessage = `Message Report\n\nID: ${id}\n\nChat ID: ${chatId}\n\nText: ${text}`;
</script>

<div class="my-10">
	<div class="flex justify-center">
		<Fieldset title="Contact" action="https://formspree.io/f/xwpblapz" method="POST" btnText="Send">
			<FieldsetInput label="Email" type="email" required value={$user.user?.email ?? undefined}
			></FieldsetInput>
			<FieldsetInput label="Name" required value={$user.user?.displayName ?? undefined}
			></FieldsetInput>
			<FieldsetTextarea label="Message" value={id && chatId && text ? reportMessage : undefined}
			></FieldsetTextarea>
		</Fieldset>
	</div>
</div>

<Title title="Contact"></Title>
