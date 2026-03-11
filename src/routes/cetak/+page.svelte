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

<!-- Kawalan cetak (screen only) -->
<div class="print-controls no-print">
	<button onclick={printPage} class="print-btn" class:fairy-btn={isFairy} class:malay-btn={!isFairy}>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" aria-hidden="true">
			<polyline points="6 9 6 2 18 2 18 9"></polyline>
			<path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"></path>
			<rect x="6" y="14" width="12" height="8"></rect>
		</svg>
		Cetak / Simpan PDF
	</button>
</div>

<!-- Latar halaman -->
<div class="page-bg" class:fairy-bg={isFairy} class:malay-bg={!isFairy}>

<main id="main-content" class="printable-card" class:fairy-print={isFairy} class:malay-print={!isFairy}>

	<!-- Ornamen penjuru -->
	<div class="corner-ornament co-tl" aria-hidden="true">
		{#if isFairy}
			<svg viewBox="0 0 70 70" fill="none" width="70" height="70">
				<path d="M2 35 Q18 18 35 2" stroke="#c084be" stroke-width="1.2" opacity="0.6"/>
				<path d="M2 55 Q28 28 55 2" stroke="#c084be" stroke-width="0.6" opacity="0.35"/>
				<circle cx="6" cy="6" r="3.5" fill="#c084be" opacity="0.5"/>
				<circle cx="18" cy="4" r="2" fill="#d4a0c8" opacity="0.4"/>
				<circle cx="4" cy="18" r="2" fill="#d4a0c8" opacity="0.4"/>
			</svg>
		{:else}
			<svg viewBox="0 0 70 70" fill="none" width="70" height="70">
				<path d="M2 35 Q18 18 35 2" stroke="#c9a227" stroke-width="1.2" opacity="0.6"/>
				<path d="M2 55 Q28 28 55 2" stroke="#c9a227" stroke-width="0.6" opacity="0.35"/>
				<circle cx="6" cy="6" r="3.5" fill="#c9a227" opacity="0.55"/>
				<circle cx="18" cy="4" r="2" fill="#e8c84a" opacity="0.4"/>
				<circle cx="4" cy="18" r="2" fill="#e8c84a" opacity="0.4"/>
			</svg>
		{/if}
	</div>
	<div class="corner-ornament co-tr" aria-hidden="true">
		{#if isFairy}
			<svg viewBox="0 0 70 70" fill="none" width="70" height="70">
				<path d="M68 35 Q52 18 35 2" stroke="#c084be" stroke-width="1.2" opacity="0.6"/>
				<path d="M68 55 Q42 28 15 2" stroke="#c084be" stroke-width="0.6" opacity="0.35"/>
				<circle cx="64" cy="6" r="3.5" fill="#c084be" opacity="0.5"/>
			</svg>
		{:else}
			<svg viewBox="0 0 70 70" fill="none" width="70" height="70">
				<path d="M68 35 Q52 18 35 2" stroke="#c9a227" stroke-width="1.2" opacity="0.6"/>
				<path d="M68 55 Q42 28 15 2" stroke="#c9a227" stroke-width="0.6" opacity="0.35"/>
				<circle cx="64" cy="6" r="3.5" fill="#c9a227" opacity="0.55"/>
			</svg>
		{/if}
	</div>
	<div class="corner-ornament co-bl" aria-hidden="true">
		{#if isFairy}
			<svg viewBox="0 0 70 70" fill="none" width="70" height="70">
				<path d="M2 35 Q18 52 35 68" stroke="#c084be" stroke-width="1.2" opacity="0.6"/>
				<path d="M2 15 Q28 42 55 68" stroke="#c084be" stroke-width="0.6" opacity="0.35"/>
			</svg>
		{:else}
			<svg viewBox="0 0 70 70" fill="none" width="70" height="70">
				<path d="M2 35 Q18 52 35 68" stroke="#c9a227" stroke-width="1.2" opacity="0.6"/>
				<path d="M2 15 Q28 42 55 68" stroke="#c9a227" stroke-width="0.6" opacity="0.35"/>
			</svg>
		{/if}
	</div>
	<div class="corner-ornament co-br" aria-hidden="true">
		{#if isFairy}
			<svg viewBox="0 0 70 70" fill="none" width="70" height="70">
				<path d="M68 35 Q52 52 35 68" stroke="#c084be" stroke-width="1.2" opacity="0.6"/>
				<path d="M68 15 Q42 42 15 68" stroke="#c084be" stroke-width="0.6" opacity="0.35"/>
			</svg>
		{:else}
			<svg viewBox="0 0 70 70" fill="none" width="70" height="70">
				<path d="M68 35 Q52 52 35 68" stroke="#c9a227" stroke-width="1.2" opacity="0.6"/>
				<path d="M68 15 Q42 42 15 68" stroke="#c9a227" stroke-width="0.6" opacity="0.35"/>
			</svg>
		{/if}
	</div>

	<!-- Batas atas -->
	<div class="top-border" aria-hidden="true"></div>

	<!-- Bismillah -->
	<p class="bismillah" lang="ar">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>

	<!-- Gelombang hiasan -->
	<div class="wave-rule" aria-hidden="true">
		<svg viewBox="0 0 260 14" xmlns="http://www.w3.org/2000/svg" width="220" height="12">
			<line x1="0" y1="7" x2="88" y2="7" stroke="currentColor" stroke-width="0.6" opacity="0.4"/>
			<path d="M94 7 Q99 3 104 7 Q109 11 114 7 Q119 3 124 7 Q129 11 134 7 Q139 3 144 7 Q149 11 154 7 Q159 3 164 7 Q169 11 174 7" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.8"/>
			<line x1="180" y1="7" x2="260" y2="7" stroke="currentColor" stroke-width="0.6" opacity="0.4"/>
		</svg>
	</div>

	<!-- Header jemputan -->
	<div class="invite-header">
		<p class="with-honor">Dengan penuh kesyukuran ke hadrat Ilahi</p>
		{#if isFairy}
			<p class="parent-invite">bersama sejambak mawar setapak sirih kami hulurkan untuk mengundang</p>
			<p class="invite-addr">Tuan/Puan &amp; seisi keluarga ke <strong>{ev.type}</strong></p>
			<p class="putri">putri kami</p>
		{:else}
			<p class="parent-invite">"Sejambak bunga kami hulurkan, semekar senyuman seikhlas hati."</p>
			<p class="invite-addr">kami menjemput Tuan/Puan ke <strong>{ev.type}</strong></p>
			<p class="putri">putera kami</p>
		{/if}
	</div>

	<!-- Nama pengantin -->
	<div class="couple-section">
		{#if isFairy}
			<p class="main-name bride">{wedding.bride.nameDisplay}</p>
			<p class="dengan-text">— Dengan Pasangannya —</p>
			<p class="main-name groom">{wedding.groom.nameDisplay}</p>
		{:else}
			<p class="main-name groom">{wedding.groom.nameDisplay}</p>
			<p class="dengan-text">— dengan pilihan hatinya —</p>
			<p class="main-name bride">{wedding.bride.nameDisplay}</p>
		{/if}
	</div>

	<!-- Divider -->
	<div class="wave-rule" aria-hidden="true">
		<svg viewBox="0 0 260 14" xmlns="http://www.w3.org/2000/svg" width="220" height="12">
			<line x1="0" y1="7" x2="88" y2="7" stroke="currentColor" stroke-width="0.6" opacity="0.4"/>
			<path d="M94 7 Q99 3 104 7 Q109 11 114 7 Q119 3 124 7 Q129 11 134 7 Q139 3 144 7 Q149 11 154 7 Q159 3 164 7 Q169 11 174 7" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.8"/>
			<line x1="180" y1="7" x2="260" y2="7" stroke="currentColor" stroke-width="0.6" opacity="0.4"/>
		</svg>
	</div>

	<!-- Butiran majlis -->
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

	<!-- Untuk Dihubungi -->
	<div class="contacts-section">
		<p class="contacts-heading">Untuk Dihubungi</p>
		<div class="contacts-list">
			{#each ev.contacts as c}
				<div class="contact-item">
					<span class="ci-name">{c.name}</span>
					<span class="ci-phone">{c.phone}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Penutup -->
	<div class="closing-dua">
		<p>Semoga kehadiran para hadirin dapat memeriahkan lagi majlis ini.</p>
		<p class="hashtag-print">{wedding.hashtag}</p>
	</div>

	<!-- Batas bawah -->
	<div class="bottom-border" aria-hidden="true"></div>

</main>
</div>

<style>
/* ═══ Kawalan cetak ══════════════════════════════════════ */
.print-controls {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	flex-wrap: wrap;
	padding: 0.85rem 1.25rem;
	background: #fff;
	border-bottom: 1px solid #eee;
	font-family: var(--font-lato);
	box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.print-btn {
	display: flex;
	align-items: center;
	gap: 0.45rem;
	padding: 0.55rem 1.2rem;
	border: none;
	border-radius: 8px;
	font-family: var(--font-lato);
	font-size: 0.85rem;
	font-weight: 600;
	cursor: pointer;
	transition: opacity 0.15s;
}
.print-btn:hover { opacity: 0.85; }
.fairy-btn { background: linear-gradient(135deg, #9b6fc4, #c471a0); color: #fff; }
.malay-btn { background: linear-gradient(135deg, #c9a227, #e8c84a); color: #3d2a00; }


/* ═══ Latar halaman ══════════════════════════════════════ */
.page-bg {
	min-height: 100vh;
	padding: 2rem 1rem;
	display: flex;
	justify-content: center;
}
.fairy-bg {
	background:
		radial-gradient(ellipse at 20% 20%, rgba(196,113,160,0.15) 0%, transparent 55%),
		radial-gradient(ellipse at 80% 80%, rgba(155,111,196,0.12) 0%, transparent 55%),
		linear-gradient(150deg, #f5eefa 0%, #ede0f5 50%, #f0e8f8 100%);
}
.malay-bg {
	background:
		radial-gradient(ellipse at 20% 20%, rgba(201,162,39,0.15) 0%, transparent 55%),
		radial-gradient(ellipse at 80% 80%, rgba(224,192,64,0.12) 0%, transparent 55%),
		linear-gradient(150deg, #fefcf0 0%, #f8f0d0 50%, #fdf6e0 100%);
}

/* ═══ Kad utama ══════════════════════════════════════════ */
.printable-card {
	position: relative;
	width: 100%;
	max-width: 560px;
	padding: 3rem 2.5rem;
	border-radius: 12px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.1rem;
	text-align: center;
	font-family: var(--font-lato);
	/* Bingkai dalam */
	box-shadow:
		0 0 0 1px rgba(0,0,0,0.06),
		0 8px 32px rgba(0,0,0,0.1);
}

/* Bingkai dekoratif dalaman */
.printable-card::before {
	content: '';
	position: absolute;
	inset: 10px;
	border-radius: 8px;
	border: 1px solid;
	pointer-events: none;
	z-index: 0;
}

.fairy-print {
	background: linear-gradient(145deg, #fdf8ff 0%, #fff 40%, #f8f2fe 100%);
}
.fairy-print::before { border-color: rgba(192,132,190,0.28); }

.malay-print {
	background: linear-gradient(145deg, #fffef5 0%, #fff 40%, #fdf8e8 100%);
}
.malay-print::before { border-color: rgba(201,162,39,0.28); }

/* Z-index supaya kandungan atas bingkai */
.printable-card > * { position: relative; z-index: 1; }

/* ═══ Ornamen penjuru ════════════════════════════════════ */
.corner-ornament {
	position: absolute;
	width: 70px;
	height: 70px;
	z-index: 1;
	pointer-events: none;
}
.co-tl { top: 0; left: 0; }
.co-tr { top: 0; right: 0; }
.co-bl { bottom: 0; left: 0; }
.co-br { bottom: 0; right: 0; }

/* ═══ Border atas/bawah ══════════════════════════════════ */
.top-border, .bottom-border {
	width: 100%;
	height: 5px;
	border-radius: 3px;
}
.fairy-print .top-border,
.fairy-print .bottom-border {
	background: linear-gradient(90deg, #c084be 0%, #7eb8d6 40%, #d4af37 60%, #c084be 100%);
}
.malay-print .top-border,
.malay-print .bottom-border {
	background: linear-gradient(90deg, #8b6914 0%, #c9a227 30%, #e8c84a 50%, #c9a227 70%, #8b6914 100%);
}

/* ═══ Bismillah ══════════════════════════════════════════ */
.bismillah {
	font-family: var(--font-amiri);
	font-size: clamp(1.6rem, 5vw, 2.1rem);
	direction: rtl;
	margin: 0;
	line-height: 1.5;
}
.fairy-print .bismillah { color: #5a2d82; }
.malay-print .bismillah { color: #5a3a00; }

/* ═══ Gelombang ══════════════════════════════════════════ */
.wave-rule {
	opacity: 0.8;
}
.fairy-print .wave-rule { color: #b87fa8; }
.malay-print .wave-rule { color: #c9a227; }

/* ═══ Header jemputan ════════════════════════════════════ */
.invite-header {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	font-size: 0.85rem;
}
.with-honor { color: #888; margin: 0; }
.parent-invite { color: #666; margin: 0; line-height: 1.55; }
.invite-addr { color: #444; margin: 0; }
.invite-addr strong { font-weight: 700; }
.fairy-print .invite-addr strong { color: #7a4d9a; }
.malay-print .invite-addr strong { color: #8a6010; }
.putri { color: #999; font-style: italic; font-size: 0.78rem; margin: 0; }

/* ═══ Nama pengantin ═════════════════════════════════════ */
.couple-section {
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
}

.main-name {
	font-family: var(--font-playfair);
	font-size: clamp(1.2rem, 4vw, 1.65rem);
	font-weight: 700;
	margin: 0;
	letter-spacing: 0.04em;
}
.fairy-print .main-name.bride { color: #b060b8; }
.fairy-print .main-name.groom { color: #5a3d7a; }
.malay-print .main-name.groom { color: #7a5200; }
.malay-print .main-name.bride { color: #c9a227; }

.dengan-text {
	font-size: 0.8rem;
	font-style: italic;
	margin: 0.1rem 0;
}
.fairy-print .dengan-text { color: #b87fa8; }
.malay-print .dengan-text { color: #c9a227; }

/* ═══ Butiran ════════════════════════════════════════════ */
.details-section {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 0.45rem;
	padding: 0.9rem 0;
	border-top: 1px solid;
	border-bottom: 1px solid;
}
.fairy-print .details-section { border-color: rgba(192,132,190,0.2); }
.malay-print .details-section { border-color: rgba(201,162,39,0.22); }

.detail-row {
	display: grid;
	grid-template-columns: 148px 1fr;
	gap: 0.5rem;
	text-align: left;
	font-size: 0.84rem;
}
.detail-label { color: #999; font-weight: 600; }
.detail-value { color: #333; }

/* ═══ Dihubungi ══════════════════════════════════════════ */
.contacts-section { width: 100%; }

.contacts-heading {
	font-size: 0.78rem;
	font-weight: 700;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	margin: 0 0 0.6rem;
}
.fairy-print .contacts-heading { color: #9b6fc4; }
.malay-print .contacts-heading { color: #c9a227; }

.contacts-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0.4rem;
	justify-content: center;
}

.contact-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.1rem;
	padding: 0.4rem 0.8rem;
	border-radius: 6px;
	font-size: 0.78rem;
}
.fairy-print .contact-item {
	background: rgba(192,132,190,0.08);
	border: 1px solid rgba(192,132,190,0.2);
}
.malay-print .contact-item {
	background: rgba(201,162,39,0.08);
	border: 1px solid rgba(201,162,39,0.2);
}
.ci-name {
	font-weight: 700;
	font-size: 0.72rem;
}
.fairy-print .ci-name { color: #7a4d9a; }
.malay-print .ci-name { color: #8a6010; }

.ci-phone { color: #555; }

/* ═══ Penutup ════════════════════════════════════════════ */
.closing-dua {
	font-size: 0.82rem;
	color: #777;
	line-height: 1.65;
}
.closing-dua p { margin: 0; }

.hashtag-print {
	font-family: var(--font-lato);
	font-size: 0.82rem;
	font-weight: 700;
	margin-top: 0.2rem;
}
.fairy-print .hashtag-print { color: #b060b8; }
.malay-print .hashtag-print { color: #c9a227; }

/* ═══ Paksa browser print warna latar ═══════════════════ */
.printable-card,
.printable-card * {
	-webkit-print-color-adjust: exact !important;
	print-color-adjust: exact !important;
}

/* ═══ Print media ════════════════════════════════════════ */
@media print {
	.print-controls { display: none !important; }
	.page-bg {
		padding: 0;
		min-height: unset;
		background: white !important;
	}
	.printable-card {
		width: 100%;
		max-width: 100%;
		margin: 0;
		box-shadow: none;
		border-radius: 0;
		padding: 1.5rem 2rem;
		/* Kekalkan warna latar kad */
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}
	.printable-card::before {
		/* Kekalkan bingkai dalam */
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}
	:global(body) {
		background: white;
		margin: 0;
		padding: 0;
	}
}
</style>
