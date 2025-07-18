import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Avatar } from './Avatar';
import { Story } from '@/types';
import { colors, spacing, typography, borderRadius } from '@/constants/colors';
import { getCurrentUser } from '@/mocks/users';

interface StoryListProps {
  stories: Story[];
  onStoryPress: (storyId: string) => void;
}

export const StoryList: React.FC<StoryListProps> = ({ stories, onStoryPress }) => {
  const currentUser = getCurrentUser();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add Story Button */}
        <TouchableOpacity style={styles.storyItem} activeOpacity={0.8}>
          <View style={styles.addStoryContainer}>
            <Avatar uri={currentUser.avatar} size={64} borderWidth={2} />
            <View style={styles.plusIconContainer}>
              <Plus size={16} color={colors.textInverse} />
            </View>
          </View>
          <Text style={styles.username} numberOfLines={1}>
            Your Story
          </Text>
        </TouchableOpacity>

        {/* Stories */}
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={styles.storyItem}
            onPress={() => onStoryPress(story.id)}
            activeOpacity={0.8}
          >
            <Avatar
              uri={story.user?.avatar || ''}
              size={64}
              hasStory
              seen={story.seen}
              borderWidth={2}
            />
            <Text style={styles.username} numberOfLines={1}>
              {story.user?.username}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  storyItem: {
    alignItems: 'center',
    width: 80,
  },
  addStoryContainer: {
    position: 'relative',
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  username: {
    marginTop: spacing.sm,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
});