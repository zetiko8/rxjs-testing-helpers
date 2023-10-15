import { Logger } from '../lib/types';

export function fail (message: string) {
  throw new Error(message);
}

export function expectToPass (
  fn: () => unknown,
) {
  try {
    fn();
  } catch (error) {
    expect((error as Error).message).toEqual('{{no error}}');
  }
}

export function expectToThrow (
  fn: () => unknown,
): {
    error: (
      assertOnErrorFunction: (
        error: Error
      ) => void
    ) => void
} {
  try {
    fn();
  } catch (error) {
    return {
      error: (assertOnErrorFunction) => {
        assertOnErrorFunction(error as Error);
      },
    };
  }

  throw Error('Expected to throw an error');

}

export const expectToFail = (
  fn: () => unknown,
) => {
  return {
    with: (errorMessage: string) => {
      try {
        fn();
      } catch (error) {
        expect((error as Error).message)
          .toBe(errorMessage);

        return {
          and: (
            assertOnErrorFunction: (error: Error) => void,
          ) => {
            assertOnErrorFunction(error as Error);
          },
        };
      }

      expect('{no error thrown}')
        .toBe(errorMessage);

      return {
        and: (
          assertOnErrorFunction: (error: Error) => void,
        ) => {
          assertOnErrorFunction(null as unknown as Error);
        },
      };
    },
  };
};

export function ignoreIndent (str: string): string {
  return str.split('\n')
    .map(s => s.trim())
    .join('\n');
}

export class TestableLogger implements Logger {

  debugString = '';
  logString = '';

  log (...args: any[]) {
    this.logString +=`
${args.join(', ')}`;
    // eslint-disable-next-line no-console
    if (this.doShow) console.log(...args);
  }

  debug (...args: any[]) {
    this.debugString +=`
${args.join(', ')}`;
    // eslint-disable-next-line no-console
    if (this.doShow) console.debug(...args);
  };

  constructor (
    private readonly doShow = false,
  ) {

  }

}