import { combineReducers } from '@reduxjs/toolkit';
import invokerSlice from './invokerSlice';

const rootReducer = combineReducers({
  invoker: invokerSlice,
});

export default rootReducer;