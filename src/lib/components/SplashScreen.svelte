<script lang="ts">
	import { onDestroy } from 'svelte';

	let {
		theme = 'fairy',
		audioSrc,
		brideName,
		groomName,
		eventLabel
	}: {
		theme?: 'fairy' | 'malay';
		audioSrc: string;
		brideName: string;
		groomName: string;
		eventLabel: string;
	} = $props();

	let show = $state(true);
	let leaving = $state(false);
	let muted = $state(false);
	let playing = $state(false);
	let audio: HTMLAudioElement;

	const isFairy = $derived(theme === 'fairy');

	// Kupu-kupu untuk fairy
	const butterflies = [
		{ left: '8%',  du: '7s',  de: '0.5s', sz: '18px', color: '#c471a0' },
		{ left: '20%', du: '10s', de: '2s',   sz: '13px', color: '#9b6fc4' },
		{ left: '45%', du: '8s',  de: '1s',   sz: '22px', color: '#d4a0c8' },
		{ left: '68%', du: '11s', de: '3s',   sz: '15px', color: '#b87fa8' },
		{ left: '85%', du: '9s',  de: '0s',   sz: '20px', color: '#a06dc0' },
	];

	// Kelopak untuk malay
	const petals = [
		{ left: '10%', du: '7s',  de: '0s',   sz: '11px', bg: '#c9a227' },
		{ left: '25%', du: '10s', de: '1.5s', sz: '15px', bg: '#e8c84a' },
		{ left: '50%', du: '8s',  de: '3s',   sz: '9px',  bg: '#f0d870' },
		{ left: '72%', du: '12s', de: '0.8s', sz: '13px', bg: '#c9a227' },
		{ left: '88%', du: '9s',  de: '2.5s', sz: '17px', bg: '#e0c040' },
	];

	function enter() {
		leaving = true;
		if (audio) {
			audio.volume = 0.5;
			audio.play().then(() => { playing = true; }).catch(() => {});
		}
		setTimeout(() => { show = false; }, 700);
	}

	function toggleMute() {
		if (!audio) return;
		muted = !muted;
		audio.muted = muted;
	}

	onDestroy(() => { if (audio) audio.pause(); });
</script>

<!-- Audio -->
<audio bind:this={audio} src={audioSrc} loop preload="auto"></audio>

