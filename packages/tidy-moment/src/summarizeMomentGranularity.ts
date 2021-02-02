import moment, { Moment } from 'moment';
import { A } from 'ts-toolbelt';
import {
  tidy,
  first,
  groupBy,
  mutate,
  summarize,
  TidyFn,
  SummarizeSpec,
  SummarizeOptions,
} from '@tidyjs/tidy';
import { GranularityWithQuarter } from './types';

interface SummarizeMGOptions<T> extends SummarizeOptions<T> {
  timestampKey?: string;
  dateKey?: string;
}

type SMGOutput<
  T extends object,
  SumSpec extends SummarizeSpec<T>,
  Options extends SummarizeMGOptions<T>
> = {
  // summarized values map to return type of the spec functions
  [K in keyof SumSpec]: ReturnType<SumSpec[K]>;
} &
  Exclude<T, keyof SumSpec> &
  (Options['timestampKey'] extends string
    ? { [K in Options['timestampKey']]: string }
    : { timestamp: string }) &
  (Options['dateKey'] extends string
    ? { [K in Options['dateKey']]: Moment }
    : { date: Moment });

export function summarizeMomentGranularity<
  T extends object,
  SummarizedSpec extends SummarizeSpec<T> = SummarizeSpec<T>,
  Options extends SummarizeMGOptions<T> = SummarizeMGOptions<T>
>(
  granularity: GranularityWithQuarter,
  summarySpec: SummarizedSpec,
  options?: Options
): TidyFn<T, A.Compute<SMGOutput<T, SummarizedSpec, Options>, 'flat'>> {
  type Output = SMGOutput<T, SummarizedSpec, Options>;

  const _summarizeMomentGranularity: TidyFn<T, A.Compute<Output, 'flat'>> = (
    items: T[]
  ): A.Compute<Output, 'flat'>[] => {
    options = options ?? ({} as Options);
    const {
      timestampKey = 'timestamp',
      dateKey = 'date',
      rest = first,
      ...other
    } = options;

    const dateFormats = {
      d: 'YYYY-MM-DD',
      days: 'YYYY-MM-DD',
      day: 'YYYY-MM-DD',
      w: 'GGGG-WW', // need Week Year otherwise 2019-12-31 is year 2019, week 1
      week: 'GGGG-WW', // need Week Year otherwise 2019-12-31 is year 2019, week 1
      weeks: 'GGGG-WW', // need Week Year otherwise 2019-12-31 is year 2019, week 1
      m: 'YYYY-MM',
      month: 'YYYY-MM',
      months: 'YYYY-MM',
      q: 'YYYY-[Q]Q',
      quarter: 'YYYY-[Q]Q',
      quarters: 'YYYY-[Q]Q',
      y: 'YYYY',
      year: 'YYYY',
      years: 'YYYY',
    };
    const dateFormat = dateFormats[granularity];

    const results = tidy(
      items,
      mutate({
        [dateKey]: (d) =>
          moment.utc(
            ((d as any)[dateKey] as Moment).format(dateFormat),
            dateFormat
          ),
        [timestampKey]: (d) => ((d as any)[dateKey] as Moment).toISOString(),
      }),
      groupBy(
        [timestampKey as any],
        [
          summarize<T, SummarizedSpec, Pick<Options, keyof SummarizeOptions>>(
            summarySpec,
            { rest, ...other }
          ) as any,
        ]
      )
    );

    return (results as unknown) as A.Compute<Output, 'flat'>[];
  };

  return _summarizeMomentGranularity;
}
