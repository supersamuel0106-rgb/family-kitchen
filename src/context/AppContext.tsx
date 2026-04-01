import React, { createContext, useContext, useState, useEffect } from 'react';
import { FamilyRole, FamilyRoleId, Reservation, UsagePost, Page, UsageSession } from '../types';
import { kitchenService } from '../services/kitchenService';

interface AppContextType {
  currentRole: FamilyRole | null;
  setCurrentRoleById: (id: FamilyRoleId) => void;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  reservations: Reservation[];
  posts: UsagePost[];
  currentSession: UsageSession | null;
  refreshData: () => Promise<void>;
  startSession: () => Promise<void>;
  endSession: (duration: number) => Promise<void>;
  submitPost: (photoUrl: string, caption: string) => Promise<void>;
  addReservation: (date: string, slot: 'morning' | 'afternoon') => Promise<void>;
  tempPhoto: string | null;
  setTempPhoto: (url: string | null) => void;
  lastDuration: number;
  roles: FamilyRole[];
  isLoading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<FamilyRole | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('role_selection');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [posts, setPosts] = useState<UsagePost[]>([]);
  const [currentSession, setCurrentSession] = useState<UsageSession | null>(null);
  const [roles, setRoles] = useState<FamilyRole[]>([]);
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);
  const [lastDuration, setLastDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [resData, postData, roleData] = await Promise.all([
        kitchenService.getReservations(),
        kitchenService.getUsagePosts(),
        kitchenService.getFamilyRoles()
      ]);

      // 檢查回應是否為陣列，防止後端回傳錯誤物件導致前端 map 崩潰
      if (!Array.isArray(resData) || !Array.isArray(postData) || !Array.isArray(roleData)) {
         throw new Error('伺服器回傳格式錯誤 (非陣列)');
      }

      setReservations(resData);
      setPosts(postData);
      setRoles(roleData);
    } catch (err: any) {
      setError(err.message || '資料讀取失敗');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const setCurrentRoleById = (id: FamilyRoleId) => {
    const role = roles.find(r => r.id === id);
    if (role) setCurrentRole(role);
  };

  const startSession = async () => {
    if (!currentRole) return;
    const session = await kitchenService.startUsageSession(currentRole.id);
    setCurrentSession(session);
  };

  const endSession = async (duration: number) => {
    if (!currentSession) return;
    const session = await kitchenService.endUsageSession(currentSession.id, duration);
    setCurrentSession(session);
    setLastDuration(duration);
  };

  const submitPost = async (photoUrl: string, caption: string) => {
    if (!currentRole) throw new Error('尚未選擇角色，請先返回選擇角色');

    // NOTE: 如果使用者跳過「開始使用」直接拍照，自動建立 session 以確保功能正常
    let sessionToUse = currentSession;
    if (!sessionToUse) {
      const newSession = await kitchenService.startUsageSession(currentRole.id);
      sessionToUse = newSession;
      setCurrentSession(newSession);
    }

    await kitchenService.createUsagePost(sessionToUse.id, currentRole.id, photoUrl, caption, lastDuration);
    await refreshData();
    setTempPhoto(null);
    setCurrentSession(null); // 發佈成功後清除 session
  };

  const addReservation = async (date: string, slot: 'morning' | 'afternoon') => {
    if (!currentRole) return;
    await kitchenService.createReservation(currentRole.id, date, slot);
    await refreshData();
  };

  return (
    <AppContext.Provider value={{
      currentRole,
      setCurrentRoleById,
      currentPage,
      setCurrentPage,
      reservations,
      posts,
      currentSession,
      refreshData,
      startSession,
      endSession,
      submitPost,
      addReservation,
      tempPhoto,
      setTempPhoto,
      lastDuration,
      roles,
      isLoading,
      error
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
