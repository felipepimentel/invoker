import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { Plus, X, Send, ChevronDown, Book, History, Settings, Download, Upload, Maximize2, Save, ChevronLeft, ChevronRight, Star, Code, Tag } from 'lucide-react';
import RequestForm from './RequestForm';
import ResponseViewer from './ResponseViewer';
import EnvironmentModal from './EnvironmentModal';
import HistoryPanel from './HistoryPanel';
import FavoritesPanel from './FavoritesPanel';
import CompareResponsesModal from './CompareResponsesModal';
import CodeGenerationModal from './CodeGenerationModal';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  addTab,
  removeTab,
  setActiveTab,
  updateTab,
  toggleTheme,
  setUrl,
  setMethod,
  setParams,
  setHeaders,
  setBody,
  setResponse,
  addCollection,
  addToHistory,
  addToFavorites,
  removeFromFavorites,
  addTag,
  removeTag,
} from '../store/invokerSlice';

const Invoker = () => {
  const dispatch = useDispatch();
  const {
    tabs,
    activeTabId,
    collections,
    history,
    theme,
  } = useSelector((state) => state.invoker);

  // Add a default tab if tabs is undefined or empty
  useEffect(() => {
    if (!tabs || tabs.length === 0) {
      dispatch(addTab());
    }
  }, [tabs, dispatch]);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showEnvironmentModal, setShowEnvironmentModal] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(true);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showFavoritesPanel, setShowFavoritesPanel] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showCodeGenModal, setShowCodeGenModal] = useState(false);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  }, [theme]);

  const getActiveTab = useCallback(() => {
    return tabs && tabs.find(tab => tab.id === activeTabId);
  }, [tabs, activeTabId]);

  const handleSend = useCallback(async () => {
    const activeTab = getActiveTab();
    if (!activeTab) {
      toast.error('No active tab found');
      return;
    }

    try {
      const response = await fetch(activeTab.url, {
        method: activeTab.method,
        headers: Object.fromEntries(activeTab.headers.filter(h => h.key && h.value)),
        body: activeTab.method !== 'GET' ? activeTab.body : undefined,
      });
      const data = await response.json();
      const newResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data,
      };
      dispatch(updateTab({ id: activeTabId, response: newResponse }));
      dispatch(addToHistory({ method: activeTab.method, url: activeTab.url, response: newResponse }));
      toast.success('Request sent successfully!');
    } catch (error) {
      console.error('Error:', error);
      dispatch(updateTab({ id: activeTabId, response: {
        status: 'Error',
        statusText: error.message,
        data: { error: 'Failed to fetch' },
      }}));
      toast.error('Failed to send request');
    }
  }, [activeTabId, dispatch, getActiveTab]);

  const handleSaveCollection = useCallback(() => {
    const name = prompt("Digite o nome da coleção:");
    if (name) {
      const newCollection = {
        id: Date.now(),
        name,
        requests: [{
          id: Date.now(),
          name: tabs.find(tab => tab.id === activeTabId).url,
          method: tabs.find(tab => tab.id === activeTabId).method,
          url: tabs.find(tab => tab.id === activeTabId).url,
          params: tabs.find(tab => tab.id === activeTabId).params,
          headers: tabs.find(tab => tab.id === activeTabId).headers,
          body: tabs.find(tab => tab.id === activeTabId).body
        }]
      };
      dispatch(addCollection(newCollection));
    }
  }, [tabs, activeTabId, dispatch]);

  const handleExportCollections = () => {
    const dataStr = JSON.stringify(collections);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'invoker_collections.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportCollections = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedCollections = JSON.parse(e.target.result);
        importedCollections.forEach(collection => {
          dispatch(addCollection(collection));
        });
      } catch (error) {
        console.error('Error importing collections:', error);
        // Você pode adicionar uma notificação de erro aqui
      }
    };
    reader.readAsText(file);
  };

  useHotkeys('ctrl+enter', handleSend);
  useHotkeys('ctrl+s', handleSaveCollection);
  useHotkeys('ctrl+t', () => dispatch(toggleTheme()));

  const handleAddParam = () => dispatch(updateTab({ id: activeTabId, params: [...tabs.find(tab => tab.id === activeTabId).params, { key: '', value: '' }] }));
  const handleAddHeader = () => dispatch(updateTab({ id: activeTabId, headers: [...tabs.find(tab => tab.id === activeTabId).headers, { key: '', value: '' }] }));

  const handleRemoveParam = (index) => {
    const newParams = tabs.find(tab => tab.id === activeTabId).params.filter((_, i) => i !== index);
    dispatch(updateTab({ id: activeTabId, params: newParams }));
  };

  const handleRemoveHeader = (index) => {
    const newHeaders = tabs.find(tab => tab.id === activeTabId).headers.filter((_, i) => i !== index);
    dispatch(updateTab({ id: activeTabId, headers: newHeaders }));
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const handleAddToFavorites = useCallback(() => {
    const activeTab = getActiveTab();
    if (activeTab) {
      dispatch(addToFavorites({
        id: Date.now(),
        name: activeTab.url,
        method: activeTab.method,
        url: activeTab.url,
        params: activeTab.params,
        headers: activeTab.headers,
        body: activeTab.body
      }));
      toast.success('Added to favorites!');
    }
  }, [dispatch, getActiveTab]);

  const handleCompareResponses = () => {
    setShowCompareModal(true);
  };

  const handleGenerateCode = () => {
    setShowCodeGenModal(true);
  };

  const handleAddTag = (collectionId, tag) => {
    dispatch(addTag({ collectionId, tag }));
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <div className="flex flex-col md:flex-row h-screen">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`w-full md:w-64 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 overflow-y-auto flex-shrink-0 relative`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Book className="mr-2 h-5 w-5" /> Collections
                </h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="md:hidden p-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </div>
              {isCollectionsOpen && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {collections && collections.length > 0 ? (
                    collections.map((collection) => (
                      <div key={collection.id} className={`${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded-md p-3`}>
                        <h3 className="font-semibold text-lg mb-2">{collection.name}</h3>
                        <ul className="space-y-1">
                          {collection.requests && collection.requests.map((request) => (
                            <li 
                              key={request.id} 
                              className={`text-sm cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-500' : 'hover:bg-gray-400'} p-2 rounded-md transition duration-300 ease-in-out`}
                              onClick={() => {
                                dispatch(updateTab({ id: activeTabId, method: request.method, url: request.url, params: request.params, headers: request.headers, body: request.body }));
                              }}
                            >
                              <span className={`font-mono ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>{request.method}</span> {request.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p>No collections available</p>
                  )}
                </div>
              )}
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                  className={`w-full text-left py-2 px-4 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  <History className="inline-block mr-2" /> History
                </button>
                <button
                  onClick={() => setShowFavoritesPanel(!showFavoritesPanel)}
                  className={`w-full text-left py-2 px-4 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  <Star className="inline-block mr-2" /> Favorites
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-grow flex flex-col overflow-hidden">
          <header className={`flex justify-between items-center p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Invoker</h1>
            <div className="flex space-x-2">
              {!showSidebar && (
                <button 
                  onClick={() => setShowSidebar(true)} 
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
              <button onClick={() => dispatch(toggleTheme())} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                {theme === 'dark' ? '🌙' : '☀️'}
              </button>
              <button onClick={() => setShowEnvironmentModal(true)} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                <Settings className="h-6 w-6" />
              </button>
              <button onClick={toggleFullScreen} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                <Maximize2 className="h-6 w-6" />
              </button>
            </div>
          </header>

          {/* Tabs */}
          <div className={`flex overflow-x-auto ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} p-2`}>
            {tabs && tabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex items-center px-4 py-2 rounded-t-lg mr-2 cursor-pointer ${
                  tab.id === activeTabId
                    ? theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    : theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-700'
                }`}
                onClick={() => dispatch(setActiveTab(tab.id))}
              >
                {tab.url || 'New Tab'}
                <button
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(removeTab(tab.id));
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              className={`px-4 py-2 rounded-t-lg ${theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-700'}`}
              onClick={() => dispatch(addTab())}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Active tab content */}
          <div className="flex-1 overflow-auto p-4">
            {getActiveTab() ? (
              <>
                <RequestForm
                  tab={getActiveTab()}
                  updateTab={(updates) => dispatch(updateTab({ id: activeTabId, ...updates }))}
                  handleSend={handleSend}
                  theme={theme}
                />
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={handleAddToFavorites}
                    className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-400 hover:bg-yellow-500'} text-white`}
                  >
                    <Star className="inline-block mr-2" /> Add to Favorites
                  </button>
                  <button
                    onClick={handleCompareResponses}
                    className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-400 hover:bg-purple-500'} text-white`}
                  >
                    <ChevronDown className="inline-block mr-2" /> Compare Responses
                  </button>
                  <button
                    onClick={handleGenerateCode}
                    className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-400 hover:bg-green-500'} text-white`}
                  >
                    <Code className="inline-block mr-2" /> Generate Code
                  </button>
                </div>
                <ResponseViewer
                  response={getActiveTab()?.response}
                  theme={theme}
                />
              </>
            ) : (
              <div className="text-center py-10">No active tab. Please add a new tab.</div>
            )}
          </div>
        </div>
      </div>

      <EnvironmentModal
        isOpen={showEnvironmentModal}
        onClose={() => setShowEnvironmentModal(false)}
        theme={theme}
      />

      <HistoryPanel
        isOpen={showHistoryPanel}
        onClose={() => setShowHistoryPanel(false)}
        theme={theme}
      />

      <FavoritesPanel
        isOpen={showFavoritesPanel}
        onClose={() => setShowFavoritesPanel(false)}
        theme={theme}
      />

      <CompareResponsesModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        theme={theme}
      />

      <CodeGenerationModal
        isOpen={showCodeGenModal}
        onClose={() => setShowCodeGenModal(false)}
        theme={theme}
      />

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
};

export default Invoker;