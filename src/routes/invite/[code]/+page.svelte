<script lang="ts">
	import { page } from '$app/stores';
	import { wedding } from '$lib/data/wedding';
	import ShareButtons from '$lib/components/ShareButtons.svelte';
	import { browser } from '$app/environment';

	const code = $derived($page.params.code);

	// Simple guest lookup - in production, fetch from a backend or CSV
	const guestMap: Record<string, { name: string; event: 'perempuan' | 'lelaki' | 'both' }> = {
		'jemputan001': { name: 'Keluarga Ahmad', event: 'both' },
		'jemputan002': { name: 'Encik Razak', event: 'perempuan' },
		'jemputan003': { name: 'Puan Halimah', event: 'lelaki' }
	};

	const guest = $derived(guestMap[code] || null);
	const eventLabel = $derived(
		guest?.event === 'both' ? 'kedua-dua majlis' :
		guest?.event === 'perempuan' ? 'Majlis Perkahwinan (pihak perempuan)' :
		'Majlis Bertandang (pihak lelaki)'
	);

	const perempuanUrl = $derived(browser ? `${window.location.origin}/zulfatul-syarah` : '/zulfatul-syarah');
	const lelakiUrl = $derived(browser ? `${window.location.origin}/muhammed-munir` : '/muhammed-munir');
	const waMsg = $derived(guest
		? `Assalamualaikum ${guest.name},\n\nAnda dijemput ke majlis perkahwinan ${wedding.bride.name} & ${wedding.groom.name}.\n\nSila buka pautan jemputan anda:\n${browser ? window.location.href : ''}\n\n${wedding.hashtag}`
		: ''
	);
</script>

<svelte:head>
	<title>Jemputan Khas - {wedding.bride.name} & {wedding.groom.name}</title>
</svelte:head>

