import React from 'react';
import { useApp } from '../context/AppContext';
import { UserCircle, Heart, Utensils, PartyPopper } from 'lucide-react';

export const RoleSelectionPage: React.FC = () => {
  const { setCurrentRoleById, setCurrentPage, roles, isLoading } = useApp();

  // NOTE: 優先使用 Supabase 讀取的角色資料；若尚未載入則顯示讀取中
  const displayRoles = roles;

  const getIcon = (iconName: string, color: string) => {
    const props = { size: 40, style: { color } };
    switch (iconName) {
      case 'user': return <UserCircle {...props} />;
      case 'heart': return <Heart {...props} />;
      case 'utensils': return <Utensils {...props} />;
      case 'party-popper': return <PartyPopper {...props} />;
      default: return <UserCircle {...props} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full flex flex-col items-center gap-12">
        <header className="text-center">
          <h1 className="text-primary font-headline font-extrabold text-5xl tracking-tight mb-4">
            家庭廚房
          </h1>
          <p className="text-on-surface-variant font-body text-lg">
            歡迎回家。請選擇您的成員身份。
          </p>
        </header>

        <main className="grid grid-cols-2 gap-4 w-full">
          {isLoading && (
            <p className="col-span-2 text-center text-on-surface-variant">讀取角色資料中...</p>
          )}
          {!isLoading && displayRoles.map((role) => (
            <button
              key={role.id}
              onClick={() => {
                setCurrentRoleById(role.id);
                setCurrentPage('main');
              }}
              className="group bg-surface-container-lowest hover:bg-white transition-all duration-200 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm border border-surface-container-high hover:border-primary/20 active:scale-[0.98]"
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors"
                style={{ backgroundColor: `${role.color}15` }}
              >
                {getIcon(role.icon, role.color)}
              </div>
              <h2 className="text-on-surface font-headline text-xl font-bold">{role.roleName}</h2>
            </button>
          ))}
        </main>
      </div>
    </div>
  );
};
