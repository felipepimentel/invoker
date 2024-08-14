import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco, dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const CodeGenerationModal = ({ isOpen, onClose, theme }) => {
  const [language, setLanguage] = useState('javascript');
  const activeTab = useSelector((state) => 
    state.invoker.tabs.find(tab => tab.id === state.invoker.activeTabId)
  );

  if (!isOpen || !activeTab) {
    return null;
  }

  const generateCode = () => {
    // This is a simple example. You might want to expand this to cover more languages and cases.
    switch (language) {
      case 'javascript':
        return `
fetch('${activeTab.url}', {
  method: '${activeTab.method}',
  headers: ${JSON.stringify(Object.fromEntries(activeTab.headers.filter(h => h.key && h.value)), null, 2)},
  body: ${activeTab.method !== 'GET' ? JSON.stringify(activeTab.body) : 'undefined'}
})
.then(response => response.json())
.then(data => console.log(data))
.catch((error) => console.error('Error:', error));
        `;
      // Add more cases for other languages
      default:
        return 'Code generation not supported for this language yet.';
    }
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-auto ${theme === 'dark' ? 'bg-gray-900 bg-opacity-75' : 'bg-gray-100 bg-opacity-75'}`}>
      <div className={`relative w-full max-w-2xl p-6 mx-auto my-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
        <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Generate Code</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={`mb-4 p-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          <option value="go">Go</option>
          <option value="ruby">Ruby</option>
          <option value="swift">Swift</option>
          <option value="kotlin">Kotlin</option>
        </select>
        <SyntaxHighlighter 
          language={language} 
          style={theme === 'dark' ? dark : docco}
          className="rounded"
        >
          {generateCode()}
        </SyntaxHighlighter>
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

export default CodeGenerationModal;