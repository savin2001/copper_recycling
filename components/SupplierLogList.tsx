import React from 'react';
import { LogEntry } from '../types';
import { History, Star, TrendingUp } from 'lucide-react';

interface SupplierLogListProps {
  logs: LogEntry[];
}

export const SupplierLogList: React.FC<SupplierLogListProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
        <div className="text-center py-8 text-stone-400 bg-stone-50 rounded-xl border border-dashed border-stone-200">
            <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No scans yet. Start analyzing!</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
         <History className="w-4 h-4 text-stone-500" />
         <h3 className="text-stone-600 font-semibold text-sm uppercase tracking-wider">Recent Logs</h3>
      </div>
      
      <div className="grid gap-3">
        {logs.map((log) => (
            <div key={log.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex gap-4 items-start">
                <div className="shrink-0 w-16 h-16 bg-stone-100 rounded-lg overflow-hidden border border-stone-100">
                    {log.thumbnail ? (
                        <img src={log.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <TrendingUp className="text-stone-300 w-6 h-6" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-stone-800 truncate">{log.supplier}</h4>
                        <div className="flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded-full">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold text-stone-700">{log.rating}</span>
                        </div>
                    </div>
                    <p className="text-xs text-stone-400 mt-1">{log.date}</p>
                    <p className="text-sm text-stone-600 mt-2 line-clamp-2 leading-snug">{log.verdict}</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};