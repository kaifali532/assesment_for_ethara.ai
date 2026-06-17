import React from 'react';
import { Sidebar } from './Sidebar';

export function Layout({ children }) {
  return (
    <div className="flex h-screen bg-[#000000] text-white overflow-hidden">
      
      {/* Decorative ambient blurred blobs for the premium 3D feeling */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none"></div>

      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
