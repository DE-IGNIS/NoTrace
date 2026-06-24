import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

type Controls = { goBack: () => void; goForward: () => void; goHome: () => void };
type Ctx = {
  canGoBack: boolean;
  canGoForward: boolean;
  setNavState: (s: { canGoBack: boolean; canGoForward: boolean }) => void;
  registerControls: (c: Controls) => void;
  goBack: () => void;
  goForward: () => void;
  goHome: () => void;
};

const BrowserNavContext = createContext<Ctx | null>(null);

export function BrowserNavProvider({ children }: { children: React.ReactNode }) {
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const controlsRef = useRef<Controls | null>(null);

  const setNavState = useCallback((s: { canGoBack: boolean; canGoForward: boolean }) => {
    setCanGoBack(s.canGoBack);
    setCanGoForward(s.canGoForward);
  }, []);

  const registerControls = useCallback((c: Controls) => {
    controlsRef.current = c;
  }, []);

  const goBack = useCallback(() => controlsRef.current?.goBack(), []);
  const goForward = useCallback(() => controlsRef.current?.goForward(), []);
  const goHome = useCallback(() => controlsRef.current?.goHome(), []);

  return (
    <BrowserNavContext.Provider
      value={{ canGoBack, canGoForward, setNavState, registerControls, goBack, goForward, goHome }}
    >
      {children}
    </BrowserNavContext.Provider>
  );
}

export const useBrowserNav = () => {
  const ctx = useContext(BrowserNavContext);
  if (!ctx) throw new Error('useBrowserNav must be used within BrowserNavProvider');
  return ctx;
};