import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '../navigation/types';

import EntryCard from '../../components/EntryCard';
import { Bookmark, getBookmarks } from '../../utils/bookmarkStorage';
import { openInBrowser } from '../../utils/openInBrowser';

const COLORS = {
  background: '#141313',
  surfaceContainerLowest: '#0e0e0e',
  primary: '#eeeded',
  secondary: '#c8c6c5',
  onSurfaceVariant: '#c4c7c7',
  outline: '#8e9192',
  border: '#222222',
};

export default function BookmarkScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [caretVisible, setCaretVisible] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;

      async function load() {
        const data = await getBookmarks();
        if (active) setBookmarks(data);
      }

      load();
      return () => {
        active = false;
      };
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCaretVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

        <View style={styles.cardList}>
          {bookmarks.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="star-outline"
                size={28}
                color={COLORS.outline}
              />
              <Text style={styles.emptyText}>No saved bookmarks yet</Text>
              <Text style={styles.emptyHint}>
                Tap the star on any page in the browser to save it here.
              </Text>
            </View>
          ) : (
            bookmarks.map((item, index) => (
              <EntryCard
                key={item.url}
                title={item.title}
                subtitle={item.url}
                featured={index === 0}
                leadingIcon="star"
                onPress={() => openInBrowser(navigation, item.url, item.title)}
              />
            ))
          )}
        </View>

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

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },

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

  cardList: {
    gap: 32,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceContainerLowest,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.secondary,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 13,
    color: COLORS.outline,
    textAlign: 'center',
    lineHeight: 20,
  },
});
