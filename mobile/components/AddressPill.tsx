import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const COLORS = {
  surfaceContainerLow: '#1c1b1b',
  secondary: '#c8c6c5',
  primary: '#eeeded',
  borderHairline: '#222222',
};

interface AddressPillProps {
  displayText: string;
  placeholder: string;
  onPress: () => void;
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

export default function AddressPill({ displayText, placeholder, onPress }: AddressPillProps) {
  const text = displayText ? shortenUrl(displayText) : placeholder;

  return (
    <TouchableOpacity style={styles.pill} onPress={onPress} activeOpacity={0.7}>
      <MaterialIcons name={displayText ? 'lock' : 'search'} size={16} color={COLORS.secondary} />
      <Text style={styles.text} numberOfLines={1}>
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
  text: { flex: 1, color: COLORS.primary, fontSize: 13 },
});