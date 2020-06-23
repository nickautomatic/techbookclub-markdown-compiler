const {
  matches,
  matchFirst,
  boldParser,
  emphasisParser,
  textParser,
  sentenceParser,
} = require('./parser');
const { tokenize } = require('./tokenizer');

let tokens;
let parsers;

describe('matches', () => {
  describe('matching a single token', () => {
    beforeEach(() => {
      tokens = [{ type: 'TEXT' }];
    });

    it('returns true when the token matches the pattern', () => {
      expect(matches('TEXT', tokens)).toBe(true);
    });

    it('returns false when the token does not match the pattern', () => {
      expect(matches('BOLD', tokens)).toBe(false);
    });

    it('returns false when the pattern is longer than the input', () => {
      expect(matches('TEXT TEXT', tokens)).toBe(false);
    });
  });

  describe('matching multiple tokens', () => {
    beforeEach(() => {
      tokens = [
        { type: 'UNDERSCORE' },
        { type: 'TEXT' },
        { type: 'UNDERSCORE' },
      ];
    });

    it('returns true when the tokens match the pattern', () => {
      expect(matches('UNDERSCORE TEXT UNDERSCORE', tokens)).toBe(true);
    });

    it('returns false when the tokens do not match the pattern', () => {
      expect(matches('UNDERSCORE TEXT STAR', tokens)).toBe(false);
    });
  });
});

describe('matchFirst', () => {
  describe('given several parsers', () => {
    beforeEach(() => {
      parsers = [emphasisParser, boldParser, textParser];
    });

    it('returns the output of the first parser that matches the input tokens', () => {
      const tokens = tokenize('Hello, how are __you__?');
      const node = matchFirst(parsers, tokens);

      expect(node).toEqual({
        type: 'TEXT',
        value: 'Hello, how are ',
        consumed: 1,
      });
    });

    it('returns a null node if none of the parsers match', () => {
      const node = matchFirst(parsers, tokenize('*_'));

      expect(node.type).toEqual('NULL');
    });
  });
});

describe('sentenceParser', () => {
  it('matches the first emphasis, bold, or text node', () => {
    tokens = tokenize('Hello, this is **Markdown**');

    expect(sentenceParser(tokens)).toEqual({
      type: 'TEXT',
      value: 'Hello, this is ',
      consumed: 1,
    })
  });
});

describe('boldParser', () => {
  it('matches text enclosed in double asterisks', () => {
    tokens = tokenize('**Hello**');

    expect(boldParser(tokens)).toEqual({
      type: 'BOLD',
      value: 'Hello',
      consumed: 5,
    })
  });

  it('matches text enclosed in double underscores', () => {
    tokens = tokenize('__Hello__');

    expect(boldParser(tokens)).toEqual({
      type: 'BOLD',
      value: 'Hello',
      consumed: 5,
    })
  });
});

describe('emphasisParser', () => {
  it('matches text enclosed in single asterisks', () => {
    tokens = tokenize('*Hello*');

    expect(emphasisParser(tokens)).toEqual({
      type: 'EMPHASIS',
      value: 'Hello',
      consumed: 3,
    })
  });

  it('matches text enclosed in single underscores', () => {
    tokens = tokenize('_Hello_');

    expect(emphasisParser(tokens)).toEqual({
      type: 'EMPHASIS',
      value: 'Hello',
      consumed: 3,
    })
  });
});

describe('textParser', () => {
  describe('when the first token is text', () => {
    beforeEach(() => {
      tokens = tokenize('This is a _nice_ bit of *Markdown*');
    });

    it('returns an appropriate TEXT node', () => {
      expect(textParser(tokens)).toEqual({
        type: 'TEXT',
        value: 'This is a ',
        consumed: 1,
      });
    });
  });

  describe('when the first token is not text', () => {
    beforeEach(() => {
      tokens = tokenize('*This* is a _nice_ bit of *Markdown*');
    });

    it('returns a null node', () => {
      expect(textParser(tokens)).toEqual({
        type: 'NULL',
        value: null,
        consumed: 0,
      });
    });
  });
});
