// services/firebaseDatabase.ts
import { db } from './firebaseConfig';
import { ref, set, get, update, child, remove, push } from 'firebase/database';
import { User, Post, Story, Message, Chat, PhoneCall, LiveStream } from '@/types';

export const firebaseDatabase = {
  // --- USER OPERATIONS ---
  async createUser(userData: any): Promise<User> {
    const userRef = ref(db, `users/${userData.id}`);
    const user: User = {
      id: userData.id,
      phoneId: userData.phoneId,
      username: userData.username,
      name: userData.name,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60',
      bio: userData.bio || 'New user on Elenty!',
      followers: 0,
      following: 0,
      isVerified: false,
      canReceiveCalls: true,
      countryCode: userData.countryCode || '+966',
    };
    await set(userRef, user);
    return user;
  },

  async getUserById(id: string): Promise<User | null> {
    const userRef = ref(db, `users/${id}`);
    const snap = await get(userRef);
    return snap.exists() ? snap.val() : null;
  },

  async updateUser(id: string, userData: any): Promise<User> {
    const userRef = ref(db, `users/${id}`);
    await update(userRef, userData);
    const snap = await get(userRef);
    return snap.val();
  },

  async searchUsers(query: string): Promise<User[]> {
    const snap = await get(ref(db, 'users'));
    if (!snap.exists()) return [];
    const usersMap = snap.val();
    const list: User[] = Object.values(usersMap);
    return list.filter(u => 
      u.name.toLowerCase().includes(query.toLowerCase()) || 
      u.username.toLowerCase().includes(query.toLowerCase())
    );
  },

  // --- POST OPERATIONS ---
  async createPost(postData: any): Promise<Post> {
    const postId = `post_${Date.now()}`;
    const postRef = ref(db, `posts/${postId}`);
    const post: Post = {
      id: postId,
      userId: postData.userId,
      caption: postData.caption || '',
      media: [
        {
          type: postData.type === 'video' ? 'video' : 'image',
          url: postData.mediaUrl || '',
        }
      ],
      type: postData.type === 'video' ? 'video' : 'photo',
      likes: 0,
      comments: 0,
      timestamp: Date.now(),
    };
    await set(postRef, post);
    return post;
  },

  async getPostsByUser(userId: string): Promise<Post[]> {
    const snap = await get(ref(db, 'posts'));
    if (!snap.exists()) return [];
    const list: Post[] = Object.values(snap.val());
    return list.filter(p => p.userId === userId).sort((a,b) => b.timestamp - a.timestamp);
  },

  async getFeedPosts(): Promise<Post[]> {
    const snap = await get(ref(db, 'posts'));
    if (!snap.exists()) return [];
    const list: Post[] = Object.values(snap.val());
    return list.sort((a,b) => b.timestamp - a.timestamp);
  },

  async likePost(postId: string, userId: string): Promise<boolean> {
    const likeRef = ref(db, `posts/${postId}/likedBy/${userId}`);
    await set(likeRef, true);
    // Increment post like count
    const postRef = ref(db, `posts/${postId}`);
    const snap = await get(postRef);
    if (snap.exists()) {
      const post = snap.val();
      await update(postRef, { likes: (post.likes || 0) + 1 });
    }
    return true;
  },

  // --- STORY OPERATIONS ---
  async createStory(storyData: any): Promise<Story> {
    const storyId = `story_${Date.now()}`;
    const storyRef = ref(db, `stories/${storyId}`);
    const story: Story = {
      id: storyId,
      userId: storyData.userId,
      media: {
        type: storyData.type === 'video' ? 'video' : 'image',
        url: storyData.mediaUrl || '',
      },
      timestamp: Date.now(),
    };
    await set(storyRef, story);
    return story;
  },

  async getActiveStories(): Promise<Story[]> {
    const snap = await get(ref(db, 'stories'));
    if (!snap.exists()) return [];
    const list: Story[] = Object.values(snap.val());
    // Filter last 24h
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return list.filter(s => s.timestamp > cutoff).sort((a,b) => b.timestamp - a.timestamp);
  },

  // --- CHAT & MESSAGING ---
  async sendMessage(chatId: string, messageData: any): Promise<Message> {
    const messageId = `msg_${Date.now()}`;
    const msgRef = ref(db, `chats/${chatId}/messages/${messageId}`);
    const message: Message = {
      id: messageId,
      senderId: messageData.senderId,
      receiverId: messageData.receiverId || (chatId.split('_').find(id => id !== messageData.senderId) || ''),
      content: messageData.content || messageData.text || '',
      timestamp: Date.now(),
      read: false,
      type: messageData.type || 'text',
      callDuration: messageData.callDuration,
    };
    await set(msgRef, message);
    
    // Update last message in chat node
    const chatRef = ref(db, `chats/${chatId}`);
    await update(chatRef, {
      lastMessage: message,
    });

    return message;
  },

  async getChatMessages(chatId: string): Promise<Message[]> {
    const snap = await get(ref(db, `chats/${chatId}/messages`));
    if (!snap.exists()) return [];
    return Object.values(snap.val());
  },

  async getUserChats(userId: string): Promise<Chat[]> {
    const snap = await get(ref(db, 'chats'));
    if (!snap.exists()) return [];
    const chats: Chat[] = Object.values(snap.val());
    return chats.filter(c => c.participants.includes(userId)).sort((a,b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0));
  },

  // --- CALL OPERATIONS ---
  async createCall(callData: any): Promise<PhoneCall> {
    const callId = callData.id || `call_${Date.now()}`;
    const callRef = ref(db, `calls/${callId}`);
    const phoneCall: PhoneCall = {
      id: callId,
      callerId: callData.callerId,
      receiverId: callData.receiverId,
      status: callData.status || 'ringing',
      type: callData.type || 'voice',
      startTime: Date.now(),
      duration: 0,
    };
    await set(callRef, phoneCall);
    return phoneCall;
  },

  async getCallHistory(userId: string): Promise<PhoneCall[]> {
    const snap = await get(ref(db, 'calls'));
    if (!snap.exists()) return [];
    const list: PhoneCall[] = Object.values(snap.val());
    return list.filter(c => c.callerId === userId || c.receiverId === userId).sort((a,b) => b.startTime - a.startTime);
  },

  // --- LIVE STREAM OPERATIONS ---
  async createLiveStream(streamData: any): Promise<LiveStream> {
    const streamId = streamData.id || `stream_${Date.now()}`;
    const streamRef = ref(db, `live_streams/${streamId}`);
    const liveStream: LiveStream = {
      id: streamId,
      userId: streamData.userId,
      title: streamData.title || 'بث مباشر',
      thumbnail: streamData.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
      viewers: 1,
      isLive: true,
      category: streamData.category || 'العامة',
      startTime: Date.now(),
    };
    await set(streamRef, liveStream);
    return liveStream;
  },

  async getActiveLiveStreams(): Promise<LiveStream[]> {
    const snap = await get(ref(db, 'live_streams'));
    if (!snap.exists()) return [];
    const list: LiveStream[] = Object.values(snap.val());
    return list.filter(s => s.isLive);
  },

  async endLiveStream(streamId: string): Promise<boolean> {
    const streamRef = ref(db, `live_streams/${streamId}`);
    await update(streamRef, { isLive: false });
    return true;
  }
};