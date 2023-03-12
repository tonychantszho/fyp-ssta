import StorageContext, {initialState } from './StorageContext';
import React, { useReducer } from 'react';
import { stroageReducer } from './StroageReducer';

export default function StorageProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(stroageReducer, initialState);
  return (
    <StorageContext.Provider value={{ state, dispatch: dispatch }}>
      {children}
    </StorageContext.Provider>
  )
}