import { TestableLogger, expectToThrow } from './test-helpers';
import { MarbleDefinition, assertDeepEqual } from '../index';

export const values = {
  t: true, f: false, a: 'a', b: 'b', c: 'c', n: null, v: 'v',
  w: 'w',
  o: 'o', p: 'p', r: 'r', s: 's', u: 'u',
};

describe('library', () => {
  it('should work', () => {
    expect(assertDeepEqual)
      .toBeTruthy();
  });
  it('a = a', () => {
    const actual: MarbleDefinition = {
      frame: 0,
      notification: {
        error: undefined,
        kind: 'N',
        value: 'a',
      },
    };
    const expected: MarbleDefinition = {
      frame: 0,
      notification: {
        error: undefined,
        kind: 'N',
        value: 'a',
      },
    };

    assertDeepEqual(actual, expected);

  });
  it('a = b', () => {
    const actual: MarbleDefinition[] = [{
      frame: 0,
      notification: {
        error: undefined,
        kind: 'N',
        value: 'a',
      },
    }];
    const expected: MarbleDefinition[] = [{
      frame: 0,
      notification: {
        error: undefined,
        kind: 'N',
        value: 'b',
      },
    }];

    const logger = new TestableLogger();
    expectToThrow(() => assertDeepEqual(
      actual, expected, { logger }))
      .error(error => {
        expect(logger.debugString)
          .toBe(
            // eslint-disable-next-line indent
`
frame: 0 - N: b
----------------------
frame: 0 - N: a
----------------------`,
          );

        expect(error.message)
          .toBe(
            // eslint-disable-next-line indent
`E: b
A: a`,
          );

      });

  });
});
