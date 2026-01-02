import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-amber-700 to-amber-600 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
            <ShieldCheck className="w-6 h-6 text-amber-100" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">CopperGuard AI</h1>
            <p className="text-xs text-amber-100/80 font-medium">Smart Scrap Grading</p>
          </div>
        </div>
      </div>
    </header>
  );
};