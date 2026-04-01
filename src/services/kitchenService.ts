import { 
  FamilyRole, 
  Reservation, 
  UsageSession, 
  UsagePost, 
  TimeSlot, 
  FamilyRoleId 
} from '../types';

const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

export const kitchenService = {
  getFamilyRoles: async (): Promise<FamilyRole[]> => {
    const res = await fetch('/api/roles');
    if (!res.ok) throw new Error('Failed to fetch roles');
    return toCamelCase(await res.json());
  },

  getReservations: async (): Promise<Reservation[]> => {
    const res = await fetch('/api/reservations');
    if (!res.ok) throw new Error('Failed to fetch reservations');
    return toCamelCase(await res.json());
  },

  createReservation: async (roleId: FamilyRoleId, date: string, slot: TimeSlot): Promise<Reservation> => {
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_id: roleId, reservation_date: date, time_slot: slot })
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create reservation');
    }
    return toCamelCase(await res.json());
  },

  startUsageSession: async (roleId: FamilyRoleId): Promise<UsageSession> => {
    const res = await fetch('/api/sessions/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_id: roleId })
    });
    if (!res.ok) throw new Error('Failed to start session');
    return toCamelCase(await res.json());
  },

  endUsageSession: async (sessionId: string, durationSeconds: number): Promise<UsageSession> => {
    const res = await fetch(`/api/sessions/${sessionId}/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration_seconds: durationSeconds })
    });
    if (!res.ok) throw new Error('Failed to end session');
    return toCamelCase(await res.json());
  },

  createUsagePost: async (sessionId: string, roleId: FamilyRoleId, photoDataUrl: string, caption: string, durationSeconds: number): Promise<UsagePost> => {
    const res_fetch = await fetch(photoDataUrl);
    const blob = await res_fetch.blob();

    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('role_id', roleId);
    formData.append('caption', caption);
    formData.append('duration_seconds', durationSeconds.toString());
    formData.append('photo', blob, 'photo.jpg');

    const res = await fetch('/api/posts', {
      method: 'POST',
      body: formData
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create post');
    }
    return toCamelCase(await res.json());
  },

  getUsagePosts: async (): Promise<UsagePost[]> => {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error('Failed to fetch posts');
    return toCamelCase(await res.json());
  }
};
