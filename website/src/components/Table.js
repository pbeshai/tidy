import * as React from 'react';
import cx from 'clsx';
import { format } from 'd3-format';

const formatter = (d) => {
  if (typeof d === 'object') {
    return JSON.stringify(d);
  }
  if (typeof d !== 'number') {
    return d;
  }

  // if it has decimals
  if (d < 1 && d > 0) {
    return format('.3r')(d);
  }
  return format('.3s')(d);
};

const Pager = ({ page, onChange, pageSize, numItems }) => {
  const numPages = Math.ceil(numItems / pageSize);
  const hasPrev = page > 0;
  const hasNext = page < numPages - 1;
  return (
    <div className="text-sm flex items-center">
      <button
        className={cx('button button--sm button--secondary mr-2', {
          disabled: !hasPrev,
        })}
        disabled={!hasPrev}
        onClick={() => onChange(page - 1)}
      >
        Prev
      </button>{' '}
      {page + 1} of {numPages}{' '}
      <button
        className={cx('button button--sm button--secondary ml-2', {
          disabled: !hasNext,
        })}
        disabled={!hasNext}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

const Table = ({ data, className }) => {
  const [page, setPage] = React.useState(0);
  const pageSize = 8;

  const hasPages = data == null ? false : data.length > pageSize;

  if (!data || !data.length) return null;

  // look for keys across all items in case first items are missing
  const columnMap = {};
  for (const item of data) {
    for (const key in item) {
      if (columnMap[key]) continue;
      columnMap[key] = {
        Header: key,
        accessor: key,
        type: typeof item[key],
      };
    }
  }

  const columns = Object.values(columnMap);

  const visibleRows = data.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div>
      <table className={className}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} className={`data-type-${col.type}`}>
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((d, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col.accessor} className={`data-type-${col.type}`}>
                  {formatter(d[col.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {hasPages ? (
        <Pager
          page={page}
          onChange={setPage}
          numItems={data.length}
          pageSize={pageSize}
        />
      ) : null}
    </div>
  );
};

export default Table;
