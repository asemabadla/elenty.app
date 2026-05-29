// app/call/[id].tsx
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, Dimensions, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Phone, PhoneOff, Video, Mic, MicOff, Volume2, VolumeX, Grid, Disc, Shield, UserX } from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { colors } from '@/constants/colors';
import { mockUsers, getCurrentUser } from '@/mocks/users';
import { twilioService } from '@/services/twilio';
import { liveKitService } from '@/services/livekit';

const { width, height } = Dimensions.get('window');

export default function CallScreen() {
  const { id: receiverId, type: callTypeParam, isExternal } = useLocalSearchParams();
  const router = useRouter();
  const currentUser = getCurrentUser();
  
  const isPSTN = isExternal === 'true';
  const callType = callTypeParam === 'video' ? 'video' : 'voice';
  
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended' | 'failed'>('ringing');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [twilioCallId, setTwilioCallId] = useState<string | null>(null);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Retrieve receiver details
  const receiver = mockUsers.find(u => u.id === receiverId) || {
    id: receiverId as string,
    name: 'رقم خارجي',
    phoneId: receiverId as string,
    countryCode: '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    username: 'external_phone',
  };

  useEffect(() => {
    // Check camera permission for Video calls
    if (callType === 'video' && (!permission || !permission.granted)) {
      requestPermission();
    }

    startCallSequence();

    return () => {
      stopTimer();
      cleanupCall();
    };
  }, []);

  const startCallSequence = async () => {
    if (isPSTN) {
      // Twilio Calling sequence
      console.log(`[Call] Initiating Twilio PSTN call to ${receiver.countryCode}${receiver.phoneId}`);
      const result = await twilioService.makeCall(currentUser.id, `${receiver.countryCode}${receiver.phoneId}`);
      
      if (result.success) {
        setTwilioCallId(result.callId);
        // Simulate ringing to connect
        setTimeout(() => {
          setCallStatus('connected');
          startTimer();
        }, 3000);
      } else {
        setCallStatus('failed');
        Alert.alert('خطأ في الاتصال', result.error || 'عذراً، فشل إجراء مكالمة Twilio. يرجى مراجعة إعدادات الاشتراك.');
        setTimeout(() => router.back(), 3000);
      }
    } else {
      // In-app LiveKit Calling sequence
      console.log(`[Call] Initiating LiveKit WebRTC session...`);
      const roomName = `room_${currentUser.id}_${receiver.id}`;
      await liveKitService.createRoom(roomName, currentUser.id, {
        callType,
      });
      await liveKitService.joinRoom(roomName, currentUser.id, currentUser.name);

      // Simulate recipient answering the call
      setTimeout(() => {
        setCallStatus('connected');
        startTimer();
      }, 2500);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const cleanupCall = async () => {
    if (isPSTN && twilioCallId) {
      await twilioService.endCall(twilioCallId, duration);
    } else if (!isPSTN) {
      const roomName = `room_${currentUser.id}_${receiver.id}`;
      await liveKitService.leaveRoom(roomName, currentUser.id);
      await liveKitService.endRoom(roomName);
    }
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    stopTimer();
    cleanupCall();
    
    Alert.alert(
      'انتهت المكالمة',
      `المدة الزمنية للمكالمة: ${formatDuration(duration)}`,
      [{ text: 'حسنًا', onPress: () => router.back() }]
    );
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Background or video feed */}
      {callType === 'video' && callStatus === 'connected' && permission?.granted ? (
        <CameraView style={styles.cameraView} facing={facing}>
          {/* Main call UI content on top of video */}
        </CameraView>
      ) : (
        <View style={styles.voiceBackground}>
          <Image source={{ uri: receiver.avatar }} style={styles.avatarBlur} blurRadius={20} />
          <View style={styles.overlayDark} />
        </View>
      )}

      {/* Main Calling Content Wrapper */}
      <View style={styles.callingOverlay}>
        <View style={styles.headerInfo}>
          <Shield size={18} color={colors.primary} />
          <Text style={styles.encryptedText}>
            {isPSTN ? 'مكالمة Twilio PSTN حقيقية' : 'اتصال مشفر وآمن عبر LiveKit'}
          </Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: receiver.avatar }} style={styles.avatar} />
            {callStatus === 'ringing' && <View style={styles.pulseRing} />}
          </View>
          <Text style={styles.userName}>{receiver.name}</Text>
          <Text style={styles.userPhone}>
            {isPSTN ? `${receiver.countryCode}${receiver.phoneId}` : `@${receiver.username}`}
          </Text>
          <Text style={styles.statusText}>
            {callStatus === 'ringing' && 'جاري الاتصال...'}
            {callStatus === 'connected' && formatDuration(duration)}
            {callStatus === 'ended' && 'تم إنهاء المكالمة'}
            {callStatus === 'failed' && 'فشل الاتصال'}
          </Text>
        </View>

        {/* Controls Layout */}
        <View style={styles.controlsContainer}>
          <View style={styles.controlsRow}>
            {/* Mute Button */}
            <TouchableOpacity 
              style={[styles.controlButton, isMuted && styles.controlButtonActive]} 
              onPress={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff size={24} color="white" /> : <Mic size={24} color="white" />}
            </TouchableOpacity>

            {/* Speaker Button */}
            <TouchableOpacity 
              style={[styles.controlButton, isSpeakerOn && styles.controlButtonActive]} 
              onPress={() => setIsSpeakerOn(!isSpeakerOn)}
            >
              {isSpeakerOn ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color="white" />}
            </TouchableOpacity>

            {/* Camera Swap (For Video calls) */}
            {callType === 'video' && (
              <TouchableOpacity 
                style={styles.controlButton} 
                onPress={() => setFacing(curr => curr === 'front' ? 'back' : 'front')}
              >
                <Video size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>

          {/* Red End Call Button */}
          <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
            <PhoneOff size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  cameraView: {
    ...StyleSheet.absoluteFillObject,
  },
  voiceBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  avatarBlur: {
    width: width,
    height: height,
    opacity: 0.4,
  },
  overlayDark: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 14, 26, 0.85)',
  },
  callingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  encryptedText: {
    color: '#D1D5DB',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  userCard: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  pulseRing: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: `${colors.primary}80`,
    opacity: 0.8,
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
    marginBottom: 6,
  },
  userPhone: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  controlsContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 36,
    width: '100%',
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  controlButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  endCallButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});
