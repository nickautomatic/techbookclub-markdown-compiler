const visit = (node) => {
  return (typeof node.value === 'string') ? node.value : node.value.map(visit).join('');
}

const generate = (ast) => visit(ast);

export {
  generate,
  visit,
}
