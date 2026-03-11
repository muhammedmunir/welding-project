export const wedding = {
	bride: {
		name: 'Zulfatul Syarah',
		nameDisplay: 'ZULFATUL SYARAH',
		father: 'Zulhamlly bin Hussin',
		mother: 'Suzana binti Yahaya @ Roni',
		parentsDisplay: 'ZULHAMLLY BIN HUSSIN & SUZANA BINTI YAHAYA @ RONI'
	},
	groom: {
		name: 'Muhammed Munir',
		nameDisplay: 'MUHAMMED MUNIR',
		father: 'Mohd Azmi bin Husain',
		mother: 'Wan Rosnani binti Wan Ismail',
		parentsDisplay: 'MOHD AZMI BIN HUSAIN & WAN ROSNANI BINTI WAN ISMAIL'
	},
	events: {
		perempuan: {
			type: 'Majlis Walimatul Urus',
			typeShort: 'Majlis Perkahwinan',
			date: '2026-05-29',
			dateDisplay: '29 Mei 2026',
			dayDisplay: 'Jumaat',
			hijriDisplay: '12 Zulhijjah 1447H',
			venue: 'Dewan Jubli Perak KB',
			venueShort: 'Dewan Jubli Perak',
			address: 'Dewan Jubli Perak, Kota Bharu, Kelantan',
			time: {
				jamuan: { start: '12:00', end: '17:00', display: '12.00ptg - 5.00ptg' },
				ketibaan: { time: '14:30', display: '2.30ptg' }
			},
			contacts: [
				{ name: 'Joe', phone: '013-923 9938' },
				{ name: 'Suzana', phone: '013-950 2888' },
				{ name: 'Zainal', phone: '019-961 5346' },
				{ name: 'Jue', phone: '019-500 6714' }
			],
			googleMapsUrl: 'https://maps.google.com/?q=Dewan+Jubli+Perak+Kota+Bharu+Kelantan',
			wazeUrl: 'https://waze.com/ul?q=Dewan+Jubli+Perak+Kota+Bharu'
		},
		lelaki: {
			type: 'Majlis Bertandang',
			typeShort: 'Majlis Bertandang',
			date: '2026-05-31',
			dateDisplay: '31 Mei 2026',
			dayDisplay: 'Ahad',
			hijriDisplay: '14 Zulhijjah 1447H',
			venue: 'Rumah Pengantin Lelaki',
			venueShort: 'Chekok',
			address: 'Chekok, Kelantan',
			time: {
				jamuan: { start: '11:00', end: '17:00', display: '11.00pg - 5.00ptg' },
				ketibaan: { time: '12:00', display: '12.00tgh' }
			},
			contacts: [
				{ name: 'Azmi', phone: '019-734 0939' },
				{ name: 'Rosnani', phone: '011-3527 7001' },
				{ name: 'Hanif', phone: '011-2550 2212' }
			],
			googleMapsUrl: 'https://maps.google.com/?q=Chekok+Kelantan',
			wazeUrl: 'https://waze.com/ul?q=Chekok+Kelantan'
		}
	},
	hashtag: '#SyarahXMunir2026',
	slug: 'syarah-munir-2026'
} as const;

export type WeddingEvent = typeof wedding.events.perempuan | typeof wedding.events.lelaki;
