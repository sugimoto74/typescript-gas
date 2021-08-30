// Chatwork API Token
const token = "";

// 情報を通知するチャットのルームID
const roomid = "";
const url: string = "https://api.chatwork.com/v2/rooms/" + roomid + "/messages";
const headers: any = { "X-ChatWorkToken": token };

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
 * 送信情報
 * message : 送信データ
 */
export interface SendInfo {
  message: string;
}

/**
 * メイン処理
 *
 * Googleフォームからデータを受信してChatworkの特定のルームにメッセージを送信する
 *
 * @param e Googleフォームから受け取った内容
 */
export function sendChatwork(e : any): string {
  let input : GoogleFormInfo = {kind: e.namedValues['お問い合わせ種類'].toString(), text: e.namedValues['問い合わせ内容'].toString()};
  const message = setupSendMessage({
    kind: input.kind,
    text: input.text,
  });

  // Chatworkへ送信
  return sendMessage({ message: message });
}

/**
 * Chatworkへ送信するメッセージを生成する
 *
 * @param params Googleフォームから受け取った内容
 * @return string 送信するメッセージ内容
 */
export function setupSendMessage(params: GoogleFormInfo): string {
  console.log(params);
  const kind: string = params.kind;
  let message = "";

  switch (kind) {
    case "ログインについて":
    case "料金プランについて":
    case "その他のお問い合わせ":
      break;
    default:
      return message;
  }
  message += "[info][title]お問い合わせ[/title]";
  message += "お問い合わせ種類: " + kind + "\n";
  message += "問い合わせ内容: " + params.text + "\n";
  message += "[/info]";

  return message;
}

/**
 * ChatworkClientライブラリを使用してメッセージをChatworkへ送信する
 *
 * @param params 送信データ内容
 * @return JSON 成功 messagge_id値
 *  {
 *    "message_id": "1234"
 *  }
 * @return 失敗 Token 不正時
 *  {
 *    "errors":["Invalid API Token"]
 *  }
 * @return 失敗 RoomId 空文字時
 *  {
 *    "errors":["Invalid Endpoint or HTTP method"]
 *  }
 *
 */
export function sendMessage(params: SendInfo): string {
  let res = "";
  let result;
  try {
    const post_data = {
      body: params.message,
    };
    const options: any = {
      method: "post",
      headers: headers,
      payload: post_data || {},
    };
    result = UrlFetchApp.fetch(url, options);

    // リクエストに成功していたら結果を解析して返す
    if (result.getResponseCode() == 200) {
      res = JSON.parse(result.getContentText());
      console.log("result: " + res);
    }
  } catch (error) {
    console.log("error : " + error);
    res = <string>error;
  }
  return res;
}
