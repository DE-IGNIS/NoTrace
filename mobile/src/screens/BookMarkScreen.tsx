import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  background: '#141313',
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
};

// Bookmark vault entries
const BOOKMARKS = [
  {
    id: 'b1',
    title: 'TERMINAL_B3',
    url: 'https://onion.nodes.private/protocol_v3',
    icon: 'lock',
    featured: false,
  },
  {
    id: 'b2',
    title: 'SHADOW_REEL',
    url: 'https://notrace.cdn/v/internal/0XF4',
    icon: 'eye-off-outline',
    featured: false,
  },
  {
    id: 'b3',
    title: 'GHOST_SHELL',
    url: 'admin.shadow.protocol/control_panel',
    icon: 'shield-check',
    featured: true,
  },
  {
    id: 'b4',
    title: 'LEGACY_ROOT',
    url: 'file://system/vault/archive_2023',
    icon: 'folder-zip-outline',
    featured: false,
  },
  {
    id: 'b5',
    title: 'PROXY_GATE',
    url: 'https://tunnel.ntr.io/active_session',
    icon: 'file-document-outline',
    featured: false,
  },
];

export default function BookmarkScreen({ onOpenBookmark, onAddEntry }) {
  const [activeNav, setActiveNav] = useState('Saved');
  const [caretVisible, setCaretVisible] = useState(true);

  // Blinking terminal caret — replaces the CSS `caret-blink` step animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCaretVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.screen}>
      {/* ── Top App Bar ─────────────────────────────────── */}
      {/* <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name="shield-lock-outline"
            size={22}
            color={COLORS.primary}
          />
          <Text style={styles.logoText}>NOTRACE</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="key-variant"
            size={22}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View> */}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero / Section Header ───────────────────────── */}
        <View style={styles.heroSection}>
          <View style={styles.heroTitleRow}>
            <View style={styles.heroBar} />
            <Text style={styles.heroTitle}>SECURE VAULT</Text>
          </View>
          <View style={styles.heroSubtitleRow}>
            <Text style={styles.heroSubtitle}>REDACTED BOOKMARKS</Text>
            <View
              style={[
                styles.caret,
                { opacity: caretVisible ? 1 : 0 },
              ]}
            />
          </View>
        </View>

        {/* ── Bookmark Cards ──────────────────────────────── */}
        <View style={styles.cardList}>
          {BOOKMARKS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                item.featured ? styles.cardFeatured : styles.cardDefault,
              ]}
              activeOpacity={0.8}
              onPress={() => onOpenBookmark && onOpenBookmark(item)}
            >
              <View style={styles.cardTextWrap}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardUrl} numberOfLines={1}>
                  {item.url}
                </Text>
              </View>
              <View style={styles.cardActions}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={20}
                  color={item.featured ? COLORS.primary : COLORS.onSurfaceVariant}
                />
                <MaterialCommunityIcons
                  name="open-in-new"
                  size={20}
                  color={COLORS.primary}
                />
              </View>
            </TouchableOpacity>
          ))}

          {/* ── Add New Entry ─────────────────────────────── */}
          <TouchableOpacity
            style={styles.addCard}
            activeOpacity={0.8}
            onPress={() => onAddEntry && onAddEntry()}
          >
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color={COLORS.outline}
            />
            <Text style={styles.addCardText}>ADD ENTRY</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer so content clears the fixed bottom nav */}
        <View style={{ height: 96 }} />
      </ScrollView>

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
    gap: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: COLORS.primary,
  },
  iconButton: {
    padding: 8,
    borderRadius: 9999,
  },

  // Scroll content
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },

  // Hero
  heroSection: {
    marginBottom: 48,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  heroBar: {
    width: 8,
    height: 24,
    backgroundColor: COLORS.primary,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: COLORS.primary,
  },
  heroSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1.3,
    color: COLORS.onSurfaceVariant,
  },
  caret: {
    width: 8,
    height: 16,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },

  // Card list
  cardList: {
    gap: 32,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderWidth: 1,
    borderRadius: 4,
  },
  cardDefault: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderColor: COLORS.border,
  },
  cardFeatured: {
    backgroundColor: COLORS.surfaceContainerHigh,
    borderColor: COLORS.primary,
  },
  cardTextWrap: {
    gap: 8,
    flexShrink: 1,
    paddingRight: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: COLORS.primary,
  },
  cardUrl: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
    color: COLORS.outline,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  // Add entry card
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 4,
  },
  addCardText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1.3,
    color: COLORS.outline,
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
    color: COLORS.secondary,
    marginTop: 4,
  },
  navLabelActive: {
    color: COLORS.primary,
  },
});