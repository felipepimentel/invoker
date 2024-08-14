import React, { useState, useEffect } from 'react';
import { Send, Plus, Trash2, Save, ChevronDown, Book, Zap, History, Settings } from 'lucide-react';

const Invoker = () => {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [params, setParams] = useState([{ key: '', value: '' }]);
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);
  const [collections, setCollections] = useState([]);
  const [activeTab, setActiveTab] = useState('params');
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(true);
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [showEnvironmentModal, setShowEnvironmentModal] = useState(false);
  const [environment, setEnvironment] = useState({});

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  }, [theme]);

  const handleSend = () => {
    const newResponse = {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
      data: { message: 'Resposta simulada da API', url: url }
    };
    setResponse(newResponse);
    setHistory([{ method, url, response: newResponse }, ...history.slice(0, 9)]);
  };

  const handleAddParam = () => setParams([...params, { key: '', value: '' }]);
  const handleAddHeader = () => setHeaders([...headers, { key: '', value: '' }]);

  const handleRemoveParam = (index) => {
    const newParams = params.filter((_, i) => i !== index);
    setParams(newParams);
  };

  const handleRemoveHeader = (index) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
  };

  const handleSaveCollection = () => {
    const name = prompt("Digite o nome da coleção:");
    if (name) {
      const newCollection = {
        id: Date.now(),
        name,
        requests: [{
          id: Date.now(),
          name: url,
          method,
          url,
          params,
          headers,
          body
        }]
      };
      setCollections([...collections, newCollection]);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto p-6">
        <header className={`flex justify-between items-center mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Invoker</h1>
          <div className="flex space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            <button onClick={() => setShowEnvironmentModal(true)} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </header>
        
        <main className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
          <div className="flex space-x-2 mb-6">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
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
              onChange={(e) => setUrl(e.target.value)}
              className={`flex-grow ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
              <Zap className="mr-2 h-4 w-4" /> Invocar
            </button>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-4 mb-6`}>
            <div className="flex mb-4 space-x-4">
              {['params', 'headers', 'body'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-semibold rounded-md transition duration-300 ease-in-out ${
                    activeTab === tab
                      ? 'bg-blue-500 text-white'
                      : theme === 'dark' ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Conteúdo das abas (params, headers, body) permanece o mesmo */}
          </div>

          {response && (
            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-4 mb-6 animate-fade-in`}>
              <h2 className="text-xl font-semibold mb-2">Resposta</h2>
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-md`}>
                <p className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Status: {response.status} {response.statusText}</p>
                <h3 className={`font-semibold mt-2 mb-1 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>Headers:</h3>
                <pre className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{JSON.stringify(response.headers, null, 2)}</pre>
                <h3 className={`font-semibold mt-2 mb-1 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>Body:</h3>
                <pre className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{JSON.stringify(response.data, null, 2)}</pre>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-4`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Book className="mr-2 h-5 w-5" /> Coleções
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveCollection}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center"
                  >
                    <Save className="mr-2 h-4 w-4" /> Salvar
                  </button>
                  <button
                    onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                    className={`${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} text-white p-2 rounded-md transition duration-300 ease-in-out`}
                  >
                    <ChevronDown className={`h-4 w-4 transform ${isCollectionsOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              {isCollectionsOpen && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {collections.map((collection) => (
                    <div key={collection.id} className={`${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded-md p-3`}>
                      <h3 className="font-semibold text-lg mb-2">{collection.name}</h3>
                      <ul className="space-y-1">
                        {collection.requests.map((request) => (
                          <li 
                            key={request.id} 
                            className={`text-sm cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-500' : 'hover:bg-gray-400'} p-2 rounded-md transition duration-300 ease-in-out`}
                            onClick={() => {
                              setMethod(request.method);
                              setUrl(request.url);
                              setParams(request.params);
                              setHeaders(request.headers);
                              setBody(request.body);
                            }}
                          >
                            <span className={`font-mono ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>{request.method}</span> {request.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-4`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <History className="mr-2 h-5 w-5" /> Histórico
              </h2>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {history.map((item, index) => (
                  <div 
                    key={index} 
                    className={`${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} p-2 rounded-md cursor-pointer transition duration-300 ease-in-out`}
                    onClick={() => {
                      setMethod(item.method);
                      setUrl(item.url);
                      setResponse(item.response);
                    }}
                  >
                    <span className={`font-mono ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>{item.method}</span> {item.url}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {showEnvironmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg w-96`}>
            <h2 className="text-xl font-semibold mb-4">Variáveis de Ambiente</h2>
            {/* Adicione aqui os campos para gerenciar as variáveis de ambiente */}
            <button 
              onClick={() => setShowEnvironmentModal(false)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoker;