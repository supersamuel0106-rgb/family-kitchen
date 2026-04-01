import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Camera as CameraIcon, ImagePlus } from 'lucide-react';

export const PhotoCapturePage: React.FC = () => {
  const { setCurrentPage, setTempPhoto } = useApp();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setTempPhoto(result);
        setCurrentPage('photo_confirmation');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-surface/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentPage('main')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
          >
            <X size={24} className="text-primary" />
          </button>
          <h1 className="font-headline font-bold text-lg tracking-tight text-primary">溫馨廚房</h1>
        </div>
      </header>

      <main className="relative flex-1 flex flex-col pt-20 pb-10 px-4">
        <div className="relative flex-1 w-full max-w-md mx-auto overflow-hidden rounded-xl bg-on-surface shadow-2xl flex flex-col items-center justify-center">
          <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
            <div className="text-white text-center p-6 flex flex-col items-center gap-8 z-30 w-full max-w-xs">
              <div className="relative">
                <CameraIcon size={88} className="text-primary opacity-90 drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
                <div className="absolute -bottom-2 -right-2 bg-black rounded-full p-1.5 border border-surface/50">
                   <ImagePlus size={20} className="text-primary" />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-3 tracking-wide">拍攝廚房照片</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  請使用相機拍攝一張清晰的廚房照片<br/>或者從手機相簿中選擇
                </p>
              </div>
              
              <div className="flex flex-col gap-4 w-full mt-4">
                <div className="relative w-full group">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <button className="w-full bg-primary text-on-primary px-8 py-4 rounded-full font-bold text-lg shadow-[0_8px_30px_rgba(0,0,0,0.6)] group-active:scale-95 group-active:shadow-md transition-all duration-200 flex items-center justify-center gap-3">
                    開啟相機 / 相簿
                  </button>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none"></div>
            
            {/* Subtle background decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-white/30 blur-[1px]"></div>
              <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full border border-white/20 blur-[2px]"></div>
            </div>
          </div>
        </div>

        <div className="mt-8 px-6 text-center">
          <h2 className="font-headline font-bold text-on-surface text-xl mb-2">捕捉今日的生活點滴</h2>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs mx-auto">
            為您的居家核心拍攝一張清晰的照片，與家人分享這份溫馨。
          </p>
        </div>
      </main>
    </div>
  );
};
