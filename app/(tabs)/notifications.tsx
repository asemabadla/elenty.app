import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { colors } from '@/constants/colors';
import { mockUsers } from '@/mocks/users';

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    type: 'like',
    userId: '2',
    contentId: '1',
    timestamp: Date.now() - 1800000, // 30 minutes ago
    read: false,
  },
  {
    id: '2',
    type: 'comment',
    userId: '3',
    contentId: '1',
    timestamp: Date.now() - 3600000, // 1 hour ago
    read: false,
    comment: 'Beautiful photo! Where was this taken?',
  },
  {
    id: '3',
    type: 'follow',
    userId: '4',
    timestamp: Date.now() - 7200000, // 2 hours ago
    read: true,
  },
  {
    id: '4',
    type: 'mention',
    userId: '5',
    contentId: '2',
    timestamp: Date.now() - 86400000, // 1 day ago
    read: true,
  },
  {
    id: '5',
    type: 'like',
    userId: '6',
    contentId: '3',
    timestamp: Date.now() - 172800000, // 2 days ago
    read: true,
  },
];

export default function NotificationsScreen() {
  const renderNotificationText = (notification: any) => {
    const user = mockUsers.find(u => u.id === notification.userId);
    
    switch (notification.type) {
      case 'like':
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.username}>{user?.username}</Text> liked your post.
          </Text>
        );
      case 'comment':
        return (
          <View>
            <Text style={styles.notificationText}>
              <Text style={styles.username}>{user?.username}</Text> commented on your post.
            </Text>
            <Text style={styles.commentText} numberOfLines={1}>
              "{notification.comment}"
            </Text>
          </View>
        );
      case 'follow':
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.username}>{user?.username}</Text> started following you.
          </Text>
        );
      case 'mention':
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.username}>{user?.username}</Text> mentioned you in a comment.
          </Text>
        );
      default:
        return null;
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockNotifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const user = mockUsers.find(u => u.id === item.userId);
          
          return (
            <TouchableOpacity
              style={[
                styles.notificationItem,
                !item.read && styles.unreadNotification,
              ]}
              activeOpacity={0.7}
            >
              <Avatar uri={user?.avatar || ''} size={50} />
              
              <View style={styles.notificationContent}>
                {renderNotificationText(item)}
                <Text style={styles.timestamp}>
                  {formatTimeAgo(item.timestamp)}
                </Text>
              </View>
              
              {item.type === 'follow' && (
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followButtonText}>Follow</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  unreadNotification: {
    backgroundColor: `${colors.primary}10`, // 10% opacity of primary color
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  notificationText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  username: {
    fontWeight: '600',
  },
  commentText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  followButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    marginLeft: 8,
  },
  followButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});