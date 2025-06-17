<script lang="ts">
	import { authHandlers } from '$lib/firebase/firebase';
	import { addParams } from '$lib/helpers';
	import { user } from '$lib/stores/user';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import NavDropdown from './NavDropdown.svelte';
	import { localeMap, t, updateLocale } from '$lib/stores/localization';

	onMount(() => themeChange(false));

	const locales = Object.entries(localeMap);
</script>

<div class="navbar bg-base-100 sticky top-0 z-10 shadow-sm">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost sm:hidden">
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
			<ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
				{@render Items()}
			</ul>
		</div>
		<a href="/" class="btn btn-ghost btn-lg hover:text-orange-400" aria-label="Home">
			<i class="fa-solid fa-fire-flame-curved"></i>
		</a>
	</div>
	<div class="navbar-center hidden sm:flex">
		<ul class="menu menu-horizontal px-1">
			{@render Items()}
		</ul>
	</div>
	<div class="navbar-end gap-2">
		{#if $user.user}
			<a href="/profile" class="btn btn-primary btn-outline">{$t('profile')}</a>
			<button onclick={authHandlers.signout} class="btn btn-primary">{$t('logout')}</button>
		{:else if !$user.loading}
			<a href={addParams('/auth', { action: 'login' })} class="btn btn-primary btn-outline"
				>{$t('login')}</a
			>
			<a href="/auth" class="btn btn-primary">{$t('sign_up')}</a>
		{/if}
	</div>
</div>

{#snippet Items()}
	<li><a href="/contact">{$t('contact')}</a></li>
	<li><a href="/about">{$t('about')}</a></li>
	<li>
		<NavDropdown label={$t('theme')}>
			<li><button data-set-theme="nav">{$t('theme_nav')}</button></li>
			<li><button data-set-theme="ember">{$t('theme_ember')}</button></li>
			<li><button data-set-theme="winter">{$t('theme_winter')}</button></li>
		</NavDropdown>
	</li>
	<li>
		<NavDropdown label={$t('language')}>
			{#each locales as map}
				<li><button onclick={() => updateLocale(map[0])}>{map[1].label}</button></li>
			{/each}
		</NavDropdown>
	</li>
{/snippet}
