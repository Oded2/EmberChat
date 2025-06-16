<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import ProfileTab from '$lib/components/ProfileTab.svelte';
	import ProfileSettings from '$lib/components/ProfileSettings.svelte';
	import ProfileStats from '$lib/components/ProfileStats.svelte';
	import Title from '$lib/components/Title.svelte';
	import { t } from '$lib/stores/localization';
	import { user } from '$lib/stores/user';

	let tab = $state(0);
	// In order to only fetch all of the user's messages when necessary
	let showStats = $state(false);
</script>

{#if $user.user}
	{@const userData = $user.user}
	<div class="my-10">
		<Container>
			<h1 class="mb-10 text-center text-3xl font-bold">
				{$t('personal_greeting').replace('%NAME%', userData.displayName ?? '')}
			</h1>
			<div class="mx-auto mb-2 flex w-52 gap-2">
				<ProfileTab label={$t('settings')} checked={tab == 0} onchange={() => (tab = 0)}
				></ProfileTab>
				<ProfileTab
					label={$t('stats')}
					checked={tab == 1}
					onchange={() => {
						showStats = true;
						tab = 1;
					}}
				></ProfileTab>
			</div>
			<ProfileSettings show={tab == 0} {userData}></ProfileSettings>
			{#if showStats}
				<ProfileStats show={tab == 1} {userData}></ProfileStats>
			{/if}
		</Container>
	</div>
{/if}
<Title title={$t('profile')}></Title>
