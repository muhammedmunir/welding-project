<script lang="ts">
	import { onMount } from 'svelte';

	let {
		formUrl,
		open = $bindable(false),
		theme = 'fairy'
	}: { formUrl: string; open: boolean; theme?: 'fairy' | 'malay' } = $props();

	let isMobile = $state(false);
	let iframeEl: HTMLIFrameElement | undefined = $state();

	onMount(() => {
		isMobile = window.matchMedia('(max-width: 640px)').matches;
	});

	function close() {
		open = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}

	$effect(() => {
		if (open && isMobile) {
			window.open(formUrl, '_blank', 'noopener,noreferrer');
			open = false;
		}
	});

	$effect(() => {
		if (open && iframeEl) {
			setTimeout(() => iframeEl?.focus(), 100);
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open && !isMobile}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="overlay"
		onclick={(e) => e.target === e.currentTarget && close()}
		role="dialog"
		aria-modal="true"
		aria-label="Borang RSVP"
		tabindex="-1"
	>
		<div class="modal" class:fairy={theme === 'fairy'} class:malay={theme === 'malay'}>
			<div class="modal-header">
				<h2 class="modal-title">Pengesahan Kehadiran (RSVP)</h2>
				<button onclick={close} class="close-btn" aria-label="Tutup modal">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>
			<iframe
				bind:this={iframeEl}
				src={formUrl}
				title="Borang RSVP"
				class="form-iframe"
				frameborder="0"
				marginheight="0"
				marginwidth="0"
			>
				Sedang memuatkan...
			</iframe>
			<p class="mobile-hint">
				Masalah dengan borang?
				<a href={formUrl} target="_blank" rel="noopener noreferrer">Buka dalam tab baru</a>
			</p>
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		backdrop-filter: blur(4px);
	}

	.modal {
		background: #fff;
		border-radius: 16px;
		width: 100%;
		max-width: 640px;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid #eee;
	}

	.modal-title {
		font-family: var(--font-playfair);
		font-size: 1.125rem;
		margin: 0;
	}

	.fairy .modal-title {
		color: var(--color-fairy-text);
	}

	.malay .modal-title {
		color: var(--color-malay-text);
	}

	.close-btn {
		background: none;
		border: none;
		cursor: pointer;
		color: #666;
		padding: 4px;
		border-radius: 6px;
		display: flex;
		align-items: center;
	}

	.close-btn:hover {
		background: #f0f0f0;
	}

	.form-iframe {
		flex: 1;
		width: 100%;
		min-height: 480px;
		border: none;
	}

	.mobile-hint {
		padding: 0.5rem 1rem;
		font-size: 0.75rem;
		color: #888;
		text-align: center;
		margin: 0;
	}

	.mobile-hint a {
		color: inherit;
		text-decoration: underline;
	}
</style>
