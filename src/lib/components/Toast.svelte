<script lang="ts">
	import type { ToastType } from '$lib/stores/toasts';
	import { type Snippet } from 'svelte';

	interface Props {
		type: ToastType;
		duration: number;
		handleClose?: () => any;
		children: Snippet;
	}

	const { type, duration, handleClose, children }: Props = $props();

	let progress = $state(100);
	showProgress();

	function showProgress(): void {
		if (duration <= 0) return;
		const start = Date.now();
		const interval = setInterval(() => {
			const elapsed = Date.now() - start;
			progress = Math.max(100 - (elapsed * 100) / duration, 0);
		}, 10);
		setTimeout(() => {
			clearInterval(interval);
		}, duration);
	}
</script>

<div
	role="alert"
	class="alert flex w-112 max-w-[90vw] flex-col items-stretch text-base"
	class:alert-success={type === 'success'}
	class:alert-info={type === 'info'}
>
	<div class="flex items-baseline gap-2">
		{#if type === 'success'}
			<i class="fa-solid fa-check-circle"></i>
		{:else if type === 'info'}
			<i class="fa-solid fa-info-circle"></i>
		{:else if type === 'error'}
			<i class="fa-solid fa-exclamation-circle"></i>
		{/if}
		<span>
			{@render children()}
		</span>
		<button
			class="btn btn-ghost btn-sm btn-circle ms-auto"
			aria-label="Close"
			onclick={handleClose}
		>
			<i class="fa-solid fa-xmark"></i>
		</button>
	</div>
	{#if duration > 0}
		<progress value={progress} max="100" class="progress"></progress>
	{/if}
</div>
