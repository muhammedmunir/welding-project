<script lang="ts">
	let {
		mapEmbedUrl,
		googleMapsUrl,
		wazeUrl,
		venue,
		address,
		parkingNote = '',
		entranceNote = '',
		distanceNote = '',
		theme = 'fairy'
	}: {
		mapEmbedUrl: string;
		googleMapsUrl: string;
		wazeUrl: string;
		venue: string;
		address: string;
		parkingNote?: string;
		entranceNote?: string;
		distanceNote?: string;
		theme?: 'fairy' | 'malay';
	} = $props();

	const isFairy = $derived(theme === 'fairy');
</script>

<div class="map-wrap">
	{#if mapEmbedUrl}
		<div class="iframe-wrap">
			<iframe
				src={mapEmbedUrl}
				title={`Peta lokasi ${venue}`}
				allowfullscreen
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
				class="map-iframe"
			></iframe>
		</div>
	{:else}
		<div class="map-placeholder" class:fairy={isFairy} class:malay={!isFairy}>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
				<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
			</svg>
			<p class="venue-name">{venue}</p>
			<p class="address">{address}</p>
		</div>
	{/if}

	<div class="info-grid">
		{#if parkingNote}
			<div class="info-item" class:fairy={isFairy} class:malay={!isFairy}>
				<span class="info-icon" aria-hidden="true">P</span>
				<div>
					<strong>Tempat Letak Kereta</strong>
					<p>{parkingNote}</p>
				</div>
			</div>
		{/if}
		{#if entranceNote}
			<div class="info-item" class:fairy={isFairy} class:malay={!isFairy}>
				<span class="info-icon" aria-hidden="true">↗</span>
				<div>
					<strong>Pintu Masuk</strong>
					<p>{entranceNote}</p>
				</div>
			</div>
		{/if}
		{#if distanceNote}
			<div class="info-item" class:fairy={isFairy} class:malay={!isFairy}>
				<span class="info-icon" aria-hidden="true">~</span>
				<div>
					<strong>Jarak & Masa</strong>
					<p>{distanceNote}</p>
				</div>
			</div>
		{/if}
	</div>

	<div class="directions-wrap">
		<a
			href={googleMapsUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="dir-btn google"
			aria-label="Dapatkan arah melalui Google Maps"
		>
			<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
				<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
			</svg>
			Google Maps
		</a>
		<a
			href={wazeUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="dir-btn waze"
			aria-label="Dapatkan arah melalui Waze"
		>
			<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
				<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
				<path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
				<circle cx="9" cy="10" r="1.5" fill="currentColor"/>
				<circle cx="15" cy="10" r="1.5" fill="currentColor"/>
			</svg>
			Waze
		</a>
	</div>
</div>

<style>
	.map-wrap {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.iframe-wrap {
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
	}

	.map-iframe {
		width: 100%;
		height: 300px;
		border: none;
		display: block;
	}

	.map-placeholder {
		border-radius: 16px;
		padding: 2.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		text-align: center;
	}

	.map-placeholder.fairy {
		background: rgba(192, 132, 190, 0.1);
		border: 2px dashed rgba(192, 132, 190, 0.4);
		color: var(--color-fairy-muted);
	}

	.map-placeholder.malay {
		background: rgba(201, 162, 39, 0.1);
		border: 2px dashed rgba(201, 162, 39, 0.4);
		color: var(--color-malay-muted);
	}

	.venue-name {
		font-family: var(--font-playfair);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0;
	}

	.address {
		font-size: 0.875rem;
		margin: 0;
		opacity: 0.8;
	}

	.info-grid {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.info-item {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		padding: 0.75rem 1rem;
		border-radius: 10px;
		font-size: 0.875rem;
	}

	.info-item.fairy {
		background: rgba(192, 132, 190, 0.08);
	}

	.info-item.malay {
		background: rgba(201, 162, 39, 0.08);
	}

	.info-icon {
		font-size: 1rem;
		font-weight: 700;
		min-width: 24px;
		text-align: center;
	}

	.info-item strong {
		display: block;
		font-weight: 600;
		margin-bottom: 2px;
	}

	.info-item p {
		margin: 0;
		opacity: 0.8;
	}

	.directions-wrap {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.dir-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 1.25rem;
		border-radius: 50px;
		font-family: var(--font-lato);
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		transition: transform 0.15s, opacity 0.15s;
	}

	.dir-btn:hover {
		transform: translateY(-2px);
		opacity: 0.85;
	}

	.dir-btn.google {
		background: #4285f4;
		color: #fff;
	}

	.dir-btn.waze {
		background: #33ccff;
		color: #1a1a2e;
	}
</style>
