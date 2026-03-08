<script lang="ts">
	import { wedding } from '$lib/data/wedding';
</script>

<svelte:head>
	<title>{wedding.bride.name} & {wedding.groom.name} — Majlis Perkahwinan 2026</title>
	<meta name="description" content="Jemputan digital majlis perkahwinan Zulfatul Syarah & Muhammed Munir — 29 & 31 Mei 2026, Kota Bharu, Kelantan." />
	<meta property="og:title" content="{wedding.bride.name} & {wedding.groom.name}" />
	<meta property="og:description" content="29 & 31 Mei 2026 · Kota Bharu, Kelantan" />
</svelte:head>

<main id="main-content" class="landing">

	<!-- Corner ornaments -->
	<div class="corner corner-tl" aria-hidden="true">
		<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 50 Q25 25 50 0" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>
			<path d="M0 70 Q35 35 70 0" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.25"/>
			<circle cx="5" cy="5" r="2" fill="currentColor" opacity="0.35"/>
		</svg>
	</div>
	<div class="corner corner-tr" aria-hidden="true">
		<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<path d="M100 50 Q75 25 50 0" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>
			<path d="M100 70 Q65 35 30 0" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.25"/>
			<circle cx="95" cy="5" r="2" fill="currentColor" opacity="0.35"/>
		</svg>
	</div>
	<div class="corner corner-bl" aria-hidden="true">
		<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 50 Q25 75 50 100" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>
			<path d="M0 30 Q35 65 70 100" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.25"/>
		</svg>
	</div>
	<div class="corner corner-br" aria-hidden="true">
		<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<path d="M100 50 Q75 75 50 100" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>
			<path d="M100 30 Q65 65 30 100" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.25"/>
		</svg>
	</div>

	<div class="content">
		<!-- Bismillah -->
		<p class="bismillah" lang="ar">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>

		<!-- Ornament -->
		<div class="ornament" aria-hidden="true">
			<svg viewBox="0 0 300 12" xmlns="http://www.w3.org/2000/svg">
				<line x1="0" y1="6" x2="115" y2="6" stroke="currentColor" stroke-width="0.6" opacity="0.4"/>
				<path d="M124 6 Q130 1 136 6 Q142 11 148 6 Q154 1 160 6 Q166 11 172 6 Q178 1 184 6" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.7"/>
				<line x1="193" y1="6" x2="300" y2="6" stroke="currentColor" stroke-width="0.6" opacity="0.4"/>
			</svg>
		</div>

		<!-- Label kecil -->
		<p class="supertitle">Majlis Perkahwinan</p>

		<!-- Nama pengantin -->
		<div class="names" aria-label="Nama pengantin">
			<h1 class="name-bride">{wedding.bride.nameDisplay}</h1>
			<div class="ampersand-wrap" aria-hidden="true">
				<span class="amp-line"></span>
				<span class="amp">&amp;</span>
				<span class="amp-line"></span>
			</div>
			<h1 class="name-groom">{wedding.groom.nameDisplay}</h1>
		</div>

		<!-- Tarikh -->
		<p class="dates-sub">29 &amp; 31 MEI 2026 · KOTA BHARU, KELANTAN</p>

		<!-- Ornament -->
		<div class="ornament" aria-hidden="true">
			<svg viewBox="0 0 300 12" xmlns="http://www.w3.org/2000/svg">
				<line x1="0" y1="6" x2="115" y2="6" stroke="currentColor" stroke-width="0.6" opacity="0.4"/>
				<path d="M124 6 Q130 1 136 6 Q142 11 148 6 Q154 1 160 6 Q166 11 172 6 Q178 1 184 6" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.7"/>
				<line x1="193" y1="6" x2="300" y2="6" stroke="currentColor" stroke-width="0.6" opacity="0.4"/>
			</svg>
		</div>

		<!-- Pilihan jemputan -->
		<p class="choose-label">Sila pilih jemputan anda</p>

		<div class="cards">
			<!-- Perempuan -->
			<a href="/zulfatul-syarah" class="card card-fairy" aria-label="Buka jemputan Majlis Perkahwinan — pihak perempuan">
				<div class="card-top card-top-fairy">
					<svg class="card-arch" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						<path d="M10 60 L10 30 Q10 5 100 5 Q190 5 190 30 L190 60" fill="none" stroke="currentColor" stroke-width="1" opacity="0.6"/>
						<path d="M30 60 L30 35 Q30 18 100 18 Q170 18 170 35 L170 60" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.35"/>
					</svg>
				</div>
				<div class="card-body">
					<span class="card-tag">Pihak Perempuan</span>
					<p class="card-name">{wedding.bride.name}</p>
					<p class="card-event">{wedding.events.perempuan.typeShort}</p>
					<div class="card-date-row">
						<span class="card-day-num">29</span>
						<div class="card-date-info">
							<span class="card-month">MEI 2026</span>
							<span class="card-hijri">{wedding.events.perempuan.hijriDisplay}</span>
						</div>
					</div>
					<p class="card-venue">{wedding.events.perempuan.venue}</p>
					<span class="card-cta card-cta-fairy">Buka Jemputan</span>
				</div>
			</a>

			<!-- Lelaki -->
			<a href="/muhammed-munir" class="card card-malay" aria-label="Buka jemputan Majlis Bertandang — pihak lelaki">
				<div class="card-top card-top-malay">
					<svg class="card-arch" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						<path d="M10 60 L10 30 Q10 5 100 5 Q190 5 190 30 L190 60" fill="none" stroke="currentColor" stroke-width="1" opacity="0.6"/>
						<path d="M30 60 L30 35 Q30 18 100 18 Q170 18 170 35 L170 60" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.35"/>
					</svg>
				</div>
				<div class="card-body">
					<span class="card-tag">Pihak Lelaki</span>
					<p class="card-name">{wedding.groom.name}</p>
					<p class="card-event">{wedding.events.lelaki.typeShort}</p>
					<div class="card-date-row">
						<span class="card-day-num">31</span>
						<div class="card-date-info">
							<span class="card-month">MEI 2026</span>
							<span class="card-hijri">{wedding.events.lelaki.hijriDisplay}</span>
						</div>
					</div>
					<p class="card-venue">{wedding.events.lelaki.venue}, {wedding.events.lelaki.venueShort}</p>
					<span class="card-cta card-cta-malay">Buka Jemputan</span>
				</div>
			</a>
		</div>

		<p class="hashtag">{wedding.hashtag}</p>
	</div>
