<script lang="ts">
	import LabelInput from '$lib/components/LabelInput.svelte';
	import { db } from '$lib/firebase/firebase';
	import { user } from '$lib/stores/user';
	import {
		addDoc,
		collection,
		onSnapshot,
		orderBy,
		query,
		serverTimestamp
	} from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	let newMessage: string = $state('');
	let messages: Record<string, any>[] = $state([]);

	onMount(() => {
		const q = query(collection(db, 'globalMessages'), orderBy('timestamp'));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		});
		return unsubscribe;
	});

	async function sendMessage() {
		await addDoc(collection(db, 'globalMessages'), {
			text: newMessage,
			senderName: get(user)?.displayName,
			timestamp: serverTimestamp()
		});
		newMessage = '';
	}
</script>

<div class="flex grow flex-col gap-4">
	<div class="flex grow flex-col gap-3">
		{#each messages as message}
			<div class="bg-base-100 relative inline-flex gap-2 rounded-lg p-2 transition-transform">
				<span class="font-medium after:content-[':']">{message.senderName}</span>
				<span>{message.text}</span>
			</div>
		{/each}
	</div>
	<form
		class="flex items-center gap-4"
		onsubmit={(e) => {
			e.preventDefault();
			sendMessage();
		}}
	>
		<LabelInput bind:value={newMessage} label="Enter a message" required></LabelInput>
		<button type="submit" class="btn btn-primary">Send</button>
	</form>
</div>
