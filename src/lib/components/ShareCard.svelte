<script lang="ts">
	let {
		brideName,
		groomName,
		eventLabel,
		dayDisplay,
		dateDisplay,
		hijriDisplay,
		venue,
		timeDisplay,
		hashtag,
		theme = 'fairy',
		swapNames = false
	}: {
		brideName: string;
		groomName: string;
		eventLabel: string;
		dayDisplay: string;
		dateDisplay: string;
		hijriDisplay: string;
		venue: string;
		timeDisplay: string;
		hashtag: string;
		theme?: 'fairy' | 'malay';
		swapNames?: boolean;
	} = $props();

	const firstName = $derived(swapNames ? groomName : brideName);
	const secondName = $derived(swapNames ? brideName : groomName);

	let generating = $state(false);

	async function generateCard() {
		generating = true;
		await new Promise(r => setTimeout(r, 50)); // let UI update

		const W = 1080, H = 1080;
		const canvas = document.createElement('canvas');
		canvas.width = W; canvas.height = H;
		const ctx = canvas.getContext('2d')!;

		const isFairy = theme === 'fairy';

		// ── Background gradient ──────────────────────────────────
		const bgGrad = ctx.createLinearGradient(0, 0, W, H);
		if (isFairy) {
			bgGrad.addColorStop(0, '#f0e8f8');
			bgGrad.addColorStop(0.5, '#e8eef8');
			bgGrad.addColorStop(1, '#f4e4f4');
		} else {
			bgGrad.addColorStop(0, '#fdf6e3');
			bgGrad.addColorStop(0.5, '#fef9ee');
			bgGrad.addColorStop(1, '#fdf0cc');
		}
		ctx.fillStyle = bgGrad;
		ctx.fillRect(0, 0, W, H);

		// ── Decorative corner fill (top-left) ───────────────────
		const cornerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 400);
		cornerGrad.addColorStop(0, isFairy ? 'rgba(192,132,190,0.18)' : 'rgba(201,162,39,0.15)');
		cornerGrad.addColorStop(1, 'transparent');
		ctx.fillStyle = cornerGrad;
		ctx.fillRect(0, 0, W, H);
		const cornerGrad2 = ctx.createRadialGradient(W, H, 0, W, H, 450);
		cornerGrad2.addColorStop(0, isFairy ? 'rgba(126,184,214,0.15)' : 'rgba(201,162,39,0.12)');
		cornerGrad2.addColorStop(1, 'transparent');
		ctx.fillStyle = cornerGrad2;
		ctx.fillRect(0, 0, W, H);

		const gold = isFairy ? '#c084be' : '#c9a227';
		const primary = isFairy ? '#6b3fa0' : '#7a5c00';
		const accent = isFairy ? '#4a3060' : '#3d2b00';

		// ── Outer border ────────────────────────────────────────
		ctx.strokeStyle = gold;
		ctx.lineWidth = 6;
		roundRect(ctx, 28, 28, W - 56, H - 56, 24);
		ctx.stroke();
		ctx.lineWidth = 1.5;
		roundRect(ctx, 46, 46, W - 92, H - 92, 16);
		ctx.stroke();

		// ── Corner ornaments ────────────────────────────────────
		drawCornerOrnament(ctx, 68, 68, gold, 0);
		drawCornerOrnament(ctx, W - 68, 68, gold, 90);
		drawCornerOrnament(ctx, 68, H - 68, gold, 270);
		drawCornerOrnament(ctx, W - 68, H - 68, gold, 180);

		// ── Bismillah ───────────────────────────────────────────
		ctx.textAlign = 'center';
		ctx.font = '38px Amiri, serif';
		ctx.fillStyle = primary;
		ctx.globalAlpha = 0.7;
		ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', W / 2, 135);
		ctx.globalAlpha = 1;

		// ── Top ornament line ───────────────────────────────────
		drawOrnamentLine(ctx, W / 2, 160, 340, gold);

		// ── Event label ─────────────────────────────────────────
		ctx.font = '700 34px Lato, sans-serif';
		ctx.fillStyle = accent;
		ctx.globalAlpha = 0.65;
		ctx.letterSpacing = '4px';
		ctx.fillText(eventLabel.toUpperCase(), W / 2, 215);
		ctx.globalAlpha = 1;

		// ── Couple names ─────────────────────────────────────────
		ctx.font = `italic 700 82px 'Playfair Display', Georgia, serif`;
		ctx.fillStyle = primary;
		ctx.fillText(firstName, W / 2, 330);

		// Heart
		ctx.font = '52px serif';
		ctx.fillStyle = gold;
		ctx.fillText('♥', W / 2, 400);

		ctx.font = `italic 700 82px 'Playfair Display', Georgia, serif`;
		ctx.fillStyle = primary;
		ctx.fillText(secondName, W / 2, 490);

		// ── Mid ornament line ──────────────────────────────────
		drawOrnamentLine(ctx, W / 2, 530, 260, gold);

		// ── Date block ─────────────────────────────────────────
		ctx.font = '500 30px Lato, sans-serif';
		ctx.fillStyle = accent;
		ctx.globalAlpha = 0.6;
		ctx.fillText(hijriDisplay, W / 2, 590);
		ctx.globalAlpha = 1;

		ctx.font = `700 44px 'Playfair Display', Georgia, serif`;
		ctx.fillStyle = primary;
		ctx.fillText(dayDisplay + ', ' + dateDisplay, W / 2, 648);

		ctx.font = '400 30px Lato, sans-serif';
		ctx.fillStyle = accent;
		ctx.globalAlpha = 0.75;
		ctx.fillText('Jamuan: ' + timeDisplay, W / 2, 700);
		ctx.globalAlpha = 1;

		// ── Venue ───────────────────────────────────────────────
		ctx.font = `600 34px 'Playfair Display', Georgia, serif`;
		ctx.fillStyle = primary;
		ctx.fillText(venue, W / 2, 770);

		// ── Bottom ornament ─────────────────────────────────────
		drawOrnamentLine(ctx, W / 2, 820, 220, gold);

		// ── Hashtag ─────────────────────────────────────────────
		ctx.font = `italic 500 32px 'Playfair Display', Georgia, serif`;
		ctx.fillStyle = gold;
		ctx.fillText(hashtag, W / 2, 890);

		// ── Website hint ────────────────────────────────────────
		ctx.font = '400 22px Lato, sans-serif';
		ctx.fillStyle = accent;
		ctx.globalAlpha = 0.4;
		ctx.fillText('Imbas QR atau lawati pautan jemputan digital', W / 2, 960);
		ctx.globalAlpha = 1;

		// ── Download / Share ────────────────────────────────────
		const dataUrl = canvas.toDataURL('image/png');
		const filename = `jemputan-${theme}-syarah-munir.png`;

		if (navigator.share && navigator.canShare) {
			try {
				const res = await fetch(dataUrl);
				const blob = await res.blob();
				const file = new File([blob], filename, { type: 'image/png' });
				if (navigator.canShare({ files: [file] })) {
					await navigator.share({ files: [file], title: 'Jemputan Perkahwinan' });
					generating = false;
					return;
				}
			} catch { /* fallback to download */ }
		}

		const a = document.createElement('a');
		a.href = dataUrl;
		a.download = filename;
		a.click();
		generating = false;
	}

	function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.lineTo(x + w - r, y);
		ctx.arcTo(x + w, y, x + w, y + r, r);
		ctx.lineTo(x + w, y + h - r);
		ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
		ctx.lineTo(x + r, y + h);
		ctx.arcTo(x, y + h, x, y + h - r, r);
		ctx.lineTo(x, y + r);
		ctx.arcTo(x, y, x + r, y, r);
		ctx.closePath();
	}

	function drawOrnamentLine(ctx: CanvasRenderingContext2D, cx: number, y: number, halfW: number, color: string) {
		ctx.strokeStyle = color;
		ctx.lineWidth = 1.2;
		ctx.globalAlpha = 0.55;
		ctx.beginPath(); ctx.moveTo(cx - halfW, y); ctx.lineTo(cx - 18, y); ctx.stroke();
		ctx.beginPath(); ctx.moveTo(cx + 18, y); ctx.lineTo(cx + halfW, y); ctx.stroke();
		ctx.fillStyle = color;
		ctx.beginPath(); ctx.arc(cx, y, 3, 0, Math.PI * 2); ctx.fill();
		ctx.beginPath(); ctx.arc(cx - 10, y, 2, 0, Math.PI * 2); ctx.fill();
		ctx.beginPath(); ctx.arc(cx + 10, y, 2, 0, Math.PI * 2); ctx.fill();
		ctx.globalAlpha = 1;
	}

	function drawCornerOrnament(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, rotation: number) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate((rotation * Math.PI) / 180);
		ctx.strokeStyle = color;
		ctx.lineWidth = 1.5;
		ctx.globalAlpha = 0.5;
		ctx.beginPath(); ctx.moveTo(0, -32); ctx.lineTo(0, 0); ctx.lineTo(32, 0); ctx.stroke();
		ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(10, -18); ctx.lineTo(10, 0); ctx.stroke();
		ctx.fillStyle = color;
		ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
		ctx.globalAlpha = 1;
		ctx.restore();
	}
