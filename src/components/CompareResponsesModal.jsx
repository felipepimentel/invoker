import React from 'react';
import { useSelector } from 'react-redux';
import ReactDiffViewer from 'react-diff-viewer';

const CompareResponsesModal = ({ isOpen, onClose, theme }) => {
  const history = useSelector((state) => state.invoker.history);

  if (!isOpen || history.length < 2) {
    return null;
  }

  const latestResponse = history[0].response;
  const previousResponse = history[1].response;

  return (
    <div className={`fixed inset-0 z-50 overflow-auto ${theme === 'dark' ? 'bg-gray-900 bg-opacity-75' : 'bg-gray-100 bg-opacity-75'}`}>
      <div className={`relative w-full max-w-4xl p-6 mx-auto my-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
        <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Compare Responses</h2>
        <ReactDiffViewer
          oldValue={JSON.stringify(previousResponse, null, 2)}
          newValue={JSON.stringify(latestResponse, null, 2)}
          splitView={true}
          useDarkTheme={theme === 'dark'}
        />
        <button
          onClick={onClose}
          className={`mt-4 px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CompareResponsesModal;