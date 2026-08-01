import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import AddressPill from '../../components/AddressPill';
import { useBrowserNav } from '../../context/BrowserNavContext';
import {
  addBookmark,
  removeBookmark,
  getBookmarks,
  type Bookmark,
} from '../../utils/bookmarkStorage';
import { addHistoryEntry } from '../../utils/historyStorage';
import type { RootTabParamList } from '../navigation/types';
import {
  buildProxyUrl,
  extractTargetFromProxyUrl,
  isProxiedUrl,
} from '../../services/proxyService';

const COLORS = {
  background: '#141313',
  surfaceContainerLow: '#1c1b1b',
  primary: '#eeeded',
  secondary: '#c8c6c5',
  onBackground: '#e5e2e1',
  outline: '#8e9192',
  outlineVariant: '#444748',
  privacyActive: '#4ade80',     // green — privacy mode on
  privacyInactive: '#8e9192',   // muted — privacy mode off
  errorBg: '#2a1a1a',
  errorBorder: '#6b2020',
  errorText: '#f87171',
};

const isLikelyUrl = (value: string) => {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return true;
  return /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(\/[^\s]*)?$/.test(trimmed) && !trimmed.includes(' ');
};

const buildTargetUrl = (rawInput: string) => {
  const trimmed = rawInput.trim();
  if (!trimmed) return '';
  if (isLikelyUrl(trimmed)) {
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
};

/**
 * Returns the human-readable "real" URL for display in the address bar.
 * If we're showing a proxy URL, decode back to the actual destination.
 */
const getDisplayUrl = (url: string): string => {
  return extractTargetFromProxyUrl(url) ?? url;
};

type HomeRoute = RouteProp<RootTabParamList, 'Home'>;

const PRIVACY_QUOTES = [
  { text: "Privacy is not an option, it is a prerequisite.", author: "Philip Zimmermann" },
  { text: "Arguing that you don't care about privacy because you have nothing to hide is like saying you don't care about free speech because you have nothing to say.", author: "Edward Snowden" },
  { text: "Privacy is not about having something to hide. It's about having something to protect.", author: null },
  { text: "Privacy is the power to selectively reveal oneself to the world.", author: "Eric Hughes" },
  { text: "In a digital world, privacy isn't just a right—it is a necessity.", author: null },
];

// Error states the proxy / WebView can surface
type ProxyError = 'blocked' | 'unreachable' | 'invalid' | null;

export default function BrowserScreen() {
  const inputRef = useRef<TextInput>(null);
  const lastHistoryUrl = useRef('');

  const route = useRoute<HomeRoute>();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const {
    tabs,
    activeTabId,
    createTab,
    updateTab,
    registerWebViewRef,
    reloadActiveTab,
    privacyMode,
    togglePrivacyMode,
  } = useBrowserNav();

  // Derived state from active tab
  const activeTab = tabs.find((t) => t.id === activeTabId) || null;
  const url = activeTab ? activeTab.url : '';
  const pageTitle = activeTab ? activeTab.title : '';
  const hasNavigated = activeTab ? activeTab.hasNavigated : false;
  const showIdle = !hasNavigated;

  // Display URL = decoded real URL (strips proxy wrapper for address bar)
  const displayUrl = getDisplayUrl(url);

  const [draft, setDraft] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [proxyError, setProxyError] = useState<ProxyError>(null);
  const [quote, setQuote] = useState(() => {
    const randomIndex = Math.floor(Math.random() * PRIVACY_QUOTES.length);
    return PRIVACY_QUOTES[randomIndex];
  });

  // Animation values for webview switching and progress bar
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const barOpacity = useRef(new Animated.Value(0)).current;
  // Subtle pulse animation for the shield icon when privacy mode is on
  const shieldPulse = useRef(new Animated.Value(1)).current;

  const isBookmarked = bookmarks.some((b) => b.url === displayUrl);

  // Pulse the shield gently when privacy mode is toggled on
  useEffect(() => {
    if (!privacyMode) return;
    Animated.sequence([
      Animated.timing(shieldPulse, { toValue: 1.25, duration: 200, useNativeDriver: true }),
      Animated.timing(shieldPulse, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [privacyMode]);

  /**
   * Core URL navigation — applies proxy wrapping when Privacy Mode is on.
   * The tab stores the proxy URL (or real URL in direct mode), but the
   * address bar always decodes back to the real URL via getDisplayUrl().
   */
  const openUrl = useCallback((targetUrl: string, title?: string) => {
    setProxyError(null);
    const webViewUrl = privacyMode ? buildProxyUrl(targetUrl) : targetUrl;

    if (activeTabId) {
      updateTab(activeTabId, {
        url: webViewUrl,
        title: title || targetUrl,
        hasNavigated: true,
      });
    } else {
      createTab(webViewUrl, title || targetUrl);
    }
    setDraft('');
  }, [activeTabId, updateTab, createTab, privacyMode]);

  useEffect(() => {
    getBookmarks().then(setBookmarks);
  }, []);

  // Update draft whenever active tab changes or its URL navigates
  useEffect(() => {
    if (!isEditing && activeTab) {
      // Always show the real URL in the input, not the proxy-wrapped one
      setDraft(getDisplayUrl(activeTab.url));
    }
  }, [activeTabId, activeTab?.url, isEditing]);

  // Animate tab switching transition (fade and subtle scale)
  useEffect(() => {
    if (!hasNavigated) return;
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [activeTabId, hasNavigated]);

  useFocusEffect(
    useCallback(() => {
      const params = route.params;
      if (params?.url) {
        openUrl(params.url, params.title);
        navigation.setParams({ url: undefined, title: undefined, t: undefined });
      }
      const randomIndex = Math.floor(Math.random() * PRIVACY_QUOTES.length);
      setQuote(PRIVACY_QUOTES[randomIndex]);
    }, [route.params?.t, route.params?.url, route.params?.title, openUrl, navigation])
  );

  const startEditing = () => {
    setDraft(hasNavigated ? displayUrl : '');
    setIsEditing(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const cancelEditing = () => setIsEditing(false);

  const handleSubmit = useCallback(() => {
    const target = buildTargetUrl(draft);
    if (!target) {
      setIsEditing(false);
      return;
    }
    setIsEditing(false);
    openUrl(target);
  }, [draft, openUrl]);

  const handleLoadStart = (tabId: string) => {
    if (tabId !== activeTabId) return;
    setProxyError(null);
    progress.setValue(0);
    Animated.timing(barOpacity, { toValue: 1, duration: 120, useNativeDriver: true }).start();
  };

  const handleLoadProgress = (tabId: string, { nativeEvent }: any) => {
    if (tabId !== activeTabId) return;
    Animated.timing(progress, {
      toValue: nativeEvent.progress,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const handleLoadEnd = (tabId: string) => {
    if (tabId !== activeTabId) return;
    Animated.timing(progress, { toValue: 1, duration: 150, useNativeDriver: false }).start(() => {
      Animated.timing(barOpacity, {
        toValue: 0,
        duration: 250,
        delay: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  /**
   * WebView HTTP error handler — catches proxy-specific error responses
   * (403 blocked, 502 unreachable) and surfaces a friendly inline banner.
   */
  const handleHttpError = (tabId: string, { nativeEvent }: any) => {
    if (tabId !== activeTabId || !privacyMode) return;
    const statusCode = nativeEvent?.statusCode;
    if (statusCode === 403) {
      setProxyError('blocked');
    } else if (statusCode === 502 || statusCode === 504) {
      setProxyError('unreachable');
    } else if (statusCode === 400) {
      setProxyError('invalid');
    }
  };

  const handleWebViewError = (tabId: string) => {
    if (tabId !== activeTabId) return;
    if (privacyMode) {
      setProxyError('unreachable');
    }
  };

  const recordHistory = useCallback((entryUrl: string, entryTitle: string) => {
    if (!entryUrl || entryUrl === lastHistoryUrl.current) return;
    // Store the real URL in history, not the proxy URL
    const realUrl = getDisplayUrl(entryUrl);
    lastHistoryUrl.current = realUrl;
    addHistoryEntry({ title: entryTitle || realUrl, url: realUrl });
  }, []);

  const handleNavStateChange = (tabId: string, navState: any) => {
    // Preserve the proxy-wrapped URL in tab state, but decode title from real URL
    const realUrl = getDisplayUrl(navState.url);
    updateTab(tabId, {
      url: navState.url,
      title: navState.title || realUrl,
      canGoBack: navState.canGoBack,
      canGoForward: navState.canGoForward,
    });

    if (!navState.loading && navState.url && tabId === activeTabId) {
      recordHistory(navState.url, navState.title || realUrl);
    }
  };

  const toggleBookmark = async () => {
    if (!hasNavigated || !displayUrl) return;

    const updated = isBookmarked
      ? await removeBookmark(displayUrl)
      : await addBookmark({ title: pageTitle || displayUrl, url: displayUrl });

    setBookmarks(updated);
  };

  const retryAfterError = () => {
    setProxyError(null);
    reloadActiveTab();
  };

  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />

      {!showIdle && (
        <View style={styles.toolbarRow}>
          <TouchableOpacity style={styles.iconButton} onPress={reloadActiveTab} activeOpacity={0.7}>
            <MaterialIcons name="refresh" size={20} color={COLORS.secondary} />
          </TouchableOpacity>

          {isEditing ? (
            <TextInput
              ref={inputRef}
              style={styles.addressInput}
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={handleSubmit}
              onBlur={cancelEditing}
              placeholder="Search or enter URL"
              placeholderTextColor={COLORS.outline}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              selectTextOnFocus
            />
          ) : (
            <AddressPill
              displayText={hasNavigated ? displayUrl : ''}
              placeholder="Search or enter URL"
              onPress={startEditing}
              privacyMode={privacyMode}
            />
          )}

          {/* Privacy Mode Toggle — shield icon */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={togglePrivacyMode}
            activeOpacity={0.7}
            accessibilityLabel={privacyMode ? 'Disable Privacy Mode' : 'Enable Privacy Mode'}
            accessibilityRole="button"
          >
            <Animated.View style={{ transform: [{ scale: shieldPulse }] }}>
              <MaterialCommunityIcons
                name={privacyMode ? 'shield-check' : 'shield-off-outline'}
                size={20}
                color={privacyMode ? COLORS.privacyActive : COLORS.privacyInactive}
              />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={toggleBookmark} disabled={!hasNavigated} activeOpacity={0.7}>
            <MaterialIcons
              name={isBookmarked ? 'star' : 'star-border'}
              size={20}
              color={isBookmarked ? COLORS.primary : COLORS.secondary}
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.webviewContainer}>
        {!showIdle && (
          <Animated.View style={[styles.loadingBarTrack, { opacity: barOpacity }]} pointerEvents="none">
            <Animated.View
              style={[
                styles.loadingBarFill,
                {
                  width: barWidth,
                  backgroundColor: privacyMode ? COLORS.privacyActive : COLORS.primary,
                },
              ]}
            />
          </Animated.View>
        )}

        {/* Inline Proxy Error Banner */}
        {proxyError !== null && (
          <View style={styles.errorBanner}>
            <MaterialCommunityIcons
              name={proxyError === 'blocked' ? 'shield-alert' : 'wifi-off'}
              size={22}
              color={COLORS.errorText}
            />
            <View style={styles.errorTextBlock}>
              <Text style={styles.errorTitle}>
                {proxyError === 'blocked'
                  ? 'Request Blocked'
                  : proxyError === 'unreachable'
                  ? 'Proxy Unreachable'
                  : 'Invalid Request'}
              </Text>
              <Text style={styles.errorSubtitle}>
                {proxyError === 'blocked'
                  ? 'This destination is on the privacy blocklist.'
                  : proxyError === 'unreachable'
                  ? 'Could not reach the backend proxy. Check that the server is running.'
                  : 'The URL could not be processed by the proxy.'}
              </Text>
            </View>
            <TouchableOpacity onPress={retryAfterError} style={styles.retryButton} activeOpacity={0.7}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          if (!tab.hasNavigated) return null;

          return (
            <Animated.View
              key={tab.id}
              pointerEvents={isActive ? 'auto' : 'none'}
              style={[
                styles.webviewWrapper,
                !isActive && styles.webviewHidden,
                isActive && {
                  opacity: fadeAnim,
                  transform: [
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.97, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <WebView
                ref={(ref) => registerWebViewRef(tab.id, ref)}
                style={styles.webview}
                source={{ uri: tab.url }}
                onLoadStart={() => handleLoadStart(tab.id)}
                onLoadProgress={(e) => handleLoadProgress(tab.id, e)}
                onLoadEnd={() => handleLoadEnd(tab.id)}
                onNavigationStateChange={(navState) => handleNavStateChange(tab.id, navState)}
                onHttpError={(e) => handleHttpError(tab.id, e)}
                onError={() => handleWebViewError(tab.id)}
              />
            </Animated.View>
          );
        })}

        {showIdle && (
          <View style={styles.idleOverlay}>
            <Text style={styles.idleTitle}>NOTRACE</Text>

            {/* Privacy Mode badge on idle screen */}
            <TouchableOpacity
              style={[
                styles.privacyBadge,
                privacyMode ? styles.privacyBadgeActive : styles.privacyBadgeInactive,
              ]}
              onPress={togglePrivacyMode}
              activeOpacity={0.75}
            >
              <MaterialCommunityIcons
                name={privacyMode ? 'shield-check' : 'shield-off-outline'}
                size={14}
                color={privacyMode ? COLORS.privacyActive : COLORS.outline}
              />
              <Text style={[styles.privacyBadgeText, { color: privacyMode ? COLORS.privacyActive : COLORS.outline }]}>
                {privacyMode ? 'Privacy Mode · ON' : 'Privacy Mode · OFF'}
              </Text>
            </TouchableOpacity>

            <View style={styles.idleInputContainer}>
              <MaterialIcons name="search" size={20} color={COLORS.outline} style={styles.idleSearchIcon} />
              <TextInput
                style={styles.idleInput}
                value={draft}
                onChangeText={setDraft}
                onSubmitEditing={handleSubmit}
                placeholder="Search or enter URL"
                placeholderTextColor={COLORS.outline}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="go"
              />
            </View>
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>"{quote.text}"</Text>
              {quote.author && <Text style={styles.quoteAuthor}>— {quote.author}</Text>}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 2,
  },
  iconButton: { padding: 8 },
  addressInput: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLow,
    color: COLORS.onBackground,
    fontSize: 13,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    marginHorizontal: 4,
  },
  webviewContainer: { flex: 1, position: 'relative' },
  webview: { flex: 1 },
  webviewWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  webviewHidden: {
    opacity: 0,
    pointerEvents: 'none',
    width: 0,
    height: 0,
  },
  loadingBarTrack: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 10 },
  loadingBarFill: { height: 2 },
  // Error banner
  errorBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.errorBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.errorBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  errorTextBlock: { flex: 1 },
  errorTitle: { color: COLORS.errorText, fontSize: 13, fontWeight: '700' },
  errorSubtitle: { color: COLORS.secondary, fontSize: 12, marginTop: 2, lineHeight: 17 },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
  },
  retryText: { color: COLORS.errorText, fontSize: 12, fontWeight: '600' },
  // Idle screen
  idleOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  idleTitle: { color: COLORS.primary, fontSize: 22, fontWeight: '800', letterSpacing: -0.5, marginBottom: 12 },
  // Privacy badge (idle screen)
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    borderWidth: 1,
    marginBottom: 20,
  },
  privacyBadgeActive: {
    borderColor: 'rgba(74, 222, 128, 0.3)',
    backgroundColor: 'rgba(74, 222, 128, 0.08)',
  },
  privacyBadgeInactive: {
    borderColor: COLORS.outlineVariant,
    backgroundColor: 'transparent',
  },
  privacyBadgeText: { fontSize: 12, fontWeight: '600', letterSpacing: 0.3 },
  idleInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  idleSearchIcon: {
    marginRight: 8,
  },
  idleInput: {
    flex: 1,
    color: COLORS.onBackground,
    fontSize: 14,
    paddingVertical: 0,
  },
  quoteContainer: {
    marginTop: 48,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  quoteText: {
    color: 'rgba(200, 198, 197, 0.7)',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
  },
  quoteAuthor: {
    color: COLORS.outline,
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
});
