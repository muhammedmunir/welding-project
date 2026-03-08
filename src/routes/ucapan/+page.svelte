<script lang="ts">
	import { onMount } from 'svelte';
	import { wedding } from '$lib/data/wedding';

	const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw63LbFxa30ujG2oMUjjrQbYf65EtjyPd6mKe54QBJPiMohYsV9aCStHvzluGpBA583/exec';

	type UcapanItem = { nama: string; msg: string; pihak: 'Perempuan' | 'Lelaki' };

	let ucapanAll = $state<UcapanItem[]>([]);
	let loading = $state(true);
	let filter = $state<'semua' | 'perempuan' | 'lelaki'>('semua');

	const displayed = $derived(
		filter === 'semua' ? ucapanAll :
		filter === 'perempuan' ? ucapanAll.filter(u => u.pihak === 'Perempuan') :
		ucapanAll.filter(u => u.pihak === 'Lelaki')
	);

	async function fetchAll() {
		try {
			const [p, l] = await Promise.all([
				fetch(`${SCRIPT_URL}?action=getUcapan&jenis=Ucapan%20Perempuan&t=${Date.now()}`).then(r => r.json()),
				fetch(`${SCRIPT_URL}?action=getUcapan&jenis=Ucapan%20Lelaki&t=${Date.now()}`).then(r => r.json()),
			]);
			const perempuan: UcapanItem[] = (p as { nama: string; msg: string }[]).map(u => ({ ...u, pihak: 'Perempuan' }));
			const lelaki: UcapanItem[]    = (l as { nama: string; msg: string }[]).map(u => ({ ...u, pihak: 'Lelaki' }));
			// Gabung & susun selang-seli supaya tidak berpihak
			const merged: UcapanItem[] = [];
			const max = Math.max(perempuan.length, lelaki.length);
			for (let i = 0; i < max; i++) {
				if (i < perempuan.length) merged.push(perempuan[i]);
				if (i < lelaki.length)    merged.push(lelaki[i]);
			}
			ucapanAll = merged;
		} catch {
			ucapanAll = [];
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		fetchAll();
		const interval = setInterval(fetchAll, 30000);
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>Ucapan — {wedding.bride.nameDisplay} & {wedding.groom.nameDisplay}</title>
</svelte:head>

<main>
	<header>
		<div class="title-wrap">
			<p class="event-label">Majlis Perkahwinan</p>
			<h1>{wedding.bride.nameDisplay} <span class="amp">&amp;</span> {wedding.groom.nameDisplay}</h1>
			<p class="subtitle">{wedding.hashtag}</p>
		</div>

		<div class="filter-bar">
			<button class:active={filter === 'semua'}     onclick={() => filter = 'semua'}>Semua</button>
			<button class:active={filter === 'perempuan'} onclick={() => filter = 'perempuan'}>Majlis Perempuan</button>
			<button class:active={filter === 'lelaki'}    onclick={() => filter = 'lelaki'}>Majlis Lelaki</button>
		</div>
	</header>

	{#if loading}
		<div class="empty">Memuatkan ucapan…</div>
	{:else if displayed.length === 0}
		<div class="empty">Belum ada ucapan lagi.</div>
	{:else}
		<div class="grid">
			{#each displayed as u, i}
				<div class="card" class:card-p={u.pihak === 'Perempuan'} class:card-l={u.pihak === 'Lelaki'}>
					<div class="card-top">
						<div class="avatar">{u.nama.charAt(0).toUpperCase()}</div>
						<div>
							<p class="nama">{u.nama}</p>
							<span class="badge" class:badge-p={u.pihak === 'Perempuan'} class:badge-l={u.pihak === 'Lelaki'}>
								{u.pihak === 'Perempuan' ? '♀ Perempuan' : '♂ Lelaki'}
							</span>
						</div>
					</div>
					<p class="msg">"{u.msg}"</p>
				</div>
			{/each}
		</div>
		<p class="count">Jumlah ucapan: {displayed.length} | Kemaskini setiap 30 saat</p>
	{/if}
</main>

<style>
	:global(body) {
		margin: 0;
		background: #0f0f1a;
		color: #fff;
		font-family: 'Georgia', serif;
	}

	main {
		min-height: 100vh;
		padding: 2rem 1.5rem 4rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	header {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.event-label {
		font-size: 0.75rem;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: #c9a227;
		margin: 0 0 0.5rem;
	}

	h1 {
		font-size: clamp(1.6rem, 5vw, 3rem);
		font-weight: 400;
		margin: 0 0 0.4rem;
		color: #fff;
	}

	.amp { color: #c9a227; }

	.subtitle {
		font-size: 0.85rem;
		color: #888;
		margin: 0 0 1.5rem;
		letter-spacing: 0.15em;
	}

	.filter-bar {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.filter-bar button {
		padding: 0.4rem 1.1rem;
		border: 1px solid rgba(255,255,255,0.15);
		border-radius: 20px;
		background: transparent;
		color: #aaa;
		font-size: 0.82rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.filter-bar button.active,
	.filter-bar button:hover {
		background: #c9a227;
		border-color: #c9a227;
		color: #000;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	.card {
		background: rgba(255,255,255,0.05);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 14px;
		padding: 1.2rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		transition: transform 0.2s;
	}

	.card:hover { transform: translateY(-2px); }

	.card-p { border-left: 3px solid #b87fa8; }
	.card-l { border-left: 3px solid #c9a227; }

	.card-top {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: rgba(255,255,255,0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.1rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.card-p .avatar { background: rgba(184,127,168,0.25); color: #d4a0c4; }
	.card-l .avatar { background: rgba(201,162,39,0.25);  color: #e8c04a; }

	.nama {
		font-size: 0.92rem;
		font-weight: 600;
		margin: 0 0 0.2rem;
		color: #fff;
	}

	.badge {
		font-size: 0.68rem;
		padding: 2px 8px;
		border-radius: 10px;
		letter-spacing: 0.05em;
	}

	.badge-p { background: rgba(184,127,168,0.2); color: #d4a0c4; }
	.badge-l { background: rgba(201,162,39,0.2);  color: #e8c04a; }

	.msg {
		font-size: 0.88rem;
		line-height: 1.65;
		color: #ccc;
		font-style: italic;
		margin: 0;
	}

	.empty {
		text-align: center;
		color: #666;
		margin-top: 5rem;
		font-size: 1rem;
	}

	.count {
		text-align: center;
		font-size: 0.72rem;
		color: #444;
		margin-top: 2rem;
		letter-spacing: 0.05em;
	}
</style>
