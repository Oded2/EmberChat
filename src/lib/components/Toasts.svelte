<script lang="ts">
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import Toast from './Toast.svelte';
	import { dismissToast, toasts } from '$lib/stores/toasts';
</script>

<section class="fixed bottom-2 left-2 flex flex-col gap-4 print:hidden">
	{#each $toasts as toast (toast.id)}
		<div transition:fly={{ duration: 300, y: 200 }} animate:flip={{ duration: 200 }}>
			<Toast type={toast.type} duration={toast.duration} handleClose={() => dismissToast(toast.id)}>
				{toast.text}
			</Toast>
		</div>
	{/each}
</section>
