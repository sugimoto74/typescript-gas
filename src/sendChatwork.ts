// Chatwork API Token
const token = "";

// 情報を通知するチャットのルームID
const roomid = "";

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
 * token : Chatwork API Token
 * roomid : 情報を通知するチャットのルームID
 * message : 送信データ
 */
export interface SendInfo {
  token: string;
  roomid: string;
  message: string;
}

/**
 * メイン処理
 *
 * Googleフォームからデータを受信してChatworkの特定のルームにメッセージを送信する
 *
 * メッセージ送信は Chatwork Client for Google Apps Script を使用
 * [https://github.com/cw-shibuya/chatwork-client-gas]
 *
 * @param e Googleフォームから受け取った内容
 */
export function sendChatwork(e: {
  namedValues: { [x: string]: string };
}): string {
  const message = setupSendMessage({
    kind: e.namedValues["お問い合わせ種類"],
    text: e.namedValues["問い合わせ内容"],
  });
  //console.log(message);

  // Chatworkへ送信
  return sendMessage({ token: token, roomid: roomid, message: message });
}

/**
 * Chatworkへ送信するメッセージを生成する
 *
 * @param params Googleフォームから受け取った内容
 * @return string 送信するメッセージ内容
 */
export function setupSendMessage(params: GoogleFormInfo): string {
  let kind = params.kind;
  switch (kind) {
    case "ログインについて":
    case "料金プランについて":
    case "その他のお問い合わせ":
      break;
    default:
      kind = "該当なし";
  }

  let message = "";
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
 *  https://developer.chatwork.com/ja/endpoint_rooms.html#POST-rooms-room_id-messages
 */
export function sendMessage(params: SendInfo): string {
  let res = "";
  try {
    const cwclient = ChatWorkClient.factory({ token: params.token });
    console.log(cwclient);
    res = cwclient.sendMessage({
      room_id: params.roomid,
      body: params.message,
    });
    console.log(res);
  } catch (error) {
    console.log(error);
    res = error;
  }
  return res;
}
