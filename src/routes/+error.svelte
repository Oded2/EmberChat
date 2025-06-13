<script lang="ts">
	import { page } from '$app/state';
	import Title from '$lib/components/Title.svelte';
	import { t } from '$lib/stores/localization';

	const { status, error } = page;
</script>

<div class="mx-auto flex w-full max-w-md grow flex-col justify-center text-center">
	<h1 class="mb-4 text-6xl font-extrabold">{status}</h1>
	<h2 class="mb-2 text-2xl font-semibold">{$t('something_went_wrong')}</h2>
	<p class="text-base-content/30 mb-6">{error?.message ?? $t('unexpected_error')}</p>
	<a href="/" class="btn btn-primary btn-lg">{$t('go_back_home')}</a>
</div>

<Title title={$t('error')}></Title>
