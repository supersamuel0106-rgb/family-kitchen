export type TimeSlot = 'morning' | 'afternoon';

export type FamilyRoleId = 'father' | 'mother' | 'brother_older' | 'brother_younger';

export interface FamilyRole {
  id: FamilyRoleId;
  roleName: string;
  avatar: string;
  color: string;
  icon: string;
  displayOrder: number;
}

export interface Reservation {
  id: string;
  roleId: FamilyRoleId;
  reservationDate: string; // ISO string (YYYY-MM-DD)
  timeSlot: TimeSlot;
  status: 'active' | 'cancelled';
  createdAt: string;
}

export interface UsageSession {
  id: string;
  roleId: FamilyRoleId;
  startTime: string;
  endTime?: string;
  durationSeconds?: number;
  status: 'in_progress' | 'completed';
  createdAt: string;
}

export interface UsagePost {
  id: string;
  usageSessionId: string;
  roleId: FamilyRoleId;
  photoUrl: string;
  caption: string;
  publishedAt: string;
  createdAt: string;
  durationSeconds: number;
}

export type Page = 
  | 'role_selection' 
  | 'main' 
  | 'reservation' 
  | 'reservation_success' 
  | 'usage_status' 
  | 'start_usage' 
  | 'timer' 
  | 'photo_capture' 
  | 'photo_confirmation';
