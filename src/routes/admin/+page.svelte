<script lang="ts">
	import { browser } from '$app/environment';
	import { wedding } from '$lib/data/wedding';

	const ADMIN_PASS = 'admin123'; // In production, use environment variable

	let authenticated = $state(false);
	let passwordInput = $state('');
	let error = $state('');

	// Simulated RSVP data - in production, fetch from Google Sheets or backend
	const rsvpData = [
		{ id: 1, name: 'Ahmad bin Ali', guests: 4, event: 'perempuan', dietary: 'Tiada', confirmed: true, phone: '013-111 2222', timestamp: '2026-05-01 10:30' },
		{ id: 2, name: 'Siti binti Hassan', guests: 2, event: 'both', dietary: 'Vegetarian', confirmed: false, phone: '019-333 4444', timestamp: '2026-05-02 14:15' },
		{ id: 3, name: 'Razali bin Osman', guests: 6, event: 'lelaki', dietary: 'Tiada', confirmed: true, phone: '011-555 6666', timestamp: '2026-05-03 09:00' },
	];

	let filterEvent = $state('all');
	let filterConfirmed = $state('all');

	const filtered = $derived(rsvpData.filter(r => {
		if (filterEvent !== 'all' && r.event !== filterEvent && r.event !== 'both') return false;
		if (filterConfirmed === 'yes' && !r.confirmed) return false;
		if (filterConfirmed === 'no' && r.confirmed) return false;
		return true;
	}));

	const totalGuests = $derived(filtered.reduce((sum, r) => sum + r.guests, 0));

	function login() {
		if (passwordInput === ADMIN_PASS) {
			authenticated = true;
			error = '';
		} else {
			error = 'Kata laluan salah. Cuba lagi.';
		}
	}

	function handleLoginKey(e: KeyboardEvent) {
		if (e.key === 'Enter') login();
	}

	function exportCsv() {
		const headers = ['Nama', 'Bil. Tetamu', 'Majlis', 'Makanan Khas', 'Disahkan', 'No. Telefon', 'Masa'];
		const rows = rsvpData.map(r => [
			r.name, r.guests, r.event, r.dietary,
			r.confirmed ? 'Ya' : 'Tidak', r.phone, r.timestamp
		]);
		const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'rsvp-syarah-munir-2026.csv';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
</script>

<svelte:head>
	<title>Admin - {wedding.bride.name} & {wedding.groom.name}</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if !authenticated}
	<div class="login-wrap">
		<div class="login-card">
			<div class="login-icon" aria-hidden="true">🔐</div>
			<h1>Panel Admin</h1>
			<p>Majlis Perkahwinan {wedding.bride.name} & {wedding.groom.name}</p>

			<div class="login-form">
				<label for="password" class="sr-only">Kata Laluan</label>
				<input
					id="password"
					type="password"
					bind:value={passwordInput}
					onkeydown={handleLoginKey}
					placeholder="Masukkan kata laluan"
					class="password-input"
					autocomplete="current-password"
				/>
				{#if error}
					<p class="login-error" role="alert">{error}</p>
				{/if}
				<button onclick={login} class="login-btn">Log Masuk</button>
			</div>

			<a href="/" class="back-link">← Kembali ke halaman utama</a>
		</div>
	</div>
{:else}
	<div class="admin-wrap">
		<!-- Sidebar / Header -->
		<header class="admin-header">
			<div class="admin-title">
				<span class="admin-icon" aria-hidden="true">👑</span>
				<div>
					<h1>Panel Admin</h1>
					<p>{wedding.bride.name} &amp; {wedding.groom.name}</p>
				</div>
			</div>
			<nav class="admin-nav" aria-label="Admin navigation">
				<a href="/zulfatul-syarah" target="_blank" rel="noopener" class="nav-link">Lihat /zulfatul-syarah ↗</a>
				<a href="/muhammed-munir" target="_blank" rel="noopener" class="nav-link">Lihat /muhammed-munir ↗</a>
				<button onclick={() => authenticated = false} class="logout-btn">Log Keluar</button>
			</nav>
		</header>

		<main id="main-content" class="admin-main">
			<!-- Stats cards -->
			<div class="stats-grid" role="region" aria-label="Ringkasan RSVP">
				<div class="stat-card">
					<span class="stat-num">{rsvpData.length}</span>
					<span class="stat-label">Respons Diterima</span>
				</div>
				<div class="stat-card">
					<span class="stat-num">{rsvpData.reduce((s, r) => s + r.guests, 0)}</span>
					<span class="stat-label">Jumlah Tetamu</span>
				</div>
				<div class="stat-card">
					<span class="stat-num">{rsvpData.filter(r => r.confirmed).length}</span>
					<span class="stat-label">Pengesahan Diterima</span>
				</div>
				<div class="stat-card">
					<span class="stat-num">{rsvpData.filter(r => r.event === 'both' || r.event === 'perempuan').length}</span>
					<span class="stat-label">Majlis Perempuan</span>
				</div>
				<div class="stat-card">
					<span class="stat-num">{rsvpData.filter(r => r.event === 'both' || r.event === 'lelaki').length}</span>
					<span class="stat-label">Majlis Lelaki</span>
				</div>
			</div>

			<!-- Actions -->
			<div class="actions-bar">
				<div class="filters" role="group" aria-label="Penapis">
					<select bind:value={filterEvent} class="filter-select" aria-label="Tapis mengikut majlis">
						<option value="all">Semua Majlis</option>
						<option value="perempuan">Perempuan</option>
						<option value="lelaki">Lelaki</option>
					</select>
					<select bind:value={filterConfirmed} class="filter-select" aria-label="Tapis mengikut pengesahan">
						<option value="all">Semua Status</option>
						<option value="yes">Disahkan</option>
						<option value="no">Belum Disahkan</option>
					</select>
				</div>
				<button onclick={exportCsv} class="export-btn" aria-label="Eksport senarai RSVP sebagai CSV">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true">
						<polyline points="8 17 12 21 16 17"></polyline>
						<line x1="12" y1="12" x2="12" y2="21"></line>
						<path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29"></path>
					</svg>
					Eksport CSV
				</button>
			</div>

			<!-- Table -->
			<div class="table-wrap" role="region" aria-label="Senarai RSVP">
				<p class="table-meta">{filtered.length} rekod · {totalGuests} tetamu</p>
				<div class="table-scroll">
					<table class="rsvp-table" aria-label="Senarai RSVP">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th scope="col">Nama</th>
								<th scope="col">Bil.</th>
								<th scope="col">Majlis</th>
								<th scope="col">Makanan</th>
								<th scope="col">Status</th>
								<th scope="col">Telefon</th>
								<th scope="col">Tindakan</th>
							</tr>
						</thead>
						<tbody>
							{#each filtered as rsvp, i}
								<tr class:confirmed={rsvp.confirmed}>
									<td>{i + 1}</td>
									<td class="name-cell">{rsvp.name}</td>
									<td class="center">{rsvp.guests}</td>
									<td>
										<span class="event-badge" class:fairy-badge={rsvp.event === 'perempuan' || rsvp.event === 'both'} class:malay-badge={rsvp.event === 'lelaki'}>
											{rsvp.event === 'both' ? 'Kedua-dua' : rsvp.event}
										</span>
									</td>
									<td>{rsvp.dietary}</td>
									<td>
										<span class="status-badge" class:status-ok={rsvp.confirmed} class:status-pending={!rsvp.confirmed}>
											{rsvp.confirmed ? '✓ Disahkan' : '⏳ Belum'}
										</span>
									</td>
									<td>
										<a href="tel:{rsvp.phone.replace(/\s/g,'')}" class="phone-link">{rsvp.phone}</a>
									</td>
									<td>
										<a
											href="https://wa.me/6{rsvp.phone.replace(/[-\s]/g,'').replace(/^0/,'')}?text={encodeURIComponent(`Assalamualaikum ${rsvp.name}, terima kasih atas pengesahan hadir ke majlis perkahwinan ${wedding.bride.name} & ${wedding.groom.name}. ${wedding.hashtag}`)}"
											target="_blank"
											rel="noopener noreferrer"
											class="wa-link"
											aria-label="Hantar WhatsApp kepada {rsvp.name}"
										>
											💬
										</a>
									</td>
								</tr>
							{/each}

							{#if filtered.length === 0}
								<tr>
									<td colspan="8" class="empty-row">Tiada rekod dijumpai</td>
								</tr>
							{/if}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Invite links -->
			<div class="invite-gen" aria-labelledby="invite-gen-title">
				<h2 id="invite-gen-title">Jana Pautan Jemputan</h2>
				<p>Hantar pautan peribadi kepada tetamu:</p>
				<div class="invite-examples">
					{#each ['jemputan001', 'jemputan002', 'jemputan003'] as code}
						<div class="invite-row">
							<code class="invite-code">/invite/{code}</code>
							<button
								onclick={() => {
									if (browser) {
										navigator.clipboard.writeText(window.location.origin + '/invite/' + code);
									}
								}}
								class="copy-btn"
								aria-label="Salin pautan {code}"
							>
								Salin
							</button>
						</div>
					{/each}
				</div>
				<p class="invite-note">
					Edit <code>guestMap</code> dalam fail <code>/invite/[code]/+page.svelte</code>
					untuk menambah tetamu baharu.
				</p>
			</div>
		</main>
	</div>
{/if}

<style>
	/* ===== Login ===== */
	.login-wrap {
		min-height: 100vh;
		background: linear-gradient(135deg, #eef4fb 0%, #f9f0ff 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.login-card {
		background: #fff;
		border-radius: 20px;
		padding: 2.5rem 2rem;
		max-width: 360px;
		width: 100%;
		text-align: center;
		box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.login-icon { font-size: 2.5rem; }

	.login-card h1 {
		font-family: var(--font-playfair);
		color: var(--color-fairy-text);
		font-size: 1.5rem;
		margin: 0;
	}

	.login-card p {
		color: #888;
		font-size: 0.875rem;
		margin: 0;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.password-input {
		padding: 0.75rem 1rem;
		border: 1.5px solid #ddd;
		border-radius: 10px;
		font-family: var(--font-lato);
		font-size: 0.9rem;
		width: 100%;
		outline: none;
		transition: border-color 0.15s;
	}

	.password-input:focus { border-color: var(--color-fairy-primary); }

	.login-error {
		color: #e53e3e;
		font-size: 0.8rem;
		margin: 0;
	}

	.login-btn {
		padding: 0.75rem;
		background: linear-gradient(135deg, #c084be, #7eb8d6);
		color: #fff;
		border: none;
		border-radius: 10px;
		font-family: var(--font-lato);
		font-size: 0.9rem;
		font-weight: 700;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.login-btn:hover { opacity: 0.9; }

	.back-link {
		font-size: 0.8rem;
		color: #aaa;
		text-decoration: none;
		margin-top: 0.25rem;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0,0,0,0);
		white-space: nowrap;
		border: 0;
	}

	/* ===== Admin layout ===== */
	.admin-wrap {
		min-height: 100vh;
		background: #f5f5f5;
		font-family: var(--font-lato);
	}

	.admin-header {
		background: #fff;
		border-bottom: 1px solid #eee;
		padding: 1rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.75rem;
		box-shadow: 0 2px 10px rgba(0,0,0,0.06);
	}

	.admin-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.admin-icon { font-size: 1.5rem; }

	.admin-title h1 {
		font-family: var(--font-playfair);
		font-size: 1.25rem;
		color: #333;
		margin: 0;
	}

	.admin-title p {
		font-size: 0.78rem;
		color: #888;
		margin: 0;
	}

	.admin-nav {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.nav-link {
		font-size: 0.8rem;
		color: #666;
		text-decoration: none;
		padding: 4px 10px;
		border-radius: 6px;
		background: #f0f0f0;
		transition: background 0.15s;
	}

	.nav-link:hover { background: #e0e0e0; }

	.logout-btn {
		font-size: 0.8rem;
		color: #e53e3e;
		border: 1px solid #e53e3e;
		background: none;
		padding: 4px 12px;
		border-radius: 6px;
		cursor: pointer;
		transition: background 0.15s;
	}

	.logout-btn:hover { background: #fff5f5; }

	.admin-main {
		max-width: 1100px;
		margin: 0 auto;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	/* Stats */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: 1rem;
	}

	.stat-card {
		background: #fff;
		border-radius: 12px;
		padding: 1rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		box-shadow: 0 2px 8px rgba(0,0,0,0.06);
	}

	.stat-num {
		font-family: var(--font-playfair);
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-fairy-primary);
		line-height: 1;
	}

	.stat-label {
		font-size: 0.75rem;
		color: #888;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Actions bar */
	.actions-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.filters {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.filter-select {
		padding: 0.5rem 0.75rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		font-family: var(--font-lato);
		font-size: 0.85rem;
		color: #333;
		background: #fff;
	}

	.export-btn {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 1rem;
		background: #2d6a4f;
		color: #fff;
		border: none;
		border-radius: 8px;
		font-family: var(--font-lato);
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.export-btn:hover { opacity: 0.85; }

	/* Table */
	.table-wrap {
		background: #fff;
		border-radius: 14px;
		padding: 1rem;
		box-shadow: 0 2px 8px rgba(0,0,0,0.06);
	}

	.table-meta {
		font-size: 0.8rem;
		color: #888;
		margin: 0 0 0.75rem;
	}

	.table-scroll {
		overflow-x: auto;
	}

	.rsvp-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.85rem;
	}

	.rsvp-table th {
		text-align: left;
		padding: 0.6rem 0.75rem;
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: #888;
		border-bottom: 2px solid #f0f0f0;
		white-space: nowrap;
	}

	.rsvp-table td {
		padding: 0.6rem 0.75rem;
		border-bottom: 1px solid #f5f5f5;
		color: #444;
		vertical-align: middle;
	}

	.rsvp-table tr:last-child td { border-bottom: none; }
	.rsvp-table tr.confirmed { background: rgba(76, 175, 80, 0.03); }

	.name-cell { font-weight: 600; color: #333; }
	.center { text-align: center; }

	.event-badge {
		display: inline-block;
		padding: 2px 8px;
		border-radius: 10px;
		font-size: 0.72rem;
		font-weight: 600;
		text-transform: capitalize;
	}

	.fairy-badge { background: rgba(192, 132, 190, 0.15); color: var(--color-fairy-text); }
	.malay-badge { background: rgba(201, 162, 39, 0.15); color: var(--color-malay-secondary); }

	.status-badge {
		display: inline-block;
		padding: 2px 8px;
		border-radius: 10px;
		font-size: 0.72rem;
		font-weight: 600;
	}

	.status-ok { background: rgba(76, 175, 80, 0.12); color: #2d6a4f; }
	.status-pending { background: rgba(255, 152, 0, 0.12); color: #b76e00; }

	.phone-link {
		color: #555;
		text-decoration: none;
		font-size: 0.8rem;
	}

	.phone-link:hover { text-decoration: underline; }
	.wa-link { font-size: 1.1rem; text-decoration: none; }
	.empty-row { text-align: center; color: #bbb; padding: 2rem; }

	/* Invite gen */
	.invite-gen {
		background: #fff;
		border-radius: 14px;
		padding: 1.25rem 1.5rem;
		box-shadow: 0 2px 8px rgba(0,0,0,0.06);
	}

	.invite-gen h2 {
		font-family: var(--font-playfair);
		font-size: 1.1rem;
		color: #333;
		margin: 0 0 0.5rem;
	}

	.invite-gen p {
		font-size: 0.875rem;
		color: #777;
		margin: 0 0 0.75rem;
	}

	.invite-examples {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.invite-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.invite-code {
		font-family: monospace;
		font-size: 0.85rem;
		background: #f5f5f5;
		padding: 4px 10px;
		border-radius: 6px;
		color: #555;
	}

	.copy-btn {
		padding: 4px 12px;
		background: #f0f0f0;
		border: none;
		border-radius: 6px;
		font-size: 0.78rem;
		cursor: pointer;
		transition: background 0.15s;
	}

	.copy-btn:hover { background: #e0e0e0; }

	.invite-note {
		font-size: 0.78rem !important;
		color: #aaa !important;
	}

	.invite-note code {
		background: #f5f5f5;
		padding: 1px 6px;
		border-radius: 4px;
		font-size: 0.82rem;
	}
</style>
