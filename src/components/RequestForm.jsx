import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send } from 'lucide-react';
import { setUrl, setMethod } from '../store/invokerSlice';

const RequestForm = ({ handleSend }) => {
  const dispatch = useDispatch();
  const { url, method, theme } = useSelector((state) => state.invoker);

  const validateUrl = (value) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(value);
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    dispatch(setUrl(newUrl));
  };

  const handleMethodChange = (e) => {
    dispatch(setMethod(e.target.value));
  };

  return (
    <div className="flex space-x-2 mb-6">
      <select
        value={method}
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
        placeholder="Digite a URL"
        value={url}
        onChange={handleUrlChange}
        className={`flex-grow ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${!validateUrl(url) && url ? 'border-red-500' : ''}`}
      />
      <button
        onClick={handleSend}
        disabled={!validateUrl(url)}
        className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center ${!validateUrl(url) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Send className="mr-2 h-4 w-4" /> Invocar
      </button>
    </div>
  );
};

export default RequestForm;