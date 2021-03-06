const token = (type, value) => Object.freeze({
  type,
  value,
  length: value ? value.length : undefined,
});

const isNull = (token) => !token.type || !token.value;
const toString = (token) => `<type: ${token.type}, value: ${token.value}>`;

const simpleScanner = (input) => {
  const TOKEN_TYPES = {
    '_': 'UNDERSCORE',
    '*': 'STAR',
    "\n": 'NEWLINE',
  };
  const value = input[0];

  return token(TOKEN_TYPES[value], value);
}

const textScanner = (input) => {
  let value = '';

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (!isNull(simpleScanner(char))) {
      break;
    }

    value += char;
  }

  return value.length ? token('TEXT', value) : token();
};

const getToken = (markdown) => {
  const tokenScanners = [
    simpleScanner,
    textScanner,
  ];

  for (const scanner of tokenScanners) {
    const nextToken = scanner(markdown);

    if (!isNull(nextToken)) {
      return nextToken;
    }
  }

  return token();
}

const tokenize = (markdown) => {
  const token = getToken(markdown);

  if (isNull(token)) { return; }

  const remaining = markdown.slice(token.length, markdown.length);

  if (remaining.length) {
    return [token, ...tokenize(remaining)];
  }

  return [token];
}

export {
  simpleScanner,
  textScanner,
  tokenize
};
