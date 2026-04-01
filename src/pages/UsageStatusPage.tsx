import React from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { Clock, User, Home, LayoutGrid, PlayCircle, MessageSquareOff } from 'lucide-react';

export const UsageStatusPage: React.FC = () => {
  const { posts, roles, setCurrentPage, isLoading, error, refreshData } = useApp();

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return '剛剛';
    if (diffMins < 60) return `${diffMins} 分鐘前`;
    if (diffHours < 24) return `${diffHours} 小時前`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopBar title="家人的廚房" showBack onBack={() => setCurrentPage('main')} />

      <main className="pt-24 px-4 max-w-2xl mx-auto space-y-8">
        <header className="flex flex-col gap-1 px-2">
          <span className="font-label text-[0.75rem] font-bold tracking-[0.05em] uppercase text-secondary">廚房動態</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">廚房使用記錄</h2>
        </header>

        <div className="flex flex-col gap-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
               <p className="text-on-surface-variant text-sm font-medium">資料讀取中...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-error gap-4 px-8 text-center">
              <MessageSquareOff size={48} strokeWidth={1.5} />
              <p className="font-bold">連線失敗: {error}</p>
              <button 
                onClick={refreshData}
                className="mt-2 bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-bold shadow-md active:scale-95 transition-all"
              >
                重新整理
              </button>
            </div>
          ) : (!Array.isArray(posts) || posts.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant/40 gap-4">
              <MessageSquareOff size={48} strokeWidth={1.5} />
              <p className="font-bold">目前尚無廚房使用紀錄</p>
            </div>
          ) : (
            posts.map((post) => {
              if (!post || !post.id) return null;
              const role = roles?.find(r => r.id === post.roleId);
              const roleColor = role?.color || '#7c4dff'; // Fallback color
              
              return (
                <article key={post.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm">
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${roleColor}15` }}
                      >
                        <User size={20} style={{ color: roleColor }} />
                      </div>
                      <div>
                        <p className="font-bold text-base leading-tight">{role?.roleName || '未知成員'} 剛剛結束使用</p>
                        <p className="text-on-surface-variant text-xs flex items-center gap-1 mt-0.5">
                          <Clock size={14} />
                          時長：{Math.floor((post.durationSeconds || 0) / 60)} 分鐘
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-md">
                      {formatTime(post.publishedAt || new Date().toISOString())}
                    </span>
                  </div>

                  <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-surface-container">
                    {post.photoUrl ? (
                      <img src={post.photoUrl} alt="Kitchen usage" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20 italic text-xs">
                        無照片
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-primary italic text-sm font-medium">「{post.caption || '忙碌的一天！'}」</p>
                  </div>
                </div>
              </article>
            );
          }))}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-surface/80 backdrop-blur-md shadow-lg rounded-t-[3rem]">
        <button 
          onClick={() => setCurrentPage('main')}
          className="flex flex-col items-center justify-center text-on-surface-variant p-2"
        >
          <Home size={24} className="mb-1" />
          <span className="text-[10px] font-bold uppercase">主頁</span>
        </button>
        <button 
          className="flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-container text-white rounded-full p-3 min-w-[64px] shadow-lg scale-110"
        >
          <LayoutGrid size={24} className="mb-1" />
          <span className="text-[10px] font-bold uppercase">記錄</span>
        </button>
        <button 
          onClick={() => setCurrentPage('start_usage')}
          className="flex flex-col items-center justify-center text-on-surface-variant p-2"
        >
          <PlayCircle size={24} className="mb-1" />
          <span className="text-[10px] font-bold uppercase">開始</span>
        </button>
      </nav>
    </div>
  );
};
