<script lang="ts">
	import { goto } from '$app/navigation';
	import LabelInput from '$lib/components/LabelInput.svelte';
	import LabelInputForm from '$lib/components/LabelInputForm.svelte';
	import Title from '$lib/components/Title.svelte';
	import { alphanumericRegex, globalRoomCode } from '$lib/helpers';
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
</script>

<div class="my-10 flex gap-8">
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
				<LabelInput
					bind:value={roomCode}
					label="Room code"
					autocorrect="off"
					autocapitalize="off"
					spellcheck={false}
				></LabelInput>
				<button type="submit" class="btn btn-primary btn-lg w-full sm:w-auto">
					<i class="fa-solid fa-circle-right"></i> Go
				</button>
			</LabelInputForm>
		</div>
		<span class="text-sm font-light italic before:me-0.5 before:content-['*']">
			Room code must include only lowercase letters and/or numbers, without spaces or symbols.
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

<Title title="JustChat"></Title>
