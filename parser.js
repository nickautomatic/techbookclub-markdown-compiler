const node = (type, value, consumed) => ({
  type,
  value,
  consumed,
});

const nullNode = () => node('NULL', null, 0);
const textNode = (value) => node('TEXT', value, 1);

const textParser = (tokens) => {
  if (tokens.length && tokens[0].type === 'TEXT') {
    return textNode(tokens[0].value);
  }

  return nullNode();
}

module.exports = {
  textParser,
};
