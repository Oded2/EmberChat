<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		children: Snippet;
	}

	const { id, children }: Props = $props();

	let popover: HTMLUListElement;
</script>

<!-- Needs to be used with DropdownButton -->
<ul
	class="dropdown menu rounded-box bg-base-100 dropdown-end w-52 shadow-2xl"
	bind:this={popover}
	popover
	id={`popover-${id}`}
	style={`position-anchor:--anchor-${id}`}
>
	{@render children()}
</ul>
