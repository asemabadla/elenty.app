import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Sparkles, Phone, Heart } from 'lucide-react-native';
import { colors, spacing, typography } from '@/constants/colors';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  style,
  showTagline = false 
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { 
          fontSize: typography.sizes.xl, 
          iconSize: 18, 
          spacing: spacing.sm,
          iconContainer: 32,
        };
      case 'medium':
        return { 
          fontSize: typography.sizes.xxxl, 
          iconSize: 24, 
          spacing: spacing.md,
          iconContainer: 40,
        };
      case 'large':
        return { 
          fontSize: typography.sizes.xxxxl, 
          iconSize: 32, 
          spacing: spacing.lg,
          iconContainer: 48,
        };
      default:
        return { 
          fontSize: typography.sizes.xxxl, 
          iconSize: 24, 
          spacing: spacing.md,
          iconContainer: 40,
        };
    }
  };

  const { fontSize, iconSize, spacing: logoSpacing, iconContainer } = getSize();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.logoContainer}>
        <View style={[
          styles.iconContainer, 
          { 
            marginRight: logoSpacing,
            width: iconContainer,
            height: iconContainer,
          }
        ]}>
          <Sparkles size={iconSize} color={colors.primary} />
          <Phone 
            size={iconSize - 4} 
            color={colors.secondary} 
            style={styles.phoneIcon} 
          />
          <Heart 
            size={iconSize - 6} 
            color={colors.error} 
            style={styles.heartIcon} 
          />
        </View>
        <Text style={[styles.logoText, { fontSize }]}>
          <Text style={styles.primaryText}>Elenty</Text>
          <Text style={styles.secondaryText}>.app</Text>
        </Text>
      </View>
      {showTagline && (
        <Text style={styles.tagline}>
          تواصل، شارك، اتصل - كل شيء في مكان واحد
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  heartIcon: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  logoText: {
    fontWeight: typography.weights.bold,
  },
  primaryText: {
    color: colors.primary,
  },
  secondaryText: {
    color: colors.secondary,
  },
  tagline: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: typography.lineHeights.relaxed * typography.sizes.base,
  },
});