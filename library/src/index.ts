export {
  createAfter$,
  debugTicks,
  ignoreErrorSub,
} from './lib/library';
export {
  MarbleDefinition,
} from './lib/types';
import {
  assertDeepEqual as assertDeepEqualInternal,
} from './lib/library';
export const assertDeepEqual
  = assertDeepEqualInternal.bind(null, { logger: console });
