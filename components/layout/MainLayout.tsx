'use client';

import React, { useState } from 'react';
import { AppHeader } from './AppHeader';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposeModal } from '../email-view/ComposeModal';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-atmospheric">
      <AppHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'oklch(0 0 0 / 55%)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar — floats above the atmospheric bg */}
        <div
          className={`
            fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <React.Suspense fallback={<div className="w-64 h-full" style={{ background: 'var(--sidebar)' }} />}>
            <Sidebar onCloseMobile={() => setSidebarOpen(false)} onCompose={() => setIsComposeOpen(true)} />
          </React.Suspense>
        </div>

        {/* Main content — transparent so bg-atmospheric shows beneath */}
        <main className="flex-1 overflow-auto w-full relative z-10">
          {children}
        </main>
      </div>

      <AnimatePresence>
        {isComposeOpen && <ComposeModal onClose={() => setIsComposeOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
