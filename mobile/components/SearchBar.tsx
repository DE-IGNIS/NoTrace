import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const COLORS = {
    background: '#141313',
    surface: '#141313',
    surfaceContainerLowest: '#0e0e0e',
    surfaceContainerLow: '#1c1b1b',
    surfaceContainer: '#201f1f',
    surfaceContainerHigh: '#2a2a2a',
    surfaceContainerHighest: '#353434',
    primary: '#eeeded',
    onPrimary: '#2f3131',
    secondary: '#c8c6c5',
    onBackground: '#e5e2e1',
    outline: '#8e9192',
    outlineVariant: '#444748',
    borderHairline: '#222222',
    borderActive: '#404040',
};


export default function SearchBar({ input, setInput, loadUrl }) {
    return (
        <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color={COLORS.secondary} />
            <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Search or enter URL"
                placeholderTextColor="rgba(200,198,197,0.5)"
                style={styles.searchInput}
                onSubmitEditing={loadUrl}
            />

            <View style={styles.searchActions}>
                <TouchableOpacity activeOpacity={0.7}>
                    <MaterialIcons name="mic" size={20} color={COLORS.secondary} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7}>
                    <MaterialIcons name="qr-code-scanner" size={20} color={COLORS.secondary} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: COLORS.surfaceContainerLow,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderHairline,
        paddingVertical: 14,
        paddingHorizontal: 18,
        marginBottom: 40,
    },
    searchInput: {
        flex: 1,
        color: COLORS.primary,
        fontSize: 14,
        padding: 0,
    },
    searchActions: {
        flexDirection: 'row',
        gap: 14,
    },
});