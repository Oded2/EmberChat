<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		children: Snippet;
	}

	const { label, children }: Props = $props();
	const uniqueId = $props.id();
</script>

<button
	class="btn btn-xs btn-ghost"
	popovertarget={`popover-${uniqueId}`}
	style={`anchor-name:--anchor-${uniqueId}`}
	aria-label={label}
>
	<i class="fa-solid fa-ellipsis"></i>
</button>
<ul
	class="dropdown menu rounded-box bg-base-100 dropdown-end w-52 shadow-2xl"
	popover
	id={`popover-${uniqueId}`}
	style={`position-anchor:--anchor-${uniqueId}`}
>
	{@render children()}
</ul>
