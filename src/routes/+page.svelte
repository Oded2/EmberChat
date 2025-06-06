<script>
	import { user } from '$lib/stores/user';
</script>

<div class="flex flex-col gap-8 lg:flex-row">
	<div class="flex grow flex-col gap-4">
		<h1 class="text-8xl font-bold">Zero complexity, just chat.</h1>
		<p class="text-lg font-light">
			Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt tenetur veritatis cumque
			laboriosam fugiat vitae architecto nobis esse, nisi consectetur ipsam atque minus placeat
			aperiam quis in maiores assumenda omnis?
		</p>
		{#if $user && !$user.emailVerified}
			<span class="text-warning"
				>{`Email unverified: check your inbox at ${$user.email} to verify your email`}
			</span>
		{/if}
		<a href="/chat" class="btn btn-primary btn-wide mx-auto mt-2 md:mx-0">Begin</a>
	</div>
	<img src="/favicon.png" alt="Logo" class="mx-auto max-w-md rounded-2xl shadow-2xl" />
</div>