</script>

<button
	class="card-btn"
	class:fairy={theme === 'fairy'}
	class:malay={theme === 'malay'}
	onclick={generateCard}
	disabled={generating}
>
	{#if generating}
		<span class="spinner"></span>
		Jana kad…
	{:else}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
			<rect x="3" y="3" width="18" height="18" rx="2"/>
			<path d="M8 12h8M12 8v8"/>
		</svg>
		Jana Kad Jemputan
	{/if}
</button>

<style>
	.card-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.55rem 1.3rem;
		border-radius: 50px;
		border: 1.5px solid;
		font-family: var(--font-lato);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.card-btn:disabled {
		opacity: 0.65;
		cursor: wait;
	}

	.card-btn.fairy {
		border-color: #c084be;
		color: #6b3fa0;
		background: rgba(192,132,190,0.08);
	}

	.card-btn.fairy:hover:not(:disabled) {
		background: rgba(192,132,190,0.18);
		transform: translateY(-1px);
	}

	.card-btn.malay {
		border-color: #c9a227;
		color: #7a5c00;
		background: rgba(201,162,39,0.08);
	}

	.card-btn.malay:hover:not(:disabled) {
		background: rgba(201,162,39,0.18);
		transform: translateY(-1px);
	}

	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid currentColor;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
		flex-shrink: 0;
	}

	@keyframes spin { to { transform: rotate(360deg); } }
</style>
