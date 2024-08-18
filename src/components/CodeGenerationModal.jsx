import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/light';
import { docco, dark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

const CodeGenerationModal = ({ isOpen, onClose, theme }) => {
  const [language, setLanguage] = useState('javascript');
  const activeTab = useSelector((state) => 
    state.invoker.tabs.find(tab => tab.id === state.invoker.activeTabId)
  );

  if (!isOpen || !activeTab) {
    return null;
  }

  const generateCode = () => {
    const headers = Object.fromEntries(activeTab.headers.filter(h => h.key && h.value));
    const body = activeTab.method !== 'GET' ? activeTab.body : undefined;

    switch (language) {
      case 'javascript':
        return `
fetch('${activeTab.url}', {
  method: '${activeTab.method}',
  headers: ${JSON.stringify(headers, null, 2)},
  ${body ? `body: ${JSON.stringify(body)}` : ''}
})
.then(response => response.json())
.then(data => console.log(data))
.catch((error) => console.error('Error:', error));
        `;
      case 'python':
        return `
import requests

url = '${activeTab.url}'
headers = ${JSON.stringify(headers, null, 2)}
${body ? `body = ${JSON.stringify(body)}` : ''}

response = requests.${activeTab.method.toLowerCase()}(url, headers=headers${body ? ', json=body' : ''})
print(response.json())
        `;
      case 'curl':
        return `
curl -X ${activeTab.method} \\
  ${Object.entries(headers).map(([key, value]) => `-H '${key}: ${value}' \\`).join('\n  ')}
  ${body ? `-d '${JSON.stringify(body)}' \\` : ''}
  ${activeTab.url}
        `;
      // Add more cases for other languages as needed
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
          <option value="curl">cURL</option>
          {/* Add more language options as needed */}
        </select>
        <SyntaxHighlighter 
          language={language === 'curl' ? 'bash' : language}
          style={theme === 'dark' ? dark : docco}
          className="rounded"
        >
          {generateCode()}
        </SyntaxHighlighter>
        <button
          onClick={() => {
            navigator.clipboard.writeText(generateCode());
            // You might want to add a toast notification here
          }}
          className={`mt-4 mr-2 px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          Copy to Clipboard
        </button>
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