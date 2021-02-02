import * as React from 'react';
import cx from 'clsx';
import CodeBlock from '@theme/CodeBlock';
import jsonStringify from 'json-stringify-pretty-compact';

const ConsoleOutput = ({ logs }) => {
  return (
    <div className="text-xs limited-code-block">
      {/* <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}> */}
      <CodeBlock className="language-json">
        {'>\u00a0' +
          logs
            .map((lineArgs, i) =>
              lineArgs
                .map((arg) =>
                  typeof arg === 'string'
                    ? arg.substring(0, 500)
                    : arg.slice
                    ? jsonStringify(arg.slice(0, 10), { maxLength: 80 })
                    : jsonStringify(arg, { maxLength: 80 }).slice(0, 500)
                )
                .join(' ')
            )
            .join('\n>\u00a0')}
      </CodeBlock>
    </div>
  );
};

export default ConsoleOutput;
