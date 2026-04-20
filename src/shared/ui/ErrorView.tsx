import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { tokens } from '../lib/theme';

interface ErrorViewProps {
  onRetry: () => void;
  title?: string;
}

export default function ErrorView({ onRetry, title = "Не удалось загрузить публикацию" }: ErrorViewProps) {
  return (
    <View style={styles.screen}>
      <View>
        <View style={styles.content}>
          <Image 
            source={require('../../../assets/axolot.png')} 
            style={styles.image}
            resizeMode="contain"
          />
          
          <Text style={styles.title}>{title}</Text>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={onRetry} 
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F7FB',
    paddingHorizontal: tokens.spacing.md,
    justifyContent: 'flex-start',
  },
  content: {
    alignItems: 'center',
  },
  image: {
    width: 160,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: tokens.colors.brand,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});