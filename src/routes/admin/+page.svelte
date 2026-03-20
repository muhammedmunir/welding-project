<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { wedding, SCRIPT_URL } from '$lib/data/wedding';

	let authenticated = $state(false);
	let passwordInput = $state('');
	let error = $state('');
	let loginLoading = $state(false);

	onMount(() => {
		if (sessionStorage.getItem('admin_auth') === '1') {
			authenticated = true;
			fetchRsvp();
			fetchInvites();
		}
	});

	type RsvpItem = { id: number; name: string; guests: number; event: string; dietary: string; confirmed: boolean; phone: string; timestamp: string };
	let rsvpData = $state<RsvpItem[]>([]);
	let rsvpLoading = $state(false);
	let rsvpError = $state('');

	let filterEvent = $state('all');
	let filterConfirmed = $state('all');

	const filtered = $derived(rsvpData.filter(r => {
		if (filterEvent !== 'all' && r.event !== filterEvent && r.event !== 'both') return false;
		if (filterConfirmed === 'yes' && !r.confirmed) return false;
		if (filterConfirmed === 'no' && r.confirmed) return false;
		return true;
	}));

	const totalGuests = $derived(filtered.reduce((sum, r) => sum + r.guests, 0));

	async function login() {
		loginLoading = true;
		error = '';
		try {
			const res = await fetch('/api/admin', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password: passwordInput })
			});
			const { ok, error: serverError } = await res.json();
			if (ok) {
				authenticated = true;
				sessionStorage.setItem('admin_auth', '1');
				fetchRsvp();
				fetchInvites();
			} else {
				error = serverError || 'Kata laluan salah. Cuba lagi.';
			}
		} catch {
			error = 'Ralat sambungan. Cuba semula.';
		} finally {
			loginLoading = false;
		}
	}

	function handleLoginKey(e: KeyboardEvent) {
		if (e.key === 'Enter') login();
	}

	async function fetchRsvp() {
		rsvpLoading = true;
		rsvpError = '';
		try {
			const res = await fetch(`${SCRIPT_URL}?action=getRsvp&t=${Date.now()}`);
			const data = await res.json();
			if (Array.isArray(data)) {
				rsvpData = data;
			}
		} catch {
			rsvpError = 'Gagal memuatkan data RSVP. Data di bawah adalah contoh.';
			// Fallback kepada data contoh jika gagal
			rsvpData = [
				{ id: 1, name: 'Ahmad bin Ali', guests: 4, event: 'perempuan', dietary: 'Tiada', confirmed: true, phone: '013-111 2222', timestamp: '2026-05-01 10:30' },
				{ id: 2, name: 'Siti binti Hassan', guests: 2, event: 'both', dietary: 'Vegetarian', confirmed: false, phone: '019-333 4444', timestamp: '2026-05-02 14:15' },
				{ id: 3, name: 'Razali bin Osman', guests: 6, event: 'lelaki', dietary: 'Tiada', confirmed: true, phone: '011-555 6666', timestamp: '2026-05-03 09:00' },
			];
		} finally {
			rsvpLoading = false;
		}
	}

	// ─── Jana Pautan Jemputan ────────────────────────────────────
	type GeneratedInvite = { rowIndex: number; name: string; event: string; code: string; url: string; copied: boolean; timestamp: string };
	let inviteForm = $state({ name: '', event: 'both' });
	let generatedInvites = $state<GeneratedInvite[]>([]);
	let inviteLoading = $state(false);

	function makeInviteEntry(name: string, event: string, rowIndex = 0, timestamp = ''): GeneratedInvite {
		const code = btoa(`${name}|${event}`).replace(/=/g, '');
		const url  = browser ? `${window.location.origin}/invite/${code}` : `/invite/${code}`;
		return { rowIndex, name, event, code, url, copied: false, timestamp };
	}

	async function fetchInvites() {
		inviteLoading = true;
		try {
			const res  = await fetch(`${SCRIPT_URL}?action=getJemputan&t=${Date.now()}`);
			const data = await res.json();
			if (Array.isArray(data)) {
				generatedInvites = data.map((d: { rowIndex: number; name: string; event: string; timestamp: string }) =>
					makeInviteEntry(d.name, d.event, d.rowIndex, d.timestamp)
				);
			}
		} catch {
			generatedInvites = [];
		} finally {
			inviteLoading = false;
		}
	}

	async function generateInviteLink() {
		const name = inviteForm.name.trim();
		if (!name) return;
		// Elak duplikasi
		if (generatedInvites.some(i => i.name.toLowerCase() === name.toLowerCase() && i.event === inviteForm.event)) return;
		inviteLoading = true;
		try {
			const params = new URLSearchParams({ jenis: 'Jemputan', nama: name, majlis: inviteForm.event });
			await fetch(`${SCRIPT_URL}?${params}`, { mode: 'no-cors' });
			// Reload dari sheet supaya dapat rowIndex yang betul
			await fetchInvites();
		} catch {
			// Jika gagal, tambah secara tempatan sahaja
			generatedInvites = [makeInviteEntry(name, inviteForm.event), ...generatedInvites];
		} finally {
			inviteLoading = false;
		}
		inviteForm.name = '';
	}

	async function copyInvite(idx: number) {
		if (!browser) return;
		await navigator.clipboard.writeText(generatedInvites[idx].url);
		generatedInvites = generatedInvites.map((item, i) =>
			i === idx ? { ...item, copied: true } : item
		);
		setTimeout(() => {
			generatedInvites = generatedInvites.map((item, i) =>
				i === idx ? { ...item, copied: false } : item
			);
		}, 2000);
	}

	async function removeInvite(idx: number) {
		const inv = generatedInvites[idx];
		generatedInvites = generatedInvites.filter((_, i) => i !== idx);
		if (inv.rowIndex) {
			try {
				await fetch(`${SCRIPT_URL}?action=deleteJemputan&row=${inv.rowIndex}&t=${Date.now()}`);
			} catch { /* senyap — baris masih ada dalam sheet, boleh padam manual */ }
		}
	}

	function copyAllInvites() {
		if (!browser || generatedInvites.length === 0) return;
		const text = generatedInvites.map(i => `${i.name} (${i.event}): ${i.url}`).join('\n');
		navigator.clipboard.writeText(text);
	}

	const eventLabel = (ev: string) =>
		ev === 'both' ? 'Kedua-dua Majlis' :
		ev === 'perempuan' ? 'Majlis Perkahwinan' :
		'Majlis Bertandang';

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
					disabled={loginLoading}
				/>
				{#if error}
					<p class="login-error" role="alert">{error}</p>
				{/if}
				<button onclick={login} class="login-btn" disabled={loginLoading}>
					{loginLoading ? 'Mengesahkan…' : 'Log Masuk'}
				</button>
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
				<button onclick={() => { authenticated = false; sessionStorage.removeItem('admin_auth'); }} class="logout-btn">Log Keluar</button>
			</nav>
		</header>

		<main id="main-content" class="admin-main">
			{#if rsvpError}
				<div class="rsvp-notice" role="alert">{rsvpError}</div>
			{/if}

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
				<div class="action-btns">
					<button onclick={fetchRsvp} class="refresh-btn" disabled={rsvpLoading} aria-label="Muat semula data RSVP">
						{rsvpLoading ? '⟳ Memuatkan…' : '⟳ Muat Semula'}
					</button>
					<button onclick={exportCsv} class="export-btn" aria-label="Eksport senarai RSVP sebagai CSV">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true">
							<polyline points="8 17 12 21 16 17"></polyline>
							<line x1="12" y1="12" x2="12" y2="21"></line>
							<path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29"></path>
						</svg>
						Eksport CSV
					</button>
				</div>
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
									<td colspan="8" class="empty-row">
									{rsvpData.length === 0
										? 'Belum ada RSVP diterima lagi.'
										: 'Tiada rekod berdasarkan tapisan yang dipilih.'}
								</td>
								</tr>
							{/if}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Invite links -->
			<div class="invite-gen" aria-labelledby="invite-gen-title">
				<h2 id="invite-gen-title">Jana Pautan Jemputan</h2>
				<p>Jana pautan peribadi untuk setiap tetamu. Pautan mengandungi nama & majlis secara automatik.</p>

				<div class="invite-form-row">
					<input
						type="text"
						bind:value={inviteForm.name}
						placeholder="Nama tetamu (cth: Keluarga Ahmad)"
						class="invite-input"
						onkeydown={(e) => e.key === 'Enter' && generateInviteLink()}
						aria-label="Nama tetamu"
					/>
					<select bind:value={inviteForm.event} class="invite-select" aria-label="Pilih majlis">
						<option value="both">Kedua-dua Majlis</option>
						<option value="perempuan">Majlis Perkahwinan (Perempuan)</option>
						<option value="lelaki">Majlis Bertandang (Lelaki)</option>
					</select>
					<button onclick={generateInviteLink} class="gen-btn" disabled={!inviteForm.name.trim()}>
						+ Jana
					</button>
				</div>

				{#if inviteLoading && generatedInvites.length === 0}
				<p class="invite-empty">⟳ Memuatkan senarai jemputan…</p>
				{:else if generatedInvites.length > 0}
					<div class="invite-list-header">
						<span class="invite-count">{generatedInvites.length} pautan dijana</span>
						<button onclick={copyAllInvites} class="copy-all-btn" aria-label="Salin semua pautan">
							Salin Semua
						</button>
					</div>
					<div class="invite-list">
						{#each generatedInvites as inv, idx}
							<div class="invite-row">
								<div class="invite-info">
									<span class="invite-name">{inv.name}</span>
									<span class="invite-ev-badge" class:fairy-badge={inv.event !== 'lelaki'} class:malay-badge={inv.event === 'lelaki'}>
										{eventLabel(inv.event)}
									</span>
									{#if inv.timestamp}
										<span class="invite-ts">{inv.timestamp}</span>
									{/if}
								</div>
								<code class="invite-code">{inv.url}</code>
								<div class="invite-actions">
									<button onclick={() => copyInvite(idx)} class="copy-btn" class:copied={inv.copied} aria-label="Salin pautan {inv.name}">
										{inv.copied ? '✓ Disalin' : 'Salin'}
									</button>
									<a href={inv.url} target="_blank" rel="noopener" class="preview-btn" aria-label="Pratonton jemputan {inv.name}">Lihat</a>
									<button onclick={() => removeInvite(idx)} class="remove-btn" aria-label="Buang pautan {inv.name}">✕</button>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<p class="invite-empty">Belum ada pautan dijana. Masukkan nama tetamu di atas.</p>
				{/if}
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

	.action-btns {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.refresh-btn {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 1rem;
		background: #f0f0f0;
		color: #444;
		border: 1px solid #ddd;
		border-radius: 8px;
		font-family: var(--font-lato);
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}

	.refresh-btn:hover:not(:disabled) { background: #e0e0e0; }
	.refresh-btn:disabled { opacity: 0.6; cursor: not-allowed; }

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

	.rsvp-notice {
		background: #fff8e1;
		border: 1px solid #ffe082;
		border-radius: 8px;
		padding: 0.75rem 1rem;
		font-size: 0.82rem;
		color: #7a5800;
	}

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
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.invite-gen h2 {
		font-family: var(--font-playfair);
		font-size: 1.1rem;
		color: #333;
		margin: 0;
	}

	.invite-gen > p {
		font-size: 0.875rem;
		color: #777;
		margin: 0;
	}

	.invite-form-row {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.invite-input {
		flex: 1;
		min-width: 180px;
		padding: 0.55rem 0.85rem;
		border: 1.5px solid #ddd;
		border-radius: 8px;
		font-family: var(--font-lato);
		font-size: 0.875rem;
		outline: none;
		transition: border-color 0.15s;
	}
	.invite-input:focus { border-color: var(--color-fairy-primary); }

	.invite-select {
		padding: 0.55rem 0.75rem;
		border: 1.5px solid #ddd;
		border-radius: 8px;
		font-family: var(--font-lato);
		font-size: 0.85rem;
		background: #fff;
		color: #333;
		outline: none;
	}

	.gen-btn {
		padding: 0.55rem 1.1rem;
		background: linear-gradient(135deg, #c084be, #7eb8d6);
		color: #fff;
		border: none;
		border-radius: 8px;
		font-family: var(--font-lato);
		font-size: 0.875rem;
		font-weight: 700;
		cursor: pointer;
		white-space: nowrap;
		transition: opacity 0.15s;
	}
	.gen-btn:hover:not(:disabled) { opacity: 0.85; }
	.gen-btn:disabled { opacity: 0.45; cursor: not-allowed; }

	.invite-list-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.invite-count { font-size: 0.8rem; color: #888; font-weight: 600; }

	.copy-all-btn {
		padding: 4px 12px;
		background: #eef4fb;
		border: 1px solid #c084be;
		border-radius: 6px;
		font-size: 0.78rem;
		color: var(--color-fairy-text);
		cursor: pointer;
		transition: background 0.15s;
	}
	.copy-all-btn:hover { background: #dce8f6; }

	.invite-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.invite-row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.6rem 0.75rem;
		background: #fafafa;
		border: 1px solid #eee;
		border-radius: 10px;
		flex-wrap: wrap;
	}

	.invite-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 180px;
	}

	.invite-name {
		font-weight: 600;
		font-size: 0.875rem;
		color: #333;
	}

	.invite-ts {
		font-size: 0.68rem;
		color: #bbb;
	}

	.invite-ev-badge {
		font-size: 0.68rem;
		padding: 2px 7px;
		border-radius: 8px;
		font-weight: 600;
		white-space: nowrap;
	}

	.invite-code {
		flex: 1;
		font-family: monospace;
		font-size: 0.78rem;
		background: #f0f0f0;
		padding: 4px 8px;
		border-radius: 6px;
		color: #555;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 300px;
	}

	.invite-actions {
		display: flex;
		gap: 0.35rem;
		align-items: center;
	}

	.copy-btn {
		padding: 4px 12px;
		background: #f0f0f0;
		border: none;
		border-radius: 6px;
		font-size: 0.78rem;
		cursor: pointer;
		transition: background 0.15s, color 0.15s;
		white-space: nowrap;
	}
	.copy-btn:hover { background: #e0e0e0; }
	.copy-btn.copied { background: #d4edda; color: #2d6a4f; }

	.preview-btn {
		padding: 4px 10px;
		background: #eef4fb;
		border-radius: 6px;
		font-size: 0.78rem;
		color: #4a6fa5;
		text-decoration: none;
		white-space: nowrap;
		transition: background 0.15s;
	}
	.preview-btn:hover { background: #dce8f6; }

	.remove-btn {
		padding: 4px 8px;
		background: none;
		border: none;
		border-radius: 6px;
		font-size: 0.8rem;
		color: #bbb;
		cursor: pointer;
		transition: color 0.15s;
	}
	.remove-btn:hover { color: #e53e3e; }

	.invite-empty {
		font-size: 0.82rem;
		color: #bbb;
		text-align: center;
		padding: 1rem;
		margin: 0;
	}
</style>
