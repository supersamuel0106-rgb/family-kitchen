import { FamilyRole, Reservation, UsagePost } from '../types';

export const FAMILY_ROLES: FamilyRole[] = [
  {
    id: 'father',
    roleName: '父親',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    color: '#974125', // Primary
    icon: 'user',
    displayOrder: 1
  },
  {
    id: 'mother',
    roleName: '母親',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    color: '#b02500', // Error-ish red
    icon: 'heart',
    displayOrder: 2
  },
  {
    id: 'brother_older',
    roleName: '哥哥',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    color: '#47624c', // Secondary
    icon: 'utensils',
    displayOrder: 3
  },
  {
    id: 'brother_younger',
    roleName: '弟弟',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop',
    color: '#6e5a00', // Tertiary
    icon: 'party-popper',
    displayOrder: 4
  }
];

export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: '1',
    roleId: 'father',
    reservationDate: '2026-03-31',
    timeSlot: 'morning',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    roleId: 'mother',
    reservationDate: '2026-03-31',
    timeSlot: 'afternoon',
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

export const MOCK_POSTS: UsagePost[] = [
  {
    id: 'p1',
    usageSessionId: 's1',
    roleId: 'mother',
    photoUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
    caption: '晚餐準備好了！桌子也收拾好囉。',
    publishedAt: new Date(Date.now() - 120000).toISOString(),
    createdAt: new Date().toISOString(),
    durationSeconds: 2700
  },
  {
    id: 'p2',
    usageSessionId: 's2',
    roleId: 'father',
    photoUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80',
    caption: '使用完畢，咖啡區已補充。',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date().toISOString(),
    durationSeconds: 1200
  }
];
