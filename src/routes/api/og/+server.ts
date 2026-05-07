import type { RequestHandler } from './$types';
import { wedding } from '$lib/data/wedding';
import sharp from 'sharp';

export const GET: RequestHandler = async ({ url }) => {
	const eventKey = url.searchParams.get('event') ?? 'perempuan';
	const isLelaki = eventKey === 'lelaki';
	const ev = isLelaki ? wedding.events.lelaki : wedding.events.perempuan;

	const isFairy = !isLelaki;
	const bgFrom  = isFairy ? '#f5eeff' : '#fffaf0';
	const bgMid   = isFairy ? '#eae4f8' : '#fef6e0';
	const bgTo    = isFairy ? '#f0e8f8' : '#fdeec8';
	const primary = isFairy ? '#5b2d8e' : '#7a5000';
	const gold    = isFairy ? '#9b59b6' : '#c9a227';
	const accent  = isFairy ? '#3a1a60' : '#3d2600';
	const topEmoji = isFairy ? '🌸' : '🕊️';

	const name1 = isLelaki ? wedding.groom.name : wedding.bride.name;
	const name2 = isLelaki ? wedding.bride.name  : wedding.groom.name;

	// Scale font size down if name is long
	const nameFontSize = (name: string) => name.length > 16 ? 58 : name.length > 12 ? 68 : 76;

	const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="${bgFrom}"/>
      <stop offset="50%"  stop-color="${bgMid}"/>
      <stop offset="100%" stop-color="${bgTo}"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.25"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Soft centre panel -->
  <rect x="80" y="60" width="1040" height="510" rx="18" fill="url(#panel)"/>

  <!-- Outer frame -->
  <rect x="30" y="30" width="1140" height="570" rx="20" fill="none" stroke="${gold}" stroke-width="3.5" opacity="0.5"/>
  <!-- Inner frame -->
  <rect x="50" y="50" width="1100" height="530" rx="14" fill="none" stroke="${gold}" stroke-width="1" opacity="0.3"/>

  <!-- Corner brackets — top left -->
  <polyline points="80,110 80,80 110,80" fill="none" stroke="${gold}" stroke-width="2.5" opacity="0.6" stroke-linecap="round"/>
  <!-- Corner brackets — top right -->
  <polyline points="1090,80 1120,80 1120,110" fill="none" stroke="${gold}" stroke-width="2.5" opacity="0.6" stroke-linecap="round"/>
  <!-- Corner brackets — bottom left -->
  <polyline points="80,520 80,550 110,550" fill="none" stroke="${gold}" stroke-width="2.5" opacity="0.6" stroke-linecap="round"/>
  <!-- Corner brackets — bottom right -->
  <polyline points="1090,550 1120,550 1120,520" fill="none" stroke="${gold}" stroke-width="2.5" opacity="0.6" stroke-linecap="round"/>

  <!-- Event type label -->
  <text x="600" y="130" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold"
    letter-spacing="9" fill="${accent}" opacity="0.5">
    ${ev.type.toUpperCase()}
  </text>

  <!-- Top divider -->
  <line x1="320" y1="153" x2="566" y2="153" stroke="${gold}" stroke-width="1.2" opacity="0.45"/>
  <polygon points="600,146 611,153 600,160 589,153" fill="${gold}" opacity="0.55"/>
  <line x1="634" y1="153" x2="880" y2="153" stroke="${gold}" stroke-width="1.2" opacity="0.45"/>

  <!-- Name 1 -->
  <text x="600" y="268" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="${nameFontSize(name1)}" font-weight="bold"
    fill="${primary}">
    ${name1}
  </text>

  <!-- Separator -->
  <text x="600" y="328" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="32"
    fill="${gold}" opacity="0.8">&amp;</text>

  <!-- Name 2 -->
  <text x="600" y="430" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="${nameFontSize(name2)}" font-weight="bold"
    fill="${primary}">
    ${name2}
  </text>

  <!-- Bottom divider -->
  <line x1="360" y1="457" x2="566" y2="457" stroke="${gold}" stroke-width="1.2" opacity="0.45"/>
  <polygon points="600,450 611,457 600,464 589,457" fill="${gold}" opacity="0.55"/>
  <line x1="634" y1="457" x2="840" y2="457" stroke="${gold}" stroke-width="1.2" opacity="0.45"/>

  <!-- Date & Time -->
  <text x="600" y="503" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="600"
    fill="${primary}" opacity="0.9">
    ${ev.dayDisplay}, ${ev.dateDisplay}  ·  ${ev.time.jamuan.display}
  </text>

  <!-- Venue -->
  <text x="600" y="541" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="22"
    fill="${accent}" opacity="0.6">
    ${ev.venue}${isLelaki ? ', ' + ev.venueShort : ''}
  </text>

  <!-- Hashtag -->
  <text x="600" y="578" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="19" font-style="italic"
    fill="${gold}" opacity="0.9">
    ${wedding.hashtag}
  </text>
</svg>`;

	const buffer = await sharp(Buffer.from(svg)).jpeg({ quality: 94 }).toBuffer();

	return new Response(new Uint8Array(buffer), {
		headers: {
			'Content-Type': 'image/jpeg',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
