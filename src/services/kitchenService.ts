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
      // 標準化回調參數 (match, p1) 以避免某些瀏覽器 (如 iOS Safari) 的不穩定性
      const camelKey = key.replace(/_([a-z])/g, (_, p1) => p1.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch (err) {
    throw new Error('無法解讀伺服器回應 (非 JSON 格式)');
  }
}

export const kitchenService = {
  getFamilyRoles: async (): Promise<FamilyRole[]> => {
    const res = await fetch('/api/roles');
    if (!res.ok) throw new Error('無法讀取角色清單');
    return toCamelCase(await safeJson(res));
  },

  getReservations: async (): Promise<Reservation[]> => {
    const res = await fetch('/api/reservations');
    if (!res.ok) throw new Error('無法讀取預約資料');
    return toCamelCase(await safeJson(res));
  },

  createReservation: async (roleId: FamilyRoleId, date: string, slot: TimeSlot): Promise<Reservation> => {
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_id: roleId, reservation_date: date, time_slot: slot })
    });
    if (!res.ok) {
      const errorData = await safeJson(res).catch(() => ({}));
      throw new Error(errorData.detail || '預約失敗');
    }
    return toCamelCase(await safeJson(res));
  },

  startUsageSession: async (roleId: FamilyRoleId): Promise<UsageSession> => {
    const res = await fetch('/api/sessions/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_id: roleId })
    });
    if (!res.ok) throw new Error('開始計時失敗');
    return toCamelCase(await safeJson(res));
  },

  endUsageSession: async (sessionId: string, durationSeconds: number): Promise<UsageSession> => {
    const res = await fetch(`/api/sessions/${sessionId}/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration_seconds: durationSeconds })
    });
    if (!res.ok) throw new Error('結束計時失敗');
    return toCamelCase(await safeJson(res));
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
      const errorData = await safeJson(res).catch(() => ({}));
      throw new Error(errorData.detail || '發佈貼文失敗');
    }
    return toCamelCase(await safeJson(res));
  },

  getUsagePosts: async (): Promise<UsagePost[]> => {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error('無法讀取動態紀錄');
    return toCamelCase(await safeJson(res));
  }
};
