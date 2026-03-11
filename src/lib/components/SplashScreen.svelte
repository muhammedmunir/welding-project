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

	let phase = $state<'idle' | 'opening' | 'leaving'>('idle');
	let show  = $state(true);
	let muted = $state(false);
	let playing = $state(false);
	let audio: HTMLAudioElement;

	const isFairy = $derived(theme === 'fairy');

	const butterflies = [
		{ left: '7%',  du: '8s',  de: '0s',   sz: '16px', color: '#c471a0' },
		{ left: '22%', du: '11s', de: '2.5s', sz: '12px', color: '#9b6fc4' },
		{ left: '48%', du: '9s',  de: '1s',   sz: '20px', color: '#d4a0c8' },
		{ left: '72%', du: '12s', de: '3.8s', sz: '14px', color: '#b87fa8' },
		{ left: '88%', du: '8s',  de: '5s',   sz: '18px', color: '#a06dc0' },
	];

	const petals = [
		{ left: '8%',  du: '7s',  de: '0s',   sz: '10px', bg: '#c9a227' },
		{ left: '26%', du: '10s', de: '1.8s', sz: '14px', bg: '#e8c84a' },
		{ left: '52%', du: '9s',  de: '3.2s', sz: '9px',  bg: '#f0d870' },
		{ left: '74%', du: '11s', de: '0.6s', sz: '13px', bg: '#c9a227' },
		{ left: '90%', du: '8s',  de: '2.2s', sz: '16px', bg: '#e0c040' },
	];

	function open() {
		if (phase !== 'idle') return;
		phase = 'opening';
		if (audio) {
			audio.volume = 0.45;
			audio.play().then(() => { playing = true; }).catch(() => {});
		}
		setTimeout(() => { phase = 'leaving'; }, 1600);
		setTimeout(() => { show = false; }, 2200);
	}

	function toggleMute() {
		if (!audio) return;
		muted = !muted;
		audio.muted = muted;
	}

	onDestroy(() => { if (audio) audio.pause(); });
</script>

<audio bind:this={audio} src={audioSrc} loop preload="auto"></audio>

