<script lang="ts">
	import { globalRoomCode, type Message } from '$lib/helpers';
	import { t } from '$lib/stores/localization';
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		message?: Message;
		children?: Snippet;
	}

	const { label, message, children }: Props = $props();
</script>

<div class="bg-base-100 flex flex-col gap-2 rounded-2xl px-4 py-2 shadow">
	<div class="flex flex-col">
		<h2 class="text-lg font-semibold">{label}</h2>
		{#if message}
			<span class="text-sm">
				{message.timestamp.toDate().toLocaleString(undefined, {
					minute: 'numeric',
					hour: 'numeric',
					weekday: 'long',
					day: '2-digit',
					month: 'long',
					year: 'numeric'
				})}
			</span>
		{/if}
	</div>
	{#if message}
		<span class="line-clamp-3 whitespace-pre-line">{`"${message.text}"`}</span>
	{:else if children}
		{@render children()}
	{/if}
	{#if message}
		<span class="text-xs">
			{message.chatId === globalRoomCode
				? $t('about_usage_global_chat')
				: $t('chat_id').replace('%ID%', message.chatId)}
		</span>
	{/if}
</div>
