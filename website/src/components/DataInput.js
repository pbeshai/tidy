import * as React from 'react';
import cx from 'clsx';

import JsonOrTable from './JsonOrTable';
import mtcars from '../data/mtcars.json';
import iris from '../data/iris.json';

const DataSelect = ({ value, onChange }) => {
  return (
    <div className="button-group">
      <button
        className={cx('button button--secondary', {
          'button--outline': value !== 'mtcars',
        })}
        onClick={() => onChange('mtcars')}
      >
        mtcars
      </button>
      <button
        className={cx('button button--secondary', {
          'button--outline': value !== 'iris',
        })}
        onClick={() => onChange('iris')}
      >
        iris
      </button>
    </div>
  );
};

const DataInput = ({ input, onChange }) => {
  const [dataset, setDataset] = React.useState('mtcars');
  const handleChangeDataset = (newDataset) => {
    if (newDataset === 'mtcars') {
      onChange(mtcars);
    } else {
      onChange(iris);
    }
    setDataset(newDataset);
  };
  return (
    <JsonOrTable
      jsonClassName="text-sm"
      header={
        <div className="flex items-center">
          <div className="mr-2">Input</div>
          <DataSelect value={dataset} onChange={handleChangeDataset} />
        </div>
      }
      data={input}
    />
  );
};

export default DataInput;
