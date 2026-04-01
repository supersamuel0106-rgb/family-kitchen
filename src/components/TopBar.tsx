import React from 'react';
import { ChevronLeft, Plus, UserCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TopBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showAdd?: boolean;
  onAdd?: () => void;
  showUserSwitch?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  title, 
  showBack, 
  onBack, 
  showAdd, 
  onAdd,
  showUserSwitch
}) => {
  const { currentRole, setCurrentPage } = useApp();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-surface-container-high">
      <div className="flex items-center justify-between h-16 px-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button 
              onClick={onBack}
              className="p-2 -ml-2 text-primary hover:bg-surface-container-high rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          {showUserSwitch && (
            <button 
              onClick={() => setCurrentPage('role_selection')}
              className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full hover:bg-surface-container-highest transition-colors"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden bg-primary-container/20">
                {currentRole?.avatar ? (
                  <img src={currentRole.avatar} alt={currentRole.roleName} className="w-full h-full object-cover" />
                ) : (
                  <UserCircle size={24} className="text-primary" />
                )}
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">切換角色</span>
            </button>
          )}
          {!showUserSwitch && !showBack && <div className="w-8" />}
        </div>

        <h1 className="font-headline font-bold text-lg tracking-tight text-primary truncate max-w-[150px]">
          {title}
        </h1>

        <div className="flex items-center">
          {showAdd ? (
            <button 
              onClick={onAdd}
              className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <Plus size={24} />
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </div>
    </header>
  );
};
