import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react-native';
import { Avatar } from './Avatar';
import { Card } from './Card';
import { Post as PostType } from '@/types';
import { colors, spacing, typography, borderRadius } from '@/constants/colors';
import { formatTimeAgo } from '@/utils/date';
import { useSocialStore } from '@/store/social-store';

interface PostProps {
  post: PostType;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const imageWidth = width - (spacing.lg * 2);

export const Post: React.FC<PostProps> = ({ post, onPress }) => {
  const { likePost, unlikePost, savePost, unsavePost } = useSocialStore();

  const handleLikePress = () => {
    if (post.hasLiked) {
      unlikePost(post.id);
    } else {
      likePost(post.id);
    }
  };

  const handleSavePress = () => {
    if (post.hasSaved) {
      unsavePost(post.id);
    } else {
      savePost(post.id);
    }
  };

  return (
    <Card style={styles.container} padding="md" shadow="sm">
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo} activeOpacity={0.7}>
          <Avatar uri={post.user?.avatar || ''} size={40} borderWidth={1} />
          <View style={styles.nameContainer}>
            <Text style={styles.username}>{post.user?.username}</Text>
            <Text style={styles.timestamp}>{formatTimeAgo(post.timestamp)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
          <MoreHorizontal size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Image */}
      <TouchableOpacity 
        activeOpacity={0.95} 
        onPress={onPress}
        style={styles.imageContainer}
      >
        <Image
          source={{ uri: post.media[0].url }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleLikePress}
            activeOpacity={0.7}
          >
            <Heart
              size={24}
              color={post.hasLiked ? colors.error : colors.textSecondary}
              fill={post.hasLiked ? colors.error : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <MessageCircle size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Share2 size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSavePress} activeOpacity={0.7}>
          <Bookmark
            size={24}
            color={colors.textSecondary}
            fill={post.hasSaved ? colors.textSecondary : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.likes}>
          {post.likes.toLocaleString()} likes
        </Text>
        <View style={styles.captionContainer}>
          <Text style={styles.username}>{post.user?.username}</Text>
          <Text style={styles.caption}> {post.caption}</Text>
        </View>
        {post.comments > 0 && (
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.comments}>
              View all {post.comments} comments
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nameContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  username: {
    fontWeight: typography.weights.semibold,
    color: colors.text,
    fontSize: typography.sizes.base,
  },
  timestamp: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  moreButton: {
    padding: spacing.xs,
  },
  imageContainer: {
    marginHorizontal: -spacing.md,
    marginBottom: spacing.md,
  },
  image: {
    width: imageWidth,
    height: imageWidth,
    borderRadius: borderRadius.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: spacing.lg,
    padding: spacing.xs,
  },
  footer: {
    gap: spacing.xs,
  },
  likes: {
    fontWeight: typography.weights.semibold,
    color: colors.text,
    fontSize: typography.sizes.base,
  },
  captionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  caption: {
    color: colors.text,
    fontSize: typography.sizes.base,
    lineHeight: typography.lineHeights.relaxed * typography.sizes.base,
  },
  comments: {
    color: colors.textSecondary,
    fontSize: typography.sizes.base,
  },
});