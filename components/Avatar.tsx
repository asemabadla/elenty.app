import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors, borderRadius, shadows } from '@/constants/colors';

interface AvatarProps {
  uri: string;
  size?: number;
  hasStory?: boolean;
  seen?: boolean;
  style?: ViewStyle;
  borderWidth?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = 40,
  hasStory = false,
  seen = false,
  style,
  borderWidth = 0,
}) => {
  const storyRingSize = size + 8;
  const storyRingRadius = storyRingSize / 2;

  return (
    <View style={[styles.container, style]}>
      {hasStory && (
        <View
          style={[
            styles.storyRing,
            {
              width: storyRingSize,
              height: storyRingSize,
              borderRadius: storyRingRadius,
              borderColor: seen ? colors.inactive : colors.secondary,
            },
          ]}
        />
      )}
      <View
        style={[
          styles.avatarContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth,
            borderColor: colors.card,
          },
          shadows.sm,
        ]}
      >
        <Image
          source={{ uri }}
          style={[
            styles.avatar,
            {
              width: size - (borderWidth * 2),
              height: size - (borderWidth * 2),
              borderRadius: (size - (borderWidth * 2)) / 2,
            },
          ]}
          contentFit="cover"
          transition={200}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  avatar: {
    backgroundColor: colors.backgroundSecondary,
  },
  storyRing: {
    position: 'absolute',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});