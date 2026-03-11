<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { wedding } from '$lib/data/wedding';
	import { googleCalendarUrl } from '$lib/utils/ics';
	import Countdown from '$lib/components/Countdown.svelte';
	import ShareButtons from '$lib/components/ShareButtons.svelte';
	import QRCard from '$lib/components/QRCard.svelte';
	import StickyNav from '$lib/components/StickyNav.svelte';
	import SplashScreen from '$lib/components/SplashScreen.svelte';
	import ShareCard from '$lib/components/ShareCard.svelte';

	const ev = wedding.events.lelaki;

	// ─── ISI MAKLUMAT INI ────────────────────────────────────────
	const MAP_EMBED_URL   = 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3966.8789885865967!2d102.283512!3d6.1469510000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwMDgnNDkuMCJOIDEwMsKwMTcnMDAuNiJF!5e0!3m2!1sen!2smy!4v1772928415085!5m2!1sen!2smy';
	// ─────────────────────────────────────────────────────────────

	const petals = [
		{ left: '3%',  du: '8s',  de: '0s',   sz: '12px', bg: '#c9a227' },
		{ left: '9%',  du: '12s', de: '5s',   sz: '8px',  bg: '#f0d870' },
		{ left: '16%', du: '10s', de: '2.2s', sz: '16px', bg: '#e8c84a' },
		{ left: '23%', du: '9s',  de: '7s',   sz: '10px', bg: '#d4b030' },
		{ left: '30%', du: '13s', de: '1s',   sz: '14px', bg: '#f0d870' },
		{ left: '37%', du: '7s',  de: '4s',   sz: '9px',  bg: '#c9a227' },
		{ left: '44%', du: '11s', de: '0.5s', sz: '18px', bg: '#c9a227' },
		{ left: '51%', du: '9s',  de: '6s',   sz: '11px', bg: '#e8d060' },
		{ left: '58%', du: '8s',  de: '3s',   sz: '13px', bg: '#b89020' },
		{ left: '65%', du: '14s', de: '1.5s', sz: '8px',  bg: '#f5d840' },
		{ left: '72%', du: '10s', de: '8s',   sz: '15px', bg: '#e0c040' },
		{ left: '79%', du: '7s',  de: '2s',   sz: '10px', bg: '#c9a227' },
		{ left: '86%', du: '12s', de: '4.5s', sz: '12px', bg: '#e8c84a' },
		{ left: '93%', du: '9s',  de: '0s',   sz: '17px', bg: '#f5d840' },
	];

	type UcapanItem = { nama: string; msg: string };
	let ucapanList = $state<UcapanItem[]>([]);
	let ucapanLoading = $state(true);

	// ── Reactions ─────────────────────────────────────────────────
	const EMOJIS = ['❤️', '🎉', '🥹'] as const;
	type Emoji = typeof EMOJIS[number];
	type ReactionMap = Record<string, Record<Emoji, number>>;
	let reactions = $state<ReactionMap>({});
	let myReactions = $state<Record<string, Emoji>>({});

	function ucapanKey(u: UcapanItem) { return `${u.nama}:${u.msg.slice(0,20)}`; }

	function toggleReaction(u: UcapanItem, emoji: Emoji) {
		const key = ucapanKey(u);
		const r: ReactionMap = JSON.parse(JSON.stringify(reactions));
		const my: Record<string, Emoji> = { ...myReactions };
		if (!r[key]) r[key] = { '❤️': 0, '🎉': 0, '🥹': 0 };
		if (my[key] === emoji) {
			r[key][emoji] = Math.max(0, r[key][emoji] - 1);
			delete my[key];
		} else {
			if (my[key]) r[key][my[key]] = Math.max(0, r[key][my[key]] - 1);
			r[key][emoji] = (r[key][emoji] || 0) + 1;
			my[key] = emoji;
		}
		reactions = r; myReactions = my;
		localStorage.setItem('rx_l', JSON.stringify(r));
		localStorage.setItem('myrx_l', JSON.stringify(my));
	}


	async function fetchUcapan() {
		try {
			const res = await fetch(`${SCRIPT_URL}?action=getUcapan&jenis=Ucapan%20Lelaki&t=${Date.now()}`);
			const data = await res.json();
			ucapanList = data;
		} catch {
			ucapanList = [];
		} finally {
			ucapanLoading = false;
		}
	}

	onMount(() => {
		reactions = JSON.parse(localStorage.getItem('rx_l') || '{}');
		myReactions = JSON.parse(localStorage.getItem('myrx_l') || '{}');
		fetchUcapan();
		const interval = setInterval(fetchUcapan, 30000);
		return () => clearInterval(interval);
	});

	const navSections = [
		{ id: 'hero',    label: 'Utama',   icon: '🏠' },
		{ id: 'lokasi',  label: 'Lokasi',  icon: '📍' },
		{ id: 'rsvp',    label: 'RSVP',    icon: '✉️' },
		{ id: 'ucapan',  label: 'Ucapan',  icon: '💬' },
		{ id: 'hubungi', label: 'Hubungi', icon: '📞' }
	];

	const pageUrl = browser ? window.location.origin + '/muhammed-munir' : '';
	const waMessage = [
		`🕌 Jemputan Majlis Bertandang 🕌`,
		``,
		`${wedding.groom.name} & ${wedding.bride.name}`,
		`📅 ${ev.dayDisplay}, ${ev.dateDisplay}`,
		`🕚 ${ev.time.jamuan.display}`,
		`📍 ${ev.venue}, ${ev.venueShort}`,
		``,
		`${wedding.hashtag}`,
		`🔗`
	].join('\n');

	function downloadIcs() {
		const isAndroid = /Android/i.test(navigator.userAgent);
		if (isAndroid) {
			const url = googleCalendarUrl({
				title: `${ev.typeShort} – ${wedding.groom.name} & ${wedding.bride.name}`,
				description: `${ev.type}\n${ev.venue}, ${ev.venueShort}\nJamuan: ${ev.time.jamuan.display}`,
				location: ev.address,
				startDate: ev.date,
				startTime: ev.time.jamuan.start,
				endTime: ev.time.jamuan.end
			});
			window.open(url, '_blank', 'noopener,noreferrer');
		} else {
			// iOS: auto-prompts "Add to Calendar"; Desktop: downloads .ics
			window.location.href = '/api/calendar?event=lelaki';
		}
	}

	function waLink(phone: string) {
		return `https://wa.me/60${phone.replace(/[-\s]/g,'').replace(/^0/,'')}`;
	}

	// ─── Custom Forms → Google Sheets ────────────────────────────
	const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw63LbFxa30ujG2oMUjjrQbYf65EtjyPd6mKe54QBJPiMohYsV9aCStHvzluGpBA583/exec';

	let rsvp = $state({ nama: '', bil: '2', telefon: '', catatan: '' });
	let rsvpStatus = $state<'idle'|'loading'|'ok'|'err'>('idle');

	async function submitRsvp(e: Event) {
		e.preventDefault();
		rsvpStatus = 'loading';
		try {
			const params = new URLSearchParams({
				jenis: 'RSVP Lelaki',
				nama: rsvp.nama,
				bil: rsvp.bil,
				telefon: rsvp.telefon,
				mesej: rsvp.catatan
			});
			await fetch(`${SCRIPT_URL}?${params}`, { mode: 'no-cors' });
			rsvpStatus = 'ok';
			rsvp = { nama: '', bil: '2', telefon: '', catatan: '' };
		} catch {
			rsvpStatus = 'err';
		}
	}

	let ucapanForm = $state({ nama: '', ucapan: '' });
	let ucapanStatus = $state<'idle'|'loading'|'ok'|'err'>('idle');

	async function submitUcapan(e: Event) {
		e.preventDefault();
		ucapanStatus = 'loading';
		try {
			const params = new URLSearchParams({
				jenis: 'Ucapan Lelaki',
				nama: ucapanForm.nama,
				mesej: ucapanForm.ucapan
			});
			await fetch(`${SCRIPT_URL}?${params}`, { mode: 'no-cors' });
			ucapanStatus = 'ok';
			ucapanForm = { nama: '', ucapan: '' };
			await fetchUcapan();
		} catch {
			ucapanStatus = 'err';
		}
	}
	// ─────────────────────────────────────────────────────────────
