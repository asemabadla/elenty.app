// app/live-stream/[id].tsx
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Alert, Dimensions, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Eye, Send, Gift as GiftIcon, Heart, X, Sparkles, Coins } from 'lucide-react-native';
import { db } from '@/services/firebaseConfig';
import { ref, onValue, off, push, set } from 'firebase/database';
import { colors } from '@/constants/colors';
import { mockUsers, getCurrentUser } from '@/mocks/users';
import { liveKitService } from '@/services/livekit';
import { giftStoreService, GIFTS, Gift } from '@/services/giftStore';

const { width, height } = Dimensions.get('window');

export default function LiveStreamViewerScreen() {
  const { id: streamId } = useLocalSearchParams();
  const router = useRouter();
  const currentUser = getCurrentUser();

  const [streamInfo, setStreamInfo] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [viewersCount, setViewersCount] = useState(128);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [userCoins, setUserCoins] = useState(5000);
  
  // Animation states for floating gifts
  const [floatingGifts, setFloatingGifts] = useState<{ id: string; emoji: string; anim: Animated.Value }[]>([]);

  // Find host details based on streamId
  const host = mockUsers.find(u => u.id === streamId) || mockUsers[1];

  useEffect(() => {
    // 1. Sync live room state with LiveKit Firebase room
    const cleanupLiveKitListener = liveKitService.listenToRoom(streamId as string, (roomData) => {
      if (roomData) {
        setStreamInfo(roomData);
        setViewersCount(roomData.participantsCount || 128);
      }
    });

    // 2. Fetch User Coins balance
    giftStoreService.getUserCoins(currentUser.id).then(coins => {
      setUserCoins(coins);
    });

    // Join room in LiveKit Firebase signaling
    liveKitService.joinRoom(streamId as string, currentUser.id, currentUser.name);

    // 3. Listen to Chat Node
    const chatRef = ref(db, `livekit_rooms/${streamId}/chat`);
    const unsubscribeChat = onValue(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const msgs = Object.values(snapshot.val());
        setChatMessages(msgs.sort((a: any, b: any) => a.timestamp - b.timestamp));
      }
    });

    // 4. Listen to incoming gift triggers for floating reactions
    const giftsTriggerRef = ref(db, `livekit_rooms/${streamId}/gifts`);
    const unsubscribeGifts = onValue(giftsTriggerRef, (snapshot) => {
      if (snapshot.exists()) {
        const giftsList = Object.values(snapshot.val()) as any[];
        const latestGift = giftsList.sort((a, b) => b.timestamp - a.timestamp)[0];
        
        // Trigger float animation on screen if it happened recently (within 5 seconds)
        if (latestGift && Date.now() - latestGift.timestamp < 5000) {
          triggerFloatingAnimation(latestGift.giftIcon);
        }
      }
    });

    return () => {
      cleanupLiveKitListener();
      off(chatRef, 'value', unsubscribeChat);
      off(giftsTriggerRef, 'value', unsubscribeGifts);
      liveKitService.leaveRoom(streamId as string, currentUser.id);
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const messageId = `msg_${Date.now()}`;
    const chatMsgRef = ref(db, `livekit_rooms/${streamId}/chat/${messageId}`);
    
    await set(chatMsgRef, {
      id: messageId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      message: inputText.trim(),
      timestamp: Date.now(),
    });

    setInputText('');
  };

  const handleSendGift = async (gift: Gift) => {
    if (userCoins < gift.price) {
      Alert.alert('رصيد غير كافٍ', 'رصيدك الحالي لا يكفي لإرسال هذه الهدية. يمكنك زيادة رصيدك في أي وقت.');
      return;
    }

    setShowGiftModal(false);
    
    const result = await giftStoreService.sendGift(
      currentUser.id,
      currentUser.name,
      host.id,
      streamId as string,
      gift.id
    );

    if (result.success && result.newBalance !== undefined) {
      setUserCoins(result.newBalance);
      triggerFloatingAnimation(gift.icon);
    } else {
      Alert.alert('فشل إرسال الهدية', result.error || 'عذراً، فشل الاتصال بخدمة الهدايا.');
    }
  };

  const triggerFloatingAnimation = (emoji: string) => {
    const id = `float_${Math.random()}`;
    const anim = new Animated.Value(0);
    
    setFloatingGifts(prev => [...prev, { id, emoji, anim }]);

    Animated.timing(anim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      setFloatingGifts(prev => prev.filter(g => g.id !== id));
    });
  };

  const renderChatItem = ({ item }: { item: any }) => {
    const isSystem = item.senderId === 'system';
    return (
      <View style={[styles.chatBubble, isSystem && styles.systemBubble]}>
        <Text style={styles.chatUser}>{item.senderName}: </Text>
        <Text style={[styles.chatText, isSystem && styles.systemText]}>{item.message}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.innerContainer}>
        {/* Stream video feed background */}
        <View style={styles.videoBackground}>
          <Image 
            source={{ uri: host.avatar }} 
            style={styles.hostPreviewImage} 
            blurRadius={2} 
          />
          <View style={styles.videoOverlayDark} />
        </View>

        {/* Floating Animation Layer */}
        {floatingGifts.map(gift => {
          const translateY = gift.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [height - 180, 100],
          });
          const translateX = gift.anim.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [width / 2 + 50, width / 2 + 20, width / 2 + 80, width / 2 + 10, width / 2 + 40],
          });
          const opacity = gift.anim.interpolate({
            inputRange: [0, 0.8, 1],
            outputRange: [0, 1, 0],
          });
          const scale = gift.anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.5, 2.5, 1.2],
          });

          return (
            <Animated.Text
              key={gift.id}
              style={[
                styles.floatingGiftEmoji,
                {
                  transform: [
                    { translateY },
                    { translateX },
                    { scale },
                  ],
                  opacity,
                }
              ]}
            >
              {gift.emoji}
            </Animated.Text>
          );
        })}

        {/* Stream Overlay UI */}
        <View style={styles.streamOverlay}>
          {/* Top Host Header */}
          <View style={styles.topHeader}>
            <View style={styles.hostCard}>
              <Image source={{ uri: host.avatar }} style={styles.hostAvatar} />
              <View style={styles.hostTextContainer}>
                <Text style={styles.hostName}>{host.name}</Text>
                <Text style={styles.hostLiveStatus}>بث مباشر</Text>
              </View>
            </View>

            <View style={styles.rightStats}>
              <View style={styles.viewersCard}>
                <Eye size={14} color="white" />
                <Text style={styles.viewersText}>{viewersCount}</Text>
              </View>
              <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                <X size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Wallet Mini Status */}
          <View style={styles.coinsTracker}>
            <Coins size={14} color="#FBBF24" />
            <Text style={styles.coinsTrackerText}>{userCoins} عملة</Text>
          </View>

          {/* Chat Messages List */}
          <View style={styles.bottomArea}>
            <FlatList
              data={chatMessages}
              keyExtractor={item => item.id}
              renderItem={renderChatItem}
              style={styles.chatList}
              contentContainerStyle={styles.chatContent}
              showsVerticalScrollIndicator={false}
            />

            {/* Controls & Input */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder="أرسل تعليقاً للبث..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={inputText}
                onChangeText={setInputText}
              />
              
              <TouchableOpacity style={styles.sendIcon} onPress={handleSendMessage}>
                <Send size={20} color="white" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.giftIconContainer} 
                onPress={() => setShowGiftModal(true)}
              >
                <GiftIcon size={24} color="#FBBF24" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Gift Selection Bottom Sheet / Modal */}
        {showGiftModal && (
          <View style={styles.modalBackdrop}>
            <TouchableOpacity 
              style={styles.modalDismiss} 
              onPress={() => setShowGiftModal(false)} 
            />
            <View style={styles.giftSheet}>
              <View style={styles.sheetHeader}>
                <Coins size={18} color="#FBBF24" />
                <Text style={styles.sheetTitle}>متجر الهدايا (رصيدك: {userCoins} عملة)</Text>
              </View>

              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.giftsScroll}
              >
                {GIFTS.map(gift => (
                  <TouchableOpacity 
                    key={gift.id} 
                    style={styles.giftItem}
                    onPress={() => handleSendGift(gift)}
                  >
                    <Text style={styles.giftEmoji}>{gift.icon}</Text>
                    <Text style={styles.giftName}>{gift.nameAr}</Text>
                    <View style={styles.priceTag}>
                      <Coins size={10} color="#FBBF24" />
                      <Text style={styles.giftPrice}>{gift.price}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  innerContainer: {
    flex: 1,
    position: 'relative',
  },
  videoBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
  },
  hostPreviewImage: {
    width: width,
    height: height,
    resizeMode: 'cover',
  },
  videoOverlayDark: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  floatingGiftEmoji: {
    position: 'absolute',
    fontSize: 40,
    zIndex: 99,
  },
  streamOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 24,
  },
  hostAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  hostTextContainer: {
    marginLeft: 8,
    marginRight: 12,
  },
  hostName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
  hostLiveStatus: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
    textAlign: 'right',
  },
  rightStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewersCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  viewersText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinsTracker: {
    position: 'absolute',
    top: 110,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  coinsTrackerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  bottomArea: {
    width: '100%',
    paddingHorizontal: 16,
  },
  chatList: {
    maxHeight: 220,
    marginBottom: 16,
  },
  chatContent: {
    paddingBottom: 8,
  },
  chatBubble: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 6,
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  systemBubble: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderWidth: 0.5,
    borderColor: '#EF4444',
  },
  chatUser: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  chatText: {
    color: 'white',
    fontSize: 13,
  },
  systemText: {
    color: '#FECACA',
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  chatInput: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 46,
    color: 'white',
    fontSize: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sendIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  giftIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#FBBF24',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalDismiss: {
    flex: 1,
  },
  giftSheet: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  giftsScroll: {
    paddingVertical: 10,
  },
  giftItem: {
    width: 100,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  giftEmoji: {
    fontSize: 34,
    marginBottom: 6,
  },
  giftName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  giftPrice: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
});
