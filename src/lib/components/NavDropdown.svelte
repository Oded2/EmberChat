<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	interface Props {
		label: string;
		children: Snippet;
	}

	const { label, children }: Props = $props();

	let details: HTMLDetailsElement;
	let summary: HTMLElement;

	onMount(() => {
		const closeDetails = (e: MouseEvent) => {
			if (details.hasAttribute('open') && e.target instanceof Node && !summary.contains(e.target))
				details.removeAttribute('open');
		};
		window.addEventListener('click', closeDetails);
		return () => window.removeEventListener('click', closeDetails);
	});
</script>

<details bind:this={details}>
	<summary bind:this={summary}>{label}</summary>
	<ul class="bg-base-100 rounded-t-none p-2">
		{@render children()}
	</ul>
</details>
