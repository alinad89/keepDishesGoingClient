import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface WinterModeContextType {
  isWinterMode: boolean;
  toggleWinterMode: () => void;
}

const WinterModeContext = createContext<WinterModeContextType | undefined>(undefined);

export function WinterModeProvider({ children }: { children: ReactNode }) {
  const [isWinterMode, setIsWinterMode] = useState(() => {
    const saved = localStorage.getItem('winterMode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('winterMode', String(isWinterMode));
  }, [isWinterMode]);

  const toggleWinterMode = () => {
    setIsWinterMode(prev => !prev);
  };

  return (
    <WinterModeContext.Provider value={{ isWinterMode, toggleWinterMode }}>
      {children}
    </WinterModeContext.Provider>
  );
}

export function useWinterMode() {
  const context = useContext(WinterModeContext);
  if (!context) {
    throw new Error('useWinterMode must be used within WinterModeProvider');
  }
  return context;
}
