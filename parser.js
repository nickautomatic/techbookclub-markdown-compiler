import { matches, matchFirst, matchStar } from './matchers.js';

const node = (type, value, consumed) => ({
  type,
  value,
  consumed,
});

const countConsumed = (nodes) => nodes.reduce((n, node) => n + node.consumed, 0);

const boldParser = (tokens) => {
  const patterns = [
    'STAR STAR TEXT STAR STAR',
    'UNDERSCORE UNDERSCORE TEXT UNDERSCORE UNDERSCORE',
  ];

  if (patterns.some(pattern => matches(pattern, tokens))) {
    return node('BOLD', tokens[2].value, 5);
  }

  return null;
}

const emphasisParser = (tokens) => {
   const patterns = [
    'STAR TEXT STAR',
    'UNDERSCORE TEXT UNDERSCORE',
  ];

  if (patterns.some(pattern => matches(pattern, tokens))) {
    return node('EMPHASIS', tokens[1].value, 3);
  }

  return null;
}

const textParser = (tokens) => {
  if (matches('TEXT', tokens)) {
    return node('TEXT', tokens[0].value, 1);
  }

  return null;
}

const sentenceParser = (tokens) => {
  return matchFirst([emphasisParser, boldParser, textParser], tokens);
}

const sentenceAndNewLinesParser = (tokens) => {
  const nodes = matchStar(sentenceParser, tokens);

  if (nodes.length === 0) {
    return null;
  }

  const consumed = countConsumed(nodes);

  if (matches('NEWLINE NEWLINE', tokens.slice(consumed))) {
    return node('PARAGRAPH', nodes, consumed + 2);
  }

  return null;
}

const paragraphParser = (tokens) => {
  return matchFirst([sentenceAndNewLinesParser, sentenceParser], tokens);
}

const bodyParser = (tokens) => {
  const nodes = matchStar(paragraphParser, tokens);

  if (nodes.length > 0) {
    return node('BODY', nodes, countConsumed(nodes));
  }

  return null;
}

const parse = (tokens) => bodyParser(tokens);

export {
  boldParser,
  emphasisParser,
  textParser,
  sentenceParser,
  sentenceAndNewLinesParser,
  bodyParser,
  paragraphParser,
  parse,
};
