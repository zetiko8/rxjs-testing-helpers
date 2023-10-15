import { Logger } from '../lib/types';

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

export class TestableLogger implements Logger {

  debugString = '';
  logString = '';

  log (...args: any[]) {
    this.logString +=`
${args.join(', ')}`;
  }

  debug (...args: any[]) {
    this.debugString +=`
${args.join(', ')}`;
  };

}