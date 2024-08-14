import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromFavorites } from '../store/invokerSlice';

const FavoritesPanel = ({ isOpen, onClose, theme }) => {
  const favorites = useSelector((state) => state.invoker.favorites);
  const dispatch = useDispatch();

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`fixed top-0 right-0 z-50 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-4 rounded-md shadow-md w-80 h-full overflow-y-auto`}>
      <h2 className="text-lg font-semibold mb-4">Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <ul>
          {favorites.map((favorite) => (
            <li key={favorite.id} className="mb-4 p-2 border rounded">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{favorite.name}</span>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{favorite.method}</span>
              </div>
              <div className="mt-1 text-sm truncate">{favorite.url}</div>
              <button
                onClick={() => dispatch(removeFromFavorites(favorite.id))}
                className={`mt-2 px-2 py-1 text-sm rounded ${theme === 'dark' ? 'bg-red-700 hover:bg-red-600' : 'bg-red-500 hover:bg-red-400'} text-white`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={onClose}
        className={`mt-4 px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        Close
      </button>
    </div>
  );
};

export default FavoritesPanel;