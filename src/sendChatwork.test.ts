import { sendChatwork, setupSendMessage, sendMessage } from './sendChatwork';

// UrlFetchAppのMock化
const mockFetch = jest.fn();
UrlFetchApp.fetch = mockFetch;

describe(sendChatwork, () => {
  it('sendChatwork 要素あり', () => {
    const result = sendChatwork({
      namedValues: {
        お問い合わせ種類: ['ログインについて'],
        問い合わせ内容: ['2210'],
      },
    });

    expect(result).toBe('');
  });

  it('sendChatwork GoogleFormから異常データインプット 要素あり 空文字', () => {
    const result = sendChatwork({
      namedValues: { お問い合わせ種類: [''], 問い合わせ内容: [''] },
    });

    expect(result).toBe('');
  });

  it('sendChatwork GoogleFormから異常データインプット 要素 お問い合わせ種類のみ', () => {
    const result = sendChatwork({
      namedValues: { お問い合わせ種類: ['ログインについて'] },
    });

    expect(result).toBe('');
  });

  it('sendChatwork GoogleFormから異常データインプット 要素 問い合わせ内容のみ', () => {
    const result = sendChatwork({
      namedValues: { 問い合わせ内容: ['問い合わせ内容本文'] },
    });

    expect(result).toBe('');
  });
});

describe(setupSendMessage, () => {
  it('setupSendMessage ログインについてパターン', () => {
    const result = setupSendMessage({
      kind: 'ログインについて',
      text: '問い合わせ内容本文',
    });

    expect(result).toBe(
      '[info][title]お問い合わせ[/title]お問い合わせ種類: ログインについて\n問い合わせ内容: 問い合わせ内容本文\n[/info]'
    );
  });

  it('setupSendMessage 料金プランについてパターン', () => {
    const result = setupSendMessage({
      kind: '料金プランについて',
      text: '問い合わせ内容本文',
    });

    expect(result).toBe(
      '[info][title]お問い合わせ[/title]お問い合わせ種類: 料金プランについて\n問い合わせ内容: 問い合わせ内容本文\n[/info]'
    );
  });

  it('setupSendMessage その他のお問い合わせパターン', () => {
    const result = setupSendMessage({
      kind: 'その他のお問い合わせ',
      text: '問い合わせ内容本文',
    });

    expect(result).toBe(
      '[info][title]お問い合わせ[/title]お問い合わせ種類: その他のお問い合わせ\n問い合わせ内容: 問い合わせ内容本文\n[/info]'
    );
  });

  it('setupSendMessage GoogleFormから異常データインプット お問い合わせ種類 該当なしパターン', () => {
    const result = setupSendMessage({
      kind: '該当なし',
      text: '問い合わせ内容本文',
    });

    expect(result).toBe('');
  });

  it('setupSendMessage GoogleFormから異常データインプット パラメータが空文字パターン', () => {
    const result = setupSendMessage({ kind: '', text: '' });

    expect(result).toBe('');
  });
});

describe(sendMessage, () => {
  it('sendMessagge ', () => {
    const res = sendMessage('あいうえお');

    expect(res).toBe('');
  });
});
