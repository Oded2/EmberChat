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
	import { fly } from 'svelte/transition';
	import {
		formatDate,
		getRandomInt,
		globalRoomCode,
		handleMessages,
		sendForm,
		type Message
	} from '$lib/helpers';
	import Autolink from './Autolink.svelte';
	import LabelTextarea from './LabelTextarea.svelte';
	import { adjectives, nouns } from '$lib/words/words';
	import { showModal } from '$lib/stores/confirm';
	import { addToast } from '$lib/stores/toasts';
	import { t } from '$lib/stores/localization';
	import OptionsButton from './OptionsButton.svelte';
	import Container from './Container.svelte';
	import DynamicSpinner from './DynamicSpinner.svelte';

	interface Props {
		chatId: string;
	}

	const { chatId }: Props = $props();

	const maxlength = 5000;

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
			allMessages = handleMessages(snapshot);
			await resetScroll();
		});
		return unsubscribe;
	});

	async function sendMessage() {
		if (inProgressChat) return;
		newMessage = newMessage.trim();
		if (!newMessage) return;
		if (newMessage.length > maxlength) {
			addToast('error', $t('exceed_max_length').replace('%MAX%', maxlength.toLocaleString()));
			return;
		}
		inProgressChat = true;
		const currentUser = $user.user;
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
			date: m.timestamp.toDate().toLocaleDateString('en-US', {
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
	<Container>
		<div class="flex grow flex-col gap-4">
			{#each allMessages as message (message.id)}
				<div
					in:fly={{ duration: 200, y: 40 }}
					animate:flip={{ duration: 200 }}
					class="bg-base-100 group flex flex-col rounded-lg px-4 py-2"
					class:ring={editId === message.id}
				>
					<div class="flex items-baseline gap-x-1.5">
						<span class="font-semibold">{message.senderName}</span>
						<span class="text-xs font-light">
							{formatDate(message.timestamp.toDate())}
						</span>
						<div
							class="ms-auto flex gap-x-1.5 opacity-0 transition-opacity duration-1 group-hover:opacity-100 pointer-coarse:opacity-100"
						>
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
											$t('confirm_message_delete'),
											`"${message.text}"`,
											$t('delete')
										)}
									><i class="fa-solid fa-trash-can"></i>
								</OptionsButton>
							{:else}
								<OptionsButton
									tooltip={$t('report')}
									onclick={() =>
										showModal(
											() => handleReport(message),
											$t('confirm_message_report'),
											`"${message.text}"`,
											$t('report')
										)}
								>
									<i class="fa-solid fa-flag"></i>
								</OptionsButton>
							{/if}
						</div>
					</div>
					<div class="whitespace-pre-wrap" dir="auto">
						<Autolink text={message.text}></Autolink>
						{#if message.edit}
							<span class="text-xs font-light">{`(${$t('edited')})`}</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</Container>
	<div class="bg-base-200 sticky bottom-0 py-4">
		<Container>
			<form
				onsubmit={(e) => {
					e.preventDefault();
					sendMessage();
				}}
				class="mx-auto flex w-full max-w-4xl flex-col items-center gap-1.5"
			>
				<LabelTextarea bind:value={newMessage} label={$t('enter_message')}>
					<div class="flex items-end gap-2 ps-4">
						{#if !$user.loading && !$user.user}
							<span class="text-xs font-light italic">
								{$t('anon_chat').replace('%ANON%', anonId)}
							</span>
						{/if}
						{#if editId}
							<button type="button" onclick={cancelEdit} class="link text-xs font-light italic">
								{$t('edit_cancel')}
							</button>
						{/if}
						{#if newMessage.length > maxlength / 2}
							<div
								class="text-xs font-light italic"
								class:text-error={newMessage.length > maxlength}
							>
								<span class="hidden rtl:inline-block">
									{`${maxlength.toLocaleString()}/${newMessage.length.toLocaleString()}`}
								</span>
								<span class="hidden ltr:inline-block">
									{`${newMessage.length.toLocaleString()}/${maxlength.toLocaleString()}`}
								</span>
							</div>
						{/if}
						<button
							type="submit"
							class="btn btn-primary btn-circle ms-auto"
							aria-label={$t('send')}
						>
							<DynamicSpinner inProgress={inProgressChat}>
								<i class="fa-solid fa-arrow-up"></i>
							</DynamicSpinner>
						</button>
					</div>
				</LabelTextarea>
				{#if chatId !== globalRoomCode}
					<span class="text-center text-sm italic">{$t('chat_id').replace('%ID%', chatId)}</span>
				{/if}
			</form>
		</Container>
	</div>
</div>

<Title
	title={chatId === globalRoomCode ? $t('global_chat') : $t('chat_room').replace('%CODE%', chatId)}
></Title>
