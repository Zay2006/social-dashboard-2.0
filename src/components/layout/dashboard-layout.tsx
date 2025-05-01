import React from 'react';
import { ModeToggle } from '@/components/mode-toggle';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="text-lg font-bold">Social Dashboard</div>
          <div className="flex items-center gap-4">
            <ModeToggle />
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
