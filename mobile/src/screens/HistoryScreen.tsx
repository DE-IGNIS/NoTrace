import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '../navigation/types';

import EntryCard from '../../components/EntryCard';
import {
  HistoryEntry,
  getHistory,
  clearHistory,
  formatVisitedAt,
} from '../../utils/historyStorage';
import { openInBrowser } from '../../utils/openInBrowser';

const COLORS = {
  background: '#141313',
  surfaceContainerLowest: '#0e0e0e',
  surfaceContainerHigh: '#2a2a2a',
  primary: '#eeeded',
  secondary: '#c8c6c5',
  onSurfaceVariant: '#c4c7c7',
  outline: '#8e9192',
  border: '#222222',
};

type AnimatedHistoryItem = HistoryEntry & { opacity: Animated.Value };

export default function HistoryScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [history, setHistory] = useState<AnimatedHistoryItem[]>([]);
  const [clearing, setClearing] = useState(false);
  const [caretVisible, setCaretVisible] = useState(true);
  const caretInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadHistory = useCallback(async () => {
    const data = await getHistory();
    setHistory(
      data.map((entry) => ({
        ...entry,
        opacity: new Animated.Value(1),
      }))
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();

      caretInterval.current = setInterval(() => {
        setCaretVisible((prev) => !prev);
      }, 500);

      return () => {
        if (caretInterval.current) clearInterval(caretInterval.current);
      };
    }, [loadHistory])
  );

  const handleClearHistory = async () => {
    if (clearing || history.length === 0) return;

    setClearing(true);

    await new Promise<void>((resolve) => {
      Animated.stagger(
        60,
        history.map((item) =>
          Animated.timing(item.opacity, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
          })
        )
      ).start(() => resolve());
    });

    await clearHistory();
    setHistory([]);
    setClearing(false);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.heroTitleRow}>
            <View style={styles.heroBar} />
            <Text style={styles.heroTitle}>SESSION LOG</Text>
          </View>
          <View style={styles.heroSubtitleRow}>
            <Text style={styles.heroSubtitle}>BROWSING HISTORY</Text>
            <View style={[styles.caret, { opacity: caretVisible ? 1 : 0 }]} />
          </View>
        </View>

        {history.length > 0 && (
          <TouchableOpacity
            style={[styles.clearButton, clearing && styles.clearButtonDisabled]}
            onPress={handleClearHistory}
            disabled={clearing}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="delete-outline"
              size={18}
              color={clearing ? COLORS.outline : COLORS.primary}
            />
            <Text style={[styles.clearButtonText, clearing && styles.clearButtonTextDisabled]}>
              {clearing ? 'CLEARING...' : 'CLEAR HISTORY'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.cardList}>
          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="history"
                size={28}
                color={COLORS.outline}
              />
              <Text style={styles.emptyText}>No browsing history yet</Text>
              <Text style={styles.emptyHint}>
                Pages you visit in the browser will appear here automatically.
              </Text>
            </View>
          ) : (
            history.map((item, index) => (
              <Animated.View key={item.id} style={{ opacity: item.opacity }}>
                <EntryCard
                  title={item.title}
                  subtitle={`${formatVisitedAt(item.visitedAt)} · ${item.url}`}
                  featured={index === 0}
                  leadingIcon="history"
                  onPress={() => openInBrowser(navigation, item.url, item.title)}
                />
              </Animated.View>
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
    marginBottom: 32,
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

  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'flex-end',
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  clearButtonDisabled: {
    opacity: 0.6,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.1,
    color: COLORS.primary,
  },
  clearButtonTextDisabled: {
    color: COLORS.outline,
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
