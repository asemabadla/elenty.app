import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowLeft, Grid, Bookmark, Settings, Phone } from 'lucide-react-native';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { mockUsers } from '@/mocks/users';
import { mockPosts } from '@/mocks/posts';

const { width } = Dimensions.get('window');
const numColumns = 3;
const tileSize = width / numColumns;

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('posts');
  const router = useRouter();

  const userId = id || '1'; // Default to current user if no ID provided
  const user = mockUsers.find(u => u.id === userId);
  const userPosts = mockPosts.filter(post => post.userId === userId);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>User not found</Text>
      </View>
    );
  }

  const isCurrentUser = userId === '1';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.username}</Text>
        {isCurrentUser && (
          <TouchableOpacity>
            <Settings size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView>
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <Avatar uri={user.avatar} size={80} />
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userPosts.length}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          <View style={styles.bioContainer}>
            <Text style={styles.name}>{user.name}</Text>
            {user.isVerified && <Text style={styles.verified}>✓</Text>}
            {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
            <Text style={styles.phoneId}>Phone ID: {user.phoneId}</Text>
          </View>

          <View style={styles.actionButtons}>
            {isCurrentUser ? (
              <Button
                title="Edit Profile"
                onPress={() => {}}
                variant="outline"
                style={styles.editButton}
              />
            ) : (
              <View style={styles.actionButtonsRow}>
                <Button
                  title="Follow"
                  onPress={() => {}}
                  style={styles.followButton}
                />
                <Button
                  title="Message"
                  onPress={() => {}}
                  variant="outline"
                  style={styles.messageButton}
                />
                <TouchableOpacity style={styles.callButton}>
                  <Phone size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Grid
              size={24}
              color={activeTab === 'posts' ? colors.primary : colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
            onPress={() => setActiveTab('saved')}
          >
            <Bookmark
              size={24}
              color={activeTab === 'saved' ? colors.primary : colors.text}
            />
          </TouchableOpacity>
        </View>

        {activeTab === 'posts' && (
          <FlatList
            data={userPosts}
            keyExtractor={item => item.id}
            numColumns={numColumns}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.postTile}>
                <Image
                  source={{ uri: item.media[0].url }}
                  style={styles.postImage}
                  contentFit="cover"
                />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No posts yet</Text>
              </View>
            }
          />
        )}

        {activeTab === 'saved' && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No saved posts</Text>
          </View>
        )}
      </ScrollView>
    </View>
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
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  profileHeader: {
    padding: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bioContainer: {
    marginTop: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  verified: {
    color: colors.primary,
    fontSize: 16,
    marginLeft: 4,
  },
  bio: {
    marginTop: 4,
    color: colors.text,
  },
  phoneId: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionButtons: {
    marginTop: 16,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    width: '100%',
  },
  followButton: {
    flex: 1,
    marginRight: 8,
  },
  messageButton: {
    flex: 1,
    marginRight: 8,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  postTile: {
    width: tileSize,
    height: tileSize,
    padding: 1,
  },
  postImage: {
    flex: 1,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});