import { create } from 'zustand';
import { Post, Story, ShortVideo, Chat, Message } from '@/types';
import { mockPosts } from '@/mocks/posts';
import { mockStories } from '@/mocks/stories';
import { mockVideos } from '@/mocks/videos';
import { mockChats } from '@/mocks/chats';
import { getCurrentUser } from '@/mocks/users';

interface SocialState {
  // Data
  posts: Post[];
  stories: Story[];
  shortVideos: ShortVideo[];
  chats: Chat[];
  messages: Record<string, Message[]>;
  activeChat: string | null;
  
  // Loading states
  isLoadingPosts: boolean;
  isLoadingStories: boolean;
  isLoadingVideos: boolean;
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  
  // Error states
  postsError: string | null;
  storiesError: string | null;
  videosError: string | null;
  chatsError: string | null;
  messagesError: string | null;
  
  // Actions
  loadFeed: (userId: string) => Promise<void>;
  loadStories: (userId: string) => Promise<void>;
  loadShortVideos: () => Promise<void>;
  loadChats: (userId: string) => Promise<void>;
  loadChatMessages: (chatId: string) => Promise<void>;
  
  // Posts actions
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  savePost: (postId: string) => Promise<void>;
  unsavePost: (postId: string) => Promise<void>;
  createPost: (postData: any) => Promise<void>;
  
  // Stories actions
  markStorySeen: (storyId: string) => Promise<void>;
  createStory: (storyData: any) => Promise<void>;
  
  // Videos actions
  likeVideo: (videoId: string) => Promise<void>;
  unlikeVideo: (videoId: string) => Promise<void>;
  createShortVideo: (videoData: any) => Promise<void>;
  
  // Chat actions
  setActiveChat: (chatId: string | null) => void;
  sendMessage: (chatId: string, content: string, type: Message['type']) => Promise<void>;
  markChatAsRead: (chatId: string) => void;
  
  // Utility actions
  clearErrors: () => void;
  refreshAll: (userId: string) => Promise<void>;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  // Initial data
  posts: [],
  stories: [],
  shortVideos: [],
  chats: [],
  messages: {},
  activeChat: null,
  
  // Loading states
  isLoadingPosts: false,
  isLoadingStories: false,
  isLoadingVideos: false,
  isLoadingChats: false,
  isLoadingMessages: false,
  
  // Error states
  postsError: null,
  storiesError: null,
  videosError: null,
  chatsError: null,
  messagesError: null,
  
  // Load feed posts
  loadFeed: async (userId: string) => {
    try {
      set({ isLoadingPosts: true, postsError: null });
      // Use mock data for now
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
      set({ posts: mockPosts, isLoadingPosts: false });
    } catch (error: any) {
      console.error('Failed to load feed:', error);
      set({ 
        postsError: error.message || 'Failed to load posts',
        isLoadingPosts: false 
      });
    }
  },
  
  // Load stories
  loadStories: async (userId: string) => {
    try {
      set({ isLoadingStories: true, storiesError: null });
      // Use mock data for now
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate loading
      set({ stories: mockStories, isLoadingStories: false });
    } catch (error: any) {
      console.error('Failed to load stories:', error);
      set({ 
        storiesError: error.message || 'Failed to load stories',
        isLoadingStories: false 
      });
    }
  },
  
  // Load short videos
  loadShortVideos: async () => {
    try {
      set({ isLoadingVideos: true, videosError: null });
      // Use mock data for now
      await new Promise(resolve => setTimeout(resolve, 400)); // Simulate loading
      set({ shortVideos: mockVideos, isLoadingVideos: false });
    } catch (error: any) {
      console.error('Failed to load short videos:', error);
      set({ 
        videosError: error.message || 'Failed to load videos',
        isLoadingVideos: false 
      });
    }
  },
  
