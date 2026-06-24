import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  surfaceContainerLow: '#1c1b1b',
  surfaceContainerHigh: '#2a2a2a',
  primary: '#eeeded',
  onSurfaceVariant: '#c4c7c7',
  outline: '#8e9192',
  border: '#222222',
};

type Props = {
  title: string;
  subtitle: string;
  featured?: boolean;
  leadingIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress?: () => void;
};

export default function EntryCard({
  title,
  subtitle,
  featured = false,
  leadingIcon = 'web',
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, featured ? styles.cardFeatured : styles.cardDefault]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.cardTextWrap}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <MaterialCommunityIcons
          name={leadingIcon}
          size={20}
          color={featured ? COLORS.primary : COLORS.onSurfaceVariant}
        />
        <MaterialCommunityIcons name="open-in-new" size={20} color={COLORS.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  cardSubtitle: {
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
});
