import { Story } from '@/types';
import { mockUsers } from './users';

export const mockStories: Story[] = [
  {
    id: '1',
    userId: '2',
    user: mockUsers.find(u => u.id === '2'),
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    },
    timestamp: Date.now() - 1800000, // 30 minutes ago
    seen: false,
  },
  {
    id: '2',
    userId: '3',
    user: mockUsers.find(u => u.id === '3'),
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    },
    timestamp: Date.now() - 3600000, // 1 hour ago
    seen: false,
  },
  {
    id: '3',
    userId: '4',
    user: mockUsers.find(u => u.id === '4'),
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    },
    timestamp: Date.now() - 5400000, // 1.5 hours ago
    seen: true,
  },
  {
    id: '4',
    userId: '5',
    user: mockUsers.find(u => u.id === '5'),
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    },
    timestamp: Date.now() - 7200000, // 2 hours ago
    seen: false,
  },
  {
    id: '5',
    userId: '6',
    user: mockUsers.find(u => u.id === '6'),
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    },
    timestamp: Date.now() - 9000000, // 2.5 hours ago
    seen: false,
  },
];