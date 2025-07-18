import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Video, Image as ImageIcon, Type, BarChart3, MapPin, Users, Sparkles } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';

export default function CreateScreen() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [postText, setPostText] = useState('');
  const router = useRouter();

  const createOptions = [
    {
      id: 'photo',
      title: 'Photo',
      subtitle: 'Share a moment',
      icon: <ImageIcon size={24} color={colors.primary} />,
      action: () => handleCreatePhoto(),
    },
    {
      id: 'video',
      title: 'Video',
      subtitle: 'Upload a video',
      icon: <Video size={24} color={colors.primary} />,
      action: () => handleCreateVideo(),
    },
    {
      id: 'reel',
      title: 'Reel',
      subtitle: 'Create short video',
      icon: <Camera size={24} color={colors.primary} />,
      action: () => router.push('/studio'),
    },
    {
      id: 'live',
      title: 'Go Live',
      subtitle: 'Stream live video',
      icon: <Video size={24} color={colors.notification} />,
      action: () => router.push('/live-studio'),
    },
    {
      id: 'text',
      title: 'Text Post',
      subtitle: 'Share your thoughts',
      icon: <Type size={24} color={colors.primary} />,
      action: () => setSelectedType('text'),
    },
    {
      id: 'poll',
      title: 'Poll',
      subtitle: 'Ask your audience',
      icon: <BarChart3 size={24} color={colors.primary} />,
      action: () => setSelectedType('poll'),
    },
    {
      id: 'location',
      title: 'Check In',
      subtitle: 'Share your location',
      icon: <MapPin size={24} color={colors.primary} />,
      action: () => setSelectedType('location'),
    },
    {
      id: 'challenge',
      title: 'Challenge',
      subtitle: 'Start a trend',
      icon: <Sparkles size={24} color={colors.secondary} />,
      action: () => router.push('/challenges/create'),
    },
  ];

  const handleCreatePhoto = () => {
    // In a real app, this would open the camera or photo picker
    Alert.alert('Photo', 'Open camera or photo picker');
  };

  const handleCreateVideo = () => {
    // In a real app, this would open the video picker
    Alert.alert('Video', 'Open video picker');
  };

  const handlePublishTextPost = () => {
    if (!postText.trim()) return;
    
    // In a real app, this would create the post
    Alert.alert('Success', 'Post published!', [
      { text: 'OK', onPress: () => {
        setPostText('');
        setSelectedType(null);
        router.push('/');
      }}
    ]);
  };

  if (selectedType === 'text') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedType(null)}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Text Post</Text>
          <TouchableOpacity onPress={handlePublishTextPost}>
            <Text style={[styles.publishButton, !postText.trim() && styles.disabledButton]}>
              Publish
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.textPostContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="What's on your mind?"
            value={postText}
            onChangeText={setPostText}
            multiline
            autoFocus
          />
        </View>

        <View style={styles.textPostOptions}>
          <TouchableOpacity style={styles.optionButton}>
            <MapPin size={20} color={colors.primary} />
            <Text style={styles.optionText}>Add Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Users size={20} color={colors.primary} />
            <Text style={styles.optionText}>Tag People</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Create</Text>
          <Text style={styles.subtitle}>Share your creativity with the world</Text>
        </View>

        <View style={styles.optionsGrid}>
          {createOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={option.action}
              activeOpacity={0.7}
            >
              <View style={styles.optionIcon}>
                {option.icon}
              </View>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/effects')}
          >
            <Sparkles size={20} color={colors.secondary} />
            <Text style={styles.quickActionText}>Browse Effects</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/challenges')}
          >
            <Users size={20} color={colors.primary} />
            <Text style={styles.quickActionText}>Join Challenge</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  cancelButton: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  publishButton: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    color: colors.inactive,
  },
  headerSection: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  optionCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  quickActions: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  textPostContainer: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    fontSize: 18,
    color: colors.text,
    textAlignVertical: 'top',
    minHeight: 200,
  },
  textPostOptions: {
    padding: 20,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.primary,
  },
});