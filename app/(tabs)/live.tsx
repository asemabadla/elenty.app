import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Radio, Users, Eye, Play } from 'lucide-react-native';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { mockUsers } from '@/mocks/users';

const { width } = Dimensions.get('window');

// Mock live streams data
const mockLiveStreams = [
  {
    id: '1',
    userId: '2',
    user: mockUsers.find(u => u.id === '2'),
    title: 'Sunset Photography Tips',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    viewers: 1234,
    isLive: true,
    category: 'Photography',
  },
  {
    id: '2',
    userId: '4',
    user: mockUsers.find(u => u.id === '4'),
    title: 'Fashion Week Behind the Scenes',
    thumbnail: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    viewers: 2567,
    isLive: true,
    category: 'Fashion',
  },
  {
    id: '3',
    userId: '5',
    user: mockUsers.find(u => u.id === '5'),
    title: 'Morning Workout Session',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    viewers: 892,
    isLive: true,
    category: 'Fitness',
  },
  {
    id: '4',
    userId: '6',
    user: mockUsers.find(u => u.id === '6'),
    title: 'Cooking Italian Pasta',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    viewers: 1456,
    isLive: false,
    category: 'Cooking',
  },
];

const categories = ['All', 'Photography', 'Fashion', 'Fitness', 'Cooking', 'Music', 'Gaming'];

export default function LiveScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();

  const filteredStreams = selectedCategory === 'All' 
    ? mockLiveStreams 
    : mockLiveStreams.filter(stream => stream.category === selectedCategory);

  const handleStreamPress = (streamId: string) => {
    router.push(`/live-stream/${streamId}`);
  };

  const handleGoLive = () => {
    router.push('/live-studio');
  };

  const renderStreamItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.streamCard}
      onPress={() => handleStreamPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        {item.isLive && (
          <View style={styles.liveIndicator}>
            <Radio size={12} color="white" />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
        {!item.isLive && (
          <View style={styles.playButton}>
            <Play size={20} color="white" fill="white" />
          </View>
        )}
        <View style={styles.viewersContainer}>
          <Eye size={12} color="white" />
          <Text style={styles.viewersText}>{item.viewers}</Text>
        </View>
      </View>
      
      <View style={styles.streamInfo}>
        <View style={styles.userInfo}>
          <Avatar uri={item.user?.avatar || ''} size={32} />
          <View style={styles.userDetails}>
            <Text style={styles.streamTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.username}>{item.user?.username}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Streams</Text>
        <Button
          title="Go Live"
          onPress={handleGoLive}
          size="small"
          icon={<Radio size={16} color="white" />}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item && styles.selectedCategoryText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <FlatList
        data={filteredStreams}
        keyExtractor={item => item.id}
        renderItem={renderStreamItem}
        numColumns={2}
        contentContainerStyle={styles.streamsList}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  categoriesContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.border,
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
  },
  streamsList: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  streamCard: {
    width: (width - 32) / 2,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  liveIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.notification,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewersContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  viewersText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 2,
  },
  streamInfo: {
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userDetails: {
    flex: 1,
    marginLeft: 8,
  },
  streamTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  username: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});