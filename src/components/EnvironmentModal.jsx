import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEnvironment, setCurrentEnvironment } from '../store/invokerSlice';

const EnvironmentModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { environments, currentEnvironment, theme } = useSelector((state) => state.invoker);
  const [localEnvironments, setLocalEnvironments] = useState(environments);
  const [selectedEnvironment, setSelectedEnvironment] = useState(currentEnvironment);

  const handleSave = () => {
    Object.entries(localEnvironments).forEach(([name, variables]) => {
      dispatch(setEnvironment({ name, variables }));
    });
    dispatch(setCurrentEnvironment(selectedEnvironment));
    onClose();
  };

  const handleAddVariable = (envName) => {
    setLocalEnvironments({
      ...localEnvironments,
      [envName]: { ...localEnvironments[envName], '': '' }
    });
  };

  const handleRemoveVariable = (envName, key) => {
    const { [key]: _, ...rest } = localEnvironments[envName];
    setLocalEnvironments({
      ...localEnvironments,
      [envName]: rest
    });
  };

  const handleAddEnvironment = () => {
    const newEnvName = prompt("Enter new environment name:");
    if (newEnvName && !localEnvironments[newEnvName]) {
      setLocalEnvironments({
        ...localEnvironments,
        [newEnvName]: {}
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg w-3/4 max-w-4xl`}>
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <div className="flex mb-4">
          <select
            value={selectedEnvironment}
            onChange={(e) => setSelectedEnvironment(e.target.value)}
            className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} rounded-md px-3 py-2 mr-2`}
          >
            {Object.keys(localEnvironments).map((envName) => (
              <option key={envName} value={envName}>{envName}</option>
            ))}
          </select>
          <button
            onClick={handleAddEnvironment}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
          >
            Add Environment
          </button>
        </div>
        {Object.entries(localEnvironments[selectedEnvironment]).map(([key, value]) => (
          <div key={key} className="flex mb-2">
            <input
              type="text"
              value={key}
              onChange={(e) => setLocalEnvironments({
                ...localEnvironments,
                [selectedEnvironment]: {
                  ...localEnvironments[selectedEnvironment],
                  [e.target.value]: value
                }
              })}
              className={`flex-grow ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} rounded-l-md px-3 py-2`}
              placeholder="Key"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => setLocalEnvironments({
                ...localEnvironments,
                [selectedEnvironment]: {
                  ...localEnvironments[selectedEnvironment],
                  [key]: e.target.value
                }
              })}
              className={`flex-grow ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} rounded-r-md px-3 py-2`}
              placeholder="Value"
            />
            <button
              onClick={() => handleRemoveVariable(selectedEnvironment, key)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md ml-2"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => handleAddVariable(selectedEnvironment)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md mt-2 mr-2"
        >
          Add Variable
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mt-2"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EnvironmentModal;