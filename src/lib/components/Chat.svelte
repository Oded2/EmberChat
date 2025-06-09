<script lang="ts">
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Title from '$lib/components/Title.svelte';
	import { db } from '$lib/firebase/firebase';
	import { user } from '$lib/stores/user';
	import {
		addDoc,
		collection,
		deleteDoc,
		doc,
		limit,
		onSnapshot,
		orderBy,
		query,
		serverTimestamp,
		where
	} from 'firebase/firestore';
	import { onMount, tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import { get } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import LabelInputForm from './LabelInputForm.svelte';
	import { getRandomInt, globalRoomCode } from '$lib/helpers';
	import Autolink from './Autolink.svelte';
	import LabelTextarea from './LabelTextarea.svelte';
	import { adjectives, nouns } from '$lib/words/words';
	import { showModal } from '$lib/stores/confirm';

	interface Props {
		chatId: string;
	}

	const { chatId }: Props = $props();

	let anonId = $state('');
	let newMessage: string = $state('');
	let allMessages: {
		id: string;
		chatId: string;
		text?: string;
		senderName?: string;
		timestamp: Date;
		owner?: string;
	}[] = $state([]);
	let inProgress = $state(false);

	onMount(() => {
		anonId = getOrGenerateUsername();
		const q = query(
			collection(db, 'globalMessages'),
			where('chatId', '==', chatId),
			orderBy('timestamp'),
			limit(200)
		);
		const unsubscribe = onSnapshot(q, async (snapshot) => {
			allMessages = snapshot.docs.map((doc) => {
				const data = doc.data({ serverTimestamps: 'estimate' });
				return { ...data, id: doc.id, chatId, timestamp: firestoreTimestampToDate(data.timestamp) };
			});
			await resetScroll();
		});
		return unsubscribe;
	});

	async function sendMessage() {
		if (inProgress) return;
		inProgress = true;
		newMessage = newMessage.trim();
		if (!newMessage) return;
		const currentUser = get(user).user;
		await addDoc(collection(db, 'globalMessages'), {
			text: newMessage,
			senderName: currentUser?.displayName ?? anonId,
			timestamp: serverTimestamp(),
			owner: currentUser?.uid ?? '',
			chatId
		});
		newMessage = '';
		inProgress = false;
	}

	async function deleteMessage(id: string) {
		const docRef = doc(db, 'globalMessages', id);
		await deleteDoc(docRef);
	}

	function firestoreTimestampToDate(timestamp: any): Date {
		const millis = timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6;
		return new Date(millis);
	}

	async function resetScroll() {
		await tick();
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
	}

	function getOrGenerateUsername(): string {
		const localStorageUsername = localStorage.getItem('username');
		if (localStorageUsername) return localStorageUsername;
		const randomAdjective = adjectives[getRandomInt(1, adjectives.length) - 1];
		const randomNoun = nouns[getRandomInt(1, nouns.length) - 1];
		const randomNumber = getRandomInt(0, 99).toString().padStart(2, '0');
		const username = `${randomAdjective}-${randomNoun}-${randomNumber}`;
		localStorage.setItem('username', username);
		return username;
	}
</script>

<div class="mt-10 flex grow flex-col gap-4">
	<div class="flex grow flex-col gap-4">
		{#each allMessages as message (message.id)}
			<div
				in:fly={{ duration: 200, y: 40 }}
				animate:flip={{ duration: 200 }}
				class="bg-base-100 group flex justify-between gap-2 rounded-lg px-4 py-2"
			>
				<div class="flex flex-col">
					<div class="flex items-baseline gap-x-1.5">
						<span class="font-semibold">{message.senderName}</span>
						<span class="text-xs font-light">
							{message.timestamp.toLocaleString(undefined, {
								minute: 'numeric',
								hour: 'numeric',
								day: 'numeric',
								month: 'numeric'
							})}
						</span>
					</div>
					<span class="whitespace-pre-line" dir="auto">
						<Autolink text={message.text}></Autolink>
					</span>
				</div>
				<div class="flex gap-2">
					<CopyButton text={message.text ?? ''}>
						<i class="fa-solid fa-copy"></i>
					</CopyButton>
					{#if message.owner === $user.user?.uid}
						<div class="tooltip" data-tip="Delete">
							<button
								onclick={() =>
									showModal(
										() => deleteMessage(message.id),
										`Are you sure you want to delete the following message?\n\n"${message.text}"`
									)}
								class="btn btn-sm"
								aria-label="Delete"
							>
								<i class="fa-solid fa-trash-can"></i>
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
	<div class="bg-base-200 sticky bottom-0 flex flex-col gap-2 py-4">
		<LabelInputForm handleSubmit={sendMessage}>
			<LabelTextarea bind:value={newMessage} label="Enter a message">
				<div class="flex ps-4">
					{#if !$user.loading && !$user.user}
						<span class="mt-auto text-xs font-light italic">{`You're chatting as ${anonId}`}</span>
					{/if}
					<button type="submit" class="btn btn-primary btn-circle ms-auto" aria-label="Send">
						<i class="fa-solid fa-arrow-up"></i>
					</button>
				</div>
			</LabelTextarea>
		</LabelInputForm>
		{#if chatId !== globalRoomCode}
			<span class="text-center text-sm italic">{`Chat ID: ${chatId}`}</span>
		{/if}
	</div>
</div>

<Title title={chatId === globalRoomCode ? 'Global Chat' : `Chat - ${chatId}`}></Title>
