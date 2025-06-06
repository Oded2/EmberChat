<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';

	const { data } = $props();
	const { chatId } = data;
</script>

<Chat {chatId}></Chat>
