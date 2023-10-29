import {
  drawMarbles,
} from './draw-marbles';
import {
  AssertDeepEqualOptions,
  AssertDeepEqualOptionsFull,
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

    const {
      actual: actualDrawing,
      expected: expectedDrawing,
    } = drawMarbles(actual, expected, opts.symbols);

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

function logDef (
  def: MarbleDefinition[],
  logger: Logger,
) {
  def.forEach(d => {
    logger.debug(`frame: ${d.frame} - ${d.notification.kind}: ${d.notification.error !== undefined ? d.notification.error : d.notification.value}`);
  });
  logger.debug('----------------------');
}