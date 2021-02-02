import { summarize } from './summarize';
import { n } from './summary/n';
import { sum } from './summary/sum';
import { TidyFn } from './types';

type TallyOptions = {
  readonly name?: string;
  readonly wt?: string;
};

type TallyOutput<Options extends TallyOptions> = Options['name'] extends string
  ? { [K in Options['name']]: number }
  : { n: number };

export function tally<T extends object, Options extends TallyOptions>(
  options?: Options
): TidyFn<T, TallyOutput<Options>> {
  const _tally: TidyFn<T, TallyOutput<Options>> = (
    items: T[]
  ): TallyOutput<Options>[] => {
    const { name = 'n', wt } = options ?? {};

    const summarized = summarize({ [name]: wt == null ? n() : sum(wt as any) })(
      items
    );
    return summarized as TallyOutput<Options>[];
  };

  return _tally;
}
