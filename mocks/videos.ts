import { ShortVideo } from '@/types';
import { mockUsers } from './users';

export const mockVideos: ShortVideo[] = [
  {
    id: '1',
    userId: '2',
    user: mockUsers.find(u => u.id === '2'),
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-happily-in-a-field-of-flowers-4702-large.mp4',
    caption: 'Spring vibes! 🌸 #spring #dance #nature',
    likes: 1245,
    comments: 87,
    shares: 32,
    music: 'Original Sound - Sara Ahmed',
    timestamp: Date.now() - 86400000, // 1 day ago
    hasLiked: false,
  },
  {
    id: '2',
    userId: '3',
    user: mockUsers.find(u => u.id === '3'),
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-under-multicolored-lights-1237-large.mp4',
    caption: 'Night vibes 🌃 #nightlife #lights',
    likes: 2356,
    comments: 134,
    shares: 78,
    music: 'Midnight - DJ Khaled',
    timestamp: Date.now() - 172800000, // 2 days ago
    hasLiked: true,
  },
  {
    id: '3',
    userId: '4',
    user: mockUsers.find(u => u.id === '4'),
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-with-a-black-dress-posing-in-a-studio-34421-large.mp4',
    caption: 'New collection preview 👗 #fashion #model #style',
    likes: 5678,
    comments: 321,
    shares: 145,
    music: 'Runway - Layla Ibrahim',
    timestamp: Date.now() - 259200000, // 3 days ago
    hasLiked: false,
  },
  {
    id: '4',
    userId: '5',
    user: mockUsers.find(u => u.id === '5'),
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-exercising-in-a-gym-with-dumbbells-30349-large.mp4',
    caption: 'Monday motivation 💪 #fitness #gym #workout',
    likes: 3421,
    comments: 156,
    shares: 67,
    music: 'Power Up - Fitness Beats',
    timestamp: Date.now() - 345600000, // 4 days ago
    hasLiked: false,
  },
  {
    id: '5',
    userId: '6',
    user: mockUsers.find(u => u.id === '6'),
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cooking-with-a-pan-on-a-stove-2753-large.mp4',
    caption: 'Easy pasta recipe 🍝 #cooking #food #recipe',
    likes: 4532,
    comments: 267,
    shares: 189,
    music: 'Cooking Time - Food Channel',
    timestamp: Date.now() - 432000000, // 5 days ago
    hasLiked: true,
  },
];

// Also export as mockShortVideos for backward compatibility
export const mockShortVideos = mockVideos;