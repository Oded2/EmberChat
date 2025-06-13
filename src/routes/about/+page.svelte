<script>
	import { PUBLIC_REPO_URL } from '$env/static/public';
	import AboutCard from '$lib/components/AboutCard.svelte';
	import Title from '$lib/components/Title.svelte';
	import { t } from '$lib/stores/localization';
</script>

<div class="my-10 flex flex-col gap-20">
	<h1 class="text-center text-3xl font-bold underline underline-offset-5">
		{$t('about_emberchat')}
	</h1>
	<div class="flex flex-wrap justify-center gap-4">
		<AboutCard title={$t('mission')}>
			<span>{$t('about_mission')}</span>
		</AboutCard>
		<AboutCard title={$t('how_it_works')}>
			<span>{$t('about_how_it_works')}</span>
		</AboutCard>
		<AboutCard title={$t('usage')}>
			<span class="after:content-[':']">
				{$t('about_usage_label')}
			</span>

			<ul class="list-inside list-disc">
				<li>
					<span>{$t('about_usage_global_chat')}</span>{$t('about_usage_global_chat_description')}
				</li>
				<li>
					<span>{$t('about_usage_chat_room')}</span>{$t('about_usage_chat_room_description')}
				</li>
			</ul>
		</AboutCard>
		<AboutCard title={$t('need_account')}>
			<span class="after:content-[':']">
				{$t('about_need_account_label')}
			</span>
			<ul class="list-inside list-disc">
				<li>{$t('about_need_account_1')}</li>
				<li>{$t('about_need_account_2')}</li>
			</ul>
		</AboutCard>
		<AboutCard title={$t('chats_private')}>
			<span>{$t('about_chats_private')}</span>
		</AboutCard>
		<AboutCard title={$t('development')}>
			<span class="after:content-[':']">
				{@html $t('about_development_label').replace('%REPO_URL%', PUBLIC_REPO_URL)}
			</span>
			<ul class="list-inside list-disc">
				<li>
					<span>{$t('about_development_sveltekit')}</span>{$t(
						'about_development_sveltekit_description'
					)}
				</li>
				<li>
					<span>{$t('about_development_ui')}</span>{$t('about_development_ui_description')}
				</li>
				<li>
					<span>{$t('about_development_font_awesome')}</span>{$t(
						'about_development_font_awesome_description'
					)}
				</li>
				<li>
					<span>{$t('about_development_firebase')}</span>{$t(
						'about_development_firebase_description'
					)}
				</li>
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
