<script lang="ts">
	import CopyButton from '$lib/components/CopyButton.svelte';
	import LabelInput from '$lib/components/LabelInput.svelte';
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
	import { globalRoomCode } from '$lib/helpers';
	import Autolink from './Autolink.svelte';

	interface Props {
		chatId: string;
	}

	const { chatId }: Props = $props();

	let newMessage: string = $state('');
	let allMessages: {
		id: string;
		chatId: string;
		text?: string;
		senderName?: string;
		timestamp: Date;
		owner?: string;
	}[] = $state([]);

	onMount(() => {
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
		newMessage = newMessage.trim();
		if (!newMessage) return;
		const currentUser = get(user);
		await addDoc(collection(db, 'globalMessages'), {
			text: newMessage,
			senderName: currentUser?.displayName ?? '',
			timestamp: serverTimestamp(),
			owner: currentUser?.uid ?? '',
			chatId
		});
		newMessage = '';
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
</script>

<div class="flex grow flex-col gap-4">
	<div class="flex grow flex-col gap-4">
		{#each allMessages as message (message.id)}
			<div
				in:fly={{ duration: 200, y: 40 }}
				animate:flip={{ duration: 200 }}
				class="bg-base-100 flex items-baseline justify-between gap-2 rounded-lg px-4 py-2"
			>
				<div class="flex items-baseline gap-2">
					<span class="font-medium after:content-[':']">{message.senderName || 'Anonymous'}</span>
					<span dir="auto"><Autolink text={message.text}></Autolink></span>
				</div>
				<div class="flex items-baseline gap-2">
					<span class="whitespace-nowrap">
						{message.timestamp.toLocaleString(undefined, {
							minute: 'numeric',
							hour: 'numeric',
							day: 'numeric',
							month: 'long'
						})}
					</span>
					<CopyButton text={message.text ?? ''}>
						<i class="fa-solid fa-copy"></i>
					</CopyButton>
					{#if message.owner === $user?.uid}
						<div class="tooltip" data-tip="Delete">
							<button
								onclick={() => deleteMessage(message.id)}
								class="btn btn-error btn-sm"
								aria-label="Delete"
							>
								<i class="fa-solid fa-eraser"></i>
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
	<div class="bg-base-200 sticky bottom-0 flex flex-col gap-2 py-4">
		<LabelInputForm handleSubmit={sendMessage}>
			<LabelInput bind:value={newMessage} label="Enter a message"></LabelInput>
			<button type="submit" class="btn btn-primary">
				<i class="fa-solid fa-paper-plane"></i> Send
			</button>
		</LabelInputForm>
		{#if chatId !== globalRoomCode}
			<span class="text-center text-sm italic">{`Chat ID: ${chatId}`}</span>
		{/if}
	</div>
</div>

<Title title="Chat"></Title>
