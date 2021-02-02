import * as React from 'react';
import Table from './Table';
import cx from 'clsx';
import CodeBlock from '@theme/CodeBlock';
import jsonStringify from 'json-stringify-pretty-compact';

const JsonOrTable = ({
  data,
  header,
  initial = 'table',
  jsonClassName = undefined,
  className,
  renderType: renderTypeControlled = initial,
  onChangeRenderType,
}) => {
  const [renderTypeInternal, setRenderTypeInternal] = React.useState(initial);
  let setRenderType =
    onChangeRenderType == null ? setRenderTypeInternal : onChangeRenderType;
  let renderType =
    onChangeRenderType == null ? renderTypeInternal : renderTypeControlled;

  return (
    <div className={className}>
      <div className="flex mb-2 items-center justify-between">
        <h4 className="mb-0">{header}</h4>
        <div className="button-group">
          <button
            className={cx('button button--secondary', {
              'button--outline': renderType !== 'json',
            })}
            onClick={() => setRenderType('json')}
          >
            JSON
          </button>
          <button
            className={cx('button button--secondary', {
              'button--outline': renderType !== 'table',
            })}
            onClick={() => setRenderType('table')}
          >
            Table
          </button>
        </div>
      </div>
      {data == null ? (
        <div>
          Warning: The <code>output</code> variable was{' '}
          {data === null ? 'null' : 'undefined'}. Make sure you set it to the
          result of your tidy flow.
        </div>
      ) : renderType === 'json' ? (
        <div className={cx(jsonClassName, 'limited-code-block')}>
          <CodeBlock className="language-json">
            {data.slice
              ? jsonStringify(data.slice(0, 100), { maxLength: 80 })
              : jsonStringify(data, { maxLength: 80 }).slice(0, 3000)}
          </CodeBlock>
        </div>
      ) : (
        <Table data={data} className="code-table" />
      )}
    </div>
  );
};

export default JsonOrTable;
