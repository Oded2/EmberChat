<script lang="ts">
	import { authHandlers } from '$lib/firebase/firebase';
	import { addParams } from '$lib/helpers';
	import { user } from '$lib/stores/user';

	const items: { label: string; href: string }[] = [
		{ label: 'Chat', href: '/chat' },
		{ label: 'About', href: '/' }
	];
</script>

<div class="navbar bg-base-100 sticky top-0 z-10 mb-10 shadow-sm">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/>
				</svg>
			</div>
			<!-- Possible problem: add tabindex -->
			<ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
				{#each items as item}
					<li><a href={item.href}>{item.label}</a></li>
				{/each}
			</ul>
		</div>
		<a href="/" class="btn btn-ghost text-xl">JustChat</a>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			{#each items as item}
				<li><a href={item.href}>{item.label}</a></li>
			{/each}
		</ul>
	</div>
	<div class="navbar-end gap-2">
		{#if $user}
			<a href="/profile" class="btn btn-primary btn-outline">Profile</a>
			<button onclick={authHandlers.signout} class="btn btn-primary">Logout</button>
		{:else}
			<a href={addParams('/auth', { action: 'login' })} class="btn btn-primary btn-outline">Login</a
			>
			<a href="/auth" class="btn btn-primary">Sign Up</a>
		{/if}
	</div>
</div>
