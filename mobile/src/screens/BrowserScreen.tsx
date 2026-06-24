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
import { MaterialIcons } from '@expo/vector-icons';
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

export default function BrowserScreen() {
  const webviewRef = useRef<WebView>(null);
  const inputRef = useRef<TextInput>(null);
  const lastHistoryUrl = useRef('');

  const route = useRoute<HomeRoute>();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { setNavState, registerControls } = useBrowserNav();

  const [hasNavigated, setHasNavigated] = useState(false);
  const [url, setUrl] = useState('');
  const [draft, setDraft] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showIdle, setShowIdle] = useState(true);
  const [webViewKey, setWebViewKey] = useState(0);

  const progress = useRef(new Animated.Value(0)).current;
  const barOpacity = useRef(new Animated.Value(0)).current;

  const isBookmarked = bookmarks.some((b) => b.url === url);

  const openUrl = useCallback((targetUrl: string, title?: string) => {
    setUrl(targetUrl);
    setPageTitle(title || targetUrl);
    setHasNavigated(true);
    setShowIdle(false);
    setDraft('');
    setWebViewKey((key) => key + 1);
    lastHistoryUrl.current = '';
  }, []);

  useEffect(() => {
    getBookmarks().then(setBookmarks);

    registerControls({
      goBack: () => {
        setShowIdle(false);
        webviewRef.current?.goBack();
      },
      goForward: () => {
        setShowIdle(false);
        webviewRef.current?.goForward();
      },
      goHome: () => {
        setShowIdle(true);
        setDraft('');
      },
    });
  }, [registerControls]);

  useFocusEffect(
    useCallback(() => {
      const params = route.params;
      if (params?.url) {
        openUrl(params.url, params.title);
        navigation.setParams({ url: undefined, title: undefined, t: undefined });
        return;
      }

      if (hasNavigated && url) {
        setShowIdle(false);
      }
    }, [route.params?.t, route.params?.url, route.params?.title, hasNavigated, url, openUrl, navigation])
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

  const handleLoadStart = () => {
    progress.setValue(0);
    Animated.timing(barOpacity, { toValue: 1, duration: 120, useNativeDriver: true }).start();
  };

  const handleLoadProgress = ({ nativeEvent }: any) => {
    Animated.timing(progress, {
      toValue: nativeEvent.progress,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const handleLoadEnd = () => {
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

  const handleNavStateChange = (navState: any) => {
    setUrl(navState.url);
    setPageTitle(navState.title || navState.url);
    setNavState({ canGoBack: navState.canGoBack, canGoForward: navState.canGoForward });

    if (!navState.loading && navState.url) {
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
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />

      {!showIdle && (
        <View style={styles.toolbarRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => webviewRef.current?.reload()} activeOpacity={0.7}>
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

        {hasNavigated && (
          <WebView
            key={webViewKey}
            ref={webviewRef}
            style={[styles.webview, showIdle && styles.webviewHidden]}
            source={{ uri: url }}
            onLoadStart={handleLoadStart}
            onLoadProgress={handleLoadProgress}
            onLoadEnd={handleLoadEnd}
            onNavigationStateChange={handleNavStateChange}
          />
        )}

        {showIdle && (
          <View style={styles.idleOverlay}>
            <Text style={styles.idleTitle}>NOTRACE</Text>
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
  webviewHidden: { opacity: 0, pointerEvents: 'none' },
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
  idleInput: {
    width: '100%',
    backgroundColor: COLORS.surfaceContainerLow,
    color: COLORS.onBackground,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 9999,
    textAlign: 'center',
  },
});
