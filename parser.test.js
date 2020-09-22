const {
  matches,
  matchFirst,
  matchStar,
  boldParser,
  emphasisParser,
  textParser,
  sentenceParser,
  sentenceAndNewLinesParser,
  bodyParser,
} = require('./parser');
const { tokenize } = require('./tokenizer');

let tokens;

const dummyNode = { type: 'MATCH', consumed: 1 };
const noMatchParser = () => null;
const matchParser = () => dummyNode;

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
    it('returns the output of the first parser that returns something', () => {
      const tokens = tokenize('Hello, how are __you__?');
      const match = matchFirst([noMatchParser, matchParser], tokens);

      expect(match).toEqual(dummyNode);
    });

    it('returns a null node if none of the parsers match', () => {
      const match = matchFirst([noMatchParser], tokenize('*_'));

      expect(match).toBeNull();
    });
  });
});

describe('matchStar', () => {
  describe('when there are no matches', () => {
    it('returns an empty array', () => {
      const result = matchStar(noMatchParser, tokenize('Hello'));
      expect(result).toEqual([]);
    });
  });

  describe('when there is one match', () => {
    it('returns an array containing one node', () => {
      const result = matchStar(matchParser, tokenize('Hello'));
      expect(result).toEqual([dummyNode]);
    });
  });

  describe('when there are two consecutive matches', () => {
    it('returns an array containing two nodes', () => {
      const result = matchStar(matchParser, [1,2]);
      expect(result).toEqual([ dummyNode, dummyNode ]);
    });
  });
});

describe('bodyParser', () => {
  it('matches multiple paragraphs', () => {
    tokens = tokenize('Hello,\n\nHow are **you**?\n\n');
    const result = bodyParser(tokens);

    expect(result.type).toEqual('BODY');
  });

  it('matches a final sentence without newlines', () => {
    tokens = tokenize('Hello,\n\nHow are **you**?');
    const result = bodyParser(tokens);

    expect(result.type).toEqual('BODY');
  });

  it('sets the "consumed" count correctly', () => {
    tokens = tokenize('Hello,\n\nHow are **you**?\n\n');
    const result = bodyParser(tokens);

    expect(result.consumed).toEqual(12);
  });
});

describe('sentenceAndNewLinesParser', () => {
  it('matches a block of text, bold, or emphasis, followed by two newlines', () => {
    tokens = tokenize('Hello, this is **Markdown**\n\n')
    const result = sentenceAndNewLinesParser(tokens);

    expect(result.type).toEqual('PARAGRAPH');
  });

  it('sets the correct "consumed" value', () => {
    tokens = tokenize('Hello, this is **Markdown**\n\n')
    const result = sentenceAndNewLinesParser(tokens);

    expect(result.consumed).toEqual(1 + 5 + 2);
  });

  it('does not match text that is not followed by two newlines', () => {
    tokens = tokenize('Hello, this is **Markdown**\n')
    const result = sentenceAndNewLinesParser(tokens);

    expect(result).toBeNull();
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
      expect(textParser(tokens)).toBeNull();
    });
  });
});
