/**
 * Generate an .ics calendar file and trigger download
 */
export interface IcsEvent {
	title: string;
	description: string;
	location: string;
	startDate: string; // 'YYYY-MM-DD'
	startTime: string; // 'HH:MM' (24h)
	endTime: string;   // 'HH:MM' (24h)
}

function pad(n: number): string {
	return String(n).padStart(2, '0');
}

function toIcsDateTime(dateStr: string, timeStr: string): string {
	const [year, month, day] = dateStr.split('-').map(Number);
	const [hour, minute] = timeStr.split(':').map(Number);
	return `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(minute)}00`;
}

export function generateIcs(event: IcsEvent): void {
	const uid = `${Date.now()}@syarah-munir-2026`;
	const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
	const dtStart = toIcsDateTime(event.startDate, event.startTime);
	const dtEnd = toIcsDateTime(event.startDate, event.endTime);

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
		`SUMMARY:${event.title}`,
		`DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
		`LOCATION:${event.location}`,
		'STATUS:CONFIRMED',
		'END:VEVENT',
		'END:VCALENDAR'
	].join('\r\n');

	const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
	const url = URL.createObjectURL(blob);

	// iOS Safari: open in new tab so calendar app handles it
	const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
	if (isIOS) {
		window.open(url, '_blank');
		setTimeout(() => URL.revokeObjectURL(url), 3000);
		return;
	}

	const a = document.createElement('a');
	a.href = url;
	a.download = 'majlis-perkahwinan-syarah-munir.ics';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}
