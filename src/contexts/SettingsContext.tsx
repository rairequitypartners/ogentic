
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  clarifyingQuestionsEnabled: boolean;
  setClarifyingQuestionsEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [clarifyingQuestionsEnabled, setClarifyingQuestionsEnabled] = useState(true);

  return (
    <SettingsContext.Provider value={{
      clarifyingQuestionsEnabled,
      setClarifyingQuestionsEnabled
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
