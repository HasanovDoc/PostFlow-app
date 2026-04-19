import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { tokens } from '../lib/theme';
import LikeIcon from '../assets/LikeIcon';

interface LikeButtonProps {
  count: number;
  isLiked: boolean;
  onPress: () => void;
}

export default function LikeButton({ count, isLiked, onPress }: LikeButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        isLiked ? styles.activeContainer : styles.inactiveContainer
      ]} 
      onPress={onPress}
    >
      <LikeIcon
        isLiked={isLiked}
        fill={isLiked ? "#FFFFFF" : "#57626F"}
      />
      <Text 
        style={[
          styles.count, 
          isLiked ? styles.activeCount : styles.inactiveCount
        ]}
      >
        {count}
      </Text>
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
    marginRight: tokens.spacing.sm,
  },
  inactiveContainer: {
    backgroundColor: tokens.colors.inputBg, 
  },
  inactiveCount: {
    color: tokens.colors.secondary,
  },
  activeContainer: {
    backgroundColor: tokens.colors.like,
  },
  activeCount: {
    color: "#FFFFFF",
  },
  count: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: '700',
  },
});