import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { Plus, Trash2, Save, ChevronDown, Book, History, Settings } from 'lucide-react';
import RequestForm from './RequestForm';
import ResponseViewer from './ResponseViewer';
import EnvironmentModal from './EnvironmentModal';
import {
  setUrl,
  setMethod,
  setParams,
  setHeaders,
  setBody,
  setResponse,
  addCollection,
  addToHistory,
  toggleTheme,
} from '../store/invokerSlice';

const Invoker = () => {
  const dispatch = useDispatch();
  const {
    url,
    method,
    params,
    headers,
    body,
    response,
    collections,
    history,
    theme,
  } = useSelector((state) => state.invoker);

  const [activeTab, setActiveTab] = React.useState('params');
  const [isCollectionsOpen, setIsCollectionsOpen] = React.useState(true);
  const [showEnvironmentModal, setShowEnvironmentModal] = React.useState(false);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  }, [theme]);

  const handleSend = useCallback(async () => {
    try {
      const response = await fetch(url, {
        method,
        headers: Object.fromEntries(headers.filter(h => h.key && h.value)),
        body: method !== 'GET' ? body : undefined,
      });
      const data = await response.json();
      const newResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data,
      };
      dispatch(setResponse(newResponse));
      dispatch(addToHistory({ method, url, response: newResponse }));
    } catch (error) {
      console.error('Error:', error);
      dispatch(setResponse({
        status: 'Error',
        statusText: error.message,
        data: { error: 'Failed to fetch' },
      }));
    }
  }, [url, method, headers, body, dispatch]);

  const handleSaveCollection = useCallback(() => {
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
      dispatch(addCollection(newCollection));
    }
  }, [url, method, params, headers, body, dispatch]);

  useHotkeys('ctrl+enter', handleSend);
  useHotkeys('ctrl+s', handleSaveCollection);
  useHotkeys('ctrl+t', () => dispatch(toggleTheme()));

  const handleAddParam = () => dispatch(setParams([...params, { key: '', value: '' }]));
  const handleAddHeader = () => dispatch(setHeaders([...headers, { key: '', value: '' }]));

  const handleRemoveParam = (index) => {
    const newParams = params.filter((_, i) => i !== index);
    dispatch(setParams(newParams));
  };

  const handleRemoveHeader = (index) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    dispatch(setHeaders(newHeaders));
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto p-6">
        <header className={`flex justify-between items-center mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Invoker</h1>
          <div className="flex space-x-4">
            <button onClick={() => dispatch(toggleTheme())} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            <button onClick={() => setShowEnvironmentModal(true)} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </header>
        
        <main className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
          <RequestForm
            method={method}
            setMethod={(value) => dispatch(setMethod(value))}
            url={url}
            setUrl={(value) => dispatch(setUrl(value))}
            handleSend={handleSend}
            theme={theme}
          />

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

            {/* Conteúdo das abas (params, headers, body) */}
          </div>

          <ResponseViewer response={response} theme={theme} />

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
                              dispatch(setMethod(request.method));
                              dispatch(setUrl(request.url));
                              dispatch(setParams(request.params));
                              dispatch(setHeaders(request.headers));
                              dispatch(setBody(request.body));
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
                      dispatch(setMethod(item.method));
                      dispatch(setUrl(item.url));
                      dispatch(setResponse(item.response));
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

      <EnvironmentModal
        isOpen={showEnvironmentModal}
        onClose={() => setShowEnvironmentModal(false)}
        theme={theme}
      />
    </div>
  );
};

export default Invoker;