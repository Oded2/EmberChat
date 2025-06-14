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
		updateDoc,
		where
	} from 'firebase/firestore';
	import { onMount, tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import { get } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import LabelInputForm from './LabelInputForm.svelte';
	import { getRandomInt, globalRoomCode, sendForm } from '$lib/helpers';
	import Autolink from './Autolink.svelte';
	import LabelTextarea from './LabelTextarea.svelte';
	import { adjectives, nouns } from '$lib/words/words';
	import { showModal } from '$lib/stores/confirm';
	import { addToast } from '$lib/stores/toasts';
	import { t } from '$lib/stores/localization';
	import OptionsButton from './OptionsButton.svelte';

	interface Props {
		chatId: string;
	}

	interface Message {
		id: string;
		chatId: string;
		text?: string;
		senderName?: string;
		timestamp: Date;
		owner?: string;
		edit?: boolean;
	}

	const { chatId }: Props = $props();

	let anonId = $state('');
	let newMessage: string = $state('');
	let allMessages: Message[] = $state([]);
	let editId: string | null = $state(null);
	let inProgressChat = $state(false);
	let inProgressReport = $state(false);

	onMount(() => {
		anonId = getOrGenerateUsername();
		const q = query(
			collection(db, 'messages'),
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
		if (inProgressChat) return;
		newMessage = newMessage.trim();
		if (!newMessage) return;
		inProgressChat = true;
		const currentUser = get(user).user;
		if (editId) {
			const ref = doc(db, 'messages', editId);
			await updateDoc(ref, {
				text: newMessage,
				edit: true
			});
			editId = null;
		} else
			await addDoc(collection(db, 'messages'), {
				text: newMessage,
				senderName: currentUser?.displayName ?? anonId,
				timestamp: serverTimestamp(),
				owner: currentUser?.uid ?? '',
				chatId,
				edit: false
			});
		newMessage = '';
		inProgressChat = false;
	}

	async function deleteMessage(id: string) {
		const docRef = doc(db, 'messages', id);
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

	async function handleReport(m: Message) {
		if (inProgressReport) return;
		inProgressReport = true;
		const ok = await sendForm({
			type: 'Report',
			id: m.id,
			chat_code: m.chatId,
			text: m.text ?? '',
			owner: m.owner || 'Anonymous',
			sender: m.senderName ?? '',
			date: m.timestamp.toLocaleDateString('en-US', {
				minute: 'numeric',
				hour: 'numeric',
				weekday: 'long',
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			})
		});
		inProgressReport = false;
		if (ok) addToast('success', $t('report_success'));
		else addToast('error', $t('report_error'));
	}

	function startEdit(m: Message) {
		editId = m.id;
		newMessage = m.text ?? '';
	}

	function cancelEdit() {
		editId = null;
		newMessage = '';
	}
</script>

<div class="mt-10 flex grow flex-col gap-4">
	<div class="flex grow flex-col gap-4">
		{#each allMessages as message (message.id)}
			<div
				in:fly={{ duration: 200, y: 40 }}
				animate:flip={{ duration: 200 }}
				class="bg-base-100 group flex gap-2 rounded-lg px-4 py-2"
				class:ring={editId === message.id}
			>
				<div class="flex grow flex-col">
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
					<div class="whitespace-pre-wrap">
						<Autolink text={message.text}></Autolink>
						{#if message.edit}
							<span class="text-xs font-light">{`(${$t('edited')})`}</span>
						{/if}
					</div>
				</div>
				<div class="ainvisible flex gap-x-1.5 group-hover:visible">
					<CopyButton text={message.text ?? ''}></CopyButton>
					{#if message.owner === $user.user?.uid}
						<OptionsButton tooltip={$t('edit')} onclick={() => startEdit(message)}
							><i class="fa-solid fa-pen-to-square"></i>
						</OptionsButton>
						<OptionsButton
							tooltip={$t('delete')}
							onclick={() =>
								showModal(
									() => deleteMessage(message.id),
									$t('confirm_message_delete').replace('%TEXT%', message.text ?? '')
								)}
							><i class="fa-solid fa-trash-can"></i>
						</OptionsButton>
					{:else}
						<OptionsButton
							tooltip={$t('report')}
							onclick={() =>
								showModal(
									() => handleReport(message),
									$t('confirm_message_report')
										.replace('%TEXT%', message.text ?? '')
										.replace('%SENDER%', message.senderName ?? '')
								)}
						>
							<i class="fa-solid fa-flag"></i>
						</OptionsButton>
					{/if}
				</div>
			</div>
		{/each}
	</div>
	<div class="bg-base-200 sticky bottom-0 flex flex-col gap-2 py-4">
		<LabelInputForm handleSubmit={sendMessage}>
			<LabelTextarea bind:value={newMessage} label={$t('enter_message')}>
				<div class="flex ps-4">
					{#if !$user.loading && !$user.user}
						<span class="mt-auto text-xs font-light italic">
							{$t('anon_chat').replace('%ANON%', anonId)}
						</span>
					{/if}
					{#if editId}
						<button
							type="button"
							onclick={cancelEdit}
							class="link mt-auto text-xs font-light italic"
						>
							{$t('edit_cancel')}
						</button>
					{/if}
					<button type="submit" class="btn btn-primary btn-circle ms-auto" aria-label={$t('send')}>
						<i class="fa-solid fa-arrow-up"></i>
					</button>
				</div>
			</LabelTextarea>
		</LabelInputForm>
		{#if chatId !== globalRoomCode}
			<span class="text-center text-sm italic">{$t('chat_id').replace('%ID%', chatId)}</span>
		{/if}
	</div>
</div>

<Title
	title={chatId === globalRoomCode ? $t('global_chat') : $t('chat_room').replace('%CODE%', chatId)}
></Title>
