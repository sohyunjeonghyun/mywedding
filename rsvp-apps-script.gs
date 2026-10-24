/**
 * 참석여부를 구글 시트에 자동 저장하는 Apps Script
 *
 * [설정 방법]
 * 1. 구글 시트를 새로 만든다. (시트 이름은 자유)
 * 2. 메뉴 [확장 프로그램] > [Apps Script] 를 연다.
 * 3. 기존 코드를 지우고 이 파일 내용을 붙여넣은 뒤 저장한다.
 * 4. 오른쪽 위 [배포] > [새 배포] > 유형: [웹 앱]
 *      - 다음 사용자로 실행: 나
 *      - 액세스 권한: 모든 사용자
 *    를 선택하고 배포한다. (처음에는 권한 승인 필요)
 * 5. 나온 "웹 앱 URL"을 config.js 의 rsvp.endpoint 에 붙여넣는다.
 *
 * ※ 코드를 수정한 뒤에는 [배포] > [배포 관리] 에서 새 버전으로 다시 배포해야 반영됩니다.
 */

const HEADERS = ['제출시각', '구분', '이름', '참석여부', '인원', '식사', '전달사항'];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    }

    sheet.appendRow([
      data.submittedAt || new Date(),
      data.side || '',
      data.name || '',
      data.attend || '',
      data.count || '',
      data.meal || '',
      data.memo || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
