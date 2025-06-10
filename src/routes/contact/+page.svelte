<script lang="ts">
	import Fieldset from '$lib/components/Fieldset.svelte';
	import FieldsetInput from '$lib/components/FieldsetInput.svelte';
	import FieldsetTextarea from '$lib/components/FieldsetTextarea.svelte';
	import { user } from '$lib/stores/user';
</script>

<div class="my-10">
	<div class="flex justify-center">
		<Fieldset title="Contact" action="https://formspree.io/f/xwpblapz" method="POST" btnText="Send">
			<FieldsetInput label="Email" type="email" required value={$user.user?.email ?? undefined}
			></FieldsetInput>
			<FieldsetInput label="Name" required value={$user.user?.displayName ?? undefined}
			></FieldsetInput>
			<FieldsetTextarea label="Message"></FieldsetTextarea>
		</Fieldset>
	</div>
</div>
