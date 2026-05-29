import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Dimensions, StatusBar, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Users, Play, Plus, Video, TrendingUp } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '@/constants/colors';
import { mockVideos } from '@/mocks/videos';
import { Button } from '@/components/Button';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

// Mock challenges to find description
const mockChallenges = [
  {
    id: '1',
    title: 'تحدي الرقص والتعبير',
    description: 'أظهر لنا أفضل حركات الرقص والتعبير الحركي الإبداعي لديك! شارك مع أغنيتك المفضلة.',
    thumbnail: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    participants: 125000,
    hashtag: '#DanceChallenge',
    isHot: true,
    videos: 45000,
  },
  {
    id: '2',
    title: 'أسرار وحيل الطبخ',
    description: 'شارك أفضل نصائحك وحيلك السريعة في المطبخ لإعداد أشهى الأطباق بأسهل الطرق.',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    participants: 89000,
    hashtag: '#CookingHack',
    isHot: false,
    videos: 32000,
  },
  {
    id: '3',
    title: 'تحدي حركات الحيوانات الأليفة',
    description: 'أظهر الحركات والخدع الذكية والمضحكة التي يستطيع حيوانك الأليف القيام بها!',
    thumbnail: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    participants: 67000,
    hashtag: '#PetTricks',
    isHot: true,
    videos: 28000,
  },
  {
    id: '4',
    title: 'تحدي الرسم في دقيقة',
    description: 'ابتكر عملاً فنياً جميلاً أو رسماً سريعاً في أقل من 60 ثانية واستعرضه معنا.',
    thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    participants: 54000,
    hashtag: '#ArtChallenge',
    isHot: false,
    videos: 21000,
  },
];

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Find the challenge or use default
  const challenge = mockChallenges.find(c => c.id === id) || {
    id: id as string,
    title: 'تحدي إبداعي جديد',
    description: 'شارك بلمستك الإبداعية الخاصة في هذا التحدي الجديد والمميز معنا.',
    thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600',
    participants: 1200,
    hashtag: '#NewChallenge',
    isHot: false,
    videos: 430,
  };

  const handleJoin = () => {
    router.push('/studio');
  };

  const renderVideoItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => router.push(`/chat/${item.userId}`)} // Temporary route fallback or play view
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' }} style={styles.videoThumbnail} />
      <View style={styles.videoOverlay}>
        <Play size={16} color="white" fill="white" />
        <Text style={styles.videoLikes}>{item.likes} إعجاب</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.username} numberOfLines={1}>@{item.user?.username || 'user'}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      {/* Banner Cover */}
      <View style={styles.bannerContainer}>
        <Image source={{ uri: challenge.thumbnail }} style={styles.bannerImage} />
        <View style={styles.bannerOverlay} />
        
        {/* Back and Title Overlays */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.bannerContent}>
          {challenge.isHot && (
            <View style={styles.hotBadge}>
              <TrendingUp size={12} color="white" />
              <Text style={styles.hotText}>نشط جداً</Text>
            </View>
          )}
          <Text style={styles.hashtag}>{challenge.hashtag}</Text>
          <Text style={styles.title}>{challenge.title}</Text>
        </View>
      </View>

      {/* Info Card */}
      <View style={styles.infoSection}>
        <Text style={styles.description}>{challenge.description}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Users size={18} color={colors.primary} />
            <Text style={styles.statValue}>{challenge.participants.toLocaleString()}</Text>
            <Text style={styles.statLabel}>مشارك</Text>
          </View>
          
          <View style={styles.statBox}>
            <Video size={18} color={colors.secondary} />
            <Text style={styles.statValue}>{challenge.videos.toLocaleString()}</Text>
            <Text style={styles.statLabel}>فيديو</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>الفيديوهات المشاركة</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <FlatList
        data={mockVideos}
        keyExtractor={item => item.id}
        renderItem={renderVideoItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.floatingButton}>
        <Button
          title="شارك في التحدي الآن"
          onPress={handleJoin}
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
  listContent: {
    paddingBottom: 100,
  },
  bannerContainer: {
    height: 260,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  bannerContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  hotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  hotText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  hashtag: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'left',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  infoSection: {
    padding: spacing.lg,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'right',
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'right',
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 16,
  },
  videoCard: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH * 1.5,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  videoLikes: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  userInfo: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  username: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});
