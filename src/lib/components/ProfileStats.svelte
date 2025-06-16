<script lang="ts">
	import { db } from '$lib/firebase/firebase';
	import { globalRoomCode, handleMessages, type Message } from '$lib/helpers';
	import type { User } from 'firebase/auth';
	import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
	import { t } from '$lib/stores/localization';
	import { onMount } from 'svelte';
	import StatCard from './StatCard.svelte';

	interface Props {
		userData: User;
		show: boolean;
	}

	const { userData, show }: Props = $props();

	let messages: Message[] | null = $state(null);

	let globalFrequencyMap: [string, number][] = $state([]);

	onMount(() => {
		const q = query(
			collection(db, 'messages'),
			where('owner', '==', userData.uid),
			orderBy('timestamp')
		);
		const unsubscribe = onSnapshot(q, async (snapshot) => {
			messages = handleMessages(snapshot);
			const frequencyMap: Record<string, number> = {};
			messages.forEach(({ chatId }) => (frequencyMap[chatId] = (frequencyMap[chatId] || 0) + 1));
			globalFrequencyMap = Object.entries(frequencyMap);
		});
		return unsubscribe;
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
	{#if messages}
		{#if messages.length > 0}
			{@const mostFrequent = getMostUsedChat(messages)}
			<h2 class="mb-3 text-2xl font-semibold">
				{$t('total_messages').replace('%NUM%', messages.length.toLocaleString())}
			</h2>
			<div class="grid grid-cols-3 gap-4">
				<StatCard label={$t('last_message')} message={messages[messages.length - 1]}></StatCard>
				<StatCard label={$t('first_message')} message={messages[0]}></StatCard>
				<StatCard label={$t('most_used_chat')}>
					{`${mostFrequent.chatId === globalRoomCode ? $t('about_usage_global_chat') : mostFrequent.chatId} - ${mostFrequent.count.toLocaleString()} ${$t('messages')}`}
				</StatCard>
			</div>
			<div class="divider font-bold italic">{$t('all_chat_rooms')}</div>
			<div class="grid grid-cols-3 gap-4">
				{#each globalFrequencyMap as [chatId, count]}
					<StatCard label={chatId}>
						{`${count.toLocaleString()} ${$t('messages')}`}
					</StatCard>
				{/each}
			</div>
		{:else}
			<span>{$t('no_messages')}</span>
		{/if}
	{:else}
		<span class="loading loading-spinner loading-xl"></span>
	{/if}
</div>
