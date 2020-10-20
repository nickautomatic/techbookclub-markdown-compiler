const matches = (pattern, tokens = []) => {
  return pattern === tokens.map(token => token.type)
    .join(' ')
    .slice(0, pattern.length);
};

const matchFirst = (parsers, tokens) => {
  for (const parser of parsers) {
    const node = parser(tokens);

    if (node) { return node; }
  }

  return null;
}

const matchStar = (parser, tokens) => {
  const node = parser(tokens);

  if (!node) { return []; }

  const remaining = tokens.slice(node.consumed, tokens.length);

  if (remaining.length) {
    return [node, ...matchStar(parser, remaining)];
  }

  return [node];
}

export {
  matches,
  matchFirst,
  matchStar,
};
