<script lang="ts">
	import { onMount } from 'svelte';

	let {
		url,
		label = 'Imbas untuk membuka jemputan',
		size = 180,
		theme = 'fairy'
	}: { url: string; label?: string; size?: number; theme?: 'fairy' | 'malay' } = $props();

	let qrDataUrl = $state('');
	let error = $state(false);

	onMount(async () => {
		try {
			const QRCode = await import('qrcode');
			const primaryColor = theme === 'fairy' ? '#c084be' : '#c9a227';
			qrDataUrl = await QRCode.toDataURL(url, {
				width: size * 2,
				margin: 2,
				color: {
					dark: primaryColor,
					light: '#ffffff'
				}
			});
		} catch (e) {
			console.error('QR code error:', e);
			error = true;
		}
	});

	const isFairy = $derived(theme === 'fairy');
</script>

<div class="qr-wrap" class:fairy={isFairy} class:malay={!isFairy}>
	{#if qrDataUrl}
		<div class="qr-frame">
			<img src={qrDataUrl} alt="QR Code untuk {label}" width={size} height={size} />
		</div>
	{:else if error}
		<div class="qr-placeholder">
			<p>QR tidak dapat dipaparkan</p>
			<a href={url} target="_blank" rel="noopener noreferrer">Buka pautan</a>
		</div>
	{:else}
		<div class="qr-loading" style="width:{size}px;height:{size}px">
			<div class="spinner"></div>
		</div>
	{/if}
	<p class="qr-label">{label}</p>
</div>

<style>
	.qr-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1.5rem;
		border-radius: 20px;
		text-align: center;
	}

	.qr-wrap.fairy {
		background: rgba(192, 132, 190, 0.08);
		border: 2px solid rgba(192, 132, 190, 0.2);
	}

	.qr-wrap.malay {
		background: rgba(201, 162, 39, 0.08);
		border: 2px solid rgba(201, 162, 39, 0.2);
	}

	.qr-frame {
		padding: 0.75rem;
		background: #fff;
		border-radius: 12px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}

	.qr-frame img {
		display: block;
	}

	.qr-label {
		font-family: var(--font-lato);
		font-size: 0.8rem;
		opacity: 0.7;
		margin: 0;
	}

	.qr-placeholder {
		padding: 1rem;
		font-size: 0.875rem;
		opacity: 0.7;
	}

	.qr-placeholder a {
		display: block;
		margin-top: 0.5rem;
		text-decoration: underline;
	}

	.qr-loading {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f5f5f5;
		border-radius: 8px;
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid #ddd;
		border-top-color: #aaa;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
