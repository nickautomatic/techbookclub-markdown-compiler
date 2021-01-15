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
});
