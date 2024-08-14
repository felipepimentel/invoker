import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEnvironment } from '../store/invokerSlice';

const EnvironmentModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { environment, theme } = useSelector((state) => state.invoker);
  const [localEnvironment, setLocalEnvironment] = useState(environment);

  const handleSave = () => {
    dispatch(setEnvironment(localEnvironment));
    onClose();
  };

  const handleAddVariable = () => {
    setLocalEnvironment({ ...localEnvironment, '': '' });
  };

  const handleRemoveVariable = (key) => {
    const { [key]: _, ...rest } = localEnvironment;
    setLocalEnvironment(rest);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg w-96`}>
        <h2 className="text-xl font-semibold mb-4">Variáveis de Ambiente</h2>
        {Object.entries(localEnvironment).map(([key, value]) => (
          <div key={key} className="flex mb-2">
            <input
              type="text"
              value={key}
              onChange={(e) => setLocalEnvironment({ ...localEnvironment, [e.target.value]: value })}
              className={`flex-grow ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Chave"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => setLocalEnvironment({ ...localEnvironment, [key]: e.target.value })}
              className={`flex-grow ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} rounded-r-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Valor"
            />
            <button
              onClick={() => handleRemoveVariable(key)}
              className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 ml-2`}
            >
              Remover
            </button>
          </div>
        ))}
        <button
          onClick={handleAddVariable}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 mt-2`}
        >
          Adicionar Variável
        </button>
        <button
          onClick={handleSave}
          className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 mt-2`}
        >
          Salvar
        </button>
      </div>
    </div>
  );
};

export default EnvironmentModal;