import React, { useState } from 'react';
import { Search, MapPin, Navigation, Loader2, Store } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { findSuppliers } from '../services/gemini';
import { SupplierSearchResult, MapLocation } from '../types';

export const SupplierFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<SupplierSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('');

  const handleSearch = async (useLocation: boolean = false) => {
    if (!useLocation && !query.trim()) return;

    setIsSearching(true);
    setError(null);
    setResult(null);
    setLocationStatus(useLocation ? 'Getting GPS...' : '');

    try {
      let userLocation = undefined;

      if (useLocation) {
        try {
          const pos = await getCurrentPosition();
          userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocationStatus('Found location. Searching Maps...');
        } catch (e) {
          throw new Error("Could not access location. Please enter city name manually.");
        }
      }

      const searchData = await findSuppliers(query, userLocation);
      setResult(searchData);
      setLocationStatus('');
    } catch (err: any) {
      setError(err.message || "Failed to find suppliers");
      setLocationStatus('');
    } finally {
      setIsSearching(false);
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
      }
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
          <Store className="text-amber-600" />
          Find Scrap Dealers
        </h2>
        
        <div className="flex flex-col gap-3">
          <div className="relative">
             <input 
               type="text" 
               placeholder="Enter City, Area, or Market Name"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
               onKeyDown={(e) => e.key === 'Enter' && handleSearch(false)}
             />
             <Search className="absolute left-3 top-3.5 text-stone-400 w-5 h-5" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleSearch(false)}
              disabled={isSearching || !query}
              className="flex-1 bg-amber-600 text-white font-semibold py-3 rounded-xl hover:bg-amber-700 active:scale-[0.98] transition-all disabled:bg-stone-200 disabled:text-stone-400"
            >
              Search City
            </button>
            <button
              onClick={() => handleSearch(true)}
              disabled={isSearching}
              className="px-4 bg-stone-100 text-stone-700 font-semibold rounded-xl border border-stone-200 hover:bg-stone-200 active:scale-[0.98] transition-all disabled:opacity-50"
              title="Use Current Location"
            >
              <MapPin className="w-5 h-5" />
            </button>
          </div>
          
          {locationStatus && <p className="text-xs text-amber-600 font-medium animate-pulse">{locationStatus}</p>}
          {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>}
        </div>
      </div>

      {isSearching && !locationStatus && (
        <div className="flex flex-col items-center justify-center py-12 text-stone-400">
           <Loader2 className="w-8 h-8 animate-spin mb-2" />
           <p>Searching Kabadiwalas...</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Map Locations Cards */}
          {result.locations.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 ml-1">Verified Locations</h3>
              <div className="grid gap-3">
                {result.locations.map((loc, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between group hover:border-amber-300 transition-colors">
                     <div className="flex-1">
                        <h4 className="font-bold text-stone-800">{loc.title}</h4>
                        {loc.address && <p className="text-xs text-stone-500 mt-1">{loc.address}</p>}
                     </div>
                     <a 
                       href={loc.uri} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="bg-green-50 text-green-700 p-2 rounded-lg hover:bg-green-100 transition-colors flex flex-col items-center gap-1 min-w-[70px]"
                     >
                        <Navigation className="w-5 h-5" />
                        <span className="text-[10px] font-bold">NAVIGATE</span>
                     </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Advice Text */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200">
             <div className="prose prose-sm prose-stone max-w-none">
                <ReactMarkdown>{result.text}</ReactMarkdown>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};