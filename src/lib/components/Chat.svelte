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

	interface Props {
		chatId: number;
	}

	const { chatId }: Props = $props();

	let newMessage: string = $state('');
	let allMessages: {
		id: string;
		chatId: number;
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
				class="bg-base-100 relative flex items-baseline justify-between gap-2 rounded-lg p-2"
			>
				<div class="flex items-baseline gap-2">
					<span class="font-medium after:content-[':']">{message.senderName || 'Anonymous'}</span>
					<span dir="auto">{message.text}</span>
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
								<i class="fa-solid fa-trash"></i>
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
	<div class="bg-base-200 sticky bottom-0 py-4">
		<form
			class="flex items-center gap-4"
			onsubmit={(e) => {
				e.preventDefault();
				sendMessage();
			}}
		>
			<LabelInput bind:value={newMessage} label="Enter a message"></LabelInput>
			<button type="submit" class="btn btn-primary"
				><i class="fa-solid fa-paper-plane"></i> Send</button
			>
		</form>
	</div>
</div>

<Title title="Chat"></Title>
