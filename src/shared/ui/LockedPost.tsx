import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens } from '../lib/theme';

export default function LockedPost() {
  return (
    <View style={styles.container}>
      <Text style={styles.lockIcon}>🔒</Text>
      <Text style={styles.title}>Эксклюзивный контент</Text>
      <Text style={styles.subtitle}>Этот пост доступен только платным подписчикам</Text>
      <View style={styles.buttonPlaceholder}>
        <Text style={styles.buttonText}>Подписаться</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.surface, // Используем токены
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.lg,
    alignItems: 'center',
    marginTop: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderStyle: 'dashed',
  },
  lockIcon: { fontSize: 24, marginBottom: tokens.spacing.sm },
  title: { fontSize: 16, fontWeight: '700', color: tokens.colors.primary },
  subtitle: { 
    fontSize: 12, 
    color: tokens.colors.secondary, 
    textAlign: 'center', 
    marginTop: tokens.spacing.xs 
  },
  buttonPlaceholder: {
    marginTop: tokens.spacing.md,
    backgroundColor: tokens.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radius.round,
  },
  buttonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});