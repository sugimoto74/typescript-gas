// Chatwork API Token
const token:string = "aaaaaaa";
// 情報を通知するチャットのルームID
const roomid:string = "aaaaaaa";

/**
 * メイン処理
 *
 * Googleフォームからデータを受信してChatworkの特定のルームにメッセージを送信する
 * ※Google appGoogle app
 *
 * @param e Googleフォームから受け取った内容
 */
function sendChatwork(e: { namedValues: { [x: string]: string } }) {
  const message = setupSendMessage(e);
  console.log(message);

  // Chatworkへ送信
  sendMessagge(message);
}

/**
 * Chatworkへ送信するメッセージを生成する
 * @param e Googleフォームから受け取った内容
 * @return string 送信するメッセージ内容
 */
function setupSendMessage(e: { namedValues: { [x: string]: string } }): string {
  const kind: string = e.namedValues["お問い合わせ種類"];
  const text: string = e.namedValues["問い合わせ内容"];
  const error: string = e.namedValues["お問い合わせ内容"];

  let message = "";
  message += "[info][title]お問い合わせ[/title]";
  message += "お問い合わせ種類: " + kind + "\n";
  message += "問い合わせ内容: " + text + "\n";
  message += "[/info]";

  console.log(error);

  return message;
}

/**
 * ChatworkClientライブラリを使用してメッセージをChatworkへ送信する
 * @param message 送信するメッセージ本文
 */
function sendMessagge(message: string) {
  const client = ChatWorkClient.factory({ token: token });
  client.sendMessage({ room_id: roomid, body: message });
}
