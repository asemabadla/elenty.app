import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { ArrowLeft, Radio, Users, MessageCircle, Heart, Gift, Settings, RotateCcw } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';

export default function LiveStudioScreen() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [isLive, setIsLive] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [viewers, setViewers] = useState(0);
  const router = useRouter();

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need camera permission for live streaming</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current: CameraType) => (current === 'back' ? 'front' : 'back'));
  };

  const startLiveStream = () => {
    if (!streamTitle.trim()) {
      Alert.alert('Error', 'Please enter a stream title');
      return;
    }
    
    setIsLive(true);
    setViewers(1);
    
    // Simulate viewer count increase
    const interval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 3));
    }, 2000);

    // Store interval ID for cleanup
    setTimeout(() => clearInterval(interval), 60000);
  };

  const endLiveStream = () => {
    setIsLive(false);
    setViewers(0);
    Alert.alert('Stream Ended', `Your live stream has ended. You had ${viewers} viewers!`, [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  if (!isLive) {
    return (
      <View style={styles.container}>
        <View style={styles.setupContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Go Live</Text>
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
              <Text style={styles.label}>Stream Title</Text>
              <TextInput
                style={styles.input}
                placeholder="What's your stream about?"
                value={streamTitle}
                onChangeText={setStreamTitle}
                maxLength={100}
              />
            </View>

            <View style={styles.settingsContainer}>
              <Text style={styles.sectionTitle}>Stream Settings</Text>
              
              <TouchableOpacity style={styles.settingItem}>
                <Users size={20} color={colors.primary} />
                <Text style={styles.settingText}>Allow viewers to join</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingItem}>
                <MessageCircle size={20} color={colors.primary} />
                <Text style={styles.settingText}>Enable chat</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingItem}>
                <Gift size={20} color={colors.primary} />
                <Text style={styles.settingText}>Allow gifts</Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Start Live Stream"
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
        <View style={styles.liveOverlay}>
          <View style={styles.liveHeader}>
            <View style={styles.liveIndicator}>
              <Radio size={16} color="white" />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            
            <View style={styles.viewerCount}>
              <Users size={16} color="white" />
              <Text style={styles.viewerText}>{viewers}</Text>
            </View>
            
            <TouchableOpacity onPress={endLiveStream} style={styles.endButton}>
              <Text style={styles.endButtonText}>End</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.liveControls}>
            <TouchableOpacity style={styles.liveControlButton}>
              <MessageCircle size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.liveControlButton}>
              <Heart size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.liveControlButton}>
              <Gift size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.liveControlButton} onPress={toggleCameraFacing}>
              <RotateCcw size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.chatContainer}>
            <Text style={styles.chatMessage}>👋 Welcome to the stream!</Text>
            <Text style={styles.chatMessage}>🔥 Great content!</Text>
            <Text style={styles.chatMessage}>❤️ Love this!</Text>
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
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingText: {
    marginLeft: 12,
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
  },
  liveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.notification,
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
    bottom: 100,
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
  chatContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 80,
  },
  chatMessage: {
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
});