'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAppStore } from '@/store/useAppStore';
import { useRealtime } from '@/hooks/useRealtime';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const viewTab = useAppStore((s) => s.viewTab);
  const setViewTab = useAppStore((s) => s.setViewTab);
  const { liveEvents } = useRealtime();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar activeTab={viewTab} onTabChange={setViewTab} liveCount={liveEvents.length} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
