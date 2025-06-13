<script lang="ts">
	import { t } from '$lib/stores/localization';
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
	aria-label={$t('dropdown')}
>
	{@render children()}
</button>
