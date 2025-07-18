import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { colors, spacing, typography, borderRadius } from '@/constants/colors';
import { mockPosts } from '@/mocks/posts';

const { width } = Dimensions.get('window');
const numColumns = 3;
const itemSpacing = spacing.xs;
const tileSize = (width - (spacing.lg * 2) - (itemSpacing * (numColumns - 1))) / numColumns;

// Create a grid of images from posts
const exploreItems = [
  ...mockPosts.map(post => ({
    id: post.id,
    imageUrl: post.media[0].url,
    type: 'post',
  })),
  // Add some additional items
  {
    id: 'e1',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    type: 'post',
  },
  {
    id: 'e2',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    type: 'post',
  },
  {
    id: 'e3',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    type: 'post',
  },
  {
    id: 'e4',
    imageUrl: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    type: 'post',
  },
  {
    id: 'e5',
    imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    type: 'post',
  },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleItemPress = (id: string) => {
    console.log('Item pressed:', id);
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <Card style={styles.searchContainer} padding="md" shadow="none">
        <View style={styles.searchBar}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Card>

      {/* Grid */}
      <FlatList
        data={exploreItems}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.tile,
              {
                marginRight: (index + 1) % numColumns === 0 ? 0 : itemSpacing,
                marginBottom: itemSpacing,
              }
            ]}
            onPress={() => handleItemPress(item.id)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: typography.sizes.base,
    color: colors.text,
  },
  gridContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  tile: {
    width: tileSize,
    height: tileSize,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
});