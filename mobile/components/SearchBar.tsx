import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ─────────────────────────────────────────────────────────
// Design tokens (mirrors the Tailwind config from the source mockup)
// ─────────────────────────────────────────────────────────
const COLORS = {
  background: '#141313',
  surface: '#141313',
  surfaceContainerLow: '#1c1b1b',
  surfaceContainerLowest: '#0e0e0e',
  surfaceContainerHigh: '#2a2a2a',
  surfaceContainerHighest: '#353434',
  primary: '#eeeded',
  secondary: '#c8c6c5',
  onBackground: '#e5e2e1',
  onSurfaceVariant: '#c4c7c7',
  outline: '#8e9192',
  border: '#222222',
  borderActive: '#404040',
};

const shortenUrl = (value: string) => {
  if (!value) return '';
  try {
    const u = new URL(value);
    return u.hostname.replace(/^www\./, '') + (u.pathname !== '/' ? u.pathname : '');
  } catch {
    return value;
  }
};

interface SearchProps {
  displayText: string;
  placeholder: string;
  onPress: () => void;
}

export default function SearchBar({ displayText, placeholder, onPress }: SearchProps) {
  const [query, setQuery] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const text = displayText ? shortenUrl(displayText) : placeholder;

  return (
    <View style={styles.screen}>
      <View>
        {/* ── Incognito Logo Section ─────────────────────── */}
        <View style={styles.logoSection}>
          <View style={styles.logoGlowWrap}>
            <MaterialCommunityIcons
              name="eye-outline"
              size={140}
              color={COLORS.primary}
            />
          </View>
          {/* To be replaced with a dynaimic mode option btw standard and incognito */}
          <Text style={styles.title}>Standard Mode</Text>
          <Text style={styles.subtitle}>END-TO-END ENCRYPTED</Text>
        </View>

        {/* ── Search Bar ──────────────────────────────────── */}
        <View style={styles.searchSection}>
          <View
            style={[
              styles.searchBar,
              inputFocused && styles.searchBarFocused,
            ]}
          >
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color={inputFocused ? COLORS.primary : COLORS.secondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search or enter URL"
              placeholderTextColor="rgba(200,198,197,0.5)"
              value={query}
              onChangeText={setQuery}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* ── Quote ───────────────────────────────────────── */}
        <View style={styles.quoteSection}>
          <Text style={styles.quoteText}>
            “Privacy is not an option, it is a prerequisite.”
          </Text>
          <View style={styles.quoteDivider} />
        </View>

        <View style={{ height: 96 }} />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceContainerHighest,
    backgroundColor: COLORS.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: COLORS.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  vpnBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: COLORS.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9999,
  },
  vpnDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  vpnBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  iconButton: {
    padding: 8,
    borderRadius: 4,
  },

  // Scroll content
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
    alignItems: 'center',
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },

  // Logo / hero section
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoGlowWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: COLORS.onBackground,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1.3,
    color: COLORS.secondary,
    textTransform: 'uppercase',
    marginTop: 8,
  },

  // Search bar
  searchSection: {
    width: '100%',
    maxWidth: 640,
    marginBottom: 64,
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.surfaceContainerLow,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: Platform.OS === 'ios' ? 18 : 14,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  searchBarFocused: {
    borderBottomColor: COLORS.primary,
  },
  searchIcon: {
    marginRight: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    letterSpacing: 0.5,
    color: COLORS.primary,
    paddingVertical: 0,
  },
  searchActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 12,
  },

  // Quote
  quoteSection: {
    width: '100%',
    maxWidth: 640,
    alignItems: 'center',
    paddingVertical: 48,
  },
  quoteText: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
    fontStyle: 'italic',
    color: 'rgba(200,198,197,0.8)',
    textAlign: 'center',
  },
  quoteDivider: {
    height: 1,
    width: 48,
    backgroundColor: 'rgba(238,237,237,0.2)',
    marginTop: 24,
  },

  // Terminal feed
  terminalWrapper: {
    width: '100%',
    maxWidth: 960,
    paddingHorizontal: 16,
  },
  terminalCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 16,
  },
  terminalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  terminalHeaderText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 1.1,
    color: COLORS.secondary,
    textTransform: 'uppercase',
  },
  terminalDots: {
    flexDirection: 'row',
    gap: 4,
  },
  terminalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  terminalBody: {
    minHeight: 96,
    gap: 4,
  },
  terminalLine: {
    fontSize: 11,
    letterSpacing: 0.3,
    color: 'rgba(200,198,197,0.8)',
  },
  terminalLineHighlight: {
    color: COLORS.primary,
  },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceContainerHighest,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  navLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: COLORS.secondary,
    marginTop: 4,
  },
  navLabelActive: {
    color: COLORS.primary,
  },
});