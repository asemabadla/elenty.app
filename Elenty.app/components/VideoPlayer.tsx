import React, { useState, useRef } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Heart, MessageCircle, Share2, Music } from 'lucide-react-native';
import { Avatar } from './Avatar';
import { ShortVideo } from '@/types';
import { colors } from '@/constants/colors';
import { useSocialStore } from '@/store/social-store';

interface VideoPlayerProps {
  video: ShortVideo;
  isActive: boolean;
}

const { width, height } = Dimensions.get('window');

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isActive }) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const { likeVideo, unlikeVideo } = useSocialStore();

  const handleLikePress = () => {
    if (video.hasLiked) {
      unlikeVideo(video.id);
    } else {
      likeVideo(video.id);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  React.useEffect(() => {
    if (isActive) {
      videoRef.current?.playAsync();
      setIsPlaying(true);
    } else {
      videoRef.current?.pauseAsync();
      setIsPlaying(false);
    }
  }, [isActive]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.videoContainer}
        onPress={togglePlayPause}
      >
        <Video
          ref={videoRef}
          source={{ uri: video.videoUrl }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay={isActive}
          useNativeControls={false}
        />
      </TouchableOpacity>

      <View style={styles.overlay}>
        <View style={styles.rightControls}>
          <TouchableOpacity style={styles.controlButton} onPress={handleLikePress}>
            <Heart
              size={30}
              color="white"
              fill={video.hasLiked ? colors.notification : 'transparent'}
            />
            <Text style={styles.controlText}>{video.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <MessageCircle size={30} color="white" />
            <Text style={styles.controlText}>{video.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Share2 size={30} color="white" />
            <Text style={styles.controlText}>{video.shares}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomControls}>
          <View style={styles.userInfo}>
            <TouchableOpacity style={styles.userRow}>
              <Avatar uri={video.user?.avatar || ''} size={40} />
              <Text style={styles.username}>@{video.user?.username}</Text>
            </TouchableOpacity>
            <Text style={styles.caption}>{video.caption}</Text>
            <View style={styles.musicRow}>
              <Music size={16} color="white" />
              <Text style={styles.musicText}>{video.music}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: height - 120, // Adjust for tab bar and status bar
    backgroundColor: 'black',
  },
  videoContainer: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 16,
  },
  rightControls: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    alignItems: 'center',
  },
  controlButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  controlText: {
    color: 'white',
    marginTop: 4,
    fontWeight: '600',
  },
  bottomControls: {
    marginBottom: 20,
  },
  userInfo: {
    maxWidth: '80%',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  username: {
    color: 'white',
    fontWeight: '700',
    marginLeft: 10,
    fontSize: 16,
  },
  caption: {
    color: 'white',
    marginBottom: 10,
    fontSize: 14,
  },
  musicRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 14,
  },
});