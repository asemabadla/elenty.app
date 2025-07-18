import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  borderRadius?: keyof typeof borderRadius;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'lg',
  shadow = 'sm',
  borderRadius: borderRadiusSize = 'lg',
}) => {
  return (
    <View
      style={[
        styles.card,
        { 
          padding: spacing[padding],
          borderRadius: borderRadius[borderRadiusSize],
        },
        shadow !== 'none' && shadows[shadow],
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
});