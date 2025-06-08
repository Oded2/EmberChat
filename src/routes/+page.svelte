<script lang="ts">
	import { goto } from '$app/navigation';
	import LabelInput from '$lib/components/LabelInput.svelte';
	import LabelInputButton from '$lib/components/LabelInputButton.svelte';
	import LabelInputForm from '$lib/components/LabelInputForm.svelte';
	import Title from '$lib/components/Title.svelte';
	import { addErrorToast, alphanumericRegex, globalRoomCode } from '$lib/helpers';

	let roomCode = $state('');

	$effect(() => {
		roomCode = roomCode.toLowerCase();
	});

	function goToRoom() {
		roomCode = roomCode.trim();
		if (!roomCode) return;
		else if (!alphanumericRegex.test(roomCode))
			addErrorToast('Room code must only contain lowercase letters and/or numbers without spaces');
		else if (roomCode === globalRoomCode)
			addErrorToast(`Room code "${globalRoomCode}" is reserved for the global chat room`);
		else goto(`/chat/${roomCode}`);
	}
</script>

<div class="flex gap-8">
	<div class="flex grow flex-col gap-4">
		<h1 class="text-6xl font-bold md:text-8xl">Zero complexity, just chat.</h1>
		<p class="text-lg font-light">
			JustChat lets you connect instantly with others in real time. Join the global chat or create
			your own private room &mdash; no hassle, just conversation. Enjoy a smooth, modern interface
			that works seamlessly on any device.
		</p>
		<a href="/chat" class="btn btn-primary btn-lg btn-wide mx-auto mt-2">
			<i class="fa-solid fa-globe"></i> Enter Global Chat
		</a>
		<div class="divider">OR</div>
		<h4 class="text-2xl font-semibold">Enter Chat Room</h4>
		<div class="sm:me-auto sm:min-w-xl">
			<LabelInputForm handleSubmit={goToRoom}>
				<LabelInput bind:value={roomCode} label="Room code"></LabelInput>
				<LabelInputButton large>
					<i class="fa-solid fa-circle-right"></i> Go
				</LabelInputButton>
			</LabelInputForm>
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

<Title title="JustChat"></Title>
