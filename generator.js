const visit = (node) => {
  switch(node.type) {
    case 'BOLD':
      return `<strong>${node.value}</strong>`;
      break;

    case 'EMPHASIS':
      return `<em>${node.value}</em>`;
      break;

    case 'PARAGRAPH':
      return `<p>${node.value.map(visit).join('')}</p>`;
      break;

    default:
      return (typeof node.value === 'string') ? node.value : node.value.map(visit).join('');
      break;
  }
}

const generate = (ast) => visit(ast);

export {
  generate,
  visit,
}
