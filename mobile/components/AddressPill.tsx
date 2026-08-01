import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  surfaceContainerLow: '#1c1b1b',
  secondary: '#c8c6c5',
  primary: '#eeeded',
  borderHairline: '#222222',
  privacyActive: '#4ade80',
  privacyBorder: 'rgba(74, 222, 128, 0.25)',
};

interface AddressPillProps {
  displayText: string;
  placeholder: string;
  onPress: () => void;
  /** When true, shows a shield icon and a subtle green tint to signal Privacy Mode is active */
  privacyMode?: boolean;
}

const shortenUrl = (value: string) => {
  if (!value) return '';
  try {
    const u = new URL(value);
    return u.hostname.replace(/^www\./, '') + (u.pathname !== '/' ? u.pathname : '');
  } catch {
    return value;
  }
};

export default function AddressPill({ displayText, placeholder, onPress, privacyMode = false }: AddressPillProps) {
  const text = displayText ? shortenUrl(displayText) : placeholder;
  const hasUrl = !!displayText;

  return (
    <TouchableOpacity
      style={[
        styles.pill,
        privacyMode && hasUrl ? styles.pillPrivacy : undefined,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left icon: shield when privacy mode is on and navigated, lock otherwise */}
      {privacyMode && hasUrl ? (
        <MaterialCommunityIcons name="shield-check" size={15} color={COLORS.privacyActive} />
      ) : (
        <MaterialIcons name={hasUrl ? 'lock' : 'search'} size={16} color={COLORS.secondary} />
      )}

      <Text style={[styles.text, privacyMode && hasUrl ? styles.textPrivacy : undefined]} numberOfLines={1}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  pillPrivacy: {
    borderColor: COLORS.privacyBorder,
  },
  text: { flex: 1, color: COLORS.primary, fontSize: 13 },
  textPrivacy: { color: COLORS.primary },
});