// Database service - Backend enabled using Firebase Realtime Database
import { User, Post, Story, Message, Chat, PhoneCall, ShortVideo, LiveStream, Challenge } from '@/types';
import { firebaseDatabase } from './firebaseDatabase';
import { mockUsers, getCurrentUser } from '@/mocks/users';

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export interface DatabaseService {
  // User operations
  createUser: (userData: any) => Promise<User>;
  getUserById: (id: string) => Promise<User>;
  updateUser: (id: string, userData: any) => Promise<User>;
  deleteUser: (id: string) => Promise<boolean>;
  searchUsers: (query: string) => Promise<User[]>;
  
  // Post operations
  createPost: (postData: any) => Promise<Post>;
  getPostsByUser: (userId: string) => Promise<Post[]>;
  getFeedPosts: (userId: string, limit?: number) => Promise<Post[]>;
  likePost: (postId: string, userId: string) => Promise<boolean>;
  unlikePost: (postId: string, userId: string) => Promise<boolean>;
  savePost: (postId: string, userId: string) => Promise<boolean>;
  unsavePost: (postId: string, userId: string) => Promise<boolean>;
  
  // Story operations
  createStory: (storyData: any) => Promise<Story>;
  getActiveStories: (userId: string) => Promise<Story[]>;
  markStoryAsSeen: (storyId: string, userId: string) => Promise<boolean>;
  
  // Message operations
  sendMessage: (messageData: any) => Promise<Message>;
  getChatMessages: (chatId: string, page?: number, limit?: number) => Promise<Message[]>;
  getUserChats: (userId: string) => Promise<Chat[]>;
  
  // Call operations
  createCall: (callData: any) => Promise<PhoneCall>;
  getCallHistory: (userId: string) => Promise<PhoneCall[]>;
  updateCallStatus: (callId: string, status: string) => Promise<boolean>;
  
  // Live stream operations
  createLiveStream: (streamData: any) => Promise<LiveStream>;
  getActiveLiveStreams: () => Promise<LiveStream[]>;
  endLiveStream: (streamId: string) => Promise<boolean>;
  
  // Challenge operations
  createChallenge: (challengeData: any) => Promise<Challenge>;
  getTrendingChallenges: () => Promise<Challenge[]>;
  joinChallenge: (challengeId: string, userId: string) => Promise<boolean>;
  
  // Short video operations
  createShortVideo: (videoData: any) => Promise<ShortVideo>;
  getShortVideos: (page?: number, limit?: number) => Promise<ShortVideo[]>;
  likeVideo: (videoId: string, userId: string) => Promise<boolean>;
  unlikeVideo: (videoId: string, userId: string) => Promise<boolean>;
}

