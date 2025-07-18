import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Avatar } from './Avatar';
import { Chat, User } from '@/types';
import { colors } from '@/constants/colors';
import { formatTimeAgo } from '@/utils/date';
import { mockUsers } from '@/mocks/users';
import { Phone, Video } from 'lucide-react-native';

interface ChatItemProps {
  chat: Chat;
  onPress: (chatId: string) => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({ chat, onPress }) => {
  // Get the other user in the chat (not the current user)
  const otherUserId = chat.participants.find(id => id !== '1');
  const otherUser = mockUsers.find(user => user.id === otherUserId) as User;

  const getMessagePreview = () => {
    if (!chat.lastMessage) return '';
    
    if (chat.lastMessage.type === 'call') {
      const isOutgoing = chat.lastMessage.senderId === '1';
      const duration = chat.lastMessage.callDuration || 0;
      
      if (duration === 0) {
        return isOutgoing ? 'Missed call' : 'Missed call from you';
      } else {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const durationText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        return `Call duration: ${durationText}`;
      }
    }
    
    return chat.lastMessage.content;
  };

  const renderMessageIcon = () => {
    if (!chat.lastMessage || chat.lastMessage.type !== 'call') return null;
    
    return (
      <View style={styles.callIcon}>
        {chat.lastMessage.content.includes('video') ? (
          <Video size={14} color={colors.textSecondary} />
        ) : (
          <Phone size={14} color={colors.textSecondary} />
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(chat.id)}
      activeOpacity={0.7}
    >
      <Avatar uri={otherUser.avatar} size={50} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{otherUser.name}</Text>
          {chat.lastMessage && (
            <Text style={styles.time}>
              {formatTimeAgo(chat.lastMessage.timestamp)}
            </Text>
          )}
        </View>
        
        <View style={styles.messageRow}>
          {renderMessageIcon()}
          <Text
            style={[
              styles.message,
              chat.unreadCount > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}
          >
            {getMessagePreview()}
          </Text>
          
          {chat.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    color: colors.text,
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callIcon: {
    marginRight: 6,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  unreadMessage: {
    fontWeight: '500',
    color: colors.text,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});