<script lang="ts">
	import { wedding } from '$lib/data/wedding';

	// Placeholder photos - replace with actual photos
	const photos: { src: string; alt: string; caption?: string }[] = [
		// Add your photos here, e.g.:
		// { src: '/photos/engagement-1.jpg', alt: 'Majlis pertunangan', caption: 'Majlis Pertunangan' },
	];

	let lightboxOpen = $state(false);
	let activeIndex = $state(0);

	function openLightbox(i: number) {
		activeIndex = i;
		lightboxOpen = true;
	}

	function closeLightbox() {
		lightboxOpen = false;
	}

	function prev() {
		activeIndex = (activeIndex - 1 + photos.length) % photos.length;
	}

	function next() {
		activeIndex = (activeIndex + 1) % photos.length;
	}

	function handleKey(e: KeyboardEvent) {
		if (!lightboxOpen) return;
		if (e.key === 'Escape') closeLightbox();
		if (e.key === 'ArrowLeft') prev();
		if (e.key === 'ArrowRight') next();
	}

	let touchStartX = 0;
	let touchStartY = 0;
	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
	}
	function handleTouchEnd(e: TouchEvent) {
		const dx = e.changedTouches[0].clientX - touchStartX;
		const dy = e.changedTouches[0].clientY - touchStartY;
		if (Math.abs(dx) < Math.abs(dy) * 1.5) return; // vertical scroll, ignore
		if (dx > 50) prev();
		else if (dx < -50) next();
	}
</script>

<svelte:head>
	<title>Galeri Foto - {wedding.bride.name} & {wedding.groom.name}</title>
</svelte:head>

<svelte:window onkeydown={handleKey} />

