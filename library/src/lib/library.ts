import {
  Observable,
} from 'rxjs';
import {
  map,
} from 'rxjs/operators';
import {
  ColdCreator,
} from './types';

export const debugTicks = (
  cold: ColdCreator,
  numberOfTicks = 15,
): void => {
  let lines = '-';
  for (let i = 0; i < numberOfTicks; i++) {
    cold(lines + 't')
      .subscribe(
        // eslint-disable-next-line no-console
        () => console.log(i, '_____'),
      );
    lines += '-';
  }
};

export const ignoreErrorSub = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/explicit-module-boundary-types
  error() {},
};

/**
 * Creates an observable that will fire
 * after all the other observables are finished
 */
export function createAfter$ (
  cold: ColdCreator,
): Observable<undefined> {
  /**
   * The implementation is dumb
   *  - just make an observable that fires really late
   */
  return cold('-------------------------1')
    .pipe(map(() => undefined));
}
