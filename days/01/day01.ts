import invariant from 'tiny-invariant';
import { Mode, readFileContent } from '../../utils/readFileContent';

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
  console.log('Day 01, Part1:', sum);
}

function part2(leftList: number[], rightList: number[]) {
  let sum = 0;

  leftList.forEach((leftItem) => {
    const numberOfTimes = rightList.filter((rightItem) => leftItem === rightItem).length;
    const similarityScore = leftItem * numberOfTimes;
    sum += similarityScore;
  });
  console.log('Day 01, Part2:', sum);
}

export function day01() {
  const content = readFileContent(Mode.PUZZLE_INPUT, 1);
  const parsed = parseInput(content);
  part1(parsed.leftList, parsed.rightList);
  part2(parsed.leftList, parsed.rightList);
}
