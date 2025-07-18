import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { ArrowLeft, RotateCcw, Zap, Music, Sparkles, Square, Circle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';

const { width, height } = Dimensions.get('window');

const effects = [
  { id: 'none', name: 'None', icon: '✨' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'vintage', name: 'Vintage', icon: '📷' },
  { id: 'neon', name: 'Neon', icon: '🌈' },
  { id: 'blur', name: 'Blur', icon: '🌫️' },
];

export default function StudioScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState('none');
  const [flashMode, setFlashMode] = useState(false);
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current: CameraType) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlashMode(!flashMode);
  };

  const startRecording = async () => {
    if (!cameraRef.current) return;
    
    setIsRecording(true);
    // In a real app, you would start video recording here
    Alert.alert('Recording', 'Started recording video');
  };

  const stopRecording = async () => {
    setIsRecording(false);
    // In a real app, you would stop recording and process the video
    Alert.alert('Recording Complete', 'Video saved to gallery');
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    
    // In a real app, you would take a photo here
    Alert.alert('Photo', 'Photo captured');
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        <View style={styles.overlay}>
          <View style={styles.topControls}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.topRightControls}>
              <TouchableOpacity onPress={toggleFlash} style={styles.controlButton}>
                <Zap size={24} color={flashMode ? colors.secondary : "white"} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Music size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sideControls}>
            <TouchableOpacity onPress={toggleCameraFacing} style={styles.sideButton}>
              <RotateCcw size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.sideButton}>
              <Sparkles size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomControls}>
            <View style={styles.effectsContainer}>
              {effects.map((effect) => (
                <TouchableOpacity
                  key={effect.id}
                  style={[
                    styles.effectButton,
                    selectedEffect === effect.id && styles.selectedEffect,
                  ]}
                  onPress={() => setSelectedEffect(effect.id)}
                >
                  <Text style={styles.effectIcon}>{effect.icon}</Text>
                  <Text style={styles.effectName}>{effect.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.recordingControls}>
              <TouchableOpacity style={styles.galleryButton}>
                <Text style={styles.galleryText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.recordButton, isRecording && styles.recordingButton]}
                onPress={isRecording ? stopRecording : startRecording}
                onLongPress={startRecording}
              >
                {isRecording ? (
                  <Square size={30} color="white" fill="white" />
                ) : (
                  <Circle size={70} color="white" strokeWidth={4} />
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                <Text style={styles.photoText}>Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
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
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRightControls: {
    flexDirection: 'row',
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sideControls: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -60 }],
  },
  sideButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
  },
  effectsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  effectButton: {
    alignItems: 'center',
    marginHorizontal: 10,
    padding: 8,
    borderRadius: 8,
  },
  selectedEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  effectIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  effectName: {
    color: 'white',
    fontSize: 10,
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  galleryButton: {
    width: 60,
    alignItems: 'center',
  },
  galleryText: {
    color: 'white',
    fontSize: 14,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingButton: {
    backgroundColor: colors.notification,
  },
  photoButton: {
    width: 60,
    alignItems: 'center',
  },
  photoText: {
    color: 'white',
    fontSize: 14,
  },
});