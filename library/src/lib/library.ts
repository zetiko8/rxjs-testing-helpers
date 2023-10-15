import {
  Observable,
} from 'rxjs';
import {
  map,
} from 'rxjs/operators';
import {
  ColdObservable,
} from 'rxjs/internal/testing/ColdObservable';
import * as chai from 'chai';

const expect = chai.expect;

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

export type ColdCreator = <T = string>(marbles: string, values?: {
  [marble: string]: T;
} | undefined, error?: unknown) => ColdObservable<T>;

function getNumberOfSyncGroupings (
  expected: unknown,
) {

  const e = expected as { frame: number }[];
  const dict: Record<number, number> = {};
  e.forEach(u => {
    if (!dict[u.frame]) {
      dict[u.frame] = 0;
    }
    dict[u.frame]++;
  });

  return dict;
}

export const assertDeepEqual = (
  actual: any,
  expected: any,
) => {
  try {
    try {
      expect(actual).to.eql(expected);
    } catch (error) {
      const dictOfSyncGroupings = getNumberOfSyncGroupings(expected);

      Object.entries(dictOfSyncGroupings)
        .forEach(([key, val]) => {
          if (val > 1) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expected.forEach((frameDef: any) => {
              if (frameDef.frame > Number(key)) {
                frameDef.frame -= (val + 1);
              }
            });
          }
        });

      expect(actual).to.eql(expected);
    }
  } catch (error) {
    const e = Error(`E: ${drawMarbleFromDefs(expected)}
   A: ${drawMarbleFromDefs(actual)}`);
    e.stack = '';
    throw e;
  }
};

interface MarbleDef {
  frame: number,
  notification: { kind: 'N'|'C'|'E', value: unknown, error: Error | undefined }
}

function drawMarbleFromDefs (def: MarbleDef[]) {
  logDef(def);
  let expectedMarble = '.';
  let expectedFrame = 0;
  let isDrawingGroup = false;
  def.forEach((ev, index) => {
    let addOpeningParenthesis = false;
    let addClosingParenthesis = false;
    const next = (def.length - 1) === index ? null : def[index + 1];
    if (next === null && isDrawingGroup)
      addClosingParenthesis = true;

    if (
      !isDrawingGroup
      && next !== null
      && next.frame === ev.frame
    ) {
      isDrawingGroup = true;
      addOpeningParenthesis = true;
    }

    if (
      next !== null
      && next.frame !== ev.frame
    ) {
      if (isDrawingGroup) addClosingParenthesis = true;
      isDrawingGroup = false;
    }

    if (ev.frame === 0) {
      if (isDrawingGroup || addClosingParenthesis) {
        if (addOpeningParenthesis) {
          expectedMarble = '(';
        }
        expectedMarble += formatEventValue(ev);
      }
      else {
        expectedMarble = formatEventValue(ev);
      }
    }
    else {
      if (ev.frame > expectedFrame) {
        Array.from(
          new Array(ev.frame - (expectedFrame + 1)),
        ).forEach(() => expectedMarble += '.');
      }
      if (addOpeningParenthesis) expectedMarble += '(';
      expectedMarble += formatEventValue(ev);
    }
    expectedFrame = ev.frame;

    if (addClosingParenthesis) expectedMarble += ')';

  });

  return expectedMarble;
}

function formatEventValue (ev: MarbleDef): string {
  if (ev.notification.value !== undefined) {
    if (ev.notification.value === true) return 't';
    if (ev.notification.value === false) return 'f';
    if (ev.notification.value === null) return '_';
    if (ev.notification.value instanceof Error) return '€';
    return ev.notification.value as string;
  }
  if (ev.notification.error !== undefined) return '#';
  if (ev.notification.kind === 'C') return '|';

  return 'What is this is should not happen';
}

function logDef (def: MarbleDef[]) {
  // let s = '';
  def.forEach(d => {
    // eslint-disable-next-line no-console
    console.log(`frame: ${d.frame} - ${d.notification.kind}: ${d.notification.error !== undefined ? d.notification.error : d.notification.value}`);
  });
  // eslint-disable-next-line no-console
  console.log('----------------------');
}

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
