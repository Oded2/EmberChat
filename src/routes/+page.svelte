<script lang="ts">
	import { goto } from '$app/navigation';
	import LabelInput from '$lib/components/LabelInput.svelte';
	import LabelInputForm from '$lib/components/LabelInputForm.svelte';
	import Title from '$lib/components/Title.svelte';
	import { alphanumericRegex, getRandomInt, globalRoomCode } from '$lib/helpers';
	import { t } from '$lib/stores/localization';
	import { addToast } from '$lib/stores/toasts';

	let roomCode = $state('');

	$effect(() => {
		roomCode = roomCode.trim().toLowerCase();
	});

	function goToRoom() {
		roomCode = roomCode.trim();
		if (!roomCode) return;
		else if (!alphanumericRegex.test(roomCode))
			addToast('error', 'Room code cannot contain symbols');
		else if (roomCode === globalRoomCode)
			addToast('error', `Room code "${globalRoomCode}" is reserved for the global chat room`);
		else goto(`/chat/${roomCode}`);
	}

	function generateRoomCode() {
		const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < 4; i++) result += chars[getRandomInt(0, chars.length - 1)];
		roomCode = result;
	}
</script>

<div class="my-10 flex gap-8">
	<div class="flex grow flex-col gap-4">
		<h1 class="text-6xl font-bold md:text-8xl">{$t('heading')}</h1>
		<p class="text-lg font-light">{$t('description')}</p>
		<a href="/chat" class="btn btn-primary btn-lg btn-wide mx-auto mt-2">
			<i class="fa-solid fa-globe"></i>
			{$t('enter_global')}
		</a>
		<div class="divider">OR</div>
		<h4 class="text-2xl font-semibold">{$t('enter_chat_room')}</h4>
		<div class="sm:me-auto sm:min-w-xl">
			<LabelInputForm handleSubmit={goToRoom}>
				<LabelInput
					bind:value={roomCode}
					label={$t('room_code')}
					autocorrect="off"
					autocapitalize="off"
					spellcheck={false}
				></LabelInput>
				<button
					type="button"
					onclick={generateRoomCode}
					class="btn btn-primary btn-outline btn-lg"
					aria-label="Random"
				>
					<i class="fa-solid fa-dice"></i>
				</button>
				<button type="submit" class="btn btn-primary btn-lg w-full sm:w-auto">{$t('go')}</button>
			</LabelInputForm>
		</div>
		<span class="text-sm font-light italic before:me-0.5 before:content-['*']">
			{$t('room_code_pattern')}
		</span>
	</div>
	<div class="hidden lg:inline-block">
		<img
			src="/favicon.png"
			alt="Logo"
			class="rounded-2xl shadow-2xl transition-transform hover:-translate-y-1 sm:max-w-md"
		/>
	</div>
</div>

<Title title="Home"></Title>
