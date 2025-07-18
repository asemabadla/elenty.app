import { Post } from '@/types';
import { mockUsers } from './users';

export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '2',
    user: mockUsers.find(u => u.id === '2'),
    caption: 'Beautiful sunset at the beach today! 🌅 #sunset #beach #summer',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      },
    ],
    likes: 342,
    comments: 28,
    timestamp: Date.now() - 3600000, // 1 hour ago
    hasLiked: false,
  },
  {
    id: '2',
    userId: '3',
    user: mockUsers.find(u => u.id === '3'),
    caption: 'New coffee shop discovery in downtown! ☕ #coffee #cafe',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1497935586047-9242eb4fc795?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      },
    ],
    likes: 189,
    comments: 14,
    timestamp: Date.now() - 7200000, // 2 hours ago
    hasLiked: true,
  },
  {
    id: '3',
    userId: '4',
    user: mockUsers.find(u => u.id === '4'),
    caption: 'My new fashion collection is now available! 👗 #fashion #design',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      },
    ],
    likes: 567,
    comments: 42,
    timestamp: Date.now() - 10800000, // 3 hours ago
    hasLiked: false,
  },
  {
    id: '4',
    userId: '5',
    user: mockUsers.find(u => u.id === '5'),
    caption: 'Morning workout done! 💪 #fitness #motivation',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      },
    ],
    likes: 231,
    comments: 18,
    timestamp: Date.now() - 18000000, // 5 hours ago
    hasLiked: false,
  },
  {
    id: '5',
    userId: '6',
    user: mockUsers.find(u => u.id === '6'),
    caption: 'Homemade pasta for dinner! 🍝 #food #cooking #homemade',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      },
    ],
    likes: 412,
    comments: 32,
    timestamp: Date.now() - 25200000, // 7 hours ago
    hasLiked: true,
  },
];