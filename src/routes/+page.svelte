<script lang="ts">
	import { goto } from '$app/navigation';
	import LabelInput from '$lib/components/LabelInput.svelte';
	import LabelInputForm from '$lib/components/LabelInputForm.svelte';
	import Title from '$lib/components/Title.svelte';
	import { addErrorToast, alphanumericRegex, globalRoomCode } from '$lib/helpers';
	import { addToast } from '$lib/stores/toasts';
	import { user } from '$lib/stores/user';

	let roomCode = $state('');

	function goToRoom() {
		roomCode = roomCode.trim();
		if (!roomCode) return;
		if (!alphanumericRegex.test(roomCode))
			addErrorToast('Room code must only contain letters and/or numbers without spaces');
		else if (roomCode === globalRoomCode)
			addErrorToast(`Room code "${globalRoomCode}" is reserved for the global chat room`);
		else goto(`/chat/${roomCode}`);
	}
</script>

<div class="flex flex-col gap-8 lg:flex-row">
	<div class="flex grow flex-col gap-4">
		<h1 class="text-8xl font-bold">Zero complexity, just chat.</h1>
		<p class="text-lg font-light">
			JustChat is a simple, real-time chat application built with SvelteKit and Firebase. It
			features user authentication, live global messaging, and a clean, responsive UI using Tailwind
			CSS and DaisyUI.
		</p>
		{#if $user && !$user.emailVerified}
			<span class="text-warning"
				>{`Email unverified: check your inbox at ${$user.email} to verify your email`}
			</span>
		{/if}
		<a href="/chat" class="btn btn-primary btn-lg btn-wide mx-auto mt-2">
			<i class="fa-solid fa-globe"></i> Global Chat
		</a>
		<div class="divider">OR</div>
		<h4 class="text-2xl font-semibold">Enter Chat Room</h4>
		<LabelInputForm handleSubmit={goToRoom}>
			<LabelInput bind:value={roomCode} label="Room code" placeholder="Enter room code here"
			></LabelInput>
			<button type="submit" class="btn btn-primary btn-lg min-w-30">
				<i class="fa-solid fa-circle-right"></i> Go
			</button>
		</LabelInputForm>
	</div>
	<div>
		<img
			src="/favicon.png"
			alt="Logo"
			class="mx-auto max-w-md rounded-2xl shadow-2xl transition-transform hover:-translate-y-1"
		/>
	</div>
</div>

<Title title="JustChat"></Title>
