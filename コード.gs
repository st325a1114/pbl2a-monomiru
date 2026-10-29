// 1. システムの画面（index.html）をブラウザに表示するための関数
function doGet(e) {
  const html = HtmlService.createTemplateFromFile('index').evaluate();
  html.setTitle('校内備品貸出管理システム'); // ブラウザのタブ名
  html.addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
  return html;
}

// 2. スプレッドシートのデータを取得する関数（HTML側から呼ばれる）
function getFormData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return []; // データがない場合
  
  const rows = data.slice(1);
  
  const result = rows.map((row, index) => {
    let dueDate = "";
    if (row[6]) {
      const d = new Date(row[6]);
      dueDate = d.getFullYear() + "-" + 
                String(d.getMonth() + 1).padStart(2, '0') + "-" + 
                String(d.getDate()).padStart(2, '0');
    }
    
    let timestamp = "";
    if (row[0]) {
      const t = new Date(row[0]);
      timestamp = t.toLocaleString('ja-JP').replace(/\//g, '-');
    }

    return {
      id: 'REQ-F' + (index + 1),
      timestamp: timestamp,
      userId: row[1],
      userName: row[2],
      itemName: row[3],
      purpose: row[4],
      location: row[5],
      dueDate: dueDate,
      email: row[7],
      status: 'PENDING'
    };
  });
  
  return result; // JSON文字列にせず、直接配列を返します
}
