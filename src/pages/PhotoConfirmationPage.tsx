import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { Button } from '../components/Button';
import { Send, RotateCcw } from 'lucide-react';

export const PhotoConfirmationPage: React.FC = () => {
  const { tempPhoto, setCurrentPage, submitPost } = useApp();
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!tempPhoto) return;
    setIsSubmitting(true);
    try {
      await submitPost(tempPhoto, caption || '使用完畢，廚房已恢復整潔！');
      // 成功後強制跳轉首頁
      setCurrentPage('main');
    } catch (error: any) {
      console.error(error);
      alert(`發佈失敗: ${error.message || '請檢查 Supabase Storage 政策是否正確設定'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TopBar title="確認照片" showBack onBack={() => setCurrentPage('photo_capture')} />

      <main className="relative flex-grow flex flex-col items-center justify-center p-4 pt-20">
        <div className="relative w-full h-[60vh] max-w-md bg-surface-container-lowest rounded-xl shadow-lg overflow-hidden">
          {tempPhoto && (
            <img src={tempPhoto} alt="Preview" className="w-full h-full object-cover" />
          )}
        </div>

        <div className="w-full max-w-md mt-6 px-4 space-y-4">
          <textarea
            placeholder="寫點什麼吧... (選填)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-4 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary text-sm resize-none h-20"
          />

          <div className="flex flex-col gap-3">
            <Button 
              fullWidth 
              size="xl" 
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-3"
            >
              <Send size={20} />
              確認並發佈
            </Button>
            
            <Button 
              fullWidth 
              variant="ghost" 
              onClick={() => setCurrentPage('photo_capture')}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              重拍
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
