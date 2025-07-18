import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Phone, Video, Mic, Image as ImageIcon, Send } from 'lucide-react-native';
import { Avatar } from '@/components/Avatar';
import { MessageBubble } from '@/components/MessageBubble';
import { useSocialStore } from '@/store/social-store';
import { colors } from '@/constants/colors';
import { mockUsers } from '@/mocks/users';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { messages, chats, sendMessage, markChatAsRead } = useSocialStore();
  const [messageText, setMessageText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const chatId = id || '';
  const chat = chats.find(c => c.id === chatId);
  const chatMessages = messages[chatId] || [];
  
  // Get the other user in the chat (not the current user)
  const otherUserId = chat?.participants.find(id => id !== '1');
  const otherUser = mockUsers.find(user => user.id === otherUserId);

  useEffect(() => {
    if (chat?.unreadCount && chat.unreadCount > 0) {
      markChatAsRead(chatId);
    }
  }, [chatId]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    sendMessage(chatId, messageText.trim(), 'text');
    setMessageText('');
    
    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleVoiceCall = () => {
    sendMessage(chatId, 'Call ended', 'call');
  };

  const handleVideoCall = () => {
    sendMessage(chatId, 'Video call ended', 'call');
  };

  if (!chat || !otherUser) {
    return (
      <View style={styles.container}>
        <Text>Chat not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.userInfo}>
          <Avatar uri={otherUser.avatar} size={36} />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{otherUser.name}</Text>
            <Text style={styles.status}>Online</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleVoiceCall}>
            <Phone size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleVideoCall}>
            <Video size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={chatMessages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isCurrentUser={item.senderId === '1'}
          />
        )}
        contentContainerStyle={styles.messagesList}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
      
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <ImageIcon size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Message..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
        />
        
        {messageText.trim() ? (
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Send size={24} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.micButton}>
            <Mic size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
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
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  backButton: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    marginLeft: 10,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    color: colors.text,
  },
  status: {
    fontSize: 12,
    color: colors.success,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
  },
  messagesList: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  attachButton: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
  },
  micButton: {
    marginLeft: 10,
  },
});