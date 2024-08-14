import React from 'react';
import { useSelector } from 'react-redux';

const HistoryPanel = ({ isOpen, onClose, theme }) => {
  const history = useSelector((state) => state.invoker.history);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 z-50 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-md shadow-md`}>
      <h2 className="text-lg font-semibold mb-4">History</h2>
      <ul>
        {history.map((item, index) => (
          <li key={index} className="mb-2">
            <div className="flex justify-between items-center">
              <span>{item.url}</span>
              <span>{item.method}</span>
            </div>
            <div className="mt-2">{item.response}</div>
          </li>
        ))}
      </ul>
      <button
        onClick={onClose}
        className={`mt-4 px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        Close
      </button>
    </div>
  );
};

export default HistoryPanel;