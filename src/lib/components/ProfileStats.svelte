<script lang="ts">
	import { db } from '$lib/firebase/firebase';
	import { globalRoomCode, handleMessages, type Message } from '$lib/helpers';
	import type { User } from 'firebase/auth';
	import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
	import { t } from '$lib/stores/localization';
	import { onMount } from 'svelte';

	interface Props {
		userData: User;
		show: boolean;
	}

	const { userData, show }: Props = $props();
	const ref = query(
		collection(db, 'messages'),
		where('owner', '==', userData.uid),
		orderBy('timestamp')
	);
	const messagesPromise = getDocs(ref).then((snapshot) => handleMessages(snapshot));
	let globalFrequencyMap: [string, number][] = $state([]);

	onMount(async () => {
		const messages = await messagesPromise;
		const frequencyMap: Record<string, number> = {};
		messages.forEach(({ chatId }) => (frequencyMap[chatId] = (frequencyMap[chatId] || 0) + 1));
		globalFrequencyMap = Object.entries(frequencyMap);
	});

	function getMostUsedChat(messages: Message[]): {
		chatId: string;
		count: number;
	} {
		let max = 0;
		let chatId = messages[0].chatId;
		globalFrequencyMap.forEach(([id, count]) => {
			if (count > max) {
				max = count;
				chatId = id;
			}
		});
		return {
			chatId,
			count: max
		};
	}
</script>

<div class:hidden={!show}>
	{#await messagesPromise}
		<span class="loading loading-spinner loading-xl"></span>
	{:then messages}
		{#if messages.length > 0}
			{@const mostFrequent = getMostUsedChat(messages)}
			<h2 class="mb-3 text-2xl font-semibold">
				{$t('total_messages').replace('%NUM%', messages.length.toLocaleString())}
			</h2>
			<div class="grid grid-cols-3 gap-4">
				{@render StatCard($t('last_message'), messages[messages.length - 1])}
				{@render StatCard($t('first_message'), messages[0])}
				{@render StatCard(
					$t('most_used_chat'),
					`${mostFrequent.chatId === globalRoomCode ? $t('about_usage_global_chat') : mostFrequent.chatId} - ${mostFrequent.count.toLocaleString()} ${$t('messages')}`
				)}
			</div>
			<div class="divider font-bold italic">{$t('all_chat_rooms')}</div>
			<div class="grid grid-cols-3 gap-4">
				{#each globalFrequencyMap as [chatId, count]}
					{@render StatCard(chatId, `${count.toLocaleString()} ${$t('messages')}`)}
				{/each}
			</div>
		{:else}
			<span>{$t('no_messages')}</span>
		{/if}
	{/await}
</div>

{#snippet StatCard(statName: string, m: Message | string)}
	<div class="bg-base-100 flex flex-col gap-2 rounded-2xl px-4 py-2 shadow">
		<div class="flex flex-col">
			<h2 class="text-lg font-semibold">{`${statName}`}</h2>
			{#if typeof m !== 'string'}
				<span class="text-sm">
					{m.timestamp.toDate().toLocaleString(undefined, {
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
		<span class="whitespace-pre-line">{`${typeof m === 'string' ? m : `"${m.text}"`}`}</span>
		{#if typeof m !== 'string'}
			<span class="text-xs">
				{m.chatId === globalRoomCode
					? $t('about_usage_global_chat')
					: $t('chat_id').replace('%ID%', m.chatId)}
			</span>
		{/if}
	</div>
{/snippet}
