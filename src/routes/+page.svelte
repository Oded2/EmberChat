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

<div class="flex flex-col gap-8 lg:flex-row">
	<div class="flex grow flex-col gap-4">
		<h1 class="text-6xl font-bold md:text-8xl">Zero complexity, just chat.</h1>
		<p class="text-lg font-light">
			JustChat is a simple, real-time chat application built with SvelteKit and Firebase. It
			features user authentication, live global messaging, and a clean, responsive UI using Tailwind
			CSS and DaisyUI.
		</p>
		<a href="/chat" class="btn btn-primary btn-lg btn-wide mx-auto mt-2">
			<i class="fa-solid fa-globe"></i> Global Chat
		</a>
		<div class="divider">OR</div>
		<h4 class="text-2xl font-semibold">Enter Chat Room</h4>
		<div class="me-auto sm:min-w-xl">
			<LabelInputForm handleSubmit={goToRoom}>
				<LabelInput bind:value={roomCode} label="Room code" placeholder="Enter room code here"
				></LabelInput>
				<LabelInputButton large>
					<i class="fa-solid fa-circle-right"></i> Go
				</LabelInputButton>
			</LabelInputForm>
		</div>
	</div>
	<div>
		<img
			src="/favicon.png"
			alt="Logo"
			class="mx-auto rounded-2xl shadow-2xl transition-transform hover:-translate-y-1 sm:max-w-md"
		/>
	</div>
</div>

<Title title="JustChat"></Title>
