export interface User {
  id: string;
  phoneId: string; // Unique phone-like ID for calling
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  isVerified?: boolean;
  canReceiveCalls?: boolean; // New field for call capability
  countryCode?: string; // For international calling
}

export interface Post {
  id: string;
  userId: string;
  user?: User;
  caption: string;
  media: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }[];
  likes: number;
  comments: number;
  timestamp: number;
  hasLiked?: boolean;
  hasSaved?: boolean;
  type?: 'photo' | 'video' | 'text' | 'poll' | 'location'; // Enhanced post types
}

export interface Story {
  id: string;
  userId: string;
  user?: User;
  media: {
    type: 'image' | 'video';
    url: string;
  };
  timestamp: number;
  seen?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;
  type: 'text' | 'image' | 'video' | 'audio' | 'call' | 'video_call'; // Enhanced message types
  callDuration?: number; // For call type messages
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface ShortVideo {
  id: string;
  userId: string;
  user?: User;
  videoUrl: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  music: string;
  timestamp: number;
  hasLiked?: boolean;
  effects?: string[]; // Applied effects
  challenge?: string; // Associated challenge
}

export interface LiveStream {
  id: string;
  userId: string;
  user?: User;
  title: string;
  thumbnail: string;
  viewers: number;
  isLive: boolean;
  category: string;
  startTime: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  hashtag: string;
  thumbnail: string;
  participants: number;
  videos: number;
  isHot: boolean;
  createdBy: string;
  createdAt: number;
}

export interface Effect {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  downloads: number;
  isPopular: boolean;
}

export interface PhoneCall {
  id: string;
  callerId: string;
  receiverId: string;
  type: 'voice' | 'video';
  status: 'ringing' | 'active' | 'ended' | 'missed';
  startTime: number;
  endTime?: number;
  duration?: number;
}