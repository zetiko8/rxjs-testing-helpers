import {
  TestableLogger,
  expectToFail,
  expectToPass,
  ignoreIndent,
} from './test-helpers';
import { assertDeepEqual } from '../index';
import { TestScheduler } from 'rxjs/testing';

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
      assertDeepEqual.bind(null, { logger }))
      .run(({ cold, expectObservable }) => {
        expectObservable(cold('a'))
          .toBe('a');
      }));
  });
  it('a = b', () => {
    const logger = new TestableLogger(false);
    expectToFail(() => new TestScheduler(
      assertDeepEqual.bind(null, { logger }))
      .run(({ cold, expectObservable }) => {
        expectObservable(cold('a'))
          .toBe('b');
      }))
      .with(ignoreIndent(
        `E: b
        A: a`,
      ))
      .and(error => {
        expect(logger.debugString)
          .toBe(ignoreIndent(
            `
            frame: 0 - N: b
            ----------------------
            frame: 0 - N: a
            ----------------------`,
          ));
      });
  });
  it('# = #', () => {
    const error = new Error('test');
    const logger = new TestableLogger(false);
    expectToPass(() => new TestScheduler(
      assertDeepEqual.bind(null, { logger }))
      .run(({ cold, expectObservable }) => {
        expectObservable(cold('#', {}, error))
          .toBe('#', {}, error);
      }));
  });
});
