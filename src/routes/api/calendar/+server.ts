import type { RequestHandler } from './$types';
import { wedding } from '$lib/data/wedding';

function pad(n: number) {
	return String(n).padStart(2, '0');
}

function toIcsDateTime(dateStr: string, timeStr: string) {
	const [y, m, d] = dateStr.split('-').map(Number);
	const [h, min] = timeStr.split(':').map(Number);
	return `${y}${pad(m)}${pad(d)}T${pad(h)}${pad(min)}00`;
}

export const GET: RequestHandler = ({ url }) => {
	const eventKey = url.searchParams.get('event') ?? 'perempuan';
	const isLelaki = eventKey === 'lelaki';
	const ev = isLelaki ? wedding.events.lelaki : wedding.events.perempuan;

	const title = isLelaki
		? `${ev.typeShort} – ${wedding.groom.name} & ${wedding.bride.name}`
		: `${ev.typeShort} – ${wedding.bride.name} & ${wedding.groom.name}`;

	const uid = `${Date.now()}@syarah-munir-2026`;
	const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
	const dtStart = toIcsDateTime(ev.date, ev.time.jamuan.start);
	const dtEnd = toIcsDateTime(ev.date, ev.time.jamuan.end);

	const icsContent = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//SyarahMunir2026//Wedding//MS',
		'CALSCALE:GREGORIAN',
		'METHOD:PUBLISH',
		'BEGIN:VEVENT',
		`UID:${uid}`,
		`DTSTAMP:${dtStamp}`,
		`DTSTART:${dtStart}`,
		`DTEND:${dtEnd}`,
		`SUMMARY:${title}`,
		`DESCRIPTION:${ev.type}\\n${ev.venue}\\nJamuan: ${ev.time.jamuan.display}`,
		`LOCATION:${ev.address}`,
		'STATUS:CONFIRMED',
		'END:VEVENT',
		'END:VCALENDAR'
	].join('\r\n');

	return new Response(icsContent, {
		headers: {
			'Content-Type': 'text/calendar; charset=utf-8',
			'Content-Disposition': `attachment; filename="majlis-${eventKey}-syarah-munir.ics"`
		}
	});
};
