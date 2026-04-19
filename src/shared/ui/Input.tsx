import React from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { tokens } from '../lib/theme';
import SendIcon from '../assets/SendIcon';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSend?: () => void;
}

export default function Input({ placeholder, value, onChangeText, onSend }: InputProps) {
  const hasText = value.trim().length > 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={tokens.colors.secondary}
          value={value}
          onChangeText={onChangeText}
          multiline={false}
          underlineColorAndroid="transparent"
        />
      </View>

      {onSend && (
        <TouchableOpacity 
          onPress={onSend} 
          style={styles.sendButton}
          disabled={!hasText}
          activeOpacity={0.7}
        >
          <SendIcon 
            fill={hasText ? tokens.colors.brand : tokens.colors.brandInactive} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: tokens.colors.inputBg,
    borderRadius: tokens.radius.round,
    paddingHorizontal: tokens.spacing.md,
    height: 40,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    fontWeight: '500',
    color: tokens.colors.primary,
    paddingVertical: 0,
    height: '100%',
    ...Platform.select({
      web: {
        outlineStyle: 'none' as any,
        outlineWidth: 0,
      }
    })
  },
  sendButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  }
});