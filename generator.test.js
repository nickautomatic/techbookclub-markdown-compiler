import { visit } from './generator';

describe('visit', () => {
  it('renders an abstract syntax tree to a string', () => {
    const ast = {
      value: [
        { value: 'this is '},
        {
          value: [
            { value: 'a ' },
            { value: 'test' },
          ]
        }
      ]
    };

    expect(visit(ast)).toEqual('this is a test');
  });

  it('renders PARAGRAPH nodes to HTML', () => {
    const ast = {
      type: 'PARAGRAPH',
      value: [
        { type: 'TEXT', value: 'This is a paragraph' },
      ],
    };

    expect(visit(ast)).toEqual('<p>This is a paragraph</p>');
  });

  it('renders BOLD nodes to HTML', () => {
    const ast = {
      type: 'BOLD',
      value: 'This is some bold text',
    };

    expect(visit(ast)).toEqual('<strong>This is some bold text</strong>');
  });

  it('renders EMPHASIS nodes to HTML', () => {
    const ast = {
      type: 'EMPHASIS',
      value: 'This is some emphasised text',
    };

    expect(visit(ast)).toEqual('<em>This is some emphasised text</em>');
  });
});
