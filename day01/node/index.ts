import { readFileSync } from 'fs';
import path from 'path';
import invariant from 'tiny-invariant';

function readFileContent(mode?: 'PUZZLE_INPUT' | 'TEST_ONLY'): string {
  const fileName = mode === 'TEST_ONLY' ? 'test.txt' : 'input.txt';
  const file = path.resolve(__dirname, '..', fileName);
  return readFileSync(file, 'utf8');
}

function parseInput(input: string): { leftList: number[]; rightList: number[] } {
  return input
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => {
      const match = line.match(/(\d+) +(\d+)/);
      invariant(match, `Invalid line: ${line}`);
      return { leftItem: parseInt(match[1]), rightItem: parseInt(match[2]) };
    })
    .map(({ leftItem, rightItem }) => ({ leftItem, rightItem }))
    .reduce<{ leftList: number[]; rightList: number[] }>(
      (acc, { leftItem, rightItem }) => ({
        leftList: [...acc.leftList, leftItem],
        rightList: [...acc.rightList, rightItem],
      }),
      { leftList: [], rightList: [] },
    );
}

function part1(leftList: number[], rightList: number[]) {
  const sortedLeftList = leftList.slice().sort((a, b) => a - b);
  const sortedRightList = rightList.slice().sort((a, b) => a - b);
  invariant(sortedLeftList.length === sortedRightList.length, 'List differ in length');

  let sum = 0;

  sortedLeftList.forEach((leftItem, index) => {
    const rightItem = sortedRightList[index];
    const diff = Math.abs(leftItem - rightItem);
    sum += diff;
  });
  console.log('Part1:', sum);
}

function part2(leftList: number[], rightList: number[]) {
  let sum = 0;

  leftList.forEach((leftItem) => {
    const numberOfTimes = rightList.filter((rightItem) => leftItem === rightItem).length;
    const similarityScore = leftItem * numberOfTimes;
    sum += similarityScore;
  });
  console.log('Part2:', sum);
}

const content = readFileContent();
const parsed = parseInput(content);
part1(parsed.leftList, parsed.rightList);
part2(parsed.leftList, parsed.rightList);
