'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAppStore } from '@/store/useAppStore';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const viewTab = useAppStore((s) => s.viewTab);
  const setViewTab = useAppStore((s) => s.setViewTab);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar activeTab={viewTab} onTabChange={setViewTab} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
