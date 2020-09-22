const { matches, matchFirst, matchStar } = require('./matchers');

const node = (type, value, consumed) => ({
  type,
  value,
  consumed,
});

const boldNode = (value) => node('BOLD', value, 5);
const emphasisNode = (value) => node('EMPHASIS', value, 3);
const textNode = (value) => node('TEXT', value, 1);
const paragraphNode = (value, consumed) => node('PARAGRAPH', value, consumed);
const bodyNode = (value, consumed) => node('BODY', value, consumed);

const countConsumed = (nodes) => nodes.reduce((n, node) => n + node.consumed, 0);

const boldParser = (tokens) => {
  const patterns = [
    'STAR STAR TEXT STAR STAR',
    'UNDERSCORE UNDERSCORE TEXT UNDERSCORE UNDERSCORE',
  ];

  if (patterns.some(pattern => matches(pattern, tokens))) {
    return boldNode(tokens[2].value);
  }

  return null;
}

const emphasisParser = (tokens) => {
   const patterns = [
    'STAR TEXT STAR',
    'UNDERSCORE TEXT UNDERSCORE',
  ];

  if (patterns.some(pattern => matches(pattern, tokens))) {
    return emphasisNode(tokens[1].value);
  }

  return null;
}

const textParser = (tokens) => {
  if (matches('TEXT', tokens)) {
    return textNode(tokens[0].value);
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
    return paragraphNode(nodes, consumed + 2);
  }

  return null;
}

const paragraphParser = (tokens) => {
  return matchFirst([sentenceAndNewLinesParser, sentenceParser], tokens);
}

const bodyParser = (tokens) => {
  const nodes = matchStar(paragraphParser, tokens);

  if (nodes.length > 0) {
    return bodyNode(nodes, countConsumed(nodes));
  }

  return null;
}

module.exports = {
  boldParser,
  emphasisParser,
  textParser,
  sentenceParser,
  sentenceAndNewLinesParser,
  bodyParser,
  paragraphParser,
};
