import type { RequestHandler } from './$types';
import { wedding } from '$lib/data/wedding';
import satori from 'satori';
import sharp from 'sharp';

// Cache fonts at module level so cold starts only fetch once
let fontRegular: ArrayBuffer | null = null;
let fontBold: ArrayBuffer | null = null;

async function getFonts(): Promise<{ regular: ArrayBuffer; bold: ArrayBuffer }> {
	if (!fontRegular || !fontBold) {
		const [r1, r2] = await Promise.all([
			fetch('https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@5/files/noto-sans-latin-400-normal.woff2'),
			fetch('https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@5/files/noto-sans-latin-700-normal.woff2')
		]);
		[fontRegular, fontBold] = await Promise.all([r1.arrayBuffer(), r2.arrayBuffer()]);
	}
	return { regular: fontRegular!, bold: fontBold! };
}

export const GET: RequestHandler = async ({ url }) => {
	const eventKey = url.searchParams.get('event') ?? 'perempuan';
	const isLelaki = eventKey === 'lelaki';
	const ev = isLelaki ? wedding.events.lelaki : wedding.events.perempuan;

	const isFairy = !isLelaki;
	const bgFrom  = isFairy ? '#f5eeff' : '#fffaf0';
	const bgTo    = isFairy ? '#e5d8f8' : '#fde8b0';
	const border  = isFairy ? '#9b59b6' : '#c9a227';
	const primary = isFairy ? '#5b2d8e' : '#7a5000';
	const gold    = isFairy ? '#9b59b6' : '#c9a227';
	const muted   = isFairy ? '#3a1a60' : '#5a3800';

	const name1   = isLelaki ? wedding.groom.name : wedding.bride.name;
	const name2   = isLelaki ? wedding.bride.name  : wedding.groom.name;
	const nameSz  = (n: string) => n.length > 16 ? 52 : n.length > 12 ? 64 : 72;

	const fonts = await getFonts();

	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					display: 'flex',
					width: '1200px',
					height: '630px',
					background: `linear-gradient(135deg, ${bgFrom} 0%, ${bgTo} 100%)`,
					position: 'relative',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: 'Noto Sans',
				},
				children: [
					// Outer border frame
					{
						type: 'div',
						props: {
							style: {
								position: 'absolute',
								top: '24px', left: '24px', right: '24px', bottom: '24px',
								border: `3px solid ${border}`,
								borderRadius: '18px',
								opacity: 0.5,
							}
						}
					},
					// Inner border frame
					{
						type: 'div',
						props: {
							style: {
								position: 'absolute',
								top: '40px', left: '40px', right: '40px', bottom: '40px',
								border: `1px solid ${border}`,
								borderRadius: '12px',
								opacity: 0.25,
							}
						}
					},
					// Content column
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								gap: '0px',
								textAlign: 'center',
								padding: '60px 80px',
								width: '100%',
							},
							children: [
								// Event type
								{
									type: 'div',
									props: {
										style: {
											fontSize: '18px',
											fontWeight: 700,
											letterSpacing: '8px',
											color: muted,
											opacity: 0.6,
											marginBottom: '16px',
										},
										children: ev.type.toUpperCase()
									}
								},
								// Top divider line
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											alignItems: 'center',
											gap: '12px',
											marginBottom: '28px',
										},
										children: [
											{ type: 'div', props: { style: { width: '200px', height: '1px', background: gold, opacity: 0.5 } } },
											{ type: 'div', props: { style: { width: '8px', height: '8px', background: gold, opacity: 0.7, transform: 'rotate(45deg)' } } },
											{ type: 'div', props: { style: { width: '200px', height: '1px', background: gold, opacity: 0.5 } } },
										]
									}
								},
								// Name 1
								{
									type: 'div',
									props: {
										style: {
											fontSize: nameSz(name1),
											fontWeight: 700,
											color: primary,
											lineHeight: 1.1,
											marginBottom: '12px',
										},
										children: name1
									}
								},
								// & separator
								{
									type: 'div',
									props: {
										style: {
											fontSize: '30px',
											fontWeight: 400,
											color: gold,
											marginBottom: '12px',
											opacity: 0.9,
										},
										children: '&'
									}
								},
								// Name 2
								{
									type: 'div',
									props: {
										style: {
											fontSize: nameSz(name2),
											fontWeight: 700,
											color: primary,
											lineHeight: 1.1,
											marginBottom: '28px',
										},
										children: name2
									}
								},
								// Bottom divider line
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											alignItems: 'center',
											gap: '12px',
											marginBottom: '24px',
										},
										children: [
											{ type: 'div', props: { style: { width: '160px', height: '1px', background: gold, opacity: 0.5 } } },
											{ type: 'div', props: { style: { width: '8px', height: '8px', background: gold, opacity: 0.7, transform: 'rotate(45deg)' } } },
											{ type: 'div', props: { style: { width: '160px', height: '1px', background: gold, opacity: 0.5 } } },
										]
									}
								},
								// Date & time
								{
									type: 'div',
									props: {
										style: {
											fontSize: '24px',
											fontWeight: 600,
											color: primary,
											opacity: 0.88,
											marginBottom: '8px',
										},
										children: `${ev.dayDisplay}, ${ev.dateDisplay}  ·  ${ev.time.jamuan.display}`
									}
								},
								// Venue
								{
									type: 'div',
									props: {
										style: {
											fontSize: '20px',
											fontWeight: 400,
											color: muted,
											opacity: 0.65,
											marginBottom: '14px',
										},
										children: `${ev.venue}${isLelaki ? ', ' + ev.venueShort : ''}`
									}
								},
								// Hashtag
								{
									type: 'div',
									props: {
										style: {
											fontSize: '18px',
											fontWeight: 400,
											color: gold,
											opacity: 0.9,
										},
										children: wedding.hashtag
									}
								},
							]
						}
					}
				]
			}
		},
		{
			width: 1200,
			height: 630,
			fonts: [
				{ name: 'Noto Sans', data: fonts.regular, weight: 400, style: 'normal' },
				{ name: 'Noto Sans', data: fonts.bold,    weight: 700, style: 'normal' },
			]
		}
	);

	// satori outputs SVG with text as paths — sharp renders it cleanly without needing system fonts
	const buffer = await sharp(Buffer.from(svg)).jpeg({ quality: 94 }).toBuffer();

	return new Response(new Uint8Array(buffer), {
		headers: {
			'Content-Type': 'image/jpeg',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
