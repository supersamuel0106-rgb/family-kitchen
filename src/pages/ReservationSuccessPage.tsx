import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, Home } from 'lucide-react';
import { Button } from '../components/Button';
import { motion } from 'motion/react';

export const ReservationSuccessPage: React.FC = () => {
  const { setCurrentPage, currentRole } = useApp();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-surface-container-low rounded-xl p-8 text-center relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute inset-0 bg-primary/10 rounded-full scale-150 animate-pulse"></div>
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center shadow-xl shadow-primary/20 z-10">
            <CheckCircle size={48} className="text-white" />
          </div>
        </div>

        <div className="space-y-4 relative z-10 mb-12">
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">預約成功！</h2>
          <p className="text-secondary font-semibold text-lg">煮得愉快！</p>
        </div>

        <Button 
          fullWidth 
          size="xl" 
          onClick={() => setCurrentPage('main')}
          className="flex items-center justify-center gap-3"
        >
          <Home size={24} />
          返回主頁
        </Button>
      </motion.div>
    </div>
  );
};
