import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, TrendingUp, Users, Play, Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';

const { width } = Dimensions.get('window');

// Mock challenges data
const mockChallenges = [
  {
    id: '1',
    title: 'Dance Challenge',
    description: 'Show us your best dance moves!',
    thumbnail: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    participants: 125000,
    hashtag: '#DanceChallenge',
    isHot: true,
    videos: 45000,
  },
  {
    id: '2',
    title: 'Cooking Hack',
    description: 'Share your best cooking tips and tricks',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    participants: 89000,
    hashtag: '#CookingHack',
    isHot: false,
    videos: 32000,
  },
  {
    id: '3',
    title: 'Pet Tricks',
    description: 'Show off your pet amazing tricks!',
    thumbnail: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    participants: 67000,
    hashtag: '#PetTricks',
    isHot: true,
    videos: 28000,
  },
  {
    id: '4',
    title: 'Art Challenge',
    description: 'Create art in 60 seconds or less',
    thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    participants: 54000,
    hashtag: '#ArtChallenge',
    isHot: false,
    videos: 21000,
  },
];

export default function ChallengesScreen() {
  const [selectedTab, setSelectedTab] = useState('trending');
  const router = useRouter();

  const handleChallengePress = (challengeId: string) => {
    router.push(`/challenge/${challengeId}`);
  };

  const handleCreateChallenge = () => {
    router.push('/challenges/create');
  };

  const renderChallengeItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.challengeCard}
      onPress={() => handleChallengePress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        {item.isHot && (
          <View style={styles.hotBadge}>
            <TrendingUp size={12} color="white" />
            <Text style={styles.hotText}>HOT</Text>
          </View>
        )}
        <View style={styles.playButton}>
          <Play size={20} color="white" fill="white" />
        </View>
        <View style={styles.videoCount}>
          <Text style={styles.videoCountText}>{item.videos.toLocaleString()}</Text>
        </View>
      </View>
      
      <View style={styles.challengeInfo}>
        <Text style={styles.challengeTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.challengeDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.hashtag}>{item.hashtag}</Text>
        <View style={styles.statsContainer}>
          <Users size={14} color={colors.textSecondary} />
          <Text style={styles.participantCount}>
            {item.participants.toLocaleString()} participants
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Challenges</Text>
        <TouchableOpacity onPress={handleCreateChallenge}>
          <Plus size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'trending' && styles.activeTab]}
          onPress={() => setSelectedTab('trending')}
        >
          <Text style={[styles.tabText, selectedTab === 'trending' && styles.activeTabText]}>
            Trending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'new' && styles.activeTab]}
          onPress={() => setSelectedTab('new')}
        >
          <Text style={[styles.tabText, selectedTab === 'new' && styles.activeTabText]}>
            New
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'joined' && styles.activeTab]}
          onPress={() => setSelectedTab('joined')}
        >
          <Text style={[styles.tabText, selectedTab === 'joined' && styles.activeTabText]}>
            Joined
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockChallenges}
        keyExtractor={item => item.id}
        renderItem={renderChallengeItem}
        contentContainerStyle={styles.challengesList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.floatingButton}>
        <Button
          title="Create Challenge"
          onPress={handleCreateChallenge}
          icon={<Plus size={20} color="white" />}
        />
      </View>
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  challengesList: {
    padding: 16,
  },
  challengeCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
    height: 200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  hotBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.notification,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  hotText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoCount: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  videoCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  challengeInfo: {
    padding: 16,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  hashtag: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});