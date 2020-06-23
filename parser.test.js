const {
  textParser,
} = require('./parser');
const { tokenize } = require('./tokenizer');

let tokens;

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
