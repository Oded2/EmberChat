<script>
	import AboutCard from '$lib/components/AboutCard.svelte';
</script>

<div class="mt-10 flex flex-col gap-20">
	<h1 class="text-center text-3xl font-bold underline underline-offset-5">About JustChat</h1>
	<div class="flex flex-col justify-center gap-4 sm:flex-row">
		<AboutCard title="Mission">
			<span>Create a simple, minimalistic way to chat within a group of people. </span>
		</AboutCard>
		<AboutCard title="How it works">
			<span>Simply enter the global chat room or enter a room code.</span>
		</AboutCard>
		<AboutCard title="Usage">
			<span class="after:content-[':']">
				There are two different kinds of ways to start chatting
			</span>

			<ul class="list-inside list-disc">
				<li><span>Global chat</span>Global and main chat room.</li>
				<li>
					<span>Chat room</span>Unique chat room that sends and displays message created in that
					chat room.
				</li>
			</ul>
		</AboutCard>
	</div>
</div>

<style>
	li > span {
		font-weight: 500;
	}
	li > span:after {
		content: ': ';
	}
</style>
