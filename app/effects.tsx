import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Download, Heart, Sparkles } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2;

// Mock effects data
const mockEffects = [
  {
    id: '1',
    name: 'Beauty Glow',
    thumbnail: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Beauty',
    downloads: 12500,
    isPopular: true,
  },
  {
    id: '2',
    name: 'Neon Lights',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Artistic',
    downloads: 8900,
    isPopular: false,
  },
  {
    id: '3',
    name: 'Vintage Film',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Retro',
    downloads: 15600,
    isPopular: true,
  },
  {
    id: '4',
    name: 'Rainbow Sparkle',
    thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Fun',
    downloads: 7200,
    isPopular: false,
  },
  {
    id: '5',
    name: 'Cyberpunk',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Futuristic',
    downloads: 9800,
    isPopular: true,
  },
  {
    id: '6',
    name: 'Soft Focus',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Portrait',
    downloads: 11200,
    isPopular: false,
  },
];

const categories = ['All', 'Beauty', 'Artistic', 'Retro', 'Fun', 'Futuristic', 'Portrait'];

export default function EffectsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();

  const filteredEffects = selectedCategory === 'All' 
    ? mockEffects 
    : mockEffects.filter(effect => effect.category === selectedCategory);

  const handleEffectPress = (effectId: string) => {
    // In a real app, this would preview or apply the effect
    console.log('Effect selected:', effectId);
  };

  const renderEffectItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.effectCard}
      onPress={() => handleEffectPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        {item.isPopular && (
          <View style={styles.popularBadge}>
            <Sparkles size={12} color="white" />
            <Text style={styles.popularText}>Popular</Text>
          </View>
        )}
        <View style={styles.effectOverlay}>
          <TouchableOpacity style={styles.downloadButton}>
            <Download size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.likeButton}>
            <Heart size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.effectInfo}>
        <Text style={styles.effectName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.effectStats}>
          {item.downloads.toLocaleString()} downloads
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Effects</Text>
        <View style={{ width: 24 }} />
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
        data={filteredEffects}
        keyExtractor={item => item.id}
        renderItem={renderEffectItem}
        numColumns={2}
        contentContainerStyle={styles.effectsList}
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
    fontSize: 18,
    fontWeight: '600',
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
  effectsList: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  effectCard: {
    width: itemWidth,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
    aspectRatio: 1,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  effectOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'column',
  },
  downloadButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  likeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  effectInfo: {
    padding: 12,
  },
  effectName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  effectStats: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});