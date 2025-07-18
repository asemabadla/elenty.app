// Database service - Backend enabled
import { apiService } from './api';
import { User, Post, Story, Message, Chat, PhoneCall, ShortVideo, LiveStream, Challenge } from '@/types';

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

// Backend-enabled database service implementation
export const createDatabaseService = (config?: DatabaseConfig): DatabaseService => {
  return {
    // User operations
    createUser: async (userData: any): Promise<User> => {
      try {
        const response = await apiService.register(userData);
        return response.user;
      } catch (error) {
        console.error('Failed to create user:', error);
        throw error;
      }
    },
    
    getUserById: async (id: string): Promise<User> => {
      try {
        const response = await apiService.getProfile(id);
        return response.user;
      } catch (error) {
        console.error('Failed to get user:', error);
        throw error;
      }
    },
    
    updateUser: async (id: string, userData: any): Promise<User> => {
      try {
        const response = await apiService.updateProfile(id, userData);
        return response.user;
      } catch (error) {
        console.error('Failed to update user:', error);
        throw error;
      }
    },
    
    deleteUser: async (id: string): Promise<boolean> => {
      try {
        await apiService.updateProfile(id, { is_active: false });
        return true;
      } catch (error) {
        console.error('Failed to delete user:', error);
        return false;
      }
    },
    
    searchUsers: async (query: string): Promise<User[]> => {
      try {
        const response = await apiService.searchUsers(query);
        return response.users;
      } catch (error) {
        console.error('Failed to search users:', error);
        throw error;
      }
    },
    
    // Post operations
    createPost: async (postData: any): Promise<Post> => {
      try {
        const response = await apiService.createPost(postData);
        return response.post;
      } catch (error) {
        console.error('Failed to create post:', error);
        throw error;
      }
    },
    
    getPostsByUser: async (userId: string): Promise<Post[]> => {
      try {
        const response = await apiService.getFeed(userId, 1, 50);
        return response.posts.filter((post: Post) => post.userId === userId);
      } catch (error) {
        console.error('Failed to get user posts:', error);
        throw error;
      }
    },
    
    getFeedPosts: async (userId: string, limit = 20): Promise<Post[]> => {
      try {
        const response = await apiService.getFeed(userId, 1, limit);
        return response.posts;
      } catch (error) {
        console.error('Failed to get feed posts:', error);
        throw error;
      }
    },
    
    likePost: async (postId: string, userId: string): Promise<boolean> => {
      try {
        await apiService.likePost(postId);
        return true;
      } catch (error) {
        console.error('Failed to like post:', error);
        return false;
      }
    },
    
    unlikePost: async (postId: string, userId: string): Promise<boolean> => {
      try {
        // API would need an unlike endpoint
        await apiService.likePost(postId); // This would toggle like/unlike
        return true;
      } catch (error) {
        console.error('Failed to unlike post:', error);
        return false;
      }
    },
    
    savePost: async (postId: string, userId: string): Promise<boolean> => {
      try {
        // Would need a save post endpoint in API
        return true;
      } catch (error) {
        console.error('Failed to save post:', error);
        return false;
      }
    },
    
    unsavePost: async (postId: string, userId: string): Promise<boolean> => {
      try {
        // Would need an unsave post endpoint in API
        return true;
      } catch (error) {
        console.error('Failed to unsave post:', error);
        return false;
      }
    },
    
    // Story operations
    createStory: async (storyData: any): Promise<Story> => {
      try {
        const response = await apiService.createStory(storyData);
        return response.story;
      } catch (error) {
        console.error('Failed to create story:', error);
        throw error;
      }
    },
    
    getActiveStories: async (userId: string): Promise<Story[]> => {
      try {
        const response = await apiService.getStories(userId);
        return response.stories;
      } catch (error) {
        console.error('Failed to get stories:', error);
        throw error;
      }
    },
    
    markStoryAsSeen: async (storyId: string, userId: string): Promise<boolean> => {
      try {
        // Would need a mark story as seen endpoint
        return true;
      } catch (error) {
        console.error('Failed to mark story as seen:', error);
        return false;
      }
    },
    
    // Message operations
    sendMessage: async (messageData: any): Promise<Message> => {
      try {
        const response = await apiService.sendMessage(messageData.chatId, messageData);
        return response.message;
      } catch (error) {
        console.error('Failed to send message:', error);
        throw error;
      }
    },
    
    getChatMessages: async (chatId: string, page = 1, limit = 50): Promise<Message[]> => {
      try {
        const response = await apiService.getChatMessages(chatId, page, limit);
        return response.messages;
      } catch (error) {
        console.error('Failed to get chat messages:', error);
        throw error;
      }
    },
    
    getUserChats: async (userId: string): Promise<Chat[]> => {
      try {
        const response = await apiService.getUserChats(userId);
        return response.chats;
      } catch (error) {
        console.error('Failed to get user chats:', error);
        throw error;
      }
    },
    
    // Call operations
    createCall: async (callData: any): Promise<PhoneCall> => {
      try {
        const response = await apiService.initiateCall(callData);
        return response.call;
      } catch (error) {
        console.error('Failed to create call:', error);
        throw error;
      }
    },
    
    getCallHistory: async (userId: string): Promise<PhoneCall[]> => {
      try {
        const response = await apiService.getCallHistory(userId);
        return response.calls;
      } catch (error) {
        console.error('Failed to get call history:', error);
        throw error;
      }
    },
    
    updateCallStatus: async (callId: string, status: string): Promise<boolean> => {
      try {
        // Would need an update call status endpoint
        return true;
      } catch (error) {
        console.error('Failed to update call status:', error);
        return false;
      }
    },
    
    // Live stream operations
    createLiveStream: async (streamData: any): Promise<LiveStream> => {
      try {
        const response = await apiService.startLiveStream(streamData);
        return response.stream;
      } catch (error) {
        console.error('Failed to create live stream:', error);
        throw error;
      }
    },
    
    getActiveLiveStreams: async (): Promise<LiveStream[]> => {
      try {
        const response = await apiService.getLiveStreams();
        return response.streams;
      } catch (error) {
        console.error('Failed to get live streams:', error);
        throw error;
      }
    },
    
    endLiveStream: async (streamId: string): Promise<boolean> => {
      try {
        await apiService.endLiveStream(streamId);
        return true;
      } catch (error) {
        console.error('Failed to end live stream:', error);
        return false;
      }
    },
    
    // Challenge operations
    createChallenge: async (challengeData: any): Promise<Challenge> => {
      try {
        const response = await apiService.createChallenge(challengeData);
        return response.challenge;
      } catch (error) {
        console.error('Failed to create challenge:', error);
        throw error;
      }
    },
    
    getTrendingChallenges: async (): Promise<Challenge[]> => {
      try {
        const response = await apiService.getTrendingChallenges();
        return response.challenges;
      } catch (error) {
        console.error('Failed to get trending challenges:', error);
        throw error;
      }
    },
    
    joinChallenge: async (challengeId: string, userId: string): Promise<boolean> => {
      try {
        await apiService.joinChallenge(challengeId);
        return true;
      } catch (error) {
        console.error('Failed to join challenge:', error);
        return false;
      }
    },
    
    // Short video operations
    createShortVideo: async (videoData: any): Promise<ShortVideo> => {
      try {
        // Would use the posts endpoint with video type
        const response = await apiService.createPost({
          ...videoData,
          type: 'video'
        });
        return response.post;
      } catch (error) {
        console.error('Failed to create short video:', error);
        throw error;
      }
    },
    
    getShortVideos: async (page = 1, limit = 20): Promise<ShortVideo[]> => {
      try {
        // Would need a specific short videos endpoint
        const response = await apiService.getFeed('', page, limit);
        return response.posts.filter((post: any) => post.type === 'video');
      } catch (error) {
        console.error('Failed to get short videos:', error);
        throw error;
      }
    },
    
    likeVideo: async (videoId: string, userId: string): Promise<boolean> => {
      try {
        await apiService.likePost(videoId);
        return true;
      } catch (error) {
        console.error('Failed to like video:', error);
        return false;
      }
    },
    
    unlikeVideo: async (videoId: string, userId: string): Promise<boolean> => {
      try {
        await apiService.likePost(videoId); // Toggle like
        return true;
      } catch (error) {
        console.error('Failed to unlike video:', error);
        return false;
      }
    },
  };
};

// Export singleton instance
export const databaseService = createDatabaseService();