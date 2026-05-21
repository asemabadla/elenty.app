import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  fullWidth = false,
}) => {
  const getButtonStyle = () => {
    const baseStyle: any[] = [styles.button, (styles as any)[`${size}Button`]];
    
    if (fullWidth) baseStyle.push(styles.fullWidth);
    if (disabled) baseStyle.push(styles.disabled);
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primaryButton];
      case 'secondary':
        return [...baseStyle, styles.secondaryButton];
      case 'outline':
        return [...baseStyle, styles.outlineButton];
      case 'ghost':
        return [...baseStyle, styles.ghostButton];
      case 'danger':
        return [...baseStyle, styles.dangerButton];
      default:
        return [...baseStyle, styles.primaryButton];
    }
  };

  const getTextStyle = () => {
    const baseStyle: any[] = [styles.text, (styles as any)[`${size}Text`]];
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primaryText];
      case 'secondary':
        return [...baseStyle, styles.secondaryText];
      case 'outline':
        return [...baseStyle, styles.outlineText];
      case 'ghost':
        return [...baseStyle, styles.ghostText];
      case 'danger':
        return [...baseStyle, styles.dangerText];
      default:
        return [...baseStyle, styles.primaryText];
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textInverse}
          size="small"
        />
      );
    }

    const textElement = (
      <Text style={[getTextStyle(), textStyle]}>
        {title}
      </Text>
    );

    if (!icon) return textElement;

    return iconPosition === 'left' ? (
      <>
        {icon}
        {textElement}
      </>
    ) : (
      <>
        {textElement}
        {icon}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  
  // Sizes
  smButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  mdButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  lgButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  
  // Variants
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  dangerButton: {
    backgroundColor: colors.error,
  },
  
  // Text styles
  text: {
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
  },
  smText: {
    fontSize: typography.sizes.sm,
  },
  mdText: {
    fontSize: typography.sizes.base,
  },
  lgText: {
    fontSize: typography.sizes.lg,
  },
  
  // Text colors
  primaryText: {
    color: colors.textInverse,
  },
  secondaryText: {
    color: colors.textInverse,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  dangerText: {
    color: colors.textInverse,
  },
  
  // States
  disabled: {
    backgroundColor: colors.inactive,
    borderColor: colors.inactive,
    opacity: 0.6,
  },
  fullWidth: {
    width: '100%',
  },
});