const {
  simpleScanner,
  textScanner,
  tokenize
} = require('./tokenizer');

describe('simpleScanner', () => {
  it('matches an initial underscore character', () => {
    const token = simpleScanner('_hello');
    expect(token.type).toEqual('UNDERSCORE');
  });

  it('matches an initial asterisk character', () => {
    const token = simpleScanner('*hello');
    expect(token.type).toEqual('STAR');
  });
});

describe('textScanner', () => {
  const token = textScanner('this is a *test*');

  it('matches a block of text', () => {
    expect(token.value).toEqual('this is a ');
  });

  it('sets a token type of TEXT', () => {
    expect(token.type).toEqual('TEXT');
  })
});

describe('tokenize', () => {
  it('tokenizes Markdown', () => {
    expect(tokenize('This is a _nice_ bit of *Markdown*'))
      .toEqual([
        expect.objectContaining({ type: 'TEXT', value: 'This is a ' }),
        expect.objectContaining({ type: 'UNDERSCORE', value: '_' }),
        expect.objectContaining({ type: 'TEXT', value: 'nice' }),
        expect.objectContaining({ type: 'UNDERSCORE', value: '_' }),
        expect.objectContaining({ type: 'TEXT', value: ' bit of ' }),
        expect.objectContaining({ type: 'STAR', value: '*' }),
        expect.objectContaining({ type: 'TEXT', value: 'Markdown' }),
        expect.objectContaining({ type: 'STAR', value: '*' }),
      ]);
  });
});