  // Load chats
  loadChats: async (userId: string) => {
    try {
      set({ isLoadingChats: true, chatsError: null });
      // Use mock data for now
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate loading
      set({ chats: mockChats, isLoadingChats: false });
    } catch (error: any) {
      console.error('Failed to load chats:', error);
      set({ 
        chatsError: error.message || 'Failed to load chats',
        isLoadingChats: false 
      });
    }
  },
  
  // Load chat messages
  loadChatMessages: async (chatId: string) => {
    try {
      set({ isLoadingMessages: true, messagesError: null });
      // Use mock data for now
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate loading
      const messages: Message[] = []; // Empty for now
      set(state => ({
        messages: {
          ...state.messages,
          [chatId]: messages
        },
        isLoadingMessages: false
      }));
    } catch (error: any) {
      console.error('Failed to load messages:', error);
      set({ 
        messagesError: error.message || 'Failed to load messages',
        isLoadingMessages: false 
      });
    }
  },
  
  // Posts actions
  likePost: async (postId: string) => {
    const user = getCurrentUser();
    if (!user) return;
    
    try {
      // Optimistic update
      set(state => ({
        posts: state.posts.map(post => 
          post.id === postId 
            ? { ...post, likes: post.hasLiked ? post.likes : post.likes + 1, hasLiked: true } 
            : post
        )
      }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      console.error('Failed to like post:', error);
      // Revert optimistic update
      set(state => ({
        posts: state.posts.map(post => 
          post.id === postId 
            ? { ...post, likes: post.hasLiked ? post.likes - 1 : post.likes, hasLiked: false } 
            : post
        )
      }));
    }
  },
  
  unlikePost: async (postId: string) => {
    const user = getCurrentUser();
    if (!user) return;
    
    try {
      // Optimistic update
      set(state => ({
        posts: state.posts.map(post => 
          post.id === postId 
            ? { ...post, likes: post.hasLiked ? post.likes - 1 : post.likes, hasLiked: false } 
            : post
        )
      }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      console.error('Failed to unlike post:', error);
      // Revert optimistic update
      set(state => ({
        posts: state.posts.map(post => 
          post.id === postId 
            ? { ...post, likes: post.hasLiked ? post.likes : post.likes + 1, hasLiked: true } 
            : post
        )
      }));
    }
  },
  
  savePost: async (postId: string) => {
    const user = getCurrentUser();
    if (!user) return;
    
    try {
      set(state => ({
        posts: state.posts.map(post => 
          post.id === postId ? { ...post, hasSaved: true } : post
        )
      }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      console.error('Failed to save post:', error);
      set(state => ({
        posts: state.posts.map(post => 
          post.id === postId ? { ...post, hasSaved: false } : post
        )
      }));
    }
  },
  
  unsavePost: async (postId: string) => {
    const user = getCurrentUser();
    if (!user) return;
    
    try {
      set(state => ({
        posts: state.posts.map(post => 
          post.id === postId ? { ...post, hasSaved: false } : post
        )
      }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      console.error('Failed to unsave post:', error);
      set(state => ({
        posts: state.posts.map(post => 
          post.id === postId ? { ...post, hasSaved: true } : post
        )
      }));
    }
  },
  
  createPost: async (postData: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newPost: Post = {
        id: Date.now().toString(),
        userId: getCurrentUser().id,
        user: getCurrentUser(),
        caption: postData.caption || '',
        media: postData.media || [],
        likes: 0,
        comments: 0,
        timestamp: Date.now(),
        hasLiked: false,
        hasSaved: false,
      };
      set(state => ({
        posts: [newPost, ...state.posts]
      }));
    } catch (error: any) {
      console.error('Failed to create post:', error);
      throw error;
    }
  },
  
  // Stories actions
  markStorySeen: async (storyId: string) => {
    const user = getCurrentUser();
    if (!user) return;
    
    try {
      set(state => ({
        stories: state.stories.map(story => 
          story.id === storyId ? { ...story, seen: true } : story
        )
      }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      console.error('Failed to mark story as seen:', error);
    }
  },
  
  createStory: async (storyData: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      const newStory: Story = {
        id: Date.now().toString(),
        userId: getCurrentUser().id,
        user: getCurrentUser(),
        media: storyData.media || { type: 'image', url: '' },
        timestamp: Date.now(),
        seen: false,
      };
      set(state => ({
        stories: [newStory, ...state.stories]
      }));
    } catch (error: any) {
      console.error('Failed to create story:', error);
      throw error;
    }
  },
  
  // Videos actions
  likeVideo: async (videoId: string) => {
    const user = getCurrentUser();
    if (!user) return;
    
    try {
      set(state => ({
        shortVideos: state.shortVideos.map(video => 
          video.id === videoId 
            ? { ...video, likes: video.hasLiked ? video.likes : video.likes + 1, hasLiked: true } 
            : video
        )
      }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      console.error('Failed to like video:', error);
      set(state => ({
        shortVideos: state.shortVideos.map(video => 
          video.id === videoId 
            ? { ...video, likes: video.hasLiked ? video.likes - 1 : video.likes, hasLiked: false } 
            : video
        )
      }));
    }
  },
  
  unlikeVideo: async (videoId: string) => {
    const user = getCurrentUser();
    if (!user) return;
    
    try {
      set(state => ({
        shortVideos: state.shortVideos.map(video => 
          video.id === videoId 
            ? { ...video, likes: video.hasLiked ? video.likes - 1 : video.likes, hasLiked: false } 
            : video
        )
      }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      console.error('Failed to unlike video:', error);
      set(state => ({
        shortVideos: state.shortVideos.map(video => 
          video.id === videoId 
            ? { ...video, likes: video.hasLiked ? video.likes : video.likes + 1, hasLiked: true } 
            : video
        )
      }));
    }
  },
  
  createShortVideo: async (videoData: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const newVideo: ShortVideo = {
        id: Date.now().toString(),
        userId: getCurrentUser().id,
        user: getCurrentUser(),
        videoUrl: videoData.videoUrl || '',
        caption: videoData.caption || '',
        likes: 0,
        comments: 0,
        shares: 0,
        music: videoData.music || '',
        timestamp: Date.now(),
        hasLiked: false,
        effects: videoData.effects || [],
        challenge: videoData.challenge,
      };
      set(state => ({
        shortVideos: [newVideo, ...state.shortVideos]
      }));
    } catch (error: any) {
      console.error('Failed to create short video:', error);
      throw error;
    }
  },
  
  // Chat actions
  setActiveChat: (chatId: string | null) => set({ activeChat: chatId }),
  
  sendMessage: async (chatId: string, content: string, type: Message['type']) => {
    const user = getCurrentUser();
    if (!user) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: user.id,
        receiverId: '', // Would be determined by chat participants
        content,
        timestamp: Date.now(),
        read: false,
        type,
      };
      
      set(state => ({
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), newMessage],
        },
        chats: state.chats.map(chat => 
          chat.id === chatId 
            ? { ...chat, lastMessage: newMessage, unreadCount: 0 } 
            : chat
        ),
      }));
    } catch (error: any) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },
  
  markChatAsRead: (chatId: string) => set(state => ({
    chats: state.chats.map(chat => 
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
    ),
    messages: {
      ...state.messages,
      [chatId]: (state.messages[chatId] || []).map(message => 
        message.receiverId === getCurrentUser().id 
          ? { ...message, read: true } 
          : message
      ),
    },
  })),
  
  // Utility actions
  clearErrors: () => set({
    postsError: null,
    storiesError: null,
    videosError: null,
    chatsError: null,
    messagesError: null,
  }),
  
  refreshAll: async (userId: string) => {
    const { loadFeed, loadStories, loadShortVideos, loadChats } = get();
    await Promise.all([
      loadFeed(userId),
      loadStories(userId),
      loadShortVideos(),
      loadChats(userId),
    ]);
  },
}));