<main id="main-content" class="invite-wrap">
	<a href="/" class="back-home" aria-label="Kembali ke halaman utama">← Halaman Utama</a>

	<div class="card">
		{#if guest}
			<div class="bismillah-wrap">
				<p class="bismillah" lang="ar">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
			</div>

			<div class="header">
				<div class="rose-icon" aria-hidden="true">🌹</div>
				<h1 class="greeting">Assalamualaikum,</h1>
				<h2 class="guest-name">{guest.name}</h2>
			</div>

			<div class="message-body">
				<p>
					Dengan penuh rasa syukur dan kegembiraan, kami mengucapkan jutaan terima kasih
					kerana sudi hadir ke <strong>{eventLabel}</strong> kami.
				</p>

				<div class="couple-display">
					<span class="bride-n">{wedding.bride.nameDisplay}</span>
					<span class="amp">&amp;</span>
					<span class="groom-n">{wedding.groom.nameDisplay}</span>
				</div>

				<div class="hashtag-display">{wedding.hashtag}</div>
			</div>

			<div class="events-grid">
				{#if guest.event === 'perempuan' || guest.event === 'both'}
					<a href="/zulfatul-syarah" class="event-card fairy-card" aria-label="Lihat jemputan Majlis Perkahwinan">
						<span class="event-emoji" aria-hidden="true">🌸</span>
						<div class="event-info">
							<strong>Majlis Perkahwinan</strong>
							<span>29 Mei 2026 · {wedding.events.perempuan.venue}</span>
						</div>
						<span class="arrow" aria-hidden="true">→</span>
					</a>
				{/if}

				{#if guest.event === 'lelaki' || guest.event === 'both'}
					<a href="/muhammed-munir" class="event-card malay-card" aria-label="Lihat jemputan Majlis Bertandang">
						<span class="event-emoji" aria-hidden="true">🕌</span>
						<div class="event-info">
							<strong>Majlis Bertandang</strong>
							<span>31 Mei 2026 · {wedding.events.lelaki.venueShort}</span>
						</div>
						<span class="arrow" aria-hidden="true">→</span>
					</a>
				{/if}
			</div>

			<div class="share-section">
				<p class="share-label">Kongsi jemputan ini</p>
				<ShareButtons
					url={browser ? window.location.href : ''}
					message={waMsg}
					theme="fairy"
				/>
			</div>

			<p class="closing">
				Semoga Allah memberkati majlis kami. Kehadiran anda adalah hadiah terindah buat kami.
			</p>

		{:else}
			<div class="not-found">
				<div class="nf-icon" aria-hidden="true">🔍</div>
				<h1>Kod Jemputan Tidak Sah</h1>
				<p>Kod <code>{code}</code> tidak dijumpai dalam sistem kami.</p>
				<p>Sila semak semula kod yang diterima atau hubungi kami untuk mendapatkan bantuan.</p>
				<div class="nf-links">
					<a href="/zulfatul-syarah" class="nf-btn fairy-nf">Majlis Perkahwinan</a>
					<a href="/muhammed-munir" class="nf-btn malay-nf">Majlis Bertandang</a>
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
	.invite-wrap {
		min-height: 100vh;
		background: linear-gradient(135deg, #eef4fb 0%, #f9f0ff 50%, #fdf8ec 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
		flex-direction: column;
		gap: 1rem;
	}

	.back-home {
		font-family: var(--font-lato);
		font-size: 0.85rem;
		color: rgba(74, 48, 96, 0.6);
		text-decoration: none;
		align-self: flex-start;
		max-width: 480px;
		width: 100%;
	}

	.card {
		background: #fff;
		border-radius: 24px;
		max-width: 480px;
		width: 100%;
		padding: 2rem;
		box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.bismillah-wrap {
		text-align: center;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #f0e8ff;
	}

	.bismillah {
		font-family: var(--font-amiri);
		font-size: 1.75rem;
		color: #4a3060;
		direction: rtl;
		margin: 0;
	}

	.header {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.rose-icon { font-size: 2.5rem; }

	.greeting {
		font-family: var(--font-lato);
		font-size: 1rem;
		color: #8a7aa0;
		margin: 0;
		font-weight: 400;
	}

	.guest-name {
		font-family: var(--font-playfair);
		font-size: 1.75rem;
		color: var(--color-fairy-primary);
		margin: 0;
	}

	.message-body {
		font-family: var(--font-lato);
		font-size: 0.9rem;
		color: #555;
		line-height: 1.7;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.message-body p { margin: 0; }

	.couple-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
		padding: 0.75rem;
		background: linear-gradient(135deg, rgba(192, 132, 190, 0.06), rgba(201, 162, 39, 0.06));
		border-radius: 14px;
	}

	.bride-n {
		font-family: var(--font-playfair);
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--color-fairy-primary);
	}

	.amp {
		font-family: var(--font-playfair);
		font-style: italic;
		color: #aaa;
	}

	.groom-n {
		font-family: var(--font-playfair);
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--color-malay-secondary);
	}

	.hashtag-display {
		font-family: var(--font-lato);
		font-size: 0.85rem;
		color: #aaa;
	}

	.events-grid {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.event-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.85rem 1rem;
		border-radius: 14px;
		text-decoration: none;
		transition: transform 0.15s;
	}

	.event-card:hover { transform: translateX(4px); }

	.fairy-card {
		background: rgba(192, 132, 190, 0.08);
		border: 1px solid rgba(192, 132, 190, 0.2);
		color: var(--color-fairy-text);
	}

	.malay-card {
		background: rgba(201, 162, 39, 0.08);
		border: 1px solid rgba(201, 162, 39, 0.2);
		color: var(--color-malay-text);
	}

	.event-emoji { font-size: 1.25rem; }

	.event-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.event-info strong { font-size: 0.9rem; }
	.event-info span { font-size: 0.75rem; opacity: 0.7; }
	.arrow { font-size: 1rem; opacity: 0.5; }

	.share-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
	}

	.share-label {
		font-family: var(--font-lato);
		font-size: 0.8rem;
		color: #aaa;
		margin: 0;
	}

	.closing {
		font-family: var(--font-lato);
		font-size: 0.85rem;
		color: #888;
		text-align: center;
		line-height: 1.6;
		margin: 0;
		padding-top: 0.75rem;
		border-top: 1px solid #f0e8ff;
	}

	/* Not found */
	.not-found {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		align-items: center;
	}

	.nf-icon { font-size: 3rem; }

	.not-found h1 {
		font-family: var(--font-playfair);
		color: #555;
		font-size: 1.25rem;
		margin: 0;
	}

	.not-found p {
		color: #888;
		font-size: 0.9rem;
		margin: 0;
	}

	.not-found code {
		background: #f0f0f0;
		padding: 2px 8px;
		border-radius: 4px;
		font-family: monospace;
	}

	.nf-links {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 0.5rem;
	}

	.nf-btn {
		padding: 0.6rem 1.25rem;
		border-radius: 50px;
		font-family: var(--font-lato);
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		transition: opacity 0.15s;
	}

	.nf-btn:hover { opacity: 0.8; }
	.fairy-nf { background: linear-gradient(135deg, #c084be, #7eb8d6); color: #fff; }
	.malay-nf { background: linear-gradient(135deg, #e8c84a, #c9a227); color: #3d2b00; }
</style>
