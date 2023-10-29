import {
  AssertDeepEqualOptions,
  AssertDeepEqualOptionsFull,
  AssertDeepEqualSymbols,
  Logger,
  MarbleDefinition,
} from './types';
import * as chai from 'chai';

const expect = chai.expect;

export const defaultOptions: AssertDeepEqualOptionsFull = {
  logger: console,
  symbols: {
    tick: '-',
  },
};

export const assertDeepEqual = (
  actual: any,
  expected: any,
  options?: AssertDeepEqualOptions,
) => {
  const opts: AssertDeepEqualOptionsFull
    = Object.assign(defaultOptions, options || {});
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
    logDef(actual, opts.logger);
    logDef(expected, opts.logger);
    const actualDrawing = drawMarbleFromDefs(
      actual, opts.symbols);
    const expectedDrawing = drawMarbleFromDefs(
      expected, opts.symbols);

    // this strange indent need to be here to
    // make sure the indent is correct in
    // the result
    opts.logger.log(`E: ${expectedDrawing}
A: ${actualDrawing}`);
    expect(actualDrawing)
      .to.equal(expectedDrawing);
  }
};

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

function drawMarbleFromDefs (
  def: MarbleDefinition[],
  symbols: AssertDeepEqualSymbols,
) {
  let expectedMarble = symbols.tick;
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
        ).forEach(() => expectedMarble += symbols.tick);
      }
      if (addOpeningParenthesis) expectedMarble += '(';
      expectedMarble += formatEventValue(ev);
    }
    expectedFrame = ev.frame;

    if (addClosingParenthesis) expectedMarble += ')';

  });

  return expectedMarble;
}

function formatEventValue (ev: MarbleDefinition): string {
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

function logDef (
  def: MarbleDefinition[],
  logger: Logger,
) {
  def.forEach(d => {
    logger.debug(`frame: ${d.frame} - ${d.notification.kind}: ${d.notification.error !== undefined ? d.notification.error : d.notification.value}`);
  });
  logger.debug('----------------------');
}