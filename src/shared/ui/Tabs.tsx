import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { tokens } from '../lib/theme';

export type TabOption = {
  label: string;
  value: string;
};

interface TabsProps {
  options: TabOption[];
  activeValue: string;
  onChange: (value: any) => void;
}

export default function Tabs({ options, activeValue, onChange }: TabsProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isActive = activeValue === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onChange(option.value)}
            activeOpacity={0.8}
          >
            <Text style={[styles.text, isActive && styles.activeText]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: tokens.radius.round,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    marginHorizontal: tokens.spacing.md,
    marginVertical: tokens.spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: tokens.radius.round,
  },
  activeTab: {
    backgroundColor: tokens.colors.brand,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: tokens.colors.unselectedText,
  },
  activeText: {
    color: tokens.colors.brandText,
  },
});