<!-- Lightbox -->
{#if lightboxOpen && photos.length > 0}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="lightbox-overlay"
		onclick={(e) => e.target === e.currentTarget && closeLightbox()}
		ontouchstart={handleTouchStart}
		ontouchend={handleTouchEnd}
		role="dialog"
		aria-modal="true"
		aria-label="Paparan foto"
		tabindex="-1"
	>
		<button class="lb-close" onclick={closeLightbox} aria-label="Tutup">✕</button>
		<button class="lb-nav lb-prev" onclick={prev} aria-label="Foto sebelumnya">‹</button>

		<div class="lb-content">
			<img
				src={photos[activeIndex].src}
				alt={photos[activeIndex].alt}
				class="lb-img"
				loading="lazy"
			/>
			{#if photos[activeIndex].caption}
				<p class="lb-caption">{photos[activeIndex].caption}</p>
			{/if}
			<p class="lb-counter">{activeIndex + 1} / {photos.length}</p>
		</div>

		<button class="lb-nav lb-next" onclick={next} aria-label="Foto seterusnya">›</button>
	</div>
{/if}

<main id="main-content" class="gallery-page">
	<a href="/" class="back-btn" aria-label="Kembali">← Kembali</a>

	<header class="gallery-header">
		<p class="bismillah" lang="ar">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
		<h1>Galeri Foto</h1>
		<p class="subtitle">{wedding.bride.nameDisplay} &amp; {wedding.groom.nameDisplay}</p>
		<p class="hashtag">{wedding.hashtag}</p>
	</header>

	{#if photos.length === 0}
		<div class="empty-gallery">
			<div class="empty-icon" aria-hidden="true">📷</div>
			<h2>Galeri Akan Datang</h2>
			<p>Foto-foto majlis akan dimuat naik selepas majlis berlangsung.</p>
			<p>Nantikan gambar-gambar indah hari bahagia kami!</p>
			<div class="event-links">
				<a href="/zulfatul-syarah" class="event-link fairy-link">Jemputan Perempuan 🌸</a>
				<a href="/muhammed-munir" class="event-link malay-link">Jemputan Lelaki 🕌</a>
			</div>
		</div>
	{:else}
		<div class="photo-grid">
			{#each photos as photo, i}
				<button
					class="photo-item"
					onclick={() => openLightbox(i)}
					aria-label="Buka foto: {photo.alt}"
				>
					<img
						src={photo.src}
						alt={photo.alt}
						loading="lazy"
						decoding="async"
						class="photo-img"
					/>
					{#if photo.caption}
						<div class="photo-caption">{photo.caption}</div>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</main>

<style>
	.gallery-page {
		min-height: 100vh;
		background: linear-gradient(180deg, #eef4fb 0%, #f9f0ff 100%);
		padding: 1.5rem 1rem 3rem;
	}

	.back-btn {
		display: inline-block;
		font-family: var(--font-lato);
		font-size: 0.85rem;
		color: rgba(74, 48, 96, 0.7);
		text-decoration: none;
		background: rgba(255, 255, 255, 0.7);
		padding: 6px 14px;
		border-radius: 20px;
		margin-bottom: 1.5rem;
	}

	.gallery-header {
		text-align: center;
		margin-bottom: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
	}

	.bismillah {
		font-family: var(--font-amiri);
		font-size: 1.75rem;
		color: #4a3060;
		direction: rtl;
		margin: 0;
	}

	.gallery-header h1 {
		font-family: var(--font-playfair);
		font-size: clamp(1.5rem, 4vw, 2rem);
		color: var(--color-fairy-primary);
		margin: 0;
	}

	.subtitle {
		font-family: var(--font-playfair);
		font-size: 0.95rem;
		color: var(--color-fairy-text);
		margin: 0;
	}

	.hashtag {
		font-family: var(--font-lato);
		font-size: 0.8rem;
		color: var(--color-fairy-muted);
		margin: 0;
	}

	/* Photo grid */
	.photo-grid {
		max-width: 1000px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 1rem;
	}

	.photo-item {
		position: relative;
		overflow: hidden;
		border-radius: 14px;
		cursor: pointer;
		border: none;
		padding: 0;
		background: none;
		aspect-ratio: 3/4;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.photo-item:hover {
		transform: scale(1.02);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
	}

	.photo-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.photo-caption {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, rgba(0,0,0,0.6));
		color: #fff;
		padding: 1.5rem 0.75rem 0.75rem;
		font-family: var(--font-lato);
		font-size: 0.8rem;
		text-align: center;
	}

	/* Empty state */
	.empty-gallery {
		text-align: center;
		max-width: 420px;
		margin: 3rem auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.empty-icon { font-size: 4rem; }

	.empty-gallery h2 {
		font-family: var(--font-playfair);
		color: var(--color-fairy-text);
		font-size: 1.5rem;
		margin: 0;
	}

	.empty-gallery p {
		color: var(--color-fairy-muted);
		font-size: 0.9rem;
		line-height: 1.6;
		margin: 0;
	}

	.event-links {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 0.5rem;
	}

	.event-link {
		padding: 0.6rem 1.25rem;
		border-radius: 50px;
		font-family: var(--font-lato);
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		transition: opacity 0.15s;
	}

	.event-link:hover { opacity: 0.8; }
	.fairy-link { background: linear-gradient(135deg, #c084be, #7eb8d6); color: #fff; }
	.malay-link { background: linear-gradient(135deg, #e8c84a, #c9a227); color: #3d2b00; }

	/* Lightbox */
	.lightbox-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.92);
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.lb-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		max-width: 90vw;
		max-height: 90vh;
	}

	.lb-img {
		max-width: 80vw;
		max-height: 75vh;
		object-fit: contain;
		border-radius: 8px;
	}

	.lb-caption {
		color: #fff;
		font-family: var(--font-lato);
		font-size: 0.9rem;
		margin: 0;
		text-align: center;
	}

	.lb-counter {
		color: rgba(255,255,255,0.5);
		font-size: 0.75rem;
		margin: 0;
	}

	.lb-close {
		position: fixed;
		top: 1rem;
		right: 1rem;
		background: rgba(255,255,255,0.15);
		border: none;
		color: #fff;
		font-size: 1.25rem;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.lb-nav {
		position: fixed;
		top: 50%;
		transform: translateY(-50%);
		background: rgba(255,255,255,0.15);
		border: none;
		color: #fff;
		font-size: 2rem;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.lb-prev { left: 1rem; }
	.lb-next { right: 1rem; }
	.lb-nav:hover { background: rgba(255,255,255,0.3); }
</style>
