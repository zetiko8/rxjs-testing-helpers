import {
  AssertDeepEqualSymbols,
  MarbleDefinition,
} from './types';

interface EventsTreeNode {
    maxNumberOfEvents: number;
    actual: MarbleDefinition[];
    expected: MarbleDefinition[];
  };

export function drawMarbles (
  actual: MarbleDefinition[],
  expected: MarbleDefinition[],
  symbols: AssertDeepEqualSymbols,
): { actual: string, expected: string } {
  const tree = getEventsTree(actual, expected);
  return writeMarblesFromTree(
    tree, symbols);
}

function writeMarblesFromTree (
  tree: EventsTreeNode[],
  symbols: AssertDeepEqualSymbols,
): { actual: string, expected: string } {

  let actual = '';
  let expected = '';

  tree.forEach(node => {
    actual += writeFrame(
      node.maxNumberOfEvents, node.actual, symbols);
    expected += writeFrame(
      node.maxNumberOfEvents, node.expected, symbols);
  });

  return {
    actual,
    expected,
  };
}

function writeFrame (
  maxNumberOfEvents: number,
  events: MarbleDefinition[],
  symbols: AssertDeepEqualSymbols,
): string {
  let result = '';
  if (maxNumberOfEvents > 1) {
    result += '(';
    for (let i = 0; i < maxNumberOfEvents; ++i) {
      if (events[i])
        result += formatEventValue(events[i]);
      else
        result += ' ';
    }
    result += ')';
  }
  else if (events[0]) {
    result += formatEventValue(events[0]);
  }
  else {
    result += symbols.tick;
  }
  return result;
}

function getEventsTree (
  actual: MarbleDefinition[],
  expected: MarbleDefinition[],
): EventsTreeNode[] {
  const numberOfFrames
      = getNumberOfFrames(actual, expected);

  const tree: EventsTreeNode[] = [];

  for (let i = 0; i <= numberOfFrames; i++) {
    const actualEventsForFrame
       = getEventsForFrame(i, actual);
    const expectedEventsForFrame
       = getEventsForFrame(i, expected);
    const maxNumberOfEvents
        = actualEventsForFrame.length
          > expectedEventsForFrame.length
          ? actualEventsForFrame.length
          : expectedEventsForFrame.length;
    tree[i] = {
      maxNumberOfEvents,
      actual: actualEventsForFrame,
      expected: expectedEventsForFrame,
    };
  }

  return tree;
}

function getNumberOfFrames (
  actual: MarbleDefinition[],
  expected: MarbleDefinition[],

): number {
  const lastActual = actual[actual.length - 1].frame;
  const lastExpected = expected[expected.length - 1].frame;

  return lastActual > lastExpected
    ? lastActual : lastExpected;
}

function getEventsForFrame (
  frame: number,
  allEvents: MarbleDefinition[],
) {
  return allEvents.filter(event => {
    return event.frame === frame;
  });
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