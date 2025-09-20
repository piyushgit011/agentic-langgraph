"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface InterruptContextType {
  isInterrupted: boolean;
  interrupt: () => void;
  clearInterrupt: () => void;
  checkInterrupt: () => boolean;
}

const InterruptContext = createContext<InterruptContextType | undefined>(undefined);

export const InterruptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInterrupted, setIsInterrupted] = useState(false);

  const interrupt = useCallback(() => {
    console.log('🛑 Interrupt requested');
    setIsInterrupted(true);
  }, []);

  const clearInterrupt = useCallback(() => {
    console.log('✅ Interrupt cleared');
    setIsInterrupted(false);
  }, []);

  const checkInterrupt = useCallback(() => {
    return isInterrupted;
  }, [isInterrupted]);

  return (
    <InterruptContext.Provider value={{
      isInterrupted,
      interrupt,
      clearInterrupt,
      checkInterrupt
    }}>
      {children}
    </InterruptContext.Provider>
  );
};

export const useInterrupt = () => {
  const context = useContext(InterruptContext);
  if (context === undefined) {
    throw new Error('useInterrupt must be used within an InterruptProvider');
  }
  return context;
};