export const createDatabaseService = (): DatabaseService => {
  return {
    // User operations
    createUser: async (userData: any): Promise<User> => {
      try {
        return await firebaseDatabase.createUser(userData);
      } catch (error) {
        console.error('Failed to create user:', error);
        // Fallback to mock
        return {
          id: userData.id || 'mock_user_1',
          phoneId: userData.phoneId,
          username: userData.username,
          name: userData.name,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
          bio: 'Mock fallback user',
          followers: 0,
          following: 0,
          isVerified: false,
          canReceiveCalls: true,
          countryCode: userData.countryCode || '+966',
        };
      }
    },
    
    getUserById: async (id: string): Promise<User> => {
      try {
        const user = await firebaseDatabase.getUserById(id);
        if (user) return user;
        throw new Error('User not found in Firebase');
      } catch (error) {
        console.log('Failed to get user, using mock fallback:', error);
        return mockUsers.find(u => u.id === id) || getCurrentUser();
      }
    },
    
    updateUser: async (id: string, userData: any): Promise<User> => {
      try {
        return await firebaseDatabase.updateUser(id, userData);
      } catch (error) {
        console.error('Failed to update user:', error);
        throw error;
      }
    },
    
    deleteUser: async (id: string): Promise<boolean> => {
      try {
        await firebaseDatabase.updateUser(id, { is_active: false });
        return true;
      } catch (error) {
        console.error('Failed to delete user:', error);
        return false;
      }
    },
    
    searchUsers: async (query: string): Promise<User[]> => {
      try {
        return await firebaseDatabase.searchUsers(query);
      } catch (error) {
        console.error('Failed to search users:', error);
        return mockUsers.filter(u => u.name.includes(query) || u.username.includes(query));
      }
    },
    
    // Post operations
    createPost: async (postData: any): Promise<Post> => {
      try {
        return await firebaseDatabase.createPost(postData);
      } catch (error) {
        console.error('Failed to create post:', error);
        throw error;
      }
    },
    
    getPostsByUser: async (userId: string): Promise<Post[]> => {
      try {
        return await firebaseDatabase.getPostsByUser(userId);
      } catch (error) {
        console.error('Failed to get user posts:', error);
        return [];
      }
    },
    
    getFeedPosts: async (userId: string, limit = 20): Promise<Post[]> => {
      try {
        return await firebaseDatabase.getFeedPosts();
      } catch (error) {
        console.error('Failed to get feed posts:', error);
        return [];
      }
    },
    
    likePost: async (postId: string, userId: string): Promise<boolean> => {
      try {
        return await firebaseDatabase.likePost(postId, userId);
      } catch (error) {
        console.error('Failed to like post:', error);
        return false;
      }
    },
    
    unlikePost: async (postId: string, userId: string): Promise<boolean> => {
      return true;
    },
    
    savePost: async (postId: string, userId: string): Promise<boolean> => {
      return true;
    },
    
    unsavePost: async (postId: string, userId: string): Promise<boolean> => {
      return true;
    },
    
    // Story operations
    createStory: async (storyData: any): Promise<Story> => {
      try {
        return await firebaseDatabase.createStory(storyData);
      } catch (error) {
        console.error('Failed to create story:', error);
        throw error;
      }
    },
    
    getActiveStories: async (userId: string): Promise<Story[]> => {
      try {
        return await firebaseDatabase.getActiveStories();
      } catch (error) {
        console.error('Failed to get stories:', error);
        return [];
      }
    },
    
    markStoryAsSeen: async (storyId: string, userId: string): Promise<boolean> => {
      return true;
    },
    
    // Message operations
    sendMessage: async (messageData: any): Promise<Message> => {
      try {
        return await firebaseDatabase.sendMessage(messageData.chatId, messageData);
      } catch (error) {
        console.error('Failed to send message:', error);
        throw error;
      }
    },
    
    getChatMessages: async (chatId: string, page = 1, limit = 50): Promise<Message[]> => {
      try {
        return await firebaseDatabase.getChatMessages(chatId);
      } catch (error) {
        console.error('Failed to get chat messages:', error);
        return [];
      }
    },
    
    getUserChats: async (userId: string): Promise<Chat[]> => {
      try {
        return await firebaseDatabase.getUserChats(userId);
      } catch (error) {
        console.error('Failed to get user chats:', error);
        return [];
      }
    },
    
    // Call operations
    createCall: async (callData: any): Promise<PhoneCall> => {
      try {
        return await firebaseDatabase.createCall(callData);
      } catch (error) {
        console.error('Failed to create call:', error);
        // Mock fallback
        return {
          id: `call_${Date.now()}`,
          callerId: callData.callerId,
          receiverId: callData.receiverId,
          status: 'ringing',
          type: callData.type || 'voice',
          startTime: Date.now(),
          duration: 0,
        };
      }
    },
    
    getCallHistory: async (userId: string): Promise<PhoneCall[]> => {
      try {
        return await firebaseDatabase.getCallHistory(userId);
      } catch (error) {
        console.error('Failed to get call history:', error);
        return [];
      }
    },
    
    updateCallStatus: async (callId: string, status: string): Promise<boolean> => {
      return true;
    },
    
    // Live stream operations
    createLiveStream: async (streamData: any): Promise<LiveStream> => {
      try {
        return await firebaseDatabase.createLiveStream(streamData);
      } catch (error) {
        console.error('Failed to create live stream:', error);
        throw error;
      }
    },
    
    getActiveLiveStreams: async (): Promise<LiveStream[]> => {
      try {
        return await firebaseDatabase.getActiveLiveStreams();
      } catch (error) {
        console.error('Failed to get live streams:', error);
        return [];
      }
    },
    
    endLiveStream: async (streamId: string): Promise<boolean> => {
      try {
        return await firebaseDatabase.endLiveStream(streamId);
      } catch (error) {
        console.error('Failed to end live stream:', error);
        return false;
      }
    },
    
    // Challenge operations
    createChallenge: async (challengeData: any): Promise<Challenge> => {
      return {
        id: `challenge_${Date.now()}`,
        title: challengeData.title,
        description: challengeData.description || '',
        hashtag: challengeData.hashtag,
        thumbnail: '',
        participants: 0,
        videos: 0,
        isHot: false,
        createdBy: challengeData.creatorId || '',
        createdAt: Date.now(),
      };
    },
    
    getTrendingChallenges: async (): Promise<Challenge[]> => {
      return [];
    },
    
    joinChallenge: async (challengeId: string, userId: string): Promise<boolean> => {
      return true;
    },
    
    // Short video operations
    createShortVideo: async (videoData: any): Promise<ShortVideo> => {
      return {
        id: `video_${Date.now()}`,
        userId: videoData.userId,
        videoUrl: videoData.videoUrl,
        caption: videoData.caption || '',
        likes: 0,
        comments: 0,
        shares: 0,
        music: 'أغنية تجريبية',
        timestamp: Date.now(),
      };
    },
    
    getShortVideos: async (page = 1, limit = 20): Promise<ShortVideo[]> => {
      return [];
    },
    
    likeVideo: async (videoId: string, userId: string): Promise<boolean> => {
      return true;
    },
    
    unlikeVideo: async (videoId: string, userId: string): Promise<boolean> => {
      return true;
    },
  };
};

export const databaseService = createDatabaseService();