<script lang="ts">
	import LabelInput from '$lib/components/LabelInput.svelte';

	let message: string = $state('');
</script>

<div class="flex grow flex-col">
	<div class="grow bg-blue-500"></div>
	<div class="p-4">
		<LabelInput bind:value={message} label="Enter a message"></LabelInput>
	</div>
</div>
