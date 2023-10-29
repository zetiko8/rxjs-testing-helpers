import {
  TestableLogger,
  expectToFail,
  expectToPass,
  ignoreIndent,
} from './test-helpers';
import {
  AssertDeepEqualOptions,
  assertDeepEqual,
} from '../index';
import { TestScheduler } from 'rxjs/testing';

const tAssertDeepEqual
  = (
    options: AssertDeepEqualOptions,
    actual: any,
    expected: any,
  ) => assertDeepEqual(actual, expected, options);

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
    const logger = new TestableLogger(false);
    expectToPass(() => new TestScheduler(
      tAssertDeepEqual.bind(null, { logger }))
      .run(({ cold, expectObservable }) => {
        expectObservable(cold('a'))
          .toBe('a');
      }));
  });
  it('a = b', () => {
    const logger = new TestableLogger(true);
    expectToFail(() => new TestScheduler(
      tAssertDeepEqual.bind(null, { logger }))
      .run(({ cold, expectObservable }) => {
        expectObservable(cold('a'))
          .toBe('b');
      }))
      .with(
        // eslint-disable-next-line quotes
        `expected 'a' to equal 'b'`,
      )
      .and(error => {
        expect(logger.debugString)
          .toBe(ignoreIndent(
            `
            frame: 0 - N: a
            ----------------------
            frame: 0 - N: b
            ----------------------`,
          ));
        expect(logger.logString)
          .toBe(ignoreIndent(`
            E: b
            A: a`,
          ));
      });
  });
  it('# = #', () => {
    const error = new Error('test');
    const logger = new TestableLogger(false);
    expectToPass(() => new TestScheduler(
      tAssertDeepEqual.bind(null, { logger }))
      .run(({ cold, expectObservable }) => {
        expectObservable(cold('#', {}, error))
          .toBe('#', {}, error);
      }));
  });
  it('-a = -a', () => {
    const logger = new TestableLogger(false);
    expectToPass(() => new TestScheduler(
      tAssertDeepEqual.bind(null, { logger }))
      .run(({ cold, expectObservable }) => {
        expectObservable(cold('-a'))
          .toBe('-a');
      }));
  });
  it('-a = -b', () => {
    const logger = new TestableLogger(false);
    expectToFail(() => new TestScheduler(
      tAssertDeepEqual.bind(null, { logger }))
      .run(({ cold, expectObservable }) => {
        expectObservable(cold('-a'))
          .toBe('-b');
      }))
      .with(
        // eslint-disable-next-line quotes
        `expected '-a' to equal '-b'`,
      )
      .and(error => {
        expect(logger.debugString)
          .toBe(ignoreIndent(
            `
            frame: 1 - N: a
            ----------------------
            frame: 1 - N: b
            ----------------------`,
          ));
        expect(logger.logString)
          .toBe(ignoreIndent(`
            E: -b
            A: -a`,
          ));
      });
  });
});
