<script lang="ts">
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import Toast from './Toast.svelte';
	import { dismissToast, toasts } from '$lib/stores/toasts';
</script>

<section class="fixed start-2 bottom-2 z-10 flex flex-col gap-4 print:hidden">
	{#each $toasts as toast (toast.id)}
		<div transition:fly={{ duration: 300, y: 200 }} animate:flip={{ duration: 300 }}>
			<Toast type={toast.type} duration={toast.duration} handleClose={() => dismissToast(toast.id)}>
				{toast.text}
			</Toast>
		</div>
	{/each}
</section>
