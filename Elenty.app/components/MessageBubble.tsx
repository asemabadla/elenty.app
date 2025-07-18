import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Message } from '@/types';
import { colors } from '@/constants/colors';
import { formatTime } from '@/utils/date';
import { Phone, Video } from 'lucide-react-native';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  const renderCallMessage = () => {
    const isOutgoing = isCurrentUser;
    const duration = message.callDuration || 0;
    const icon = message.content.includes('video') ? (
      <Video size={16} color={isCurrentUser ? 'white' : colors.primary} />
    ) : (
      <Phone size={16} color={isCurrentUser ? 'white' : colors.primary} />
    );
    
    let callText = '';
    if (duration === 0) {
      callText = isOutgoing ? 'Missed call' : 'Missed call from you';
    } else {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      const durationText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      callText = `Call duration: ${durationText}`;
    }
    
    return (
      <View style={styles.callContainer}>
        {icon}
        <Text style={[
          styles.callText,
          isCurrentUser ? styles.currentUserCallText : styles.otherUserCallText
        ]}>
          {callText}
        </Text>
      </View>
    );
  };

  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      {message.type === 'call' ? (
        renderCallMessage()
      ) : (
        <Text style={[
          styles.messageText,
          isCurrentUser ? styles.currentUserText : styles.otherUserText
        ]}>
          {message.content}
        </Text>
      )}
      <Text style={[
        styles.timestamp,
        isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp
      ]}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 4,
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  currentUserText: {
    color: 'white',
  },
  otherUserText: {
    color: colors.text,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  currentUserTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherUserTimestamp: {
    color: colors.textSecondary,
  },
  callContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callText: {
    marginLeft: 6,
    fontSize: 14,
  },
  currentUserCallText: {
    color: 'white',
  },
  otherUserCallText: {
    color: colors.text,
  },
});