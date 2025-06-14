<script lang="ts">
	interface Props {
		text: string;
		inProgress: boolean;
	}

	const { text, inProgress }: Props = $props();
</script>

{#if inProgress}
	<span class="loading loading-spinner"></span>
{:else}
	{text}
{/if}
