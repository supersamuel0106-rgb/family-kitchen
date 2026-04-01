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

  const refreshData = async () => {
    const [resData, postData, roleData] = await Promise.all([
      kitchenService.getReservations(),
      kitchenService.getUsagePosts(),
      kitchenService.getFamilyRoles()
    ]);
    setReservations(resData);
    setPosts(postData);
    setRoles(roleData);
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
    if (!currentRole || !currentSession) return;
    await kitchenService.createUsagePost(currentSession.id, currentRole.id, photoUrl, caption, lastDuration);
    await refreshData();
    setTempPhoto(null);
    setCurrentSession(null); // Clear session after successful post
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
      roles
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
