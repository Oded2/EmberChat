<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import ProfileTab from '$lib/components/ProfileTab.svelte';
	import ProfileSettings from '$lib/components/ProfileSettings.svelte';
	import ProfileStats from '$lib/components/ProfileStats.svelte';
	import Title from '$lib/components/Title.svelte';
	import { t } from '$lib/stores/localization';
	import { user } from '$lib/stores/user';

	let tab = $state(0);
</script>

{#if $user.user}
	{@const userData = $user.user}
	<Container>
		<h1 class="my-10 text-center text-3xl font-bold">
			{$t('personal_greeting').replace('%NAME%', userData.displayName ?? '')}
		</h1>
		<div class="tabs tabs-box mx-auto mb-2">
			<ProfileTab label={$t('settings')} checked onchange={() => (tab = 0)}></ProfileTab>
			<ProfileTab label={$t('stats')} onchange={() => (tab = 1)}></ProfileTab>
		</div>
		{#if tab == 0}
			<ProfileSettings {userData}></ProfileSettings>
		{:else if tab == 1}
			<ProfileStats {userData}></ProfileStats>
		{/if}
	</Container>
{/if}
<Title title={$t('profile')}></Title>
