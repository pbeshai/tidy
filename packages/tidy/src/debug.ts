import { TidyContext, TidyFn } from './types';

type Options = {
  limit?: number | null;
  output?: 'log' | 'table';
};

/**
 * Debugs items
 */
export function debug<T extends object>(
  label?: string | null | undefined,
  options?: Options | null | undefined
): TidyFn<T> {
  const _debug: TidyFn<T> = (items: T[], context?: TidyContext): T[] => {
    let prefix = '[tidy.debug';
    if (context?.groupKeys?.length) {
      const groupKeys = context.groupKeys;
      const groupKeyStrings = groupKeys
        .map((keyPair: any) => keyPair.join(': '))
        .join(', ');
      if (groupKeyStrings.length) {
        prefix += '|' + groupKeyStrings;
      }
    }
    options = options ?? {};
    const { limit = 10, output = 'table' } = options;

    // check for sneaky group keys as last arg
    const dashString =
      '--------------------------------------------------------------------------------';
    let numDashes = dashString.length;
    const prefixedLabel = prefix + ']' + (label == null ? '' : ' ' + label);
    numDashes = Math.max(0, numDashes - (prefixedLabel.length + 2));

    console.log(`${prefixedLabel} ${dashString.substring(0, numDashes)}`);
    console[output](
      limit == null || limit >= items.length ? items : items.slice(0, limit)
    );
    return items;
  };

  return _debug;
}
