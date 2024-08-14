import React from 'react';
import { useSelector } from 'react-redux';
import ReactJson from 'react-json-view';

const ResponseViewer = () => {
  const { response, theme } = useSelector((state) => state.invoker);

  if (!response) return null;

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-4 mb-6 animate-fade-in`}>
      <h2 className="text-xl font-semibold mb-2">Resposta</h2>
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-md`}>
        <p className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Status: {response.status} {response.statusText}</p>
        <h3 className={`font-semibold mt-2 mb-1 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>Headers:</h3>
        <ReactJson
          src={response.headers}
          theme={theme === 'dark' ? 'monokai' : 'rjv-default'}
          displayDataTypes={false}
          name={false}
          collapsed={1}
        />
        <h3 className={`font-semibold mt-2 mb-1 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>Body:</h3>
        <ReactJson
          src={response.data}
          theme={theme === 'dark' ? 'monokai' : 'rjv-default'}
          displayDataTypes={false}
          name={false}
          collapsed={1}
        />
      </div>
    </div>
  );
};

export default ResponseViewer;