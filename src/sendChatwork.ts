// Chatwork API Token
const token = '';

// 情報を通知するチャットのルームID
const roomid = '';

/**
 * Googleフォームから受信するデータ
 * kind : お問い合わせ種類
 * text : 問い合わせ内容
 */
export interface GoogleFormInfo {
  kind: string;
  text: string;
}

/**
 * メイン処理
 *
 * Googleフォームからデータを受信してChatworkの特定のルームにメッセージを送信する
 *
 * @param e Googleフォームから受け取った内容
 */
export function sendChatwork(e: {
  namedValues: { [x: string]: string[] };
}): string {
  // 一次元配列でのインプットとなるので先頭要素を固定で取得する
  // 複数回答のインプットパターンは現状は考慮外とする
  const message: string = setupSendMessage({
    kind: e.namedValues['お問い合わせ種類'][0],
    text: e.namedValues['問い合わせ内容'][0],
  });

  // Chatworkへ送信
  return sendMessage(message);
}

/**
 * Chatworkへ送信するメッセージを生成する
 *
 * @param params Googleフォームから受け取った内容
 * @return string 成功時 送信するメッセージ内容
 * @return string 失敗時 空文字列
 */
export function setupSendMessage(params: GoogleFormInfo): string {
  let message = '';

  switch (params.kind) {
    case 'ログインについて':
    case '料金プランについて':
    case 'その他のお問い合わせ':
      message += '[info][title]お問い合わせ[/title]';
      message += 'お問い合わせ種類: ' + params.kind + '\n';
      message += '問い合わせ内容: ' + params.text + '\n';
      message += '[/info]';
      break;
    default:
      console.log('invalid param kind : ' + params.kind);
      break;
  }

  return message;
}

/**
 * ChatworkClientライブラリを使用してメッセージをChatworkへ送信する
 *
 * @param message 送信データ内容
 * @return JSON文字列 成功 messagge_id値
 *  { "message_id": "1234" }
 * @return JSON文字列 失敗 Token 不正時
 *  { "errors":["Invalid API Token"] }
 * @return JSON文字列 失敗 RoomId 空文字時
 *  { "errors":["Invalid Endpoint or HTTP method"] }
 *
 */
export function sendMessage(message: string): string {
  let res = '';
  let result: GoogleAppsScript.URL_Fetch.HTTPResponse;
  try {
    // メソッドの汎用性は一旦無視してAPI要求用の情報をまとめて定義
    const url: string =
      'https://api.chatwork.com/v2/rooms/' + roomid + '/messages';
    const headers: GoogleAppsScript.URL_Fetch.HttpHeaders = {
      'X-ChatWorkToken': token,
    };
    const post_data: GoogleAppsScript.URL_Fetch.Payload = {
      body: message,
    };
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'post',
      headers: headers,
      payload: post_data || {},
    };
    result = UrlFetchApp.fetch(url, options);

    // リクエストに成功していたら結果を解析して返す
    if (result.getResponseCode() == 200) {
      res = result.getContentText();
      console.log('result: ' + res);
    }
  } catch (error) {
    console.log('error : ' + error);
    res = <string>error;
  }
  return res;
}
