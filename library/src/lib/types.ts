import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

export interface Logger {
  log: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

export interface MarbleDefinition {
  frame: number;
  notification: {
    kind: 'N' | 'C' | 'E';
    value: unknown;
    error: Error | undefined;
  };
}

export type ColdCreator = <T = string>(marbles: string, values?: {
    [marble: string]: T;
  } | undefined, error?: unknown) => ColdObservable<T>;