</main>

<style>
	.landing {
		min-height: 100vh;
		background: linear-gradient(145deg, #f7f0f7 0%, #f0f2f8 40%, #f8f5f0 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		padding: 3rem 1.5rem;
		font-family: var(--font-lato);
	}

	/* Corner SVG ornaments */
	.corner {
		position: absolute;
		width: 100px;
		height: 100px;
		pointer-events: none;
		color: #b0a0b8;
	}
	.corner-tl { top: 0; left: 0; }
	.corner-tr { top: 0; right: 0; }
	.corner-bl { bottom: 0; left: 0; }
	.corner-br { bottom: 0; right: 0; }

	.content {
		position: relative;
		z-index: 1;
		max-width: 680px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		text-align: center;
	}

	.bismillah {
		font-family: var(--font-amiri);
		font-size: clamp(1.75rem, 5vw, 2.5rem);
		color: #3d2b3d;
		direction: rtl;
		line-height: 1.4;
		margin: 0;
	}

	.ornament {
		width: 100%;
		max-width: 300px;
		color: #a090b0;
	}
	.ornament svg { width: 100%; display: block; }

	.supertitle {
		font-size: 0.7rem;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: #9a8aaa;
		margin: 0;
	}

	/* Names */
	.names {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
	}

	.name-bride {
		font-family: var(--font-playfair);
		font-size: clamp(1.75rem, 6vw, 3rem);
		font-weight: 700;
		color: #b87fa8;
		letter-spacing: 0.04em;
		margin: 0;
		line-height: 1.1;
	}

	.name-groom {
		font-family: var(--font-playfair);
		font-size: clamp(1.75rem, 6vw, 3rem);
		font-weight: 700;
		color: #c9a227;
		letter-spacing: 0.04em;
		margin: 0;
		line-height: 1.1;
	}

	.ampersand-wrap {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		max-width: 300px;
	}

	.amp-line {
		flex: 1;
		height: 1px;
		background: rgba(160,144,176,0.3);
	}

	.amp {
		font-family: var(--font-playfair);
		font-size: 1.25rem;
		font-style: italic;
		color: #c0b0c8;
		line-height: 1;
	}

	.dates-sub {
		font-size: 0.72rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: #9a8aaa;
		margin: 0;
	}

	.choose-label {
		font-size: 0.78rem;
		letter-spacing: 0.1em;
		color: #aaa;
		margin: 0.5rem 0 0;
	}

	/* Cards */
	.cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		width: 100%;
	}

	@media (max-width: 520px) {
		.cards { grid-template-columns: 1fr; }
	}

	.card {
		border-radius: 8px;
		overflow: hidden;
		text-decoration: none;
		display: flex;
		flex-direction: column;
		background: #fff;
		box-shadow: 0 2px 20px rgba(0,0,0,0.07);
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 35px rgba(0,0,0,0.12);
	}

	.card:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 3px;
	}

	/* Card top section */
	.card-top {
		height: 70px;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 0;
		position: relative;
	}

	.card-top-fairy {
		background: linear-gradient(160deg, #d4b8e8 0%, #b8d4e8 100%);
		color: rgba(255,255,255,0.8);
	}

	.card-top-malay {
		background: linear-gradient(160deg, #e8c84a 0%, #c9a227 100%);
		color: rgba(255,255,255,0.7);
	}

	.card-arch {
		width: 100%;
		height: 60px;
		position: absolute;
		bottom: 0;
	}

	.card-body {
		padding: 1.25rem 1rem 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
		text-align: center;
		flex: 1;
	}

	.card-tag {
		font-size: 0.62rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #aaa;
	}

	.card-name {
		font-family: var(--font-playfair);
		font-size: clamp(1rem, 3vw, 1.25rem);
		font-weight: 700;
		margin: 0;
		line-height: 1.2;
	}

	.card-fairy .card-name { color: #b87fa8; }
	.card-malay .card-name { color: #8b5e00; }

	.card-event {
		font-size: 0.72rem;
		font-style: italic;
		color: #bbb;
		margin: 0;
	}

	.card-date-row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin: 0.25rem 0;
	}

	.card-day-num {
		font-family: var(--font-playfair);
		font-size: 2.25rem;
		font-weight: 700;
		line-height: 1;
	}

	.card-fairy .card-day-num { color: #b87fa8; }
	.card-malay .card-day-num { color: #c9a227; }

	.card-date-info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2px;
	}

	.card-month {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: #555;
	}

	.card-hijri {
		font-size: 0.6rem;
		color: #bbb;
	}

	.card-venue {
		font-size: 0.72rem;
		color: #aaa;
		margin: 0;
		line-height: 1.4;
	}

	.card-cta {
		display: inline-block;
		margin-top: 0.5rem;
		padding: 0.5rem 1.25rem;
		border-radius: 2px;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.card-cta-fairy { background: #b87fa8; color: #fff; }
	.card-cta-malay { background: #c9a227; color: #fff; }

	.hashtag {
		font-family: var(--font-playfair);
		font-size: 0.9rem;
		font-style: italic;
		color: #bbb;
		margin: 0.5rem 0 0;
	}
</style>