<!-- Splash -->
{#if show}
	<div class="splash" class:fairy={isFairy} class:malay={!isFairy} class:leaving>

		<!-- Partikel terapung -->
		{#if isFairy}
			{#each butterflies as bf}
				<span class="bf-wrap" style="left:{bf.left};--du:{bf.du};--de:{bf.de};--sz:{bf.sz};color:{bf.color}" aria-hidden="true">
					<span class="bf-wing">
						<svg viewBox="0 0 60 40" fill="currentColor">
							<path d="M30 20 Q15 2 2 8 Q-1 20 11 24 Q20 28 30 20Z" opacity="0.85"/>
							<path d="M30 20 Q7 24 6 35 Q13 43 24 33 Q28 27 30 20Z" opacity="0.6"/>
							<path d="M30 20 Q45 2 58 8 Q61 20 49 24 Q40 28 30 20Z" opacity="0.85"/>
							<path d="M30 20 Q53 24 54 35 Q47 43 36 33 Q32 27 30 20Z" opacity="0.6"/>
							<ellipse cx="30" cy="20" rx="2" ry="9" opacity="0.9"/>
						</svg>
					</span>
				</span>
			{/each}
		{:else}
			{#each petals as p}
				<span class="petal-wrap" style="left:{p.left};--du:{p.du};--de:{p.de};--sz:{p.sz};background:{p.bg}" aria-hidden="true"></span>
			{/each}
		{/if}

		<!-- Ornamen penjuru atas -->
		<div class="corner-tl" aria-hidden="true">
			{#if isFairy}
				<svg viewBox="0 0 90 90" fill="none">
					<path d="M0 45 Q22 22 45 0" stroke="#c471a0" stroke-width="1" opacity="0.5"/>
					<path d="M0 65 Q32 32 65 0" stroke="#9b6fc4" stroke-width="0.6" opacity="0.3"/>
					<circle cx="5" cy="5" r="3" fill="#c471a0" opacity="0.4"/>
					<circle cx="15" cy="3" r="1.5" fill="#d4a0c8" opacity="0.3"/>
				</svg>
			{:else}
				<svg viewBox="0 0 90 90" fill="none">
					<path d="M0 45 Q22 22 45 0" stroke="#c9a227" stroke-width="1" opacity="0.5"/>
					<path d="M0 65 Q32 32 65 0" stroke="#e0c040" stroke-width="0.6" opacity="0.3"/>
					<circle cx="5" cy="5" r="3" fill="#c9a227" opacity="0.5"/>
					<circle cx="15" cy="3" r="1.5" fill="#e8c84a" opacity="0.35"/>
				</svg>
			{/if}
		</div>
		<div class="corner-tr" aria-hidden="true">
			{#if isFairy}
				<svg viewBox="0 0 90 90" fill="none">
					<path d="M90 45 Q68 22 45 0" stroke="#c471a0" stroke-width="1" opacity="0.5"/>
					<path d="M90 65 Q58 32 25 0" stroke="#9b6fc4" stroke-width="0.6" opacity="0.3"/>
					<circle cx="85" cy="5" r="3" fill="#c471a0" opacity="0.4"/>
				</svg>
			{:else}
				<svg viewBox="0 0 90 90" fill="none">
					<path d="M90 45 Q68 22 45 0" stroke="#c9a227" stroke-width="1" opacity="0.5"/>
					<path d="M90 65 Q58 32 25 0" stroke="#e0c040" stroke-width="0.6" opacity="0.3"/>
					<circle cx="85" cy="5" r="3" fill="#c9a227" opacity="0.5"/>
				</svg>
			{/if}
		</div>

		<!-- Konten utama -->
		<div class="splash-content">

			<!-- Ikon tema -->
			<div class="theme-icon" aria-hidden="true">
				{#if isFairy}
					<!-- Mahkota fairy -->
					<svg viewBox="0 0 80 60" fill="none" width="72" height="54">
						<path d="M10 50 L10 30 L25 10 L40 28 L55 10 L70 30 L70 50 Z" fill="rgba(196,113,160,0.2)" stroke="#c471a0" stroke-width="1.5"/>
						<circle cx="25" cy="10" r="4" fill="#d4a0c8"/>
						<circle cx="40" cy="28" r="3" fill="#c471a0"/>
						<circle cx="55" cy="10" r="4" fill="#d4a0c8"/>
						<path d="M10 50 Q40 42 70 50" stroke="#9b6fc4" stroke-width="1" fill="none" opacity="0.6"/>
					</svg>
				{:else}
					<!-- Lengkok masjid -->
					<svg viewBox="0 0 80 70" fill="none" width="72" height="63">
						<path d="M15 65 L15 35 Q15 15 40 15 Q65 15 65 35 L65 65" fill="rgba(201,162,39,0.15)" stroke="#c9a227" stroke-width="1.5"/>
						<path d="M25 65 L25 38 Q25 25 40 25 Q55 25 55 38 L55 65" fill="rgba(224,192,64,0.12)" stroke="#e0c040" stroke-width="1"/>
						<line x1="8" y1="65" x2="72" y2="65" stroke="#c9a227" stroke-width="1.5" opacity="0.7"/>
						<circle cx="40" cy="8" r="4" fill="#c9a227" opacity="0.8"/>
						<line x1="40" y1="2" x2="40" y2="12" stroke="#c9a227" stroke-width="1.5"/>
					</svg>
				{/if}
			</div>

			<p class="bismillah" lang="ar">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>

			<div class="divider-line-wrap" aria-hidden="true">
				<span class="dline"></span>
				<span class="dstar">✦</span>
				<span class="dline"></span>
			</div>

			<p class="event-lbl">{eventLabel}</p>

			<div class="names-wrap">
				<span class="name">{brideName}</span>
				<span class="amp">&</span>
				<span class="name">{groomName}</span>
			</div>

			<div class="divider-line-wrap" aria-hidden="true">
				<span class="dline"></span>
				<span class="dstar">✦</span>
				<span class="dline"></span>
			</div>

			<button class="enter-btn" class:fairy={isFairy} class:malay={!isFairy} onclick={enter}>
				<span class="btn-ripple"></span>
				<span class="btn-inner">
					<span class="btn-icon-left" aria-hidden="true">{isFairy ? '🦋' : '🌙'}</span>
					<span class="btn-text">Buka Jemputan</span>
					<span class="btn-arrow" aria-hidden="true">
						<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
							<path d="M4 10h12M11 5l5 5-5 5"/>
						</svg>
					</span>
				</span>
			</button>

			<p class="music-hint">♪ Muzik akan dimainkan secara automatik</p>
		</div>
	</div>
{/if}

<!-- Floating mute button -->
{#if !show && playing}
	<button
		class="music-fab"
		class:fairy={isFairy}
		class:malay={!isFairy}
		onclick={toggleMute}
		aria-label={muted ? 'Nyahredam muzik' : 'Redam muzik'}
	>
		{#if muted}
			<svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
				<path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
			</svg>
		{:else}
			<svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
				<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
			</svg>
		{/if}
	</button>
{/if}

<style>
	/* ── Splash overlay ── */
	.splash {
		position: fixed;
		inset: 0;
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		animation: splashIn 0.6s ease both;
	}

	.splash.leaving {
		animation: splashOut 0.7s ease forwards;
	}

	@keyframes splashIn {
		from { opacity: 0; }
		to   { opacity: 1; }
	}

	@keyframes splashOut {
		0%   { opacity: 1; transform: scale(1); }
		60%  { opacity: 1; transform: scale(1.04); }
		100% { opacity: 0; transform: scale(0.96); }
	}

	/* ── Tema fairy ── */
	.splash.fairy {
		background:
			radial-gradient(ellipse at 20% 10%, rgba(196,113,160,0.35) 0%, transparent 55%),
			radial-gradient(ellipse at 80% 90%, rgba(155,111,196,0.3) 0%, transparent 50%),
			linear-gradient(160deg, #f5eafa 0%, #ede0f5 40%, #e8d5f0 70%, #f0e6f8 100%);
	}

	/* ── Tema malay ── */
	.splash.malay {
		background:
			radial-gradient(ellipse at 20% 10%, rgba(201,162,39,0.3) 0%, transparent 55%),
			radial-gradient(ellipse at 80% 90%, rgba(224,192,64,0.25) 0%, transparent 50%),
			linear-gradient(160deg, #fefae8 0%, #f8f0d0 40%, #f0e4a8 70%, #fdf6e3 100%);
	}

	/* ── Penjuru ── */
	.corner-tl, .corner-tr {
		position: absolute;
		top: 0;
		width: 90px;
		height: 90px;
		pointer-events: none;
	}
	.corner-tl { left: 0; }
	.corner-tr { right: 0; }

	/* ── Kupu-kupu (fairy) ── */
	.bf-wrap {
		position: absolute;
		bottom: -60px;
		width: var(--sz);
		height: var(--sz);
		animation: bf-rise var(--du) ease-in infinite var(--de);
		pointer-events: none;
	}
	.bf-wing {
		display: block;
		width: 100%;
		height: 100%;
		animation: bf-flap 0.45s ease-in-out infinite alternate;
	}
	@keyframes bf-rise {
		0%   { transform: translateY(0) translateX(0); opacity: 0; }
		10%  { opacity: 1; }
		90%  { opacity: 0.8; }
		100% { transform: translateY(-110vh) translateX(40px); opacity: 0; }
	}
	@keyframes bf-flap {
		from { transform: scaleX(1); }
		to   { transform: scaleX(0.12); }
	}

	/* ── Kelopak (malay) ── */
	.petal-wrap {
		position: absolute;
		top: -25px;
		width: var(--sz);
		height: var(--sz);
		border-radius: 50% 0 50% 0;
		animation: petal-fall var(--du) linear infinite var(--de);
		pointer-events: none;
		opacity: 0.75;
	}
	@keyframes petal-fall {
		0%   { transform: translateY(-30px) rotate(0deg) translateX(0); opacity: 0; }
		10%  { opacity: 0.75; }
		90%  { opacity: 0.5; }
		100% { transform: translateY(105vh) rotate(360deg) translateX(30px); opacity: 0; }
	}

	/* ── Konten ── */
	.splash-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 2.5rem 2rem;
		text-align: center;
		position: relative;
		z-index: 1;
		animation: contentIn 0.8s 0.2s ease both;
	}

	@keyframes contentIn {
		from { opacity: 0; transform: translateY(24px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	/* ── Ikon tema ── */
	.theme-icon {
		animation: float 4s ease-in-out infinite;
	}
	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50%       { transform: translateY(-8px); }
	}

	/* ── Bismillah ── */
	.bismillah {
		font-family: var(--font-amiri);
		font-size: clamp(1.2rem, 4.5vw, 1.6rem);
		line-height: 1.8;
		margin: 0;
	}
	.fairy .bismillah { color: #6b3d8a; }
	.malay .bismillah { color: #7a5a10; }

	/* ── Divider ── */
	.divider-line-wrap {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 200px;
	}
	.dline {
		flex: 1;
		height: 1px;
	}
	.fairy .dline { background: rgba(155,111,196,0.4); }
	.malay .dline { background: rgba(201,162,39,0.5); }

	.dstar {
		font-size: 0.65rem;
	}
	.fairy .dstar { color: #c471a0; }
	.malay .dstar { color: #c9a227; }

	/* ── Label event ── */
	.event-lbl {
		font-family: var(--font-lato);
		font-size: 0.78rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		margin: 0;
	}
	.fairy .event-lbl { color: #8a5aa8; }
	.malay .event-lbl { color: #8a6a20; }

	/* ── Nama ── */
	.names-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
	}
	.name {
		font-family: var(--font-playfair);
		font-size: clamp(1.3rem, 5.5vw, 2rem);
		font-weight: 700;
		line-height: 1.2;
	}
	.fairy .name { color: #5a2d82; }
	.malay .name { color: #5a3a00; }

	.amp {
		font-family: var(--font-playfair);
		font-size: clamp(0.9rem, 3vw, 1.2rem);
		opacity: 0.55;
		line-height: 1.4;
	}
	.fairy .amp { color: #9b6fc4; }
	.malay .amp { color: #c9a227; }

	/* ── Butang masuk ── */
	.enter-btn {
		position: relative;
		overflow: hidden;
		border: none;
		border-radius: 50px;
		cursor: pointer;
		padding: 0;
		margin-top: 0.4rem;
		transition: transform 0.18s ease, box-shadow 0.18s ease;
	}

	.enter-btn:active {
		transform: scale(0.94);
	}

	.enter-btn.fairy {
		background: linear-gradient(135deg, #9b6fc4 0%, #c471a0 100%);
		box-shadow: 0 4px 20px rgba(155,111,196,0.45);
	}
	.enter-btn.fairy:hover {
		box-shadow: 0 6px 28px rgba(155,111,196,0.6);
		transform: translateY(-1px);
	}

	.enter-btn.malay {
		background: linear-gradient(135deg, #c9a227 0%, #e8c84a 100%);
		box-shadow: 0 4px 20px rgba(201,162,39,0.45);
	}
	.enter-btn.malay:hover {
		box-shadow: 0 6px 28px rgba(201,162,39,0.6);
		transform: translateY(-1px);
	}

	/* Ripple */
	.btn-ripple {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at center, rgba(255,255,255,0.35) 0%, transparent 70%);
		opacity: 0;
		transform: scale(0);
		border-radius: inherit;
		transition: none;
	}
	.enter-btn:active .btn-ripple {
		animation: ripple 0.5s ease forwards;
	}
	@keyframes ripple {
		0%   { opacity: 1; transform: scale(0); }
		100% { opacity: 0; transform: scale(2.5); }
	}

	.btn-inner {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.75rem 1.8rem;
		position: relative;
		z-index: 1;
	}

	.btn-text {
		font-family: var(--font-lato);
		font-size: 0.95rem;
		font-weight: 700;
		letter-spacing: 0.04em;
	}
	.enter-btn.fairy .btn-text  { color: #fff; }
	.enter-btn.malay .btn-text  { color: #3d2a00; }

	.btn-icon-left { font-size: 1rem; }

	.btn-arrow {
		display: flex;
		align-items: center;
	}
	.enter-btn.fairy .btn-arrow { color: rgba(255,255,255,0.85); }
	.enter-btn.malay .btn-arrow { color: rgba(61,42,0,0.7); }

	/* ── Music hint ── */
	.music-hint {
		font-family: var(--font-lato);
		font-size: 0.72rem;
		letter-spacing: 0.05em;
		opacity: 0.5;
		margin: 0;
	}
	.fairy .music-hint { color: #7a4d9a; }
	.malay .music-hint { color: #8a6a20; }

	/* ── Floating mute button ── */
	.music-fab {
		position: fixed;
		bottom: 1.4rem;
		right: 1.2rem;
		z-index: 50;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 12px rgba(0,0,0,0.18);
		transition: transform 0.15s ease;
		animation: fabIn 0.4s ease both;
	}
	.music-fab:active { transform: scale(0.9); }

	.music-fab.fairy {
		background: rgba(155,111,196,0.88);
		color: #fff;
	}
	.music-fab.malay {
		background: rgba(201,162,39,0.9);
		color: #3d2a00;
	}

	@keyframes fabIn {
		from { opacity: 0; transform: scale(0.5); }
		to   { opacity: 1; transform: scale(1); }
	}
</style>
