<script lang="ts">
	import { db } from '$lib/firebase/firebase';
	import { deleteDocsByQuery, globalRoomCode, handleMessages, type Message } from '$lib/helpers';
	import type { User } from 'firebase/auth';
	import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
	import { t } from '$lib/stores/localization';
	import { onMount } from 'svelte';
	import StatCard from './StatCard.svelte';
	import { showModal } from '$lib/stores/confirm';
	import { addToast } from '$lib/stores/toasts';

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

	async function purgeChat(chatId: string) {
		const q = query(
			collection(db, 'messages'),
			where('owner', '==', userData.uid),
			where('chatId', '==', chatId)
		);
		const length = await deleteDocsByQuery(q);
		addToast(
			'success',
			$t('purge_messages_success')
				.replace('%NUMBER%', length.toLocaleString())
				.replace('%EMAIL%', userData.email ?? '')
		);
	}

	function chatDisplay(chatId: string) {
		return chatId === globalRoomCode ? $t('about_usage_global_chat') : chatId;
	}
</script>

<div class:hidden={!show}>
	{#if messages}
		{#if messages.length > 0}
			{@const mostFrequent = getMostUsedChat(messages)}
			<h2 class="mb-3 text-2xl font-semibold">
				{$t('total_messages').replace('%NUM%', messages.length.toLocaleString())}
			</h2>
			<div class="flex flex-col gap-4 sm:grid sm:grid-cols-3">
				<StatCard label={$t('last_message')} message={messages[messages.length - 1]}></StatCard>
				<StatCard label={$t('first_message')} message={messages[0]}></StatCard>
				<StatCard label={$t('most_used_chat')}>
					<span dir="auto">
						{`${chatDisplay(mostFrequent.chatId)} - ${mostFrequent.count.toLocaleString()} ${$t('messages')}`}
					</span>
				</StatCard>
			</div>
			<div class="divider font-bold italic">{$t('all_chat_rooms')}</div>
			<div class="flex flex-col gap-4 sm:grid sm:grid-cols-3">
				{#each [...globalFrequencyMap].sort(([a], [b]) => {
					if (a === globalRoomCode) return -1;
					if (b === globalRoomCode) return 1;
					return a.localeCompare(b);
				}) as [chatId, count]}
					<StatCard label={chatDisplay(chatId)}>
						<span>{`${count.toLocaleString()} ${$t('messages')}`}</span>
						<div class="mt-2 flex justify-end gap-2">
							<button
								class="btn btn-error btn-outline btn-sm lg:btn-md"
								onclick={() =>
									showModal(
										() => purgeChat(chatId),
										$t('confirm_purge_chat').replace('%ID%', chatDisplay(chatId)),
										$t('confirm_purge_chat_description').replace('%ID%', chatDisplay(chatId)),
										$t('purge')
									)}
							>
								{$t('purge')}
							</button>
							<a href={`/chat/${chatId}`} class="btn btn-primary btn-outline btn-sm lg:btn-md">
								{$t('go')}
							</a>
						</div>
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
