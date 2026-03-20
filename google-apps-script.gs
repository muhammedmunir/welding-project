/**
 * Google Apps Script — Wedding Website Backend
 * Syarah × Munir 2026
 *
 * CARA DEPLOY SEMULA SELEPAS EDIT:
 * Deploy > Manage deployments > Edit (ikon pensel) > Version: New version > Deploy
 */

function doGet(e) {
  // ── Baca ucapan untuk paparan website ────────────────────────
  if (e.parameter.action === 'getUcapan') {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(e.parameter.jenis);
    if (!sheet) return ContentService.createTextOutput('[]').setMimeType(ContentService.MimeType.JSON);
    const data = sheet.getDataRange().getValues();
    const ucapan = data.slice(1)
      .filter(row => row[1] && row[2])
      .map(row => ({ nama: String(row[1]), msg: String(row[2]) }))
      .reverse();
    return ContentService
      .createTextOutput(JSON.stringify(ucapan))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ── Baca semua RSVP untuk admin panel ────────────────────────
  // Sheet: [Tarikh, Nama, Bilangan, Telefon, Catatan]
  if (e.parameter.action === 'getRsvp') {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const result = [];
    let id = 1;

    const sheets = [
      { name: 'RSVP Perempuan', event: 'perempuan' },
      { name: 'RSVP Lelaki',    event: 'lelaki'    }
    ];

    for (const s of sheets) {
      const sheet = ss.getSheetByName(s.name);
      if (!sheet || sheet.getLastRow() <= 1) continue;

      const rows = sheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row[1]) continue;

        result.push({
          id:        id++,
          timestamp: row[0] ? Utilities.formatDate(new Date(row[0]), 'Asia/Kuala_Lumpur', 'yyyy-MM-dd HH:mm') : '',
          name:      String(row[1] || ''),
          guests:    parseInt(row[2]) || 1,
          event:     s.event,
          phone:     String(row[3] || ''),
          dietary:   String(row[4] || 'Tiada'),
          confirmed: false
        });
      }
    }

    result.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ── Baca senarai jemputan yang dijana ─────────────────────────
  // Sheet Jemputan: [Tarikh Jana, Nama, Majlis]
  if (e.parameter.action === 'getJemputan') {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Jemputan');
    if (!sheet || sheet.getLastRow() <= 1) {
      return ContentService.createTextOutput('[]').setMimeType(ContentService.MimeType.JSON);
    }

    const rows = sheet.getDataRange().getValues();
    const result = rows.slice(1)
      .filter(row => row[1]) // skip baris kosong
      .map((row, i) => ({
        rowIndex: i + 2,     // baris sebenar dalam sheet (untuk padam nanti)
        timestamp: row[0] ? Utilities.formatDate(new Date(row[0]), 'Asia/Kuala_Lumpur', 'yyyy-MM-dd HH:mm') : '',
        name:  String(row[1] || ''),
        event: String(row[2] || 'both')
      }));

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ── Padam satu jemputan (kosongkan baris) ─────────────────────
  if (e.parameter.action === 'deleteJemputan') {
    const rowIndex = parseInt(e.parameter.row || '0');
    if (!rowIndex || rowIndex < 2) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false })).setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Jemputan');
    if (sheet) {
      sheet.deleteRow(rowIndex);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ── Simpan borang RSVP / Ucapan / Jemputan ───────────────────
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const jenis = e.parameter.jenis || '';

  // Simpan jemputan baru
  if (jenis === 'Jemputan') {
    let sheet = ss.getSheetByName('Jemputan');
    if (!sheet) {
      sheet = ss.insertSheet('Jemputan');
      const h = sheet.getRange(1, 1, 1, 3);
      h.setValues([['Tarikh Jana', 'Nama', 'Majlis']]);
      h.setFontWeight('bold');
      h.setBackground('#2d6a4f');
      h.setFontColor('#ffffff');
      sheet.setFrozenRows(1);
      sheet.setColumnWidth(1, 160);
      sheet.setColumnWidth(2, 200);
      sheet.setColumnWidth(3, 150);
    }
    sheet.appendRow([new Date(), e.parameter.nama || '', e.parameter.majlis || '']);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = ss.getSheetByName(jenis);
  if (!sheet) return ContentService.createTextOutput(JSON.stringify({ status: 'error', msg: 'Sheet tidak dijumpai' })).setMimeType(ContentService.MimeType.JSON);

  if (jenis.startsWith('Ucapan')) {
    sheet.appendRow([new Date(), e.parameter.nama || '', e.parameter.mesej || '']);
  } else {
    sheet.appendRow([new Date(), e.parameter.nama || '', e.parameter.bil || '', e.parameter.telefon || '', e.parameter.mesej || '']);
  }
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configs = {
    'RSVP Perempuan':  { headers: ['Tarikh', 'Nama', 'Bilangan', 'Telefon', 'Catatan'], cols: 5 },
    'Ucapan Perempuan':{ headers: ['Tarikh', 'Nama', 'Ucapan'], cols: 3 },
    'RSVP Lelaki':     { headers: ['Tarikh', 'Nama', 'Bilangan', 'Telefon', 'Catatan'], cols: 5 },
    'Ucapan Lelaki':   { headers: ['Tarikh', 'Nama', 'Ucapan'], cols: 3 },
    'Jemputan':        { headers: ['Tarikh Jana', 'Nama', 'Majlis'], cols: 3 },
  };
  for (const [name, cfg] of Object.entries(configs)) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    sheet.clearFormats(); sheet.clearContents();
    const h = sheet.getRange(1, 1, 1, cfg.cols);
    h.setValues([cfg.headers]);
    h.setFontWeight('bold');
    h.setBackground(name === 'Jemputan' ? '#2d6a4f' : '#4a4a8a');
    h.setFontColor('#ffffff');
    h.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160); sheet.setColumnWidth(2, 200);
    if (cfg.cols >= 3) sheet.setColumnWidth(3, name === 'Ucapan Perempuan' || name === 'Ucapan Lelaki' ? 350 : 150);
    if (cfg.cols === 5) { sheet.setColumnWidth(4, 130); sheet.setColumnWidth(5, 280); }
    sheet.getRange(2, 1, 100, cfg.cols).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
  }
}
