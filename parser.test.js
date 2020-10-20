import {
  boldParser,
  emphasisParser,
  textParser,
  sentenceParser,
  sentenceAndNewLinesParser,
  bodyParser,
} from './parser.js';
import { tokenize } from './tokenizer.js';

let tokens;

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
