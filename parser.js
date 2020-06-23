const node = (type, value, consumed) => ({
  type,
  value,
  consumed,
});

const nullNode = () => node('NULL', null, 0);
const boldNode = (value) => node('BOLD', value, 5);
const emphasisNode = (value) => node('EMPHASIS', value, 3);
const textNode = (value) => node('TEXT', value, 1);

const isNull = (node) => node.type === 'NULL';

const matches = (pattern, tokens) => {
  const tokensToMatch = pattern.split(' ');

  if (tokensToMatch.length === 0 || tokens.length === 0) {
    return false;
  }

  if (tokensToMatch.length > tokens.length) {
    return false;
  }

  for (let i = 0; i < tokensToMatch.length; i++) {
    if (tokensToMatch[i] !== tokens[i].type) {
      return false;
    }
  }

  return true;
};

const matchFirst = (parsers, tokens) => {
  for (const parser of parsers) {
    const node = parser(tokens);

    if (!isNull(node)) {
      return node;
    }
  }

  return nullNode();
}

const matchStar = (parser, tokens) => {
  const node = parser(tokens);

  if (isNull(node)) { return []; }

  const remaining = tokens.slice(node.consumed, tokens.length);

  if (remaining.length) {
    return [node, ...matchStar(parser, remaining)];
  }

  return [node];
}

const boldParser = (tokens) => {
  const patterns = [
    'STAR STAR TEXT STAR STAR',
    'UNDERSCORE UNDERSCORE TEXT UNDERSCORE UNDERSCORE',
  ];

  if (patterns.some(pattern => matches(pattern, tokens))) {
    return boldNode(tokens[2].value);
  }

  return nullNode();
}

const emphasisParser = (tokens) => {
   const patterns = [
    'STAR TEXT STAR',
    'UNDERSCORE TEXT UNDERSCORE',
  ];

  if (patterns.some(pattern => matches(pattern, tokens))) {
    return emphasisNode(tokens[1].value);
  }

  return nullNode();
}

const textParser = (tokens) => {
  if (matches('TEXT', tokens)) {
    return textNode(tokens[0].value);
  }

  return nullNode();
}

const sentenceParser = (tokens) => {
  return matchFirst([emphasisParser, boldParser, textParser], tokens);
}

module.exports = {
  matches,
  matchFirst,
  matchStar,
  boldParser,
  emphasisParser,
  textParser,
  sentenceParser,
};
