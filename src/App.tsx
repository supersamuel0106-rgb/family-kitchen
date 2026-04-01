import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { MainPage } from './pages/MainPage';
import { ReservationPage } from './pages/ReservationPage';
import { ReservationSuccessPage } from './pages/ReservationSuccessPage';
import { UsageStatusPage } from './pages/UsageStatusPage';
import { StartUsagePage } from './pages/StartUsagePage';
import { TimerPage } from './pages/TimerPage';
import { PhotoCapturePage } from './pages/PhotoCapturePage';
import { PhotoConfirmationPage } from './pages/PhotoConfirmationPage';
import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'role_selection': return <RoleSelectionPage />;
      case 'main': return <MainPage />;
      case 'reservation': return <ReservationPage />;
      case 'reservation_success': return <ReservationSuccessPage />;
      case 'usage_status': return <UsageStatusPage />;
      case 'start_usage': return <StartUsagePage />;
      case 'timer': return <TimerPage />;
      case 'photo_capture': return <PhotoCapturePage />;
      case 'photo_confirmation': return <PhotoConfirmationPage />;
      default: return <RoleSelectionPage />;
    }
  };

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background shadow-2xl relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-screen"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
