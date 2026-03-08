<script lang="ts">
	import { browser } from '$app/environment';
	import { wedding } from '$lib/data/wedding';
	import { generateIcs } from '$lib/utils/ics';
	import Countdown from '$lib/components/Countdown.svelte';
	import ShareButtons from '$lib/components/ShareButtons.svelte';
	import QRCard from '$lib/components/QRCard.svelte';
	import StickyNav from '$lib/components/StickyNav.svelte';

	const ev = wedding.events.perempuan;

	// ─── ISI MAKLUMAT INI ────────────────────────────────────────
	const RSVP_FORM_URL   = 'https://forms.gle/1GLBcBGsTWnwM1t88';
	const UCAPAN_FORM_URL = 'https://forms.gle/xzHER6pTgHKCUDKdA';
	const MAP_EMBED_URL   = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.056380320236!2d102.24015159999999!3d6.1231146999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31b6afc47ea539c9%3A0x10827cb0596fc3a0!2sJubli%20Perak%20Hall!5e0!3m2!1sen!2smy!4v1772927876941!5m2!1sen!2smy';
	// ─────────────────────────────────────────────────────────────

	// Sample ucapan — ganti dengan data dari Google Sheets selepas majlis
	const sampleUcapan = [
		{ name: 'Hanis Amirah', msg: 'Tahniah buat pengantin baru! Semoga kekal bahagia hingga ke akhir hayat. Amin.' },
		{ name: 'Izzatul Husna', msg: 'Selamat pengantin baru Syarah & Munir! Semoga rumah tangga diberkati Allah.' },
		{ name: 'Farhana Zulaikha', msg: 'Bahagia selalu! Doakan kami datang dengan hati yang penuh kegembiraan.' },
		{ name: 'Keluarga Roslan', msg: 'Alhamdulillah, semoga menjadi pasangan yang sakinah mawaddah warahmah.' }
	];

	const navSections = [
		{ id: 'hero',     label: 'Utama',    icon: '🏠' },
		{ id: 'aturcara', label: 'Aturcara', icon: '📋' },
		{ id: 'lokasi',   label: 'Lokasi',   icon: '📍' },
		{ id: 'rsvp',     label: 'RSVP',     icon: '✉️' },
		{ id: 'ucapan',   label: 'Ucapan',   icon: '💬' },
		{ id: 'hubungi',  label: 'Hubungi',  icon: '📞' },
		{ id: 'kongsi',   label: 'QR',       icon: '📱' }
	];

	const pageUrl = browser ? window.location.origin + '/perempuan' : '';
	const waMessage = `Assalamualaikum, saya menerima jemputan ke Majlis Perkahwinan ${wedding.bride.name} & ${wedding.groom.name} pada ${ev.dayDisplay}, ${ev.dateDisplay} di ${ev.venue}.\n\n${pageUrl}\n\n${wedding.hashtag}`;

	function downloadIcs() {
		generateIcs({
			title: `${ev.typeShort} – ${wedding.bride.name} & ${wedding.groom.name}`,
			description: `${ev.type}\n${ev.venue}\nJamuan: ${ev.time.jamuan.display}`,
			location: ev.address,
			startDate: ev.date,
			startTime: ev.time.jamuan.start,
			endTime: ev.time.jamuan.end
		});
	}

	function waLink(phone: string) {
		return `https://wa.me/6${phone.replace(/[-\s]/g,'').replace(/^0/,'')}`;
	}

	// ─── Custom Forms → Google Sheets ────────────────────────────
	const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyLK9TMtqKnaG0MbkKFv43-aTO8uynzvYS4micTlo48Hn08mxIcPyQ2jser-RbQGBS2/exec';

	let rsvp = $state({ nama: '', bil: '2', telefon: '', catatan: '' });
	let rsvpStatus = $state<'idle'|'loading'|'ok'|'err'>('idle');

	async function submitRsvp(e: Event) {
		e.preventDefault();
		rsvpStatus = 'loading';
		try {
			await fetch(SCRIPT_URL, {
				method: 'POST',
				mode: 'no-cors',
				body: new URLSearchParams({ jenis: 'RSVP - Perempuan', ...rsvp })
			});
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
			await fetch(SCRIPT_URL, {
				method: 'POST',
				mode: 'no-cors',
				body: new URLSearchParams({ jenis: 'Ucapan - Perempuan', ...ucapanForm })
			});
			ucapanStatus = 'ok';
			ucapanForm = { nama: '', ucapan: '' };
		} catch {
			ucapanStatus = 'err';
		}
	}
	// ─────────────────────────────────────────────────────────────
