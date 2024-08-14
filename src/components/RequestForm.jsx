import React from 'react';
import { Send } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';

const RequestForm = ({ tab, updateTab, handleSend, theme }) => {
  const validateUrl = (value) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(value);
  };

  const handleUrlChange = (e) => {
    updateTab({ url: e.target.value });
  };

  const handleMethodChange = (e) => {
    updateTab({ method: e.target.value });
  };

  const handleBodyChange = (value) => {
    updateTab({ body: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <select
          value={tab.method}
          onChange={handleMethodChange}
          className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <input
          type="text"
          placeholder="Enter URL"
          value={tab.url}
          onChange={handleUrlChange}
          className={`flex-grow ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${!validateUrl(tab.url) && tab.url ? 'border-red-500' : ''}`}
        />
        <button
          onClick={handleSend}
          disabled={!validateUrl(tab.url)}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center ${!validateUrl(tab.url) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Send className="mr-2 h-4 w-4" /> Send
        </button>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Request Body</h3>
        <CodeMirror
          value={tab.body}
          height="200px"
          extensions={[json()]}
          onChange={handleBodyChange}
          theme={theme === 'dark' ? 'dark' : 'light'}
        />
      </div>
    </div>
  );
};

export default RequestForm;