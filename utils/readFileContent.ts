import { readFileSync } from 'fs';
import path from 'path';
import invariant from 'tiny-invariant';

export enum Mode {
  PUZZLE_INPUT,
  TEST_ONLY,
}

export function readFileContent(mode: Mode, day: number): string {
  invariant(day >= 1 && day <= 25, 'Invalid day');
  invariant(Number.isInteger(day), 'Day must be an integer');
  const fileName = mode === Mode.PUZZLE_INPUT ? 'input.txt' : 'test.txt';
  const file = path.resolve(__dirname, '..', 'days', String(day).padStart(2, '0'), fileName);
  return readFileSync(file, 'utf8');
}
