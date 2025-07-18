import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Phone } from 'lucide-react-native';
import { Post } from '@/components/Post';
import { StoryList } from '@/components/StoryList';
import { useSocialStore } from '@/store/social-store';
import { colors, spacing, borderRadius, shadows } from '@/constants/colors';
import { getCurrentUser } from '@/mocks/users';

export default function HomeScreen() {
  const { posts, stories, markStorySeen, loadFeed, loadStories } = useSocialStore();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Load initial data
  useEffect(() => {
    const currentUser = getCurrentUser();
    loadFeed(currentUser.id);
    loadStories(currentUser.id);
  }, []);

  const handleStoryPress = (storyId: string) => {
    markStorySeen(storyId);
    router.push(`/story/${storyId}`);
  };

  const handlePostPress = (postId: string) => {
    console.log('Post pressed:', postId);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const currentUser = getCurrentUser();
    await Promise.all([
      loadFeed(currentUser.id),
      loadStories(currentUser.id)
    ]);
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.phoneButton}
        onPress={() => router.push('/phone')}
        activeOpacity={0.8}
      >
        <Phone size={20} color={colors.textInverse} />
      </TouchableOpacity>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Post post={item} onPress={() => handlePostPress(item.id)} />
        )}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <StoryList stories={stories} onStoryPress={handleStoryPress} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  phoneButton: {
    position: 'absolute',
    top: 60,
    right: spacing.lg,
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    ...shadows.lg,
  },
});