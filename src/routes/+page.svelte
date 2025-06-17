<script lang="ts">
	import { goto } from '$app/navigation';
	import Container from '$lib/components/Container.svelte';
	import DynamicSpinner from '$lib/components/DynamicSpinner.svelte';
	import LabelInput from '$lib/components/LabelInput.svelte';
	import Title from '$lib/components/Title.svelte';
	import { alphanumericRegex, getRandomInt, globalRoomCode } from '$lib/helpers';
	import { t } from '$lib/stores/localization';
	import { addToast } from '$lib/stores/toasts';

	let roomCode = $state('');
	let inProgress = $state(false);

	$effect(() => {
		roomCode = roomCode.trim().toLowerCase();
	});

	function goToRoom() {
		if (inProgress) return;
		roomCode = roomCode.trim();
		if (!roomCode) return;
		if (!alphanumericRegex.test(roomCode)) addToast('error', $t('no_symbols'));
		else if (roomCode === globalRoomCode)
			addToast('error', $t('reserved_global').replace('%GLOBAL%', globalRoomCode));
		else {
			inProgress = true;
			goto(`/chat/${roomCode}`);
		}
	}

	function generateRoomCode() {
		const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < 4; i++) result += chars[getRandomInt(0, chars.length - 1)];
		roomCode = result;
	}
</script>

<Container>
	<div class="my-10 flex gap-8">
		<div class="flex grow flex-col gap-4">
			<h1 class="text-6xl font-bold md:text-8xl">{$t('heading')}</h1>
			<p class="text-lg font-light">{$t('description')}</p>
			<div class="me-auto flex flex-col gap-2">
				<a href="/chat" class="btn btn-primary btn-lg mx-auto mt-2 px-8">
					<i class="fa-solid fa-globe"></i>
					{$t('enter_global')}
				</a>
				<div class="divider"><span class="font-medium">{$t('or')}</span></div>
				<h4 class="mb-2 text-2xl font-semibold">{$t('enter_chat_room')}</h4>
				<form
					class="flex flex-wrap gap-2"
					onsubmit={(e) => {
						e.preventDefault();
						goToRoom();
					}}
				>
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
						class="btn btn-primary btn-outline btn-lg sm:w-16"
						aria-label="Random"
					>
						<i class="fa-solid fa-dice"></i>
					</button>
					<button type="submit" class="btn btn-primary btn-lg w-full sm:w-16">
						<DynamicSpinner {inProgress}>{$t('go')}</DynamicSpinner>
					</button>
				</form>
				<span class="text-sm font-light italic before:me-0.5 before:content-['*']">
					{$t('room_code_pattern')}
				</span>
			</div>
		</div>
		<div class="hidden lg:inline-block">
			<img
				src="/favicon.png"
				alt="Logo"
				class="rounded-2xl shadow-2xl transition-transform hover:-translate-y-1 sm:max-w-md"
			/>
		</div>
	</div>
</Container>

<Title title={$t('home')}></Title>