{#if show}
<div class="splash" class:fairy={isFairy} class:malay={!isFairy} class:leaving={phase === 'leaving'}>

	<!-- Partikel latar -->
	<div class="particles" aria-hidden="true">
		{#if isFairy}
			{#each butterflies as bf}
				<span class="bf-wrap" style="left:{bf.left};--du:{bf.du};--de:{bf.de};--sz:{bf.sz};color:{bf.color}">
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
				<span class="petal-wrap" style="left:{p.left};--du:{p.du};--de:{p.de};--sz:{p.sz};background:{p.bg}"></span>
			{/each}
		{/if}
	</div>

	<!-- Kandungan utama -->
	<div class="stage" class:opening={phase === 'opening' || phase === 'leaving'}>

		<!-- Sampul surat -->
		<div
			class="envelope"
			class:opening={phase === 'opening' || phase === 'leaving'}
			onclick={open}
			role="button"
			tabindex="0"
			onkeydown={(e) => e.key === 'Enter' && open()}
			aria-label="Ketuk untuk buka jemputan"
		>
			<!-- Badan sampul -->
			<div class="env-body">
				<!-- Garis lipatan dalam (dekoratif) -->
				<svg class="fold-lines" viewBox="0 0 300 190" preserveAspectRatio="none" aria-hidden="true">
					<line x1="0"   y1="0"   x2="150" y2="105" stroke-width="0.8" opacity="0.25"/>
					<line x1="300" y1="0"   x2="150" y2="105" stroke-width="0.8" opacity="0.25"/>
					<line x1="0"   y1="190" x2="150" y2="105" stroke-width="0.8" opacity="0.2"/>
					<line x1="300" y1="190" x2="150" y2="105" stroke-width="0.8" opacity="0.2"/>
				</svg>

				<!-- Kandungan dalam sampul — muncul selepas flap buka -->
				<div class="env-content" class:visible={phase === 'opening' || phase === 'leaving'}>
					<p class="content-bismillah" lang="ar">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
					<div class="content-divider" aria-hidden="true">
						<span class="cdline"></span><span class="cdstar">✦</span><span class="cdline"></span>
					</div>
					<p class="content-event">{eventLabel}</p>
					<p class="content-name">{brideName}</p>
					<p class="content-amp">&amp;</p>
					<p class="content-name">{groomName}</p>
				</div>
			</div>

			<!-- Flap atas — buka ke belakang -->
			<div class="flap-wrap" class:open={phase === 'opening' || phase === 'leaving'}>
				<div class="env-flap">
					<!-- Garis lipatan dalam flap -->
					<svg class="flap-lines" viewBox="0 0 300 165" preserveAspectRatio="none" aria-hidden="true">
						<line x1="0"   y1="0" x2="150" y2="105" stroke-width="0.8" opacity="0.2"/>
						<line x1="300" y1="0" x2="150" y2="105" stroke-width="0.8" opacity="0.2"/>
					</svg>
				</div>
			</div>

			<!-- Mohor lilin -->
			<div class="seal" class:cracked={phase !== 'idle'} aria-hidden="true">
				<span class="seal-text">{isFairy ? 'S×M' : 'M×S'}</span>
			</div>

			<!-- Sparkles bila seal pecah -->
			{#if phase !== 'idle'}
				<div class="sparkle-ring" aria-hidden="true">
					{#each [0,45,90,135,180,225,270,315] as deg, i}
						<span class="sparkle" style="--deg:{deg}deg;--i:{i}"></span>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Teks hint -->
		<p class="hint" class:hide={phase !== 'idle'}>
			{#if isFairy}🦋{:else}🌙{/if}&nbsp;Ketuk sampul untuk buka
		</p>
	</div>
</div>
{/if}

<!-- Floating mute -->
{#if !show && playing}
	<button
		class="music-fab"
		class:fairy={isFairy}
		class:malay={!isFairy}
		onclick={toggleMute}
		aria-label={muted ? 'Nyahredam' : 'Redam muzik'}
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
/* ══ Splash ═══════════════════════════════════════════════ */
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
.splash.leaving { animation: splashOut 0.6s ease forwards; }
@keyframes splashIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes splashOut { to { opacity: 0; } }

.splash.fairy {
	background:
		radial-gradient(ellipse at 18% 18%, rgba(196,113,160,0.4) 0%, transparent 52%),
		radial-gradient(ellipse at 82% 82%, rgba(155,111,196,0.35) 0%, transparent 52%),
		linear-gradient(145deg, #f8f0fc 0%, #ede0f5 40%, #e4d0ef 70%, #f4eafa 100%);
}
.splash.malay {
	background:
		radial-gradient(ellipse at 18% 18%, rgba(201,162,39,0.35) 0%, transparent 52%),
		radial-gradient(ellipse at 82% 82%, rgba(224,192,64,0.3) 0%, transparent 52%),
		linear-gradient(145deg, #fefcf0 0%, #f8f0d0 40%, #f0e4a8 70%, #fdf6e3 100%);
}

/* ══ Partikel ════════════════════════════════════════════ */
.particles {
	position: absolute; inset: 0;
	pointer-events: none; overflow: hidden;
}
.bf-wrap {
	position: absolute; bottom: -60px;
	width: var(--sz); height: var(--sz);
	animation: bf-rise var(--du) ease-in infinite var(--de);
}
.bf-wing {
	display: block; width: 100%; height: 100%;
	animation: bf-flap 0.45s ease-in-out infinite alternate;
}
@keyframes bf-rise {
	0%   { transform: translateY(0) translateX(0); opacity: 0; }
	10%  { opacity: 1; }
	90%  { opacity: 0.7; }
	100% { transform: translateY(-110vh) translateX(35px); opacity: 0; }
}
@keyframes bf-flap {
	from { transform: scaleX(1); }
	to   { transform: scaleX(0.12); }
}
.petal-wrap {
	position: absolute; top: -25px;
	width: var(--sz); height: var(--sz);
	border-radius: 50% 0 50% 0;
	animation: petal-fall var(--du) linear infinite var(--de);
	opacity: 0.7;
}
@keyframes petal-fall {
	0%   { transform: translateY(-30px) rotate(0deg) translateX(0); opacity: 0; }
	10%  { opacity: 0.7; }
	90%  { opacity: 0.4; }
	100% { transform: translateY(105vh) rotate(360deg) translateX(28px); opacity: 0; }
}

/* ══ Stage ═══════════════════════════════════════════════ */
.stage {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.2rem;
	position: relative;
	z-index: 1;
	animation: stageIn 0.8s 0.1s ease both;
}
@keyframes stageIn {
	from { opacity: 0; transform: translateY(18px); }
	to   { opacity: 1; transform: translateY(0); }
}
.stage.opening {
	animation: stageUp 0.5s 1.4s ease both;
}
@keyframes stageUp {
	to { transform: scale(1.03); opacity: 0.8; }
}

/* ══ Sampul ══════════════════════════════════════════════ */
.envelope {
	position: relative;
	width: clamp(280px, 82vw, 340px);
	/* tinggi = lebar × 0.63 nisbah sampul standard */
	aspect-ratio: 340 / 214;
	cursor: pointer;
	filter: drop-shadow(0 8px 28px rgba(0,0,0,0.15));
	transition: filter 0.2s, transform 0.15s;
}
.envelope:hover  { filter: drop-shadow(0 12px 36px rgba(0,0,0,0.2)); }
.envelope:active { transform: scale(0.98); }

/* Badan */
.env-body {
	position: absolute;
	inset: 0;
	border-radius: 4px;
	overflow: hidden;
}
.fairy .env-body {
	background: linear-gradient(160deg, #ede0f5 0%, #e0cef0 100%);
	border: 1.5px solid rgba(196,113,160,0.35);
}
.malay .env-body {
	background: linear-gradient(160deg, #f5e8c0 0%, #e8d498 100%);
	border: 1.5px solid rgba(201,162,39,0.4);
}

/* Garis lipatan SVG */
.fold-lines {
	position: absolute;
	inset: 0;
	width: 100%; height: 100%;
}
.fairy .fold-lines line { stroke: #9b6fc4; }
.malay .fold-lines line { stroke: #c9a227; }

/* Kandungan dalam */
.env-content {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.18rem;
	padding: 1rem 1.5rem;
	opacity: 0;
	transform: translateY(6px);
	transition: opacity 0.5s 0.55s ease, transform 0.5s 0.55s ease;
	pointer-events: none;
}
.env-content.visible {
	opacity: 1;
	transform: translateY(0);
}

.content-bismillah {
	font-family: var(--font-amiri);
	font-size: clamp(0.95rem, 3vw, 1.15rem);
	line-height: 1.8;
	margin: 0;
}
.fairy .content-bismillah { color: #6b3d8a; }
.malay .content-bismillah { color: #7a5a10; }

.content-divider {
	display: flex; align-items: center; gap: 0.35rem;
	width: 130px;
}
.cdline { flex: 1; height: 1px; }
.fairy .cdline  { background: rgba(155,111,196,0.4); }
.malay .cdline  { background: rgba(201,162,39,0.5); }
.cdstar { font-size: 0.55rem; }
.fairy .cdstar { color: #c471a0; }
.malay .cdstar { color: #c9a227; }

.content-event {
	font-family: var(--font-lato);
	font-size: clamp(0.55rem, 1.8vw, 0.68rem);
	letter-spacing: 0.18em;
	text-transform: uppercase;
	margin: 0;
	opacity: 0.8;
}
.fairy .content-event { color: #8a5aa8; }
.malay .content-event { color: #8a6a20; }

.content-name {
	font-family: var(--font-playfair);
	font-size: clamp(0.9rem, 3.2vw, 1.15rem);
	font-weight: 700;
	margin: 0;
	line-height: 1.25;
}
.fairy .content-name { color: #5a2d82; }
.malay .content-name { color: #5a3a00; }

.content-amp {
	font-family: var(--font-playfair);
	font-size: 0.8rem;
	margin: 0;
	opacity: 0.5;
}
.fairy .content-amp { color: #9b6fc4; }
.malay .content-amp { color: #c9a227; }

/* ══ Flap ════════════════════════════════════════════════ */
.flap-wrap {
	position: absolute;
	top: 0; left: 0; right: 0;
	/* tinggi flap = 55% daripada tinggi sampul */
	height: 55%;
	transform-origin: top center;
	transition: transform 0.7s 0.15s cubic-bezier(0.4, 0, 0.2, 1);
	z-index: 4;
	/* pastikan bahagian belakang tak nampak */
	backface-visibility: hidden;
}
.flap-wrap.open {
	transform: perspective(800px) rotateX(-178deg);
}

.env-flap {
	position: absolute;
	inset: 0;
	overflow: hidden;
	/* Bentuk segitiga menghala ke bawah = flap sampul */
	clip-path: polygon(0 0, 100% 0, 50% 82%);
}
.fairy .env-flap {
	background: linear-gradient(170deg, #e0cef0 0%, #d0b8e8 60%, #c4a8e0 100%);
}
.malay .env-flap {
	background: linear-gradient(170deg, #eddea8 0%, #e0cc88 60%, #d4bc70 100%);
}

.flap-lines {
	position: absolute; inset: 0;
	width: 100%; height: 100%;
}
.fairy .flap-lines line { stroke: #9b6fc4; }
.malay .flap-lines line { stroke: #c9a227; }

/* ══ Mohor lilin ═════════════════════════════════════════ */
.seal {
	position: absolute;
	/* letakkan di tengah bawah flap — ~55% dari atas */
	top: 48%; left: 50%;
	transform: translate(-50%, -50%);
	width: 46px; height: 46px;
	border-radius: 50%;
	z-index: 6;
	display: flex; align-items: center; justify-content: center;
	animation: sealPulse 2.4s ease-in-out infinite;
}
.seal.cracked {
	animation: sealCrack 0.35s ease forwards;
}
.fairy .seal {
	background: radial-gradient(circle at 38% 35%, #9060b8, #5a2d82);
	box-shadow: 0 0 0 3px rgba(255,255,255,0.25), 0 3px 12px rgba(90,45,130,0.55);
}
.malay .seal {
	background: radial-gradient(circle at 38% 35%, #d4b030, #8a6010);
	box-shadow: 0 0 0 3px rgba(255,255,255,0.25), 0 3px 12px rgba(138,96,16,0.55);
}
.seal-text {
	font-family: var(--font-playfair);
	font-size: 0.58rem;
	font-weight: 700;
	color: rgba(255,255,255,0.92);
	letter-spacing: 0.04em;
	pointer-events: none;
}
@keyframes sealPulse {
	0%,100% { box-shadow: 0 0 0 3px rgba(255,255,255,0.25), 0 3px 12px rgba(0,0,0,0.3); }
	50%      { box-shadow: 0 0 0 6px rgba(255,255,255,0.12), 0 5px 22px rgba(0,0,0,0.4); }
}
@keyframes sealCrack {
	0%   { transform: translate(-50%,-50%) scale(1) rotate(0deg); opacity: 1; }
	35%  { transform: translate(-50%,-50%) scale(1.3) rotate(8deg);  opacity: 1; }
	100% { transform: translate(-50%,-50%) scale(0) rotate(-25deg);  opacity: 0; }
}

/* ══ Hint ═════════════════════════════════════════════════ */
.hint {
	font-family: var(--font-lato);
	font-size: 0.78rem;
	letter-spacing: 0.1em;
	margin: 0;
	transition: opacity 0.35s;
	animation: hintBlink 2s ease-in-out infinite;
}
.hint.hide { opacity: 0 !important; animation: none; }
.fairy .hint { color: #8a5aa8; }
.malay .hint { color: #8a6a20; }
@keyframes hintBlink {
	0%,100% { opacity: 1; }
	50%     { opacity: 0.45; }
}

/* ══ Shimmer pada sampul ══════════════════════════════════ */
.env-body::after {
	content: '';
	position: absolute;
	inset: 0;
	background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%);
	background-size: 250% 100%;
	background-position: -250% center;
	animation: envShimmer 2.8s 0.8s ease-in-out infinite;
	pointer-events: none;
}
@keyframes envShimmer {
	0%   { background-position: -250% center; }
	60%  { background-position: 250% center; }
	100% { background-position: 250% center; }
}

/* ══ Sparkles ════════════════════════════════════════════ */
.sparkle-ring {
	position: absolute;
	top: 48%; left: 50%;
	width: 0; height: 0;
	z-index: 7;
	pointer-events: none;
}
.sparkle {
	position: absolute;
	width: 7px; height: 7px;
	border-radius: 50%;
	transform-origin: 0 0;
	animation: sparkleFly 0.55s calc(var(--i) * 0.03s) ease-out both;
}
.fairy .sparkle:nth-child(odd)  { background: #c471a0; }
.fairy .sparkle:nth-child(even) { background: #d4af37; }
.malay .sparkle:nth-child(odd)  { background: #c9a227; }
.malay .sparkle:nth-child(even) { background: #fff; }
@keyframes sparkleFly {
	0%   { transform: rotate(var(--deg)) translateX(0)    scale(1.2); opacity: 1; }
	100% { transform: rotate(var(--deg)) translateX(40px) scale(0);   opacity: 0; }
}

/* ══ Floating mute ═══════════════════════════════════════ */
.music-fab {
	position: fixed;
	/* biar atas sticky nav (~58px) */
	bottom: calc(58px + 0.85rem); right: 1.2rem;
	z-index: 50;
	width: 40px; height: 40px;
	border-radius: 50%; border: none;
	cursor: pointer;
	display: flex; align-items: center; justify-content: center;
	box-shadow: 0 2px 12px rgba(0,0,0,0.18);
	transition: transform 0.15s;
	animation: fabIn 0.4s ease both;
}
.music-fab:active { transform: scale(0.9); }
.music-fab.fairy { background: rgba(155,111,196,0.9); color: #fff; }
.music-fab.malay { background: rgba(201,162,39,0.92); color: #3d2a00; }
@keyframes fabIn {
	from { opacity: 0; transform: scale(0.4); }
	to   { opacity: 1; transform: scale(1); }
}
</style>
