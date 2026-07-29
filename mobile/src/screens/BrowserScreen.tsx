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

const COLORS = {
  background: '#141313',
  surfaceContainerLow: '#1c1b1b',
  primary: '#eeeded',
  secondary: '#c8c6c5',
  onBackground: '#e5e2e1',
  outline: '#8e9192',
  outlineVariant: '#444748',
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

type HomeRoute = RouteProp<RootTabParamList, 'Home'>;

const PRIVACY_QUOTES = [
  { text: "Privacy is not an option, it is a prerequisite.", author: "Philip Zimmermann" },
  { text: "Arguing that you don't care about privacy because you have nothing to hide is like saying you don't care about free speech because you have nothing to say.", author: "Edward Snowden" },
  { text: "Privacy is not about having something to hide. It's about having something to protect.", author: null },
  { text: "Privacy is the power to selectively reveal oneself to the world.", author: "Eric Hughes" },
  { text: "In a digital world, privacy isn't just a right—it is a necessity.", author: null },
];

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
  } = useBrowserNav();

  // Derived state from active tab
  const activeTab = tabs.find((t) => t.id === activeTabId) || null;
  const url = activeTab ? activeTab.url : '';
  const pageTitle = activeTab ? activeTab.title : '';
  const hasNavigated = activeTab ? activeTab.hasNavigated : false;
  const showIdle = !hasNavigated;

  const [draft, setDraft] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [quote, setQuote] = useState(() => {
    const randomIndex = Math.floor(Math.random() * PRIVACY_QUOTES.length);
    return PRIVACY_QUOTES[randomIndex];
  });

  // Animation values for webview switching and progress bar
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const barOpacity = useRef(new Animated.Value(0)).current;

  const isBookmarked = bookmarks.some((b) => b.url === url);

  const openUrl = useCallback((targetUrl: string, title?: string) => {
    if (activeTabId) {
      updateTab(activeTabId, {
        url: targetUrl,
        title: title || targetUrl,
        hasNavigated: true,
      });
    } else {
      createTab(targetUrl, title || targetUrl);
    }
    setDraft('');
  }, [activeTabId, updateTab, createTab]);

  useEffect(() => {
    getBookmarks().then(setBookmarks);
  }, []);

  // Update draft whenever active tab changes or its URL navigates
  useEffect(() => {
    if (!isEditing && activeTab) {
      setDraft(activeTab.url);
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
    setDraft(hasNavigated ? url : '');
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

  const recordHistory = useCallback((entryUrl: string, entryTitle: string) => {
    if (!entryUrl || entryUrl === lastHistoryUrl.current) return;
    lastHistoryUrl.current = entryUrl;
    addHistoryEntry({ title: entryTitle || entryUrl, url: entryUrl });
  }, []);

  const handleNavStateChange = (tabId: string, navState: any) => {
    updateTab(tabId, {
      url: navState.url,
      title: navState.title || navState.url,
      canGoBack: navState.canGoBack,
      canGoForward: navState.canGoForward,
    });

    if (!navState.loading && navState.url && tabId === activeTabId) {
      recordHistory(navState.url, navState.title || navState.url);
    }
  };

  const toggleBookmark = async () => {
    if (!hasNavigated || !url) return;

    const updated = isBookmarked
      ? await removeBookmark(url)
      : await addBookmark({ title: pageTitle || url, url });

    setBookmarks(updated);
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
              displayText={hasNavigated ? url : ''}
              placeholder="Search or enter URL"
              onPress={startEditing}
            />
          )}

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
            <Animated.View style={[styles.loadingBarFill, { width: barWidth }]} />
          </Animated.View>
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
              />
            </Animated.View>
          );
        })}

        {showIdle && (
          <View style={styles.idleOverlay}>
            <Text style={styles.idleTitle}>NOTRACE</Text>
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
              <Text style={styles.quoteText}>“{quote.text}”</Text>
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
  loadingBarFill: { height: 2, backgroundColor: COLORS.primary },
  idleOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  idleTitle: { color: COLORS.primary, fontSize: 22, fontWeight: '800', letterSpacing: -0.5, marginBottom: 16 },
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
