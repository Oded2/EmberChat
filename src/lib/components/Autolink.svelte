<script lang="ts">
	import Autolinker from 'autolinker';
	import { onMount } from 'svelte';

	const { text }: { text?: string } = $props();
	const autoLinker = new Autolinker({
		className: 'link',
		stripPrefix: false,
		sanitizeHtml: true,
		decodePercentEncoding: false
	});

	let isLoaded: boolean = $state(false);

	onMount(() => (isLoaded = true));
</script>

{#if text && isLoaded}
	<span>{@html autoLinker.link(text.replaceAll('&', '&amp;'))}</span>
{/if}
