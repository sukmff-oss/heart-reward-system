// ==========================================
// 愛心魔法盒 雲端同步 Apps Script
// ==========================================
var SPREADSHEET_ID = '1nIPtLGx4u7LgoGka3lBrGJcXyYg7U_qXpujeNtO_VG8';

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  var type = e.parameter.type ? e.parameter.type : 'heart';

  var ss, sheet;
  try {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    sheet = ss.getSheetByName(type) ? ss.getSheetByName(type) : ss.insertSheet(type);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: '請確認試算表 ID 是否正確'}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (e.parameter.action === 'read') {
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return ContentService
        .createTextOutput(JSON.stringify({status: 'ok', data: null}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var rowData = sheet.getRange(lastRow, 1, 1, 3).getValues()[0];
    var stored = rowData[2] ? JSON.parse(rowData[2]) : null;
    return ContentService
      .createTextOutput(JSON.stringify({status: 'ok', data: stored, ts: rowData[1]}))
      .setMimeType(ContentService.MimeType.JSON);
  } else if (e.parameter.action === 'write') {
    var data = e.parameter.data ? JSON.parse(e.parameter.data) : {};
    var now = new Date().toISOString();
    var rowNum = sheet.getLastRow() + 1;
    sheet.getRange(rowNum, 1, 1, 3).setValues([[type, now, JSON.stringify(data)]]);
    return ContentService
      .createTextOutput(JSON.stringify({status: 'ok', ts: now}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({status: 'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}