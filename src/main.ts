import CwUtil from './ChatworkUtil';

function main(e: { namedValues: { [x: string]: string[] } }) {
  CwUtil.sendChatwork(e);
}
