<script lang="ts">
	import LabelInput from '$lib/components/LabelInput.svelte';
	import Title from '$lib/components/Title.svelte';
	import { db } from '$lib/firebase/firebase';
	import { user } from '$lib/stores/user';
	import {
		addDoc,
		collection,
		doc,
		onSnapshot,
		orderBy,
		query,
		serverTimestamp
	} from 'firebase/firestore';
	import { onMount, tick } from 'svelte';
	import { get } from 'svelte/store';
	import { fly } from 'svelte/transition';

	let timeStampFilter: Date = $state(new Date());
	let newMessage: string = $state('');
	let allMessages: {
		id: string;
		text?: string;
		senderName?: string;
		timestamp: Date;
		owner?: string;
	}[] = $state([]);

	onMount(() => {
		const q = query(collection(db, 'globalMessages'), orderBy('timestamp'));
		const unsubscribe = onSnapshot(q, async (snapshot) => {
			allMessages = snapshot.docs.map((doc) => {
				const data = doc.data({ serverTimestamps: 'estimate' });
				return { ...data, id: doc.id, timestamp: firestoreTimestampToDate(data.timestamp) };
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
			owner: currentUser?.uid ?? ''
		});
		newMessage = '';
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
		{#each allMessages as message}
			<div
				transition:fly={{ duration: 200, y: 40 }}
				class="bg-base-100 relative justify-between gap-2 rounded-lg p-2 transition-transform"
				class:flex={message.timestamp >= timeStampFilter}
				class:hidden={message.timestamp < timeStampFilter}
			>
				<div class="flex gap-2">
					<span class="font-medium after:content-[':']">{message.senderName || 'Anonymous'}</span>
					<span dir="auto">{message.text}</span>
				</div>
				<span
					>{message.timestamp.toLocaleString(undefined, {
						minute: 'numeric',
						hour: 'numeric',
						day: 'numeric',
						month: 'long'
					})}
				</span>
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
			<button type="submit" class="btn btn-primary">Send</button>
			<button type="button" class="btn btn-error" onclick={() => (timeStampFilter = new Date())}>
				Clear Messages
			</button>
			<button
				class="btn btn-primary btn-outline"
				onclick={async () => {
					timeStampFilter = new Date(2025, 5, 6);
					await resetScroll();
				}}>Show History</button
			>
		</form>
	</div>
</div>

<Title title="Chat"></Title>
