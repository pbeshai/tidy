import Editor, { monaco } from '@monaco-editor/react';
import useThemeContext from '@theme/hooks/useThemeContext';
import Layout from '@theme/Layout';
import debounce from 'lodash.debounce';
import * as React from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import * as T from '@tidyjs/tidy';
import JsonOrTable from '../components/JsonOrTable';
import ConsoleOutput from '../components/ConsoleOutput';
import DataInput from '../components/DataInput';
import mtcars from '../data/mtcars.json';
import moment from 'moment';

if (typeof window !== 'undefined') {
  monaco
    .init()
    .catch((error) =>
      console.error(
        'An error occurred during initialization of Monaco: ',
        error
      )
    );
}

const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 14,
};

function Output({ input, codeStr, outputType, onChangeOutputType }) {
  const { output, logs } = runCodeWithInput(input, T, codeStr);
  console.log(
    '==========================================================================================='
  );
  console.log(
    '[Input] -----------------------------------------------------------------------------------'
  );
  if (input != null && input.slice != null) {
    console.table(input.slice(0, 5));
  }
  console.log(input);
  console.log(
    '[Output] ----------------------------------------------------------------------------------'
  );
  if (output != null && output.slice != null) {
    console.table(output.slice(0, 5));
  }
  console.log(output);

  return (
    <div>
      <JsonOrTable
        header="Output"
        data={output}
        jsonClassName="text-sm"
        renderType={outputType}
        onChangeRenderType={onChangeOutputType}
      />
      {logs.length ? (
        <div className="mt-4">
          <h5 className="mb-2">Console Output Preview</h5>
          <ConsoleOutput logs={logs} />
        </div>
      ) : null}
    </div>
  );
}

const SafeOutput = withErrorBoundary(Output, {
  FallbackComponent: (props) => <div>Error: {props.error.toString()}</div>,
  onError(error, componentStack) {
    // console.error('[error boundary]', error, componentStack);
  },
});

function runCodeWithInput(input, T, codeStr) {
  // eslint-disable-next-line
  return Function(`
    let output;
    let logs = [];
    
    let consoleProxy = new Proxy(console, {
      get(obj, prop) {
        if (prop === 'log') {
          return (...args) => {
            logs.push(args);
            console.log(...args);
          }
        }

        return obj[prop];
      }
    });
    return function(T, moment, input) {
      let console = consoleProxy;
      with (T) {
        ${codeStr}
      }
      return { output, logs };
    }
    `)()(T, moment, input);
}

function CodeEditor({ initialCodeStr, onChangeCodeStr }) {
  const [, setIsEditorReady] = React.useState(false);
  const editorRef = React.useRef();

  const debouncedSetCodeStr = debounce(onChangeCodeStr, 1000);

  function handleEditorDidMount(_, editor) {
    setIsEditorReady(true);
    editorRef.current = editor;

    editorRef.current.onDidChangeModelContent((ev) => {
      const codeStr = editorRef.current.getValue();
      debouncedSetCodeStr(codeStr);
    });
  }

  const { isDarkTheme } = useThemeContext();

  return (
    <Editor
      language="javascript"
      value={initialCodeStr}
      theme={isDarkTheme ? 'dark' : 'light'}
      editorDidMount={handleEditorDidMount}
      options={EDITOR_OPTIONS}
    />
  );
}

function Playground() {
  // prettier-ignore
  const initialCodeStr = `${''
}// {T.*}    - all Tidy.js functions are available directly and as T.* 
// {input}  - \`input\` variable matches mtcars or iris based on input selection
// {output} - put your output in the predefined output variable

output = tidy(input,
  groupBy(['cyl', 'gear'], [
    summarize({ 
      n: n(),
      mpg: mean('mpg'), 
      hp: mean('hp'), 
      wt: mean('wt'), 
    }),
  ]),
  select(['cyl', 'gear', everything()]),
  arrange([desc('n'), desc('mpg')])
);
`;
  const [codeStr, setCodeStr] = React.useState(initialCodeStr);
  const [input, setInput] = React.useState(mtcars);
  const [outputType, setOutputType] = React.useState('table');

  return (
    <Layout
      title={`Playground`}
      description="A REPL for interactively trying out Tidy.js"
    >
      <main>
        <div className="grid grid-cols-12" style={{ minHeight: '90vh' }}>
          <div className="col-span-7 border-r">
            <CodeEditor
              onChangeCodeStr={setCodeStr}
              initialCodeStr={initialCodeStr}
            />
          </div>
          <div className="col-span-5 p-2">
            <div className="flex flex-col h-full">
              <div className="flex-grow h-full">
                <DataInput input={input} onChange={setInput} />
              </div>
              <div className="divider my-4 -mx-2" />
              <div className="flex-grow h-full">
                <SafeOutput
                  input={input}
                  codeStr={codeStr}
                  key={codeStr}
                  outputType={outputType}
                  onChangeOutputType={setOutputType}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Playground;
