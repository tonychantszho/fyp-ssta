import StorageContext, { StorageInterface, Action, initialState } from './StorageContext';
import React, { useReducer } from 'react';
import { stroageReducer } from './StroageReducer';
import Footer from '../components/Footer';

export default function StorageProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(stroageReducer, initialState);
  return (
    <StorageContext.Provider value={{ state, dispatch: dispatch }}>
      {children}
    </StorageContext.Provider>
  )
}