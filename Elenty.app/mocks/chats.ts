import { Chat, Message } from '@/types';
import { mockUsers } from './users';

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    content: 'Hey, how are you doing?',
    timestamp: Date.now() - 3600000, // 1 hour ago
    read: true,
    type: 'text',
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '2',
    content: "I'm good, thanks! How about you?",
    timestamp: Date.now() - 3540000, // 59 minutes ago
    read: true,
    type: 'text',
  },
  {
    id: '3',
    senderId: '2',
    receiverId: '1',
    content: 'Doing great! Are you coming to the event tomorrow?',
    timestamp: Date.now() - 3480000, // 58 minutes ago
    read: true,
    type: 'text',
  },
  {
    id: '4',
    senderId: '3',
    receiverId: '1',
    content: 'Hey, did you see the new tech announcement?',
    timestamp: Date.now() - 7200000, // 2 hours ago
    read: true,
    type: 'text',
  },
  {
    id: '5',
    senderId: '1',
    receiverId: '3',
    content: 'Yes! It looks amazing. We should check it out.',
    timestamp: Date.now() - 7140000, // 1 hour 59 minutes ago
    read: true,
    type: 'text',
  },
  {
    id: '6',
    senderId: '4',
    receiverId: '1',
    content: 'Missed call',
    timestamp: Date.now() - 10800000, // 3 hours ago
    read: true,
    type: 'call',
    callDuration: 0,
  },
  {
    id: '7',
    senderId: '1',
    receiverId: '5',
    content: 'Call ended',
    timestamp: Date.now() - 86400000, // 1 day ago
    read: true,
    type: 'call',
    callDuration: 125, // 2 minutes 5 seconds
  },
];

export const mockChats: Chat[] = [
  {
    id: '1',
    participants: ['1', '2'],
    lastMessage: mockMessages.find(m => 
      (m.senderId === '1' && m.receiverId === '2') || 
      (m.senderId === '2' && m.receiverId === '1')
    ),
    unreadCount: 0,
  },
  {
    id: '2',
    participants: ['1', '3'],
    lastMessage: mockMessages.find(m => 
      (m.senderId === '1' && m.receiverId === '3') || 
      (m.senderId === '3' && m.receiverId === '1')
    ),
    unreadCount: 1,
  },
  {
    id: '3',
    participants: ['1', '4'],
    lastMessage: mockMessages.find(m => 
      (m.senderId === '1' && m.receiverId === '4') || 
      (m.senderId === '4' && m.receiverId === '1')
    ),
    unreadCount: 0,
  },
  {
    id: '4',
    participants: ['1', '5'],
    lastMessage: mockMessages.find(m => 
      (m.senderId === '1' && m.receiverId === '5') || 
      (m.senderId === '5' && m.receiverId === '1')
    ),
    unreadCount: 0,
  },
];