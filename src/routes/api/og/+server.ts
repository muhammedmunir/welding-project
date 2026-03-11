import type { RequestHandler } from './$types';
import { wedding } from '$lib/data/wedding';
import sharp from 'sharp';

export const GET: RequestHandler = async ({ url }) => {
	const eventKey = url.searchParams.get('event') ?? 'perempuan';
	const isLelaki = eventKey === 'lelaki';
	const ev = isLelaki ? wedding.events.lelaki : wedding.events.perempuan;

	const isFairy = !isLelaki;
	const bgFrom  = isFairy ? '#f0e8f8' : '#fdf6e3';
	const bgMid   = isFairy ? '#e8eef8' : '#fef9ee';
	const bgTo    = isFairy ? '#f4e4f4' : '#fdf0cc';
	const primary = isFairy ? '#6b3fa0' : '#7a5c00';
	const gold    = isFairy ? '#c084be' : '#c9a227';
	const accent  = isFairy ? '#4a3060' : '#3d2b00';

	const name1 = isLelaki ? wedding.groom.name : wedding.bride.name;
	const name2 = isLelaki ? wedding.bride.name  : wedding.groom.name;

	const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="${bgFrom}"/>
      <stop offset="50%"  stop-color="${bgMid}"/>
      <stop offset="100%" stop-color="${bgTo}"/>
    </linearGradient>
    <radialGradient id="glow1" cx="0%" cy="0%" r="50%">
      <stop offset="0%" stop-color="${gold}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${gold}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="100%" cy="100%" r="50%">
      <stop offset="0%" stop-color="${gold}" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="${gold}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- Outer border -->
  <rect x="22" y="22" width="1156" height="586" rx="16" fill="none" stroke="${gold}" stroke-width="3.5" opacity="0.55"/>
  <!-- Inner border -->
  <rect x="38" y="38" width="1124" height="554" rx="10" fill="none" stroke="${gold}" stroke-width="1.2" opacity="0.35"/>

  <!-- Corner ornaments -->
  <g opacity="0.45" stroke="${gold}" stroke-width="1.5" fill="none">
    <polyline points="60,88 60,60 88,60"/>
    <polyline points="1112,60 1140,60 1140,88"/>
    <polyline points="60,542 60,570 88,570"/>
    <polyline points="1140,542 1140,570 1112,570"/>
  </g>

  <!-- Event label -->
  <text x="600" y="132" text-anchor="middle"
    font-family="serif" font-size="26" font-weight="bold"
    fill="${accent}" opacity="0.55" letter-spacing="5">
    ${ev.type.toUpperCase()}
  </text>

  <!-- Ornament line -->
  <line x1="300" y1="155" x2="565" y2="155" stroke="${gold}" stroke-width="1" opacity="0.4"/>
  <circle cx="600" cy="155" r="3" fill="${gold}" opacity="0.6"/>
  <line x1="635" y1="155" x2="900" y2="155" stroke="${gold}" stroke-width="1" opacity="0.4"/>

  <!-- Name 1 -->
  <text x="600" y="270" text-anchor="middle"
    font-family="Georgia, serif" font-size="78" font-style="italic" font-weight="bold"
    fill="${primary}">
    ${name1}
  </text>

  <!-- Heart -->
  <text x="600" y="340" text-anchor="middle"
    font-family="serif" font-size="42" fill="${gold}">&#x2665;</text>

  <!-- Name 2 -->
  <text x="600" y="445" text-anchor="middle"
    font-family="Georgia, serif" font-size="78" font-style="italic" font-weight="bold"
    fill="${primary}">
    ${name2}
  </text>

  <!-- Ornament line -->
  <line x1="360" y1="472" x2="565" y2="472" stroke="${gold}" stroke-width="1" opacity="0.4"/>
  <circle cx="600" cy="472" r="3" fill="${gold}" opacity="0.6"/>
  <line x1="635" y1="472" x2="840" y2="472" stroke="${gold}" stroke-width="1" opacity="0.4"/>

  <!-- Date -->
  <text x="600" y="522" text-anchor="middle"
    font-family="Georgia, serif" font-size="30" font-weight="bold"
    fill="${primary}" opacity="0.85">
    ${ev.dayDisplay}, ${ev.dateDisplay}
  </text>

  <!-- Venue -->
  <text x="600" y="560" text-anchor="middle"
    font-family="serif" font-size="24"
    fill="${accent}" opacity="0.6">
    ${ev.venue}
  </text>

  <!-- Hashtag -->
  <text x="600" y="600" text-anchor="middle"
    font-family="Georgia, serif" font-size="21" font-style="italic"
    fill="${gold}" opacity="0.85">
    ${wedding.hashtag}
  </text>
</svg>`;

	const buffer = await sharp(Buffer.from(svg)).jpeg({ quality: 92 }).toBuffer();

	return new Response(new Uint8Array(buffer), {
		headers: {
			'Content-Type': 'image/jpeg',
			'Cache-Control': 'public, max-age=86400'
		}
	});
};