</script>

<svelte:head>
	<title>{wedding.bride.nameDisplay} & {wedding.groom.nameDisplay} — Majlis Perkahwinan</title>
	<meta name="description" content="Jemputan ke {ev.type} pada {ev.dayDisplay}, {ev.dateDisplay} di {ev.venue}." />
</svelte:head>

<!-- Sticky Navigation -->
<StickyNav theme="fairy" sections={navSections} />

<main id="main-content">

	<!-- ══════════════════════════════════ HERO ══ -->
	<section id="hero" class="hero">
		<a href="/" class="back-link" aria-label="Kembali">← Kembali</a>

		<!-- Sudut ornamen -->
		<div class="corner-tl" aria-hidden="true">
			<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M0 50 Q25 25 50 0" stroke="currentColor" stroke-width="1" opacity="0.5"/>
				<path d="M0 70 Q35 35 70 0" stroke="currentColor" stroke-width="0.5" opacity="0.3"/>
				<circle cx="4" cy="4" r="2.5" fill="currentColor" opacity="0.4"/>
			</svg>
		</div>
		<div class="corner-tr" aria-hidden="true">
			<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M100 50 Q75 25 50 0" stroke="currentColor" stroke-width="1" opacity="0.5"/>
				<path d="M100 70 Q65 35 30 0" stroke="currentColor" stroke-width="0.5" opacity="0.3"/>
				<circle cx="96" cy="4" r="2.5" fill="currentColor" opacity="0.4"/>
			</svg>
		</div>
		<div class="corner-bl" aria-hidden="true">
			<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M0 50 Q25 75 50 100" stroke="currentColor" stroke-width="1" opacity="0.5"/>
				<path d="M0 30 Q35 65 70 100" stroke="currentColor" stroke-width="0.5" opacity="0.3"/>
			</svg>
		</div>
		<div class="corner-br" aria-hidden="true">
			<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M100 50 Q75 75 50 100" stroke="currentColor" stroke-width="1" opacity="0.5"/>
				<path d="M100 30 Q65 65 30 100" stroke="currentColor" stroke-width="0.5" opacity="0.3"/>
			</svg>
		</div>

		<div class="hero-content">
			<p class="bismillah" lang="ar">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>

			<div class="wave-rule" aria-hidden="true">
				<svg viewBox="0 0 300 14" xmlns="http://www.w3.org/2000/svg">
					<line x1="0" y1="7" x2="108" y2="7" stroke="currentColor" stroke-width="0.6" opacity="0.4"/>
					<path d="M116 7 Q122 2 128 7 Q134 12 140 7 Q146 2 152 7 Q158 12 164 7 Q170 2 176 7 Q182 12 188 7" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.8"/>
					<line x1="196" y1="7" x2="300" y2="7" stroke="currentColor" stroke-width="0.6" opacity="0.4"/>
				</svg>
			</div>

			<p class="hero-invite">Dengan penuh kesyukuran ke hadrat Ilahi, bersama sejambak mawar setapak sirih</p>
			<p class="hero-invite">kami hulurkan untuk mengundang Tuan/Puan ke</p>
			<p class="hero-event">{ev.type}</p>
			<p class="hero-putri">putri kami</p>

			<h1 class="hero-bride">{wedding.bride.nameDisplay}</h1>

			<div class="divider-row">
				<span class="divider-line"></span>
				<span class="divider-text">Dengan Pasangannya</span>
				<span class="divider-line"></span>
			</div>

			<p class="hero-groom">{wedding.groom.nameDisplay}</p>

			<div class="wave-rule" aria-hidden="true">
				<svg viewBox="0 0 300 14" xmlns="http://www.w3.org/2000/svg">
					<line x1="0" y1="7" x2="108" y2="7" stroke="currentColor" stroke-width="0.6" opacity="0.4"/>
					<path d="M116 7 Q122 2 128 7 Q134 12 140 7 Q146 2 152 7 Q158 12 164 7 Q170 2 176 7 Q182 12 188 7" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.8"/>
					<line x1="196" y1="7" x2="300" y2="7" stroke="currentColor" stroke-width="0.6" opacity="0.4"/>
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
				<Countdown targetDate={ev.date} theme="fairy" />
			</div>

			<!-- Scroll hint -->
			<div class="scroll-hint" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
				</svg>
			</div>
		</div>
	</section>

	<!-- ════════════════════════ IBU BAPA ══ -->
	<section class="section bg-soft" aria-label="Ibu bapa pengantin">
		<div class="inner center-text">
			<p class="label-sm">Daripada</p>
			<p class="parents-name">{wedding.bride.parentsDisplay}</p>
			<p class="label-sm" style="margin-top:0.5rem">dan</p>
			<p class="parents-name">{wedding.groom.parentsDisplay}</p>
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
					<p class="venue-name">{ev.venue}</p>
					<p class="venue-addr">{ev.address}</p>
				</div>
			</div>

			<ol class="timeline">
				<li class="tl-item">
					<div class="tl-left">
						<span class="tl-time">12.00 ptg</span>
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
						<span class="tl-time">2.30 ptg</span>
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
				<p class="loc-name">{ev.venue}</p>
				<p class="loc-addr">{ev.address}</p>
			</div>

			<div class="map-btns">
				<a href={ev.googleMapsUrl} target="_blank" rel="noopener noreferrer" class="map-btn btn-gmaps">
					<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
					Google Maps
				</a>
				<a href={ev.wazeUrl} target="_blank" rel="noopener noreferrer" class="map-btn btn-waze">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke-linecap="round"/><circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="1.5" fill="currentColor" stroke="none"/></svg>
					Waze
				</a>
			</div>

			<div class="loc-notes">
				<div class="loc-note-row">
					<span>Tempat Letak Kereta</span>
					<span>Tersedia di sekitar dewan</span>
				</div>
				<div class="loc-note-row">
					<span>Jarak dari Bandar KB</span>
					<span>± 5 minit</span>
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
				Sila sahkan kehadiran anda sebelum <strong>15 Mei 2026</strong>.
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
			<div class="ucapan-grid">
				{#each sampleUcapan as u}
					<div class="ucapan-card">
						<div class="ucapan-avatar" aria-hidden="true">
							{u.name.charAt(0).toUpperCase()}
						</div>
						<div class="ucapan-body">
							<p class="ucapan-name">{u.name}</p>
							<p class="ucapan-msg">"{u.msg}"</p>
						</div>
					</div>
				{/each}
			</div>

			<p class="ucapan-note">* Ucapan di atas adalah contoh. Ganti dengan ucapan sebenar dari Google Sheets selepas majlis.</p>
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
							<p class="contact-phone">{c.phone}</p>
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
				<QRCard url={pageUrl} label="Imbas QR untuk buka jemputan" theme="fairy" size={150} />
				<div class="share-right">
					<p class="body-text">Kongsikan jemputan ini kepada rakan dan keluarga.</p>
					<ShareButtons url={pageUrl} message={waMessage} theme="fairy" />
					<a href="/cetak?event=perempuan" target="_blank" rel="noopener" class="btn-ghost" style="margin-top:0.5rem">
						Cetak / Simpan PDF
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- ════════════════════ FOOTER ══ -->
	<footer class="page-footer">
		<p class="footer-aya" lang="ar">وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا</p>
		<p class="footer-aya-ref">Surah Ar-Rum: 21</p>
		<p class="footer-hashtag">{wedding.hashtag}</p>
		<a href="/" class="footer-back">← Halaman Utama</a>
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
		--p: #b87fa8;
		--p-light: rgba(184,127,168,0.12);
		--p-rule: rgba(184,127,168,0.25);
		--text: #2a1f2a;
		--muted: #8a7a8a;
		--bg: #ffffff;
		--bg-soft: #f3edf8;
	}

	/* ── Hero ── */
	.hero {
		min-height: 100dvh;
		scroll-snap-align: start;
		background: linear-gradient(160deg, #e6d4f0 0%, #d4ddf5 50%, #e0cef0 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		padding: 5rem 2rem 5rem;
		text-align: center;
	}

	.back-link {
		position: absolute;
		top: 1.5rem;
		left: 1.5rem;
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		color: var(--muted);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: color 0.2s, border-color 0.2s;
	}
	.back-link:hover { color: var(--p); border-bottom-color: var(--p); }

	.corner-tl, .corner-tr, .corner-bl, .corner-br {
		position: absolute;
		width: 100px;
		height: 100px;
		pointer-events: none;
		color: var(--p);
	}
	.corner-tl { top: 0; left: 0; }
	.corner-tr { top: 0; right: 0; }
	.corner-bl { bottom: 0; left: 0; }
	.corner-br { bottom: 0; right: 0; }

	.hero-content {
		max-width: 500px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.9rem;
	}

	.bismillah {
		font-family: var(--font-amiri);
		font-size: clamp(2rem, 6vw, 3rem);
		color: var(--text);
		direction: rtl;
		line-height: 1.4;
		margin: 0;
	}

	.wave-rule {
		width: 100%;
		max-width: 300px;
		color: var(--p);
	}
	.wave-rule svg { width: 100%; display: block; }

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

	.hero-putri {
		font-size: 0.75rem;
		color: var(--muted);
		font-style: italic;
		margin: 0;
	}

	.hero-bride {
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

	.hero-groom {
		font-family: var(--font-playfair);
		font-size: clamp(1.4rem, 5vw, 2.25rem);
		font-weight: 400;
		font-style: italic;
		color: var(--p);
		letter-spacing: 0.06em;
		margin: 0;
	}

	.date-box {
		border: 1px solid var(--p-rule);
		padding: 1rem 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		background: rgba(255,255,255,0.7);
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

	.label-sm {
		font-size: 0.68rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 0;
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
		grid-template-columns: 72px 24px 1fr;
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
	}

	.tl-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--p);
		flex-shrink: 0;
		box-shadow: 0 0 0 3px rgba(184,127,168,0.2);
	}

	.tl-bar {
		flex: 1;
		width: 1px;
		background: var(--p-rule);
		min-height: 40px;
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

	.btn-ghost:hover { background: var(--p-light); border-color: var(--p); }

	.form-hint {
		background: var(--p-light);
		border: 1px dashed var(--p-rule);
		border-radius: 6px;
		padding: 1rem 1.5rem;
		font-size: 0.82rem;
		color: var(--muted);
		text-align: center;
	}

	.form-hint code {
		background: rgba(0,0,0,0.06);
		padding: 1px 6px;
		border-radius: 3px;
	}

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
		margin: 0;
		font-style: italic;
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

	.contact-phone {
		font-size: 0.8rem;
		color: var(--muted);
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

	@media (max-width: 460px) {
		.share-layout {
			grid-template-columns: 1fr;
			justify-items: center;
		}
	}

	.share-right {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		align-items: flex-start;
	}

	/* ── Footer ── */
	.page-footer {
		scroll-snap-align: start;
		min-height: 100dvh;
		padding: 3.5rem 1.5rem;
		background: var(--bg-soft);
		border-top: 1px solid var(--p-rule);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
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

	.footer-back {
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		color: var(--muted);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: border-color 0.2s;
	}

	.footer-back:hover { border-bottom-color: var(--muted); }
</style>
