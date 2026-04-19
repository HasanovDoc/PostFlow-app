import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { tokens } from '../lib/theme';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function Input({ placeholder, value, onChangeText }: InputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={tokens.colors.secondary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.inputBg,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
    height: 48,
    justifyContent: 'center',
    marginVertical: tokens.spacing.xs,
  },
  input: {
    fontSize: 14,
    color: tokens.colors.primary,
  },
});