const node = (type, value, consumed) => ({
  type,
  value,
  consumed,
});

const nullNode = () => node('NULL', null, 0);
const textNode = (value) => node('TEXT', value, 1);

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

const textParser = (tokens) => {
  if (matches('TEXT', tokens)) {
    return textNode(tokens[0].value);
  }

  return nullNode();
}

module.exports = {
  matches,
  textParser,
};