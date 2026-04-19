import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { tokens } from '../lib/theme';
import PaidIcon from '../assets/PaidIcon';

export default function LockedPost() {
  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.lockCircle}>
          <PaidIcon />
        </View>
        
        <Text style={styles.title}>Контент скрыт пользователем. Доступ откроется после доната</Text>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Отправить донат</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#2A2E32',
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.md,
  },
  lockCircle: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: tokens.colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    maxWidth: 236,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    color: tokens.colors.brandText,
    marginBottom: 13,
    textAlign: 'center',
  },
  button: {
    width: 239,
    height: 42,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.brand,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: 56.5,
    borderRadius: 14,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});