</script>

<svelte:head>
	<title>{wedding.groom.nameDisplay} & {wedding.bride.nameDisplay} — Majlis Bertandang</title>
	<meta name="description" content="Jemputan ke {ev.type} pada {ev.dayDisplay}, {ev.dateDisplay} di {ev.venue}, {ev.venueShort}." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:title" content="Jemputan Majlis Bertandang: {wedding.groom.name} & {wedding.bride.name}" />
	<meta property="og:description" content="{ev.type} — {ev.dayDisplay}, {ev.dateDisplay} @ {ev.venue}, {ev.venueShort}" />
	<meta property="og:image" content="{$page.url.origin}/api/og?event=lelaki" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<!-- Splash Screen + Audio -->
<SplashScreen
	theme="malay"
	audioSrc="/lagu-lelaki.mp3"
	brideName={wedding.groom.nameDisplay}
	groomName={wedding.bride.nameDisplay}
	eventLabel="Majlis Bertandang"
/>

<!-- Sticky Navigation -->
<StickyNav theme="malay" sections={navSections} />

<main id="main-content">

	<!-- Falling petals animation (all sections) -->
	<div class="page-fx" aria-hidden="true">
		{#each petals as p}
			<span class="petal-wrap" style="left:{p.left};--du:{p.du};--de:{p.de};--sz:{p.sz};background:{p.bg}"></span>
		{/each}
	</div>

	<!-- ══════════════════════════════════ HERO ══ -->
	<section id="hero" class="hero">

		<!-- Islamic geometric top border -->
		<div class="geo-border geo-top" aria-hidden="true">
			<svg viewBox="0 0 400 20" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M0,10 L10,0 L20,10 L30,0 L40,10 L50,0 L60,10 L70,0 L80,10 L90,0 L100,10 L110,0 L120,10 L130,0 L140,10 L150,0 L160,10 L170,0 L180,10 L190,0 L200,10 L210,0 L220,10 L230,0 L240,10 L250,0 L260,10 L270,0 L280,10 L290,0 L300,10 L310,0 L320,10 L330,0 L340,10 L350,0 L360,10 L370,0 L380,10 L390,0 L400,10" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>
				<path d="M0,10 L10,20 L20,10 L30,20 L40,10 L50,20 L60,10 L70,20 L80,10 L90,20 L100,10 L110,20 L120,10 L130,20 L140,10 L150,20 L160,10 L170,20 L180,10 L190,20 L200,10 L210,20 L220,10 L230,20 L240,10 L250,20 L260,10 L270,20 L280,10 L290,20 L300,10 L310,20 L320,10 L330,20 L340,10 L350,20 L360,10 L370,20 L380,10 L390,20 L400,10" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>
			</svg>
		</div>

		<!-- Lantern ornaments -->
		<div class="lantern lantern-l" aria-hidden="true">
			<svg viewBox="0 0 36 110" xmlns="http://www.w3.org/2000/svg">
				<line x1="18" y1="0" x2="18" y2="14" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
				<rect x="6" y="14" width="24" height="38" rx="4" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
				<path d="M6 20 Q18 16 30 20" fill="none" stroke="currentColor" stroke-width="1" opacity="0.35"/>
				<path d="M6 42 Q18 46 30 42" fill="none" stroke="currentColor" stroke-width="1" opacity="0.35"/>
				<line x1="12" y1="52" x2="8" y2="70" stroke="currentColor" stroke-width="1" opacity="0.3"/>
				<line x1="24" y1="52" x2="28" y2="70" stroke="currentColor" stroke-width="1" opacity="0.3"/>
				<ellipse cx="18" cy="70" rx="9" ry="4" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"/>
			</svg>
		</div>
		<div class="lantern lantern-r" aria-hidden="true">
			<svg viewBox="0 0 36 110" xmlns="http://www.w3.org/2000/svg">
				<line x1="18" y1="0" x2="18" y2="14" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
				<rect x="6" y="14" width="24" height="38" rx="4" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
				<path d="M6 20 Q18 16 30 20" fill="none" stroke="currentColor" stroke-width="1" opacity="0.35"/>
				<path d="M6 42 Q18 46 30 42" fill="none" stroke="currentColor" stroke-width="1" opacity="0.35"/>
				<line x1="12" y1="52" x2="8" y2="70" stroke="currentColor" stroke-width="1" opacity="0.3"/>
				<line x1="24" y1="52" x2="28" y2="70" stroke="currentColor" stroke-width="1" opacity="0.3"/>
				<ellipse cx="18" cy="70" rx="9" ry="4" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"/>
			</svg>
		</div>

		<div class="hero-content">
			<p class="bismillah" lang="ar">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>

			<div class="gold-rule" aria-hidden="true">
				<svg viewBox="0 0 300 12" xmlns="http://www.w3.org/2000/svg">
					<line x1="0" y1="6" x2="108" y2="6" stroke="currentColor" stroke-width="0.6" opacity="0.5"/>
					<polygon points="118,6 128,2 138,6 128,10" fill="currentColor" opacity="0.5"/>
					<polygon points="162,6 172,2 182,6 172,10" fill="currentColor" opacity="0.5"/>
					<line x1="192" y1="6" x2="300" y2="6" stroke="currentColor" stroke-width="0.6" opacity="0.5"/>
				</svg>
			</div>

			<p class="hero-quote">"Sejambak bunga kami hulurkan, semekar senyuman seikhlas hati."</p>
			<p class="hero-invite">kami menjemput Tuan/Puan/Encik/Cik ke</p>
			<p class="hero-event">{ev.type}</p>
			<p class="hero-putera">putera kami</p>

			<h1 class="hero-groom">{wedding.groom.nameDisplay}</h1>

			<div class="divider-row">
				<span class="divider-line"></span>
				<span class="divider-text">dengan pilihan hatinya</span>
				<span class="divider-line"></span>
			</div>

			<p class="hero-bride">{wedding.bride.nameDisplay}</p>

			<div class="gold-rule" aria-hidden="true">
				<svg viewBox="0 0 300 12" xmlns="http://www.w3.org/2000/svg">
					<line x1="0" y1="6" x2="108" y2="6" stroke="currentColor" stroke-width="0.6" opacity="0.5"/>
					<polygon points="118,6 128,2 138,6 128,10" fill="currentColor" opacity="0.5"/>
					<polygon points="162,6 172,2 182,6 172,10" fill="currentColor" opacity="0.5"/>
					<line x1="192" y1="6" x2="300" y2="6" stroke="currentColor" stroke-width="0.6" opacity="0.5"/>
				</svg>
			</div>

			<div class="date-box">
				<p class="date-hijri">{ev.hijriDisplay}</p>
				<div class="date-main">
					<span class="date-num">{ev.date.split('-')[2]}</span>
					<div>
						<span class="date-month">MEI 2026</span>
						<span class="date-day">{ev.dayDisplay}</span>
					</div>
				</div>
			</div>

			<!-- Countdown -->
			<div class="hero-countdown">
				<Countdown targetDate={ev.date} theme="malay" />
			</div>

			<!-- Scroll hint -->
			<div class="scroll-hint" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
				</svg>
			</div>
		</div>

		<!-- Bottom geometric border -->
		<div class="geo-border geo-bottom" aria-hidden="true">
			<svg viewBox="0 0 400 20" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M0,10 L10,0 L20,10 L30,0 L40,10 L50,0 L60,10 L70,0 L80,10 L90,0 L100,10 L110,0 L120,10 L130,0 L140,10 L150,0 L160,10 L170,0 L180,10 L190,0 L200,10 L210,0 L220,10 L230,0 L240,10 L250,0 L260,10 L270,0 L280,10 L290,0 L300,10 L310,0 L320,10 L330,0 L340,10 L350,0 L360,10 L370,0 L380,10 L390,0 L400,10" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>
				<path d="M0,10 L10,20 L20,10 L30,20 L40,10 L50,20 L60,10 L70,20 L80,10 L90,20 L100,10 L110,20 L120,10 L130,20 L140,10 L150,20 L160,10 L170,20 L180,10 L190,20 L200,10 L210,20 L220,10 L230,20 L240,10 L250,20 L260,10 L270,20 L280,10 L290,20 L300,10 L310,20 L320,10 L330,20 L340,10 L350,20 L360,10 L370,20 L380,10 L390,20 L400,10" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>
			</svg>
		</div>
	</section>

	<!-- ════════════════════════ IBU BAPA ══ -->
	<section class="section bg-soft" aria-label="Ibu bapa pengantin">
		<div class="inner center-text">

			<div class="geo-rule" aria-hidden="true">
				<svg viewBox="0 0 300 12" xmlns="http://www.w3.org/2000/svg">
					<line x1="0" y1="6" x2="115" y2="6" stroke="currentColor" stroke-width="0.6" opacity="0.3"/>
					<path d="M124 6 Q130 1 136 6 Q142 11 148 6 Q154 1 160 6 Q166 11 172 6 Q178 1 184 6" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.6"/>
					<line x1="193" y1="6" x2="300" y2="6" stroke="currentColor" stroke-width="0.6" opacity="0.3"/>
				</svg>
			</div>

			<p class="parents-intro">Dengan segala hormat dan penuh kerendahan hati,<br>kami yang berbahagia</p>

			<div class="parents-block">
				<p class="parents-role">Pihak Pengantin Lelaki</p>
				<p class="parents-name">{wedding.groom.father}</p>
				<p class="parents-amp">&amp;</p>
				<p class="parents-name">{wedding.groom.mother}</p>
			</div>

			<div class="parents-dan">
				<span class="dan-line"></span>
				<span class="dan-text">bersama</span>
				<span class="dan-line"></span>
			</div>

			<div class="parents-block">
				<p class="parents-role">Pihak Pengantin Perempuan</p>
				<p class="parents-name">{wedding.bride.father}</p>
				<p class="parents-amp">&amp;</p>
				<p class="parents-name">{wedding.bride.mother}</p>
			</div>

			<div class="parents-pantun">
				<p>Melati putih berseri indah,</p>
				<p>Harum mewangi sepanjang masa.</p>
				<p>Dengan hati yang tulus dan penuh kasih sayang,</p>
				<p>Kami menjemput ke majlis yang penuh berkat ini.</p>
			</div>

			<div class="geo-rule" aria-hidden="true">
				<svg viewBox="0 0 300 12" xmlns="http://www.w3.org/2000/svg">
					<line x1="0" y1="6" x2="115" y2="6" stroke="currentColor" stroke-width="0.6" opacity="0.3"/>
					<path d="M124 6 Q130 1 136 6 Q142 11 148 6 Q154 1 160 6 Q166 11 172 6 Q178 1 184 6" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.6"/>
					<line x1="193" y1="6" x2="300" y2="6" stroke="currentColor" stroke-width="0.6" opacity="0.3"/>
				</svg>
			</div>

		</div>
	</section>

	<!-- ════════════════════════ ATURCARA ══ -->
	<section id="aturcara" class="section" aria-labelledby="aturcara-title">
		<div class="inner">
			<p class="section-tag" id="aturcara-title">Aturcara Majlis</p>
			<div class="section-rule" aria-hidden="true"></div>

			<div class="venue-card">
				<div class="venue-icon" aria-hidden="true">
					<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
						<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
					</svg>
				</div>
				<div>
					<p class="venue-name">{ev.venue}, {ev.venueShort}</p>
					<p class="venue-addr">{ev.address}</p>
				</div>
			</div>

			<ol class="timeline">
				<li class="tl-item">
					<div class="tl-left">
						<span class="tl-time">11.00 pg</span>
					</div>
					<div class="tl-mid">
						<span class="tl-dot"></span>
						<span class="tl-bar"></span>
					</div>
					<div class="tl-right">
						<strong>Jamuan Makan Dibuka</strong>
						<span>Tetamu dijemput hadir · {ev.time.jamuan.display}</span>
					</div>
				</li>
				<li class="tl-item">
					<div class="tl-left">
						<span class="tl-time">12.00 tgh</span>
					</div>
					<div class="tl-mid">
						<span class="tl-dot"></span>
						<span class="tl-bar"></span>
					</div>
					<div class="tl-right">
						<strong>Ketibaan Pengantin</strong>
						<span>Majlis bersanding</span>
					</div>
				</li>
				<li class="tl-item">
					<div class="tl-left">
						<span class="tl-time">5.00 ptg</span>
					</div>
					<div class="tl-mid">
						<span class="tl-dot"></span>
					</div>
					<div class="tl-right">
						<strong>Majlis Selesai</strong>
						<span>Terima kasih atas kehadiran</span>
					</div>
				</li>
			</ol>
		</div>
	</section>

	<!-- ════════════════════════ LOKASI ══ -->
	<section id="lokasi" class="section bg-soft" aria-labelledby="lokasi-title">
		<div class="inner">
			<p class="section-tag" id="lokasi-title">Lokasi Majlis</p>
			<div class="section-rule" aria-hidden="true"></div>

			{#if MAP_EMBED_URL}
				<div class="map-frame">
					<iframe src={MAP_EMBED_URL} title="Peta {ev.venue}" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>
				</div>
			{:else}
				<div class="map-placeholder">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="40" height="40" opacity="0.3">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
					</svg>
					<p>Peta akan dipaparkan selepas <code>MAP_EMBED_URL</code> diisi</p>
				</div>
			{/if}

			<div class="location-info">
				<p class="loc-name">{ev.venue}, {ev.venueShort}</p>
				<p class="loc-addr">{ev.address}</p>
			</div>

			<div class="map-btns">
				<a href={ev.googleMapsUrl} target="_blank" rel="noopener noreferrer" class="map-btn btn-gmaps">
					<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
					Google Maps
				</a>
				<a href={ev.wazeUrl} target="_blank" rel="noopener noreferrer" class="map-btn btn-waze">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><path fill="#37474f" d="M27,38C9.1,38,5.2,33.2,3.6,31.1c-0.4-0.4-0.6-1-0.6-1.6C3,28.1,4.1,27,5.5,27C6.4,27,9,27,9,22.1 v-0.6C9,12.4,17.1,5,27,5s18,7.4,18,16.5S36.9,38,27,38z"/><path fill="#eceff1" d="M27,36c8.8,0,16-6.5,16-14.5S35.8,7,27,7s-16,6.5-16,14.5v0.6c0,6.2-3.8,6.9-5.5,6.9 C5.2,29,5,29.2,5,29.5c0,0.1,0,0.2,0.1,0.3C6.6,31.7,10,36,27,36z"/><path fill="#37474f" d="M32 16A2 2 0 1 0 32 20 2 2 0 1 0 32 16zM22 16A2 2 0 1 0 22 20 2 2 0 1 0 22 16zM27 29c-4.8 0-6.7-3.5-7-5.3-.1-.5.3-1.1.8-1.2.5-.1 1.1.3 1.2.8 0 .1.7 3.7 5 3.7 4.3 0 5-3.5 5-3.7.1-.5.6-.9 1.2-.8.5.1.9.6.8 1.1C33.7 25.5 31.8 29 27 29zM16.5 34A4.5 4.5 0 1 0 16.5 43 4.5 4.5 0 1 0 16.5 34z"/><path fill="#607d8b" d="M16.5 37A1.5 1.5 0 1 0 16.5 40A1.5 1.5 0 1 0 16.5 37Z"/><path fill="#37474f" d="M32.5 34A4.5 4.5 0 1 0 32.5 43A4.5 4.5 0 1 0 32.5 34Z"/><path fill="#607d8b" d="M32.5 37A1.5 1.5 0 1 0 32.5 40A1.5 1.5 0 1 0 32.5 37Z"/></svg>
					Waze
				</a>
			</div>

			<div class="loc-notes">
				<div class="loc-note-row">
					<span>Tempat Letak Kereta</span>
					<span>Di tepi jalan sekitar kawasan</span>
				</div>
				<div class="loc-note-row">
					<span>Jarak dari Bandar KB</span>
					<span>± 15 minit</span>
				</div>
			</div>
		</div>
	</section>

	<!-- ════════════════════════ RSVP ══ -->
	<section id="rsvp" class="section" aria-labelledby="rsvp-title">
		<div class="inner center-text">
			<p class="section-tag" id="rsvp-title">Pengesahan Kehadiran</p>
			<div class="section-rule" aria-hidden="true"></div>

			<p class="body-text">
				Sila sahkan kehadiran anda sebelum <strong>20 Mei 2026</strong>.
			</p>

			{#if rsvpStatus === 'ok'}
				<div class="form-success">
					<p>✓ Terima kasih! Kehadiran anda telah direkodkan.</p>
				</div>
			{:else}
				<form class="custom-form" onsubmit={submitRsvp}>
					<div class="field">
						<label for="rsvp-nama">Nama penuh</label>
						<input id="rsvp-nama" type="text" bind:value={rsvp.nama} placeholder="Nama anda" required />
					</div>
					<div class="field">
						<label for="rsvp-bil">Bilangan hadir</label>
						<select id="rsvp-bil" bind:value={rsvp.bil}>
							{#each ['1','2','3','4','5','6','7','8','9','10'] as n}
								<option value={n}>{n} orang</option>
							{/each}
						</select>
					</div>
					<div class="field">
						<label for="rsvp-tel">Nombor telefon</label>
						<input id="rsvp-tel" type="tel" bind:value={rsvp.telefon} placeholder="01X-XXXXXXX" />
					</div>
					<div class="field">
						<label for="rsvp-catatan">Catatan <span class="optional">(pilihan)</span></label>
						<textarea id="rsvp-catatan" bind:value={rsvp.catatan} rows="2" placeholder="Alahan makanan, dll."></textarea>
					</div>
					{#if rsvpStatus === 'err'}
						<p class="form-error">Ralat berlaku. Cuba semula.</p>
					{/if}
					<button type="submit" class="btn-primary" disabled={rsvpStatus === 'loading'}>
						{rsvpStatus === 'loading' ? 'Menghantar…' : 'Sahkan Kehadiran'}
					</button>
				</form>
			{/if}

			<button onclick={downloadIcs} class="btn-ghost">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
				Tambah ke Kalendar
			</button>
		</div>
	</section>

	<!-- ════════════════════════ UCAPAN ══ -->
	<section id="ucapan" class="section bg-soft" aria-labelledby="ucapan-title">
		<div class="inner">
			<p class="section-tag" id="ucapan-title">Ucapan &amp; Doa</p>
			<div class="section-rule" aria-hidden="true"></div>

			{#if ucapanStatus === 'ok'}
				<div class="form-success">
					<p>✓ Ucapan anda telah dihantar. Terima kasih!</p>
				</div>
			{:else}
				<form class="custom-form" onsubmit={submitUcapan}>
					<div class="field">
						<label for="ucapan-nama">Nama anda</label>
						<input id="ucapan-nama" type="text" bind:value={ucapanForm.nama} placeholder="Nama anda" required />
					</div>
					<div class="field">
						<label for="ucapan-msg">Ucapan &amp; Doa</label>
						<textarea id="ucapan-msg" bind:value={ucapanForm.ucapan} rows="4" placeholder="Tulis ucapan atau doa untuk pengantin…" required></textarea>
					</div>
					{#if ucapanStatus === 'err'}
						<p class="form-error">Ralat berlaku. Cuba semula.</p>
					{/if}
					<button type="submit" class="btn-primary" disabled={ucapanStatus === 'loading'}>
						{ucapanStatus === 'loading' ? 'Menghantar…' : 'Hantar Ucapan'}
					</button>
				</form>
			{/if}

			<!-- Paparan ucapan tetamu -->
			{#if ucapanLoading}
				<p class="ucapan-note">Memuatkan ucapan…</p>
			{:else if ucapanList.length === 0}
				<p class="ucapan-note">Belum ada ucapan lagi. Jadilah yang pertama!</p>
			{:else}
				<div class="ucapan-grid">
					{#each ucapanList as u (ucapanKey(u))}
						<div class="ucapan-card">
							<div class="ucapan-avatar" aria-hidden="true">
								{u.nama.charAt(0).toUpperCase()}
							</div>
							<div class="ucapan-body">
								<p class="ucapan-name">{u.nama}</p>
								<p class="ucapan-msg">"{u.msg}"</p>
								<div class="ucapan-reactions">
									{#each EMOJIS as emoji (emoji)}
										<button
											class="reaction-btn"
											class:reacted={myReactions[ucapanKey(u)] === emoji}
											onclick={() => toggleReaction(u, emoji)}
											aria-label="Reaksi {emoji}"
										>
											{emoji}
											{#if reactions[ucapanKey(u)]?.[emoji]}
												<span class="reaction-count">{reactions[ucapanKey(u)][emoji]}</span>
											{/if}
										</button>
									{/each}
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</section>

	<!-- ════════════════════ HUBUNGI ══ -->
	<section id="hubungi" class="section" aria-labelledby="hubungi-title">
		<div class="inner">
			<p class="section-tag" id="hubungi-title">Untuk Dihubungi</p>
			<div class="section-rule" aria-hidden="true"></div>

			<div class="contact-grid">
				{#each ev.contacts as c}
					<div class="contact-card">
						<div class="contact-avatar" aria-hidden="true">{c.name.charAt(0)}</div>
						<div class="contact-info">
							<p class="contact-name">{c.name}</p>
						</div>
						<div class="contact-actions">
							<a href={waLink(c.phone)} target="_blank" rel="noopener noreferrer" class="contact-btn btn-wa" aria-label="WhatsApp {c.name}">
								<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
								WhatsApp
							</a>
							<a href="tel:{c.phone.replace(/\s/g,'')}" class="contact-btn btn-call" aria-label="Telefon {c.name}">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 12.28a19.79 19.79 0 01-3.07-8.67A2 2 0 011.95 2H5a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
								Telefon
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ════════════════════ KONGSI ══ -->
	<section id="kongsi" class="section bg-soft" aria-labelledby="kongsi-title">
		<div class="inner center-text">
			<p class="section-tag" id="kongsi-title">Kongsi Jemputan</p>
			<div class="section-rule" aria-hidden="true"></div>

			<div class="share-layout">
				<QRCard url={pageUrl} label="Imbas QR untuk buka jemputan" theme="malay" size={150} />
				<div class="share-right">
					<p class="body-text">Kongsikan jemputan ini kepada rakan dan keluarga.</p>
					<ShareButtons url={pageUrl} message={waMessage} theme="malay" />
					<ShareCard
						brideName={wedding.bride.nameDisplay}
						groomName={wedding.groom.nameDisplay}
						eventLabel={ev.type}
						dayDisplay={ev.dayDisplay}
						dateDisplay={ev.dateDisplay}
						hijriDisplay={ev.hijriDisplay}
						venue={ev.venue}
						timeDisplay={ev.time.jamuan.display}
						hashtag={wedding.hashtag}
						theme="malay"
						swapNames={true}
					/>
				</div>
			</div>
		</div>
	</section>

	<!-- ════════════════════ DOA + FOOTER ══ -->
	<footer class="page-footer" aria-label="Doa dan penutup">
		<p class="footer-aya" lang="ar">وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا</p>
		<p class="footer-aya-ref">Surah Ar-Rum: 21</p>
		<p class="footer-hashtag">{wedding.hashtag}</p>

		<div class="footer-credit">
			<p class="footer-made">Dibuat dengan ❤️ oleh Syarah &amp; Munir</p>
			<p class="footer-contact">
				Berminat website jemputan sebegini?
				<a href="https://wa.me/60135636124" target="_blank" rel="noopener noreferrer" class="footer-wa">
					Hubungi: +60 13-5636124
				</a>
			</p>
		</div>
	</footer>
</main>

<style>
	/* ── Base ── */
	:global(html) {
		scroll-snap-type: y proximity;
	}

	main {
		font-family: var(--font-lato);
		color: var(--text);
		background: var(--bg);
		/* CSS vars scoped to this page */
		--p: #c9a227;
		--p-light: rgba(201,162,39,0.10);
		--p-rule: rgba(201,162,39,0.22);
		--text: #2d1a00;
		--muted: #7a6030;
		--bg: #ffffff;
		--bg-soft: #fdf8ed;
	}

	/* ── Hero ── */
	.hero {
		min-height: 100dvh;
		scroll-snap-align: start;
		background:
			linear-gradient(to bottom, rgba(254,249,228,0.6) 0%, rgba(253,244,200,0.5) 60%, rgba(253,248,236,0.7) 100%),
			url('/bg_munir.jpeg') center top/cover no-repeat;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		padding: 3rem 1.5rem;
		text-align: center;
		overflow: hidden;
	}

	@media (min-width: 768px) {
		.hero {
			background:
				linear-gradient(to bottom, rgba(254,249,228,0.72) 0%, rgba(253,244,200,0.65) 60%, rgba(253,248,236,0.78) 100%),
				url('/bg_munir.jpeg') center top/cover no-repeat;
		}
	}

	/* ── Falling petals animation ── */
	.page-fx {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 3;
		overflow: hidden;
	}

	.petal-wrap {
		position: absolute;
		top: -25px;
		width: var(--sz, 14px);
		height: calc(var(--sz, 14px) * 1.6);
		border-radius: 50% 0 50% 0;
		opacity: 0;
		animation: petal-fall var(--du, 9s) var(--de, 0s) linear infinite;
	}

	@keyframes petal-fall {
		0%   { transform: translateY(0) rotate(0deg) translateX(0);           opacity: 0; }
		6%   { opacity: 0.6; }
		50%  { transform: translateY(50vh) rotate(200deg) translateX(20px); }
		94%  { opacity: 0.35; }
		100% { transform: translateY(112vh) rotate(400deg) translateX(-10px); opacity: 0; }
	}

	.geo-border {
		position: absolute;
		left: 0;
		right: 0;
		height: 20px;
		color: var(--p);
	}
	.geo-top { top: 0; }
	.geo-bottom { bottom: 0; }
	.geo-border svg { width: 100%; height: 100%; display: block; }

	.lantern {
		position: absolute;
		top: 3.5rem;
		width: 36px;
		height: 110px;
		color: var(--p);
		pointer-events: none;
	}
	.lantern-l { left: 1.25rem; }
	.lantern-r { right: 1.25rem; }
	.lantern svg { width: 100%; height: 100%; }

	.hero-content {
		max-width: 500px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.55rem;
	}

	@media (min-width: 768px) {
		.hero-content { gap: 0.9rem; }
	}

	.bismillah {
		font-family: var(--font-amiri);
		font-size: clamp(2rem, 6vw, 3rem);
		color: var(--text);
		direction: rtl;
		line-height: 1.4;
		margin: 0;
	}

	.gold-rule {
		width: 100%;
		max-width: 300px;
		color: var(--p);
	}
	.gold-rule svg { width: 100%; display: block; }

	.hero-quote {
		font-family: var(--font-noto);
		font-size: clamp(0.78rem, 2vw, 0.88rem);
		font-style: italic;
		color: var(--muted);
		line-height: 1.7;
		margin: 0;
	}

	.hero-invite {
		font-size: clamp(0.76rem, 2vw, 0.86rem);
		color: var(--muted);
		line-height: 1.6;
		margin: 0;
	}

	.hero-event {
		font-family: var(--font-playfair);
		font-size: clamp(0.85rem, 2.5vw, 1rem);
		font-weight: 600;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--p);
		margin: 0;
	}

	.hero-putera {
		font-size: 0.75rem;
		color: var(--muted);
		font-style: italic;
		margin: 0;
	}

	.hero-groom {
		font-family: var(--font-playfair);
		font-size: clamp(2rem, 8vw, 3.5rem);
		font-weight: 700;
		color: var(--text);
		letter-spacing: 0.04em;
		line-height: 1.1;
		margin: 0;
	}

	.divider-row {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
		max-width: 360px;
	}

	.divider-line {
		flex: 1;
		height: 1px;
		background: var(--p-rule);
		display: block;
	}

	.divider-text {
		font-size: 0.7rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--muted);
		font-style: italic;
		white-space: nowrap;
	}

	.hero-bride {
		font-family: var(--font-playfair);
		font-size: clamp(1.4rem, 5vw, 2.25rem);
		font-weight: 400;
		font-style: italic;
		color: var(--p);
		letter-spacing: 0.06em;
		margin: 0;
	}

	.date-box {
		border: 1px solid rgba(255,255,255,0.4);
		padding: 1rem 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		background: rgba(255,255,255,0.15);
		border-radius: 4px;
	}

	.date-hijri {
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.date-main {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.date-num {
		font-family: var(--font-playfair);
		font-size: clamp(3rem, 10vw, 5rem);
		font-weight: 700;
		color: var(--text);
		line-height: 1;
	}

	.date-main > div {
		display: flex;
		flex-direction: column;
	}

	.date-month {
		font-family: var(--font-lato);
		font-size: 0.95rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		color: var(--p);
	}

	.date-day {
		font-size: 0.72rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.hero-countdown {
		width: 100%;
	}



	.scroll-hint {
		color: var(--muted);
		animation: bounce 2s ease-in-out infinite;
		margin-top: 0.5rem;
	}

	@keyframes bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(6px); }
	}

	/* ── Sections ── */
	.section {
		padding: 4rem 1.5rem;
		min-height: 100dvh;
		scroll-snap-align: start;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.bg-soft {
		background: var(--bg-soft);
	}

	.parents-intro {
		font-size: 0.82rem;
		color: var(--muted);
		line-height: 1.8;
		margin: 0 0 1.5rem;
	}

	.parents-block {
		margin-bottom: 0.5rem;
	}

	.parents-role {
		font-size: 0.65rem;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: var(--p);
		margin: 0 0 0.4rem;
	}

	.parents-name {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text);
		margin: 0;
		line-height: 1.5;
	}

	.parents-amp {
		font-size: 0.85rem;
		color: var(--muted);
		margin: 0.1rem 0;
	}

	.parents-dan {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin: 1rem 0;
	}

	.dan-line {
		flex: 1;
		height: 1px;
		background: var(--p-rule);
	}

	.dan-text {
		font-size: 0.72rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.parents-pantun {
		margin-top: 1.5rem;
		padding: 1rem 1.2rem;
		border-left: 2px solid var(--p-rule);
		text-align: left;
	}

	.parents-pantun p {
		font-size: 0.82rem;
		font-style: italic;
		color: var(--muted);
		line-height: 1.9;
		margin: 0;
	}

	.inner {
		width: 100%;
		max-width: 580px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.center-text { text-align: center; }

	.section-tag {
		font-size: 0.68rem;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 0;
		text-align: center;
	}

	.section-rule {
		width: 36px;
		height: 2px;
		background: var(--p);
		margin: -1rem 0 0;
		opacity: 0.7;
	}

	.parents-name {
		font-family: var(--font-playfair);
		font-size: clamp(0.9rem, 2.5vw, 1.05rem);
		font-weight: 600;
		color: var(--text);
		line-height: 1.6;
		margin: 0;
		text-align: center;
	}

	.body-text {
		font-size: 0.9rem;
		color: var(--muted);
		line-height: 1.8;
		margin: 0;
	}

	/* ── Venue card ── */
	.venue-card {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		background: var(--p-light);
		padding: 1rem 1.25rem;
		border-radius: 8px;
		width: 100%;
		text-align: left;
	}

	.venue-icon { color: var(--p); flex-shrink: 0; margin-top: 2px; }

	.venue-name {
		font-family: var(--font-playfair);
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--text);
		margin: 0;
	}

	.venue-addr {
		font-size: 0.8rem;
		color: var(--muted);
		margin: 0.2rem 0 0;
	}

	/* ── Timeline ── */
	.timeline {
		list-style: none;
		padding: 0;
		margin: 0;
		width: 100%;
	}

	.tl-item {
		display: grid;
		grid-template-columns: 80px 24px 1fr;
		gap: 0 0.75rem;
		align-items: flex-start;
	}

	.tl-left {
		text-align: right;
		padding-top: 0.1rem;
	}

	.tl-time {
		font-family: var(--font-playfair);
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--p);
		white-space: nowrap;
	}

	.tl-mid {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 0.3rem;
		align-self: stretch;
	}

	.tl-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--p);
		flex-shrink: 0;
		box-shadow: 0 0 0 3px rgba(201,162,39,0.18);
	}

	.tl-bar {
		flex: 1;
		width: 1px;
		background: var(--p-rule);
		margin-top: 4px;
	}

	.tl-right {
		padding: 0 0 1.5rem;
	}

	.tl-right strong {
		display: block;
		font-size: 0.9rem;
		color: var(--text);
		font-weight: 600;
	}

	.tl-right span {
		font-size: 0.78rem;
		color: var(--muted);
		line-height: 1.6;
	}

	/* ── Map ── */
	.map-frame {
		width: 100%;
		border-radius: 10px;
		overflow: hidden;
		box-shadow: 0 2px 16px rgba(0,0,0,0.08);
	}

	.map-frame iframe {
		width: 100%;
		height: 280px;
		border: none;
		display: block;
	}

	.map-placeholder {
		width: 100%;
		background: var(--p-light);
		border: 1px dashed var(--p-rule);
		border-radius: 10px;
		padding: 2.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		text-align: center;
		color: var(--muted);
		font-size: 0.82rem;
	}

	.map-placeholder code {
		background: rgba(0,0,0,0.05);
		padding: 1px 6px;
		border-radius: 3px;
	}

	.location-info { text-align: center; }

	.loc-name {
		font-family: var(--font-playfair);
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text);
		margin: 0;
	}

	.loc-addr {
		font-size: 0.8rem;
		color: var(--muted);
		margin: 0.25rem 0 0;
	}

	.map-btns {
		display: flex;
		gap: 0.75rem;
		width: 100%;
	}

	.map-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.7rem 1rem;
		border-radius: 6px;
		font-family: var(--font-lato);
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-decoration: none;
		transition: opacity 0.15s;
	}

	.map-btn:hover { opacity: 0.8; }
	.btn-gmaps { background: var(--p); color: #fff; }
	.btn-waze { background: var(--p-light); color: var(--text); border: 1px solid var(--p-rule); }

	.loc-notes {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border-top: 1px solid var(--p-rule);
		padding-top: 1rem;
	}

	.loc-note-row {
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		color: var(--muted);
	}

	.loc-note-row span:last-child { color: var(--text); font-weight: 500; }

	/* ── Buttons ── */
	.btn-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.85rem 2.5rem;
		background: var(--p);
		color: #fff;
		font-family: var(--font-lato);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		text-decoration: none;
		border-radius: 4px;
		border: none;
		cursor: pointer;
		transition: opacity 0.15s, transform 0.15s;
	}

	.btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }

	.btn-ghost {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.7rem 1.75rem;
		background: transparent;
		color: var(--text);
		font-family: var(--font-lato);
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-decoration: none;
		border-radius: 4px;
		border: 1px solid var(--p-rule);
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s;
	}

	.btn-ghost { text-decoration: none; }
	.btn-ghost:hover { background: var(--p-light); border-color: var(--p); }

	/* ── Custom Form ── */
	.custom-form {
		width: 100%;
		align-self: stretch;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		text-align: left;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.field label {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--text);
		letter-spacing: 0.04em;
	}

	.optional {
		font-weight: 400;
		color: var(--muted);
	}

	.field input,
	.field select,
	.field textarea {
		width: 100%;
		padding: 0.65rem 0.9rem;
		border: 1.5px solid rgba(0,0,0,0.12);
		border-radius: 10px;
		font-size: 0.92rem;
		font-family: var(--font-lato);
		color: var(--text);
		background: #fff;
		transition: border-color 0.2s;
		outline: none;
		box-sizing: border-box;
	}

	.field input:focus,
	.field select:focus,
	.field textarea:focus {
		border-color: var(--p);
	}

	.field textarea { resize: vertical; }

	.form-success {
		background: #edf7ed;
		border: 1px solid #b7dfb8;
		border-radius: 10px;
		padding: 1rem 1.2rem;
		color: #2d6a2f;
		font-size: 0.9rem;
		text-align: center;
	}

	.form-error {
		font-size: 0.8rem;
		color: #c0392b;
		margin: 0;
	}

	/* ── Ucapan ── */
	.ucapan-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}

	.ucapan-card {
		display: flex;
		gap: 0.9rem;
		align-items: flex-start;
		background: #fff;
		border-radius: 10px;
		padding: 1rem 1.25rem;
		box-shadow: 0 1px 8px rgba(0,0,0,0.05);
		border: 1px solid rgba(0,0,0,0.04);
	}

	.ucapan-avatar {
		width: 38px;
		height: 38px;
		border-radius: 50%;
		background: var(--p);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-playfair);
		font-size: 1rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.ucapan-name {
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--text);
		margin: 0 0 0.25rem;
	}

	.ucapan-msg {
		font-size: 0.83rem;
		color: var(--muted);
		line-height: 1.6;
		margin: 0 0 0.5rem;
		font-style: italic;
	}

	.ucapan-reactions {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.reaction-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		background: rgba(0,0,0,0.04);
		border: 1.5px solid transparent;
		border-radius: 50px;
		padding: 0.2rem 0.55rem;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.15s;
		color: var(--text);
		line-height: 1;
	}

	.reaction-btn:hover {
		background: rgba(201,162,39,0.12);
		border-color: rgba(201,162,39,0.4);
		transform: scale(1.08);
	}

	.reaction-btn.reacted {
		background: rgba(201,162,39,0.15);
		border-color: var(--p);
	}

	.reaction-count {
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--p);
	}

	.ucapan-note {
		font-size: 0.7rem;
		color: #bbb;
		text-align: center;
		margin: 0;
	}

	/* ── Contacts ── */
	.contact-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}

	.contact-card {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		background: #fff;
		border: 1px solid rgba(0,0,0,0.06);
		border-radius: 10px;
		padding: 0.85rem 1rem;
		box-shadow: 0 1px 6px rgba(0,0,0,0.04);
	}

	.contact-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--p-light);
		color: var(--p);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-playfair);
		font-size: 1rem;
		font-weight: 700;
		flex-shrink: 0;
		border: 1px solid var(--p-rule);
	}

	.contact-info {
		flex: 1;
	}

	.contact-name {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text);
		margin: 0;
	}

	.contact-actions {
		display: flex;
		gap: 0.4rem;
	}

	.contact-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.45rem 0.75rem;
		border-radius: 6px;
		font-size: 0.72rem;
		font-weight: 600;
		text-decoration: none;
		transition: opacity 0.15s;
	}

	.contact-btn:hover { opacity: 0.8; }
	.btn-wa { background: #25d366; color: #fff; }
	.btn-call { background: var(--p-light); color: var(--p); border: 1px solid var(--p-rule); }

	/* ── Share ── */
	.share-layout {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1.5rem;
		align-items: center;
		width: 100%;
	}

	.share-right {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		align-items: center;
	}

	@media (max-width: 460px) {
		.share-layout {
			grid-template-columns: 1fr;
			justify-items: center;
		}
		.share-right {
			align-items: center;
			text-align: center;
		}
	}


	@media (max-width: 360px) {
		.contact-btn {
			padding: 0.4rem 0.5rem;
			font-size: 0.65rem;
			gap: 0.2rem;
		}
		.contact-btn svg { width: 14px; height: 14px; }
	}

	/* ── Doa section ── */
	/* ── Footer (doa + kredit) ── */
	.page-footer {
		scroll-snap-align: start;
		min-height: 100dvh;
		padding: 3.5rem 1.5rem 2rem;
		background: var(--bg-soft);
		border-top: 1px solid var(--p-rule);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		position: relative;
	}

	.footer-credit {
		position: absolute;
		bottom: calc(58px + 1.25rem);
		left: 0; right: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0 1rem;
	}

	.footer-aya {
		font-family: var(--font-amiri);
		font-size: clamp(1.1rem, 3vw, 1.5rem);
		direction: rtl;
		color: var(--text);
		max-width: 480px;
		line-height: 1.7;
		margin: 0;
	}

	.footer-aya-ref {
		font-size: 0.7rem;
		letter-spacing: 0.12em;
		font-style: italic;
		color: var(--muted);
		margin: 0;
	}

	.footer-hashtag {
		font-family: var(--font-playfair);
		font-size: 1rem;
		color: var(--p);
		font-style: italic;
		margin: 0.25rem 0;
	}

	.footer-made {
		font-family: var(--font-lato);
		font-size: 0.78rem;
		color: var(--muted);
		margin: 0;
	}

	.footer-contact {
		font-family: var(--font-lato);
		font-size: 0.75rem;
		color: var(--muted);
		margin: 0;
		text-align: center;
	}

	.footer-wa {
		color: #25d366;
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
	}

	.footer-wa:hover {
		text-decoration: underline;
	}

</style>
