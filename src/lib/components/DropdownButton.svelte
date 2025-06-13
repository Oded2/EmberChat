<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		className?: string;
		children: Snippet;
	}

	const { id, className, children }: Props = $props();
</script>

<!-- Opens a Dropdown component -->
<button
	class={className}
	popovertarget={`popover-${id}`}
	style={`anchor-name:--anchor-${id}`}
	aria-label="Dropdown"
>
	{@render children()}
</button>
