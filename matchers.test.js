import { matches, matchFirst, matchStar } from './matchers';
import { tokenize } from './tokenizer';

const dummyNode = { type: 'MATCH', consumed: 1 };
const noMatchParser = () => null;
const matchParser = () => dummyNode;

let tokens;

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
      const result = matchStar(matchParser, [1, 2]);
      expect(result).toEqual([dummyNode, dummyNode]);
    });
  });
});
