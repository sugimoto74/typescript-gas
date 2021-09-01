import CwUtil from './ChatworkUtil';

// UrlFetchAppのMock化
UrlFetchApp.fetch = jest.fn().mockImplementation(() => {
  return {
    getResponseCode: jest.fn().mockReturnValue('200'),
    getContentText: jest
      .fn()
      .mockReturnValue({ message_id: '1484917167420887040' }),
  };
});

describe(CwUtil.sendChatwork, () => {
  it('sendChatwork 要素あり', () => {
    const result = CwUtil.sendChatwork({
      namedValues: {
        お問い合わせ種類: ['ログインについて'],
        問い合わせ内容: ['2210'],
      },
    });

    expect(result).toStrictEqual({ message_id: '1484917167420887040' });
  });

  it('sendChatwork GoogleFormから異常データインプット 要素あり 空文字', () => {
    const result = CwUtil.sendChatwork({
      namedValues: { お問い合わせ種類: [''], 問い合わせ内容: [''] },
    });

    expect(result).toBe('');
  });

  it('sendChatwork GoogleFormから異常データインプット 要素 お問い合わせ種類のみ', () => {
    const result = CwUtil.sendChatwork({
      namedValues: { お問い合わせ種類: ['ログインについて'] },
    });

    expect(result).toBe('');
  });

  it('sendChatwork GoogleFormから異常データインプット 要素 問い合わせ内容のみ', () => {
    const result = CwUtil.sendChatwork({
      namedValues: { 問い合わせ内容: ['問い合わせ内容本文'] },
    });

    expect(result).toBe('');
  });
});

describe(CwUtil.setupSendMessage, () => {
  it('setupSendMessage ログインについてパターン', () => {
    const result = CwUtil.setupSendMessage({
      kind: 'ログインについて',
      text: '問い合わせ内容本文',
    });

    expect(result).toBe(
      '[info][title]お問い合わせ[/title]お問い合わせ種類: ログインについて\n問い合わせ内容: 問い合わせ内容本文\n[/info]'
    );
  });

  it('setupSendMessage 料金プランについてパターン', () => {
    const result = CwUtil.setupSendMessage({
      kind: '料金プランについて',
      text: '問い合わせ内容本文',
    });

    expect(result).toBe(
      '[info][title]お問い合わせ[/title]お問い合わせ種類: 料金プランについて\n問い合わせ内容: 問い合わせ内容本文\n[/info]'
    );
  });

  it('setupSendMessage その他のお問い合わせパターン', () => {
    const result = CwUtil.setupSendMessage({
      kind: 'その他のお問い合わせ',
      text: '問い合わせ内容本文',
    });

    expect(result).toBe(
      '[info][title]お問い合わせ[/title]お問い合わせ種類: その他のお問い合わせ\n問い合わせ内容: 問い合わせ内容本文\n[/info]'
    );
  });

  it('setupSendMessage GoogleFormから異常データインプット お問い合わせ種類 該当なしパターン', () => {
    const result = CwUtil.setupSendMessage({
      kind: '該当なし',
      text: '問い合わせ内容本文',
    });

    expect(result).toBe('');
  });

  it('setupSendMessage GoogleFormから異常データインプット パラメータが空文字パターン', () => {
    const result = CwUtil.setupSendMessage({ kind: '', text: '' });

    expect(result).toBe('');
  });
});

describe(CwUtil.sendMessage, () => {
  it('sendMessagge ', () => {
    const res = CwUtil.sendMessage('あいうえお');

    expect(res).toStrictEqual({ message_id: '1484917167420887040' });
  });
});
