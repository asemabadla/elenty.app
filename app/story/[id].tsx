import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { X } from 'lucide-react-native';
import { Avatar } from '@/components/Avatar';
import { useSocialStore } from '@/store/social-store';
import { colors } from '@/constants/colors';
import { formatTimeAgo } from '@/utils/date';

const { width, height } = Dimensions.get('window');

export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { stories } = useSocialStore();
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const storyId = id || '';
  const story = stories.find(s => s.id === storyId);

  useEffect(() => {
    if (!story) return;

    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) {
          return 1;
        }
        return prev + 0.01;
      });
    }, 50); // 5 seconds total duration (50ms * 100 steps)

    return () => clearInterval(interval);
  }, [story]);

  useEffect(() => {
    if (progress >= 1) {
      const timeout = setTimeout(() => {
        router.back();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, router]);

  if (!story) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Story not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: story.media.url }}
        style={styles.image}
        contentFit="cover"
      />

      <View style={styles.overlay}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>

        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar uri={story.user?.avatar || ''} size={36} />
            <View style={styles.userTextContainer}>
              <Text style={styles.username}>{story.user?.username}</Text>
              <Text style={styles.timestamp}>{formatTimeAgo(story.timestamp)}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.back()}>
            <X size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  image: {
    width,
    height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
  },
  progressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 16,
    marginTop: 40,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTextContainer: {
    marginLeft: 10,
  },
  username: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 100,
  },
});