import invariant from 'tiny-invariant';
import { Mode, readFileContent } from '../../utils/readFileContent';

function calc(reports: number[][], canSkip: boolean) {
  const calculatedReports = reports.map((report) => {
    type ReportReduce = {
      lastNum: number;
      skipped: boolean;
      error: string | null;
      monotonic: 'INC' | 'DEC' | 'UNDECIDED';
    };
    return report.reduce<ReportReduce | null>((acc, curr, index) => {
      if (acc === null) {
        return { lastNum: curr, skipped: false, error: null, monotonic: 'UNDECIDED' };
      }
      if (acc.error) {
        return acc;
      }
      let error: string | null = null;
      let monotonic: 'INC' | 'DEC' | 'UNDECIDED';
      if (curr === acc.lastNum) {
        error = `Unsafe because '${curr} ${acc.lastNum} is neither an increase or a decrease`;
        monotonic = acc.monotonic;
      } else if (curr > acc.lastNum) {
        error =
          acc.monotonic === 'DEC'
            ? `Unsafe because '? ${curr}' is decreasing but '${acc.lastNum} ${curr}' is increasing`
            : curr - acc.lastNum > 3
              ? `Unsafe because '${acc.lastNum} ${curr}' is an increase of ${curr - acc.lastNum}`
              : null;
        monotonic = error ? acc.monotonic : 'INC';
      } else {
        error =
          acc.monotonic === 'INC'
            ? `Unsafe because '? ${curr}' is increasing but '${acc.lastNum} ${curr}' is decreasing`
            : acc.lastNum - curr > 3
              ? `Unsafe because '${acc.lastNum} ${curr}' is a decrease of ${acc.lastNum - curr}`
              : null;
        monotonic = error ? acc.monotonic : 'DEC';
      }
      const skipThisLevel = canSkip && !acc.skipped && error != null;
      if (skipThisLevel) {
        return { ...acc, skipped: true };
      }
      return {
        lastNum: curr,
        skipped: false,
        error: error,
        monotonic: monotonic,
      };
    }, null);
  });
  calculatedReports.forEach((calculatedReport) => {
    // console.log(calculatedReport);
  });
  const sum = calculatedReports
    .map((calculatedReport) => {
      invariant(calculatedReport, 'Invalid report');
      return (calculatedReport.error ? 0 : 1) as number;
    })
    .reduce((acc, curr) => acc + curr, 0);
  return sum;
}

function part1(reports: number[][]) {
  const sum = calc(reports, false);
  console.log('Day 02, Part1:', sum);
}

function part2(reports: number[][]) {
  const sum = calc(reports, true);
  console.log('Day 02, Part2:', sum);
}

export function day02() {
  // 581 is too high
  const content = readFileContent(Mode.PUZZLE_INPUT, 2);
  const parsed = content
    .split('\n')
    .filter((v) => v)
    .map((line) => line.split(' ').map((char) => parseInt(char)));
  part1(parsed);
  part2(parsed);
}
