import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { tokens } from '../lib/theme';
import CommentIcon from '../assets/CommentIcon';

interface CommentButtonProps {
  count: number;
  onPress?: () => void;
}

export default function CommentButton({ count, onPress }: CommentButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <CommentIcon fill="#57626F" />
      <Text style={styles.count}>{count}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    paddingLeft: 6,
    paddingVertical: 6,
    borderRadius: tokens.radius.round,
    backgroundColor: tokens.colors.inputBg,
  },
  count: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: '700',
    color: tokens.colors.secondary,
  },
});