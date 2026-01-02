import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AlertTriangle, Hammer, ClipboardList, CheckCircle2 } from 'lucide-react';
import { AnalysisResult } from '../types';

interface AnalysisResultCardProps {
  result: AnalysisResult;
}

export const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({ result }) => {
  // We need to customize the markdown rendering to fit our specific design request
  // However, generic markdown rendering is usually fine if the prompt is strict.
  // We can add specific icon headers based on section titles if we wanted to get fancy,
  // but let's rely on standard rendering with good typography.
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Score Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 flex items-center justify-between">
         <div>
            <p className="text-sm text-stone-500 font-medium">Quality Rating</p>
            <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-bold ${result.rating >= 7 ? 'text-green-600' : result.rating >= 4 ? 'text-amber-600' : 'text-red-600'}`}>
                    {result.rating}
                </span>
                <span className="text-stone-400 text-lg">/10</span>
            </div>
         </div>
         <div className="h-12 w-12 rounded-full flex items-center justify-center bg-stone-100">
            {result.rating >= 7 ? <CheckCircle2 className="text-green-600" /> : <AlertTriangle className="text-amber-500" />}
         </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="prose prose-stone max-w-none p-5 prose-headings:text-amber-800 prose-headings:font-bold prose-a:text-amber-600 prose-strong:text-stone-800">
            <ReactMarkdown
                components={{
                    h2: ({node, ...props}) => (
                        <h2 className="text-lg font-bold border-b border-amber-100 pb-2 mb-3 mt-6 flex items-center gap-2 text-amber-900" {...props} />
                    ),
                    ul: ({node, ...props}) => (
                        <ul className="space-y-2 list-none pl-0" {...props} />
                    ),
                    li: ({node, ...props}) => (
                        <li className="bg-stone-50 p-3 rounded-lg border border-stone-100 text-sm leading-relaxed" {...props} />
                    )
                }}
            >
                {result.markdown}
            </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};