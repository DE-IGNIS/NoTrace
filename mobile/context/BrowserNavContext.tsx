import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

export interface Tab {
  id: string;
  url: string;
  title: string;
  hasNavigated: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

type Ctx = {
  tabs: Tab[];
  activeTabId: string | null;
  canGoBack: boolean;
  canGoForward: boolean;
  createTab: (url?: string, title?: string) => string;
  closeTab: (tabId: string) => void;
  switchTab: (tabId: string) => void;
  updateTab: (tabId: string, updates: Partial<Tab>) => void;
  registerWebViewRef: (tabId: string, ref: any) => void;
  goBack: () => void;
  goForward: () => void;
  goHome: () => void;
  reloadActiveTab: () => void;
};

const BrowserNavContext = createContext<Ctx | null>(null);

const generateTabId = () => `tab_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

export function BrowserNavProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>(() => [
    {
      id: generateTabId(),
      url: '',
      title: 'New Tab',
      hasNavigated: false,
      canGoBack: false,
      canGoForward: false,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // Initialize activeTabId on first render if it is null
  if (activeTabId === null && tabs.length > 0) {
    setActiveTabId(tabs[0].id);
  }

  const webViewRefs = useRef<{ [tabId: string]: any }>({});

  const registerWebViewRef = useCallback((tabId: string, ref: any) => {
    if (ref) {
      webViewRefs.current[tabId] = ref;
    } else {
      delete webViewRefs.current[tabId];
    }
  }, []);

  const createTab = useCallback((url = '', title = 'New Tab') => {
    const newId = generateTabId();
    const newTab: Tab = {
      id: newId,
      url,
      title,
      hasNavigated: !!url,
      canGoBack: false,
      canGoForward: false,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
    return newId;
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setTabs((prev) => {
      const index = prev.findIndex((t) => t.id === tabId);
      if (index === -1) return prev;

      const newTabs = prev.filter((t) => t.id !== tabId);

      // If no tabs left, create a default tab
      if (newTabs.length === 0) {
        const newId = generateTabId();
        setActiveTabId(newId);
        return [
          {
            id: newId,
            url: '',
            title: 'New Tab',
            hasNavigated: false,
            canGoBack: false,
            canGoForward: false,
          },
        ];
      }

      // If active tab was closed, switch active to another
      if (activeTabId === tabId) {
        const nextActiveIndex = Math.min(index, newTabs.length - 1);
        setActiveTabId(newTabs[nextActiveIndex].id);
      }

      return newTabs;
    });

    if (webViewRefs.current[tabId]) {
      delete webViewRefs.current[tabId];
    }
  }, [activeTabId]);

  const switchTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  const updateTab = useCallback((tabId: string, updates: Partial<Tab>) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, ...updates } : t))
    );
  }, []);

  const activeTab = tabs.find((t) => t.id === activeTabId) || null;
  const canGoBack = activeTab ? activeTab.canGoBack : false;
  const canGoForward = activeTab ? activeTab.canGoForward : false;

  const goBack = useCallback(() => {
    if (activeTabId && webViewRefs.current[activeTabId]) {
      webViewRefs.current[activeTabId].goBack();
    }
  }, [activeTabId]);

  const goForward = useCallback(() => {
    if (activeTabId && webViewRefs.current[activeTabId]) {
      webViewRefs.current[activeTabId].goForward();
    }
  }, [activeTabId]);

  const reloadActiveTab = useCallback(() => {
    if (activeTabId && webViewRefs.current[activeTabId]) {
      webViewRefs.current[activeTabId].reload();
    }
  }, [activeTabId]);

  const goHome = useCallback(() => {
    if (activeTabId) {
      updateTab(activeTabId, {
        url: '',
        title: 'New Tab',
        hasNavigated: false,
        canGoBack: false,
        canGoForward: false,
      });
    }
  }, [activeTabId, updateTab]);

  return (
    <BrowserNavContext.Provider
      value={{
        tabs,
        activeTabId,
        canGoBack,
        canGoForward,
        createTab,
        closeTab,
        switchTab,
        updateTab,
        registerWebViewRef,
        goBack,
        goForward,
        goHome,
        reloadActiveTab,
      }}
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