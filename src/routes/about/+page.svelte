<script>
	import { PUBLIC_REPO_URL } from '$env/static/public';
	import AboutCard from '$lib/components/AboutCard.svelte';
	import Title from '$lib/components/Title.svelte';
</script>

<div class="mt-10 flex flex-col gap-20">
	<h1 class="text-center text-3xl font-bold underline underline-offset-5">About JustChat</h1>
	<div class="flex flex-col flex-wrap justify-center gap-4 sm:flex-row">
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
		<AboutCard title="Do I need an account?">
			<span class="after:content-[':']">
				No. An account is not required in order to chat, however there are benefits to creating an
				account
			</span>
			<ul class="list-inside list-disc">
				<li>Custom display name</li>
				<li>Ability to delete messages</li>
			</ul>
		</AboutCard>
		<AboutCard title="Are chats private?">
			<span>No. Every single message is available to everyone using JustChat.</span>
		</AboutCard>
		<AboutCard title="Development">
			<span>
				JustChat is open source and available on <a href={PUBLIC_REPO_URL} class="link">GitHub</a>.
			</span>
			<br />
			<span>Technologies used</span>
			<ul class="list-inside list-disc">
				<li><span>SvelteKit</span>Web framework</li>
				<li><span>TailwindCSS &amp; DaisyUI</span>User interface</li>
				<li><span>Font Awesome</span>Icons</li>
				<li><span>Firebase</span>Database &amp; authentication</li>
			</ul>
		</AboutCard>
	</div>
</div>

<Title title="About"></Title>

<style>
	li > span {
		font-weight: 500;
	}
	li > span:after {
		content: ': ';
	}
</style>
