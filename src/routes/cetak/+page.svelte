<script lang="ts">
	import { page } from '$app/stores';
	import { wedding } from '$lib/data/wedding';

	const event = $derived($page.url.searchParams.get('event') || 'perempuan');
	const ev = $derived(event === 'lelaki' ? wedding.events.lelaki : wedding.events.perempuan);
	const isFairy = $derived(event !== 'lelaki');

	function printPage() {
		window.print();
	}
</script>

<svelte:head>
	<title>Cetak Jemputan - {wedding.bride.name} & {wedding.groom.name}</title>
</svelte:head>

<div class="print-controls no-print">
	<a href="/{event}" class="back-link">← Kembali</a>
	<button onclick={printPage} class="print-btn">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" aria-hidden="true">
			<polyline points="6 9 6 2 18 2 18 9"></polyline>
			<path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"></path>
			<rect x="6" y="14" width="12" height="8"></rect>
		</svg>
		Cetak / Simpan PDF
	</button>
	<div class="event-toggle">
		<a href="/cetak?event=perempuan" class="toggle-btn" class:active={event === 'perempuan'}>Perempuan</a>
		<a href="/cetak?event=lelaki" class="toggle-btn" class:active={event === 'lelaki'}>Lelaki</a>
	</div>
</div>

<main id="main-content" class="printable-card" class:fairy-print={isFairy} class:malay-print={!isFairy}>
	<!-- Top border decoration -->
	<div class="top-border" aria-hidden="true"></div>

	<!-- Bismillah -->
	<p class="bismillah" lang="ar">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>

	<!-- Header text -->
	<div class="invite-header">
		<p class="with-honor">Dengan penuh kesyukuran ke hadrat Ilahi</p>
		{#if isFairy}
			<p class="parent-invite">bersama sejambak mawar setapak sirih kami hulurkan untuk mengundang</p>
			<p class="invite-addr">Tuan/Puan &amp; seisi keluarga ke {ev.type}</p>
			<p class="putri">putri kami</p>
		{:else}
			<p class="parent-invite">"Sejambak bunga kami hulurkan, semekar senyuman seikhlas hati."</p>
			<p class="invite-addr">kami menjemput Tuan/Puan/Encik/Cik ke {ev.type}</p>
			<p class="putri">putera kami</p>
		{/if}
	</div>

	<!-- Couple names -->
	<div class="couple-section">
		{#if isFairy}
			<p class="main-name bride">{wedding.bride.nameDisplay}</p>
			<p class="dengan-text">Dengan Pasangannya</p>
			<p class="main-name groom">{wedding.groom.nameDisplay}</p>
		{:else}
			<p class="main-name groom">{wedding.groom.nameDisplay}</p>
			<p class="dengan-text">dengan pilihan hatinya</p>
			<p class="main-name bride">{wedding.bride.nameDisplay}</p>
		{/if}
	</div>

	<!-- Divider -->
	<div class="divider" aria-hidden="true">
		<span>✦</span><span>✦</span><span>✦</span>
	</div>

	<!-- Event details -->
	<div class="details-section">
		<div class="detail-row">
			<span class="detail-label">Tarikh</span>
			<span class="detail-value">{ev.dateDisplay} ({ev.dayDisplay})</span>
		</div>
		<div class="detail-row">
			<span class="detail-label">Tahun Hijri</span>
			<span class="detail-value">{ev.hijriDisplay}</span>
		</div>
		<div class="detail-row">
			<span class="detail-label">Tempat</span>
			<span class="detail-value">{ev.venue}</span>
		</div>
		<div class="detail-row">
			<span class="detail-label">Alamat</span>
			<span class="detail-value">{ev.address}</span>
		</div>
		<div class="detail-row">
			<span class="detail-label">Jamuan</span>
			<span class="detail-value">{ev.time.jamuan.display}</span>
		</div>
		<div class="detail-row">
			<span class="detail-label">Ketibaan Pengantin</span>
			<span class="detail-value">{ev.time.ketibaan.display}</span>
		</div>
	</div>

	<!-- Divider -->
	<div class="divider" aria-hidden="true">
		<span>✦</span><span>✦</span><span>✦</span>
	</div>

	<!-- Contacts -->
	<div class="contacts-section">
		<p class="contacts-heading">Untuk Dihubungi:</p>
		<div class="contacts-list">
			{#each ev.contacts as c}
				<span class="contact-item">{c.phone} [{c.name}]</span>
			{/each}
		</div>
	</div>

	<!-- Closing dua -->
	<div class="closing-dua">
		<p>Semoga kehadiran para hadirin dapat memeriahkan lagi majlis ini.</p>
		<p class="hashtag-print">{wedding.hashtag}</p>
	</div>

	<!-- Bottom border -->
	<div class="bottom-border" aria-hidden="true"></div>
</main>

<style>
	/* Print controls - screen only */
	.print-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 1rem 1.5rem;
		background: #f8f8f8;
		border-bottom: 1px solid #eee;
		font-family: var(--font-lato);
	}

	.back-link {
		font-size: 0.875rem;
		color: #666;
		text-decoration: none;
	}

	.print-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 1.25rem;
		background: #333;
		color: #fff;
		border: none;
		border-radius: 8px;
		font-family: var(--font-lato);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
	}

	.event-toggle {
		display: flex;
		gap: 0.25rem;
		margin-left: auto;
	}

	.toggle-btn {
		padding: 0.4rem 1rem;
		border-radius: 6px;
		font-size: 0.8rem;
		font-weight: 600;
		text-decoration: none;
		color: #666;
		background: #fff;
		border: 1px solid #ddd;
		transition: background 0.15s;
	}

	.toggle-btn.active {
		background: #333;
		color: #fff;
		border-color: #333;
	}

	/* ===== Printable card ===== */
	.printable-card {
		max-width: 560px;
		margin: 2rem auto;
		padding: 2.5rem 2rem;
		background: #fff;
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0,0,0,0.08);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		text-align: center;
		font-family: var(--font-lato);
	}

	.top-border, .bottom-border {
		width: 100%;
		height: 8px;
		border-radius: 4px;
	}

	.fairy-print .top-border,
	.fairy-print .bottom-border {
		background: linear-gradient(90deg, #c084be, #7eb8d6, #c084be);
	}

	.malay-print .top-border,
	.malay-print .bottom-border {
		background: linear-gradient(90deg, #c9a227, #e8c84a, #c9a227);
	}

	.bismillah {
		font-family: var(--font-amiri);
		font-size: 2rem;
		direction: rtl;
		margin: 0;
		line-height: 1.5;
	}

	.fairy-print .bismillah { color: #4a3060; }
	.malay-print .bismillah { color: #3d2b00; }

	.invite-header {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.875rem;
	}

	.with-honor { color: #666; margin: 0; }
	.parent-invite { color: #555; margin: 0; line-height: 1.5; }
	.invite-addr { color: #444; font-weight: 600; margin: 0; }
	.putri { color: #888; font-style: italic; font-size: 0.8rem; margin: 0; }

	.couple-section {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.main-name {
		font-family: var(--font-playfair);
		font-size: clamp(1.25rem, 4vw, 1.75rem);
		font-weight: 700;
		margin: 0;
		letter-spacing: 0.04em;
	}

	.fairy-print .main-name.bride { color: var(--color-fairy-primary); }
	.fairy-print .main-name.groom { color: #5a4070; }
	.malay-print .main-name.groom { color: var(--color-malay-secondary); }
	.malay-print .main-name.bride { color: var(--color-malay-primary); }

	.dengan-text {
		font-size: 0.8rem;
		font-style: italic;
		color: #999;
		margin: 0;
	}

	.divider {
		display: flex;
		gap: 0.5rem;
		opacity: 0.4;
	}

	.fairy-print .divider { color: var(--color-fairy-primary); }
	.malay-print .divider { color: var(--color-malay-primary); }

	.details-section {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border-top: 1px solid #f0f0f0;
		border-bottom: 1px solid #f0f0f0;
		padding: 1rem 0;
	}

	.detail-row {
		display: grid;
		grid-template-columns: 160px 1fr;
		gap: 0.5rem;
		text-align: left;
		font-size: 0.875rem;
	}

	.detail-label {
		color: #888;
		font-weight: 600;
	}

	.detail-value { color: #333; }

	.contacts-section {
		width: 100%;
		text-align: left;
	}

	.contacts-heading {
		font-size: 0.85rem;
		font-weight: 600;
		color: #666;
		margin: 0 0 0.5rem;
	}

	.contacts-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.contact-item {
		font-size: 0.82rem;
		color: #444;
		background: #f8f8f8;
		padding: 3px 10px;
		border-radius: 4px;
	}

	.closing-dua {
		font-size: 0.85rem;
		color: #666;
		line-height: 1.6;
	}

	.closing-dua p { margin: 0; }

	.hashtag-print {
		font-family: var(--font-lato);
		font-size: 0.8rem;
		margin-top: 0.25rem;
	}

	.fairy-print .hashtag-print { color: var(--color-fairy-primary); }
	.malay-print .hashtag-print { color: var(--color-malay-primary); }

	/* ===== Print media query ===== */
	@media print {
		.printable-card {
			margin: 0;
			box-shadow: none;
			border-radius: 0;
			max-width: 100%;
		}

		:global(body) { background: white; }
	}
</style>
