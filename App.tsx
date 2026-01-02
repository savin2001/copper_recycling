import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResultCard } from './components/AnalysisResultCard';
import { SupplierLogList } from './components/SupplierLogList';
import { SupplierFinder } from './components/SupplierFinder';
import { analyzeCopper } from './services/gemini';
import { LogEntry, AnalysisResult } from './types';
import { Loader2, AlertCircle, ScanLine, Search } from 'lucide-react';

type Tab = 'scanner' | 'suppliers';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('scanner');
  
  // Scanner State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [supplierName, setSupplierName] = useState('');
  const [notes, setNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Load logs from local storage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('copper_guard_logs');
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    }
  }, []);

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    setResult(null); // Reset previous result when new image is picked
    setError(null);
  };

  const handleImageRemoved = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysisData = await analyzeCopper(selectedImage, supplierName, notes);
      
      setResult(analysisData);

      // Create log entry
      const newLog: LogEntry = {
        id: Date.now().toString(),
        supplier: supplierName || "Unknown Dealer",
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        rating: analysisData.rating,
        verdict: analysisData.verdict,
        fullReport: analysisData.markdown,
      };

      const updatedLogs = [newLog, ...logs];
      setLogs(updatedLogs);
      localStorage.setItem('copper_guard_logs', JSON.stringify(updatedLogs));

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <Header />

      {/* Navigation Tabs */}
      <div className="sticky top-[72px] z-40 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200 mb-4 px-4 pt-2">
        <div className="max-w-3xl mx-auto flex gap-4">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'scanner' 
                ? 'border-amber-600 text-amber-800' 
                : 'border-transparent text-stone-400 hover:text-stone-600'
            }`}
          >
            <ScanLine className="w-4 h-4" />
            Quality Scanner
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'suppliers' 
                ? 'border-amber-600 text-amber-800' 
                : 'border-transparent text-stone-400 hover:text-stone-600'
            }`}
          >
            <Search className="w-4 h-4" />
            Find Suppliers
          </button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto p-4 space-y-8">
        
        {activeTab === 'scanner' ? (
          <>
            {/* Intro / Context */}
            <section className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-900 text-sm">
               <p className="font-medium">🛠️ Expert Garage Mode</p>
               <p className="opacity-80 mt-1">Get industrial-grade copper analysis using just your camera. Perfect for quick checks at the godown.</p>
            </section>

            {/* Input Section */}
            <section className="space-y-4">
              <h2 className="font-bold text-stone-800 text-lg">1. Capture Metal</h2>
              <ImageUploader 
                onImageSelected={handleImageSelected} 
                onImageRemoved={handleImageRemoved} 
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Supplier / Kabadiwala Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Raju Scrap Dealer"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="w-full p-3 rounded-lg border border-stone-200 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Notes / Batch ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Found in humid godown"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 rounded-lg border border-stone-200 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!selectedImage || isAnalyzing}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${
                  !selectedImage || isAnalyzing
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 active:scale-[0.99]'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" /> Analyzing...
                  </>
                ) : (
                  'Run Copper Analysis'
                )}
              </button>
            </section>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Results Section */}
            {result && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                         <h2 className="font-bold text-stone-800 text-lg">2. Analysis Report</h2>
                         <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">AI Generated</span>
                    </div>
                    <AnalysisResultCard result={result} />
                </section>
            )}

            <hr className="border-stone-200" />

            {/* History Section */}
            <section>
              <SupplierLogList logs={logs} />
            </section>
          </>
        ) : (
          <SupplierFinder />
        )}

      </main>
    </div>
  );
}