// app/live-studio.tsx
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Dimensions, FlatList, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { ArrowLeft, Radio, Users, MessageCircle, Heart, Gift as GiftIcon, RotateCcw, Coins, Sparkles, X } from 'lucide-react-native';
import { db } from '@/services/firebaseConfig';
import { ref, onValue, off, set } from 'firebase/database';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { getCurrentUser } from '@/mocks/users';
import { liveKitService } from '@/services/livekit';

const { width, height } = Dimensions.get('window');

export default function LiveStudioScreen() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [isLive, setIsLive] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [viewers, setViewers] = useState(0);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [coinsEarned, setCoinsEarned] = useState(0);
  
  // Animation states for floating reactions inside the studio
  const [floatingGifts, setFloatingGifts] = useState<{ id: string; emoji: string; anim: Animated.Value }[]>([]);

  const router = useRouter();
  const currentUser = getCurrentUser();
  const streamId = currentUser.id; // Stream matches host user id

  useEffect(() => {
    if (isLive) {
      // 1. Listen to room participant count
      const cleanupRoomListener = liveKitService.listenToRoom(streamId, (roomData) => {
        if (roomData) {
          setViewers(roomData.participantsCount || 1);
        }
      });

      // 2. Listen to Chat Node
      const chatRef = ref(db, `livekit_rooms/${streamId}/chat`);
      const unsubscribeChat = onValue(chatRef, (snapshot) => {
        if (snapshot.exists()) {
          const msgs = Object.values(snapshot.val());
          setChatMessages(msgs.sort((a: any, b: any) => a.timestamp - b.timestamp));
        }
      });

      // 3. Listen to incoming gift triggers to display floating emoji and increase revenue
      const giftsTriggerRef = ref(db, `livekit_rooms/${streamId}/gifts`);
      const unsubscribeGifts = onValue(giftsTriggerRef, (snapshot) => {
        if (snapshot.exists()) {
          const giftsList = Object.values(snapshot.val()) as any[];
          
          // Calculate total coins earned during session
          let totalCoins = 0;
          giftsList.forEach((gift: any) => {
            if (gift.giftId === '1') totalCoins += 10;
            else if (gift.giftId === '2') totalCoins += 50;
            else if (gift.giftId === '3') totalCoins += 200;
            else if (gift.giftId === '4') totalCoins += 500;
            else if (gift.giftId === '5') totalCoins += 1000;
            else if (gift.giftId === '6') totalCoins += 2500;
          });
          setCoinsEarned(totalCoins);

          const latestGift = giftsList.sort((a, b) => b.timestamp - a.timestamp)[0];
          if (latestGift && Date.now() - latestGift.timestamp < 3000) {
            triggerFloatingAnimation(latestGift.giftIcon);
          }
        }
      });

      return () => {
        cleanupRoomListener();
        off(chatRef, 'value', unsubscribeChat);
        off(giftsTriggerRef, 'value', unsubscribeGifts);
      };
    }
  }, [isLive]);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>تطبيق إيلينتي يحتاج صلاحية الكاميرا لإطلاق البث المباشر</Text>
        <Button title="منح الصلاحية" onPress={requestPermission} />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current: CameraType) => (current === 'back' ? 'front' : 'back'));
  };

  const startLiveStream = async () => {
    if (!streamTitle.trim()) {
      Alert.alert('تنبيه', 'الرجاء إدخال عنوان للبث المباشر أولاً.');
      return;
    }
    
    // Initialize session room in Firebase
    const success = await liveKitService.createRoom(streamId, currentUser.id, {
      title: streamTitle,
      hostName: currentUser.name,
      hostAvatar: currentUser.avatar,
    });

    if (success) {
      setIsLive(true);
      setViewers(1);
      
      // Post welcome message inside the stream chat
      const welcomeMsgId = `msg_welcome_${Date.now()}`;
      await set(ref(db, `livekit_rooms/${streamId}/chat/${welcomeMsgId}`), {
        id: welcomeMsgId,
        senderId: 'system',
        senderName: 'نظام إيلينتي',
        message: '🚀 تم إطلاق البث المباشر بنجاح! شارك البث مع أصدقائك.',
        timestamp: Date.now(),
        type: 'system',
      });
    } else {
      Alert.alert('فشل الاتصال', 'حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة لاحقاً.');
    }
  };

  const endLiveStream = async () => {
    await liveKitService.endRoom(streamId);
    setIsLive(false);
    setViewers(0);
    
    Alert.alert(
      'انتهى البث المباشر',
      `أرباح البث الإجمالية: ${coinsEarned} عملة 🪙\nشكراً لك ولجميع متابعيك!`,
      [{ text: 'حسنًا', onPress: () => router.back() }]
    );
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

  if (!isLive) {
    return (
      <View style={styles.container}>
        <View style={styles.setupContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>بث مباشر جديد</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.previewContainer}>
            <CameraView style={styles.preview} facing={facing}>
              <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                <RotateCcw size={24} color="white" />
              </TouchableOpacity>
            </CameraView>
          </View>

          <ScrollView style={styles.setupForm}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>عنوان البث المباشر</Text>
              <TextInput
                style={styles.input}
                placeholder="عن ماذا يتحدث البث الخاص بك؟"
                placeholderTextColor={colors.textSecondary}
                value={streamTitle}
                onChangeText={setStreamTitle}
                maxLength={100}
                textAlign="right"
              />
            </View>

            <View style={styles.settingsContainer}>
              <Text style={styles.sectionTitle}>إعدادات البث</Text>
              
              <View style={styles.settingItem}>
                <Users size={20} color={colors.primary} />
                <Text style={styles.settingText}>السماح للمشاهدين بالانضمام</Text>
              </View>
              
              <View style={styles.settingItem}>
                <MessageCircle size={20} color={colors.primary} />
                <Text style={styles.settingText}>تفعيل الشات الفوري</Text>
              </View>
              
              <View style={styles.settingItem}>
                <Sparkles size={20} color={colors.primary} />
                <Text style={styles.settingText}>تفعيل متجر الهدايا التفاعلي</Text>
              </View>
            </View>

            <Button
              title="إطلاق البث المباشر الآن"
              onPress={startLiveStream}
              icon={<Radio size={20} color="white" />}
              style={styles.startButton}
            />
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.liveCamera} facing={facing}>
        {/* Floating Animation Layer inside Studio */}
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

        <View style={styles.liveOverlay}>
          {/* Top Live Stats Bar */}
          <View style={styles.liveHeader}>
            <View style={styles.liveIndicator}>
              <Radio size={16} color="white" />
              <Text style={styles.liveText}>مباشر</Text>
            </View>
            
            <View style={styles.viewerCount}>
              <Users size={16} color="white" />
              <Text style={styles.viewerText}>{viewers}</Text>
            </View>

            <View style={styles.earningsTracker}>
              <Coins size={16} color="#FBBF24" />
              <Text style={styles.earningsText}>{coinsEarned} عملة</Text>
            </View>
            
            <TouchableOpacity onPress={endLiveStream} style={styles.endButton}>
              <Text style={styles.endButtonText}>إنهاء</Text>
            </TouchableOpacity>
          </View>

          {/* Right Controls */}
          <View style={styles.liveControls}>
            <TouchableOpacity style={styles.liveControlButton} onPress={toggleCameraFacing}>
              <RotateCcw size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Chat Container */}
          <View style={styles.chatContainer}>
            <FlatList
              data={chatMessages}
              keyExtractor={item => item.id}
              renderItem={renderChatItem}
              style={styles.studioChatList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: colors.text,
  },
  setupContainer: {
    flex: 1,
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
  previewContainer: {
    height: 200,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  preview: {
    flex: 1,
  },
  flipButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setupForm: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  settingsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'right',
  },
  settingItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingText: {
    marginRight: 12,
    fontSize: 16,
    color: colors.text,
  },
  startButton: {
    marginTop: 20,
  },
  liveCamera: {
    flex: 1,
  },
  liveOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
  },
  liveHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  viewerCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  viewerText: {
    color: 'white',
    marginLeft: 4,
  },
  earningsTracker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#FBBF24',
  },
  earningsText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  endButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  endButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  liveControls: {
    position: 'absolute',
    right: 16,
    bottom: 150,
    alignItems: 'center',
  },
  liveControlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  floatingGiftEmoji: {
    position: 'absolute',
    fontSize: 40,
    zIndex: 99,
  },
  chatContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  studioChatList: {
    maxHeight: 180,
  },
  chatBubble: {
    flexDirection: 'row-reverse',
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
});