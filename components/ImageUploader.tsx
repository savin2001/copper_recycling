import React, { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  onImageRemoved: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, onImageRemoved }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelected(file);
  };

  const clearImage = () => {
    setPreview(null);
    onImageRemoved();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {!preview ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-stone-300 bg-stone-50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-stone-100 hover:border-amber-400 transition-colors gap-3 active:scale-[0.98]"
        >
          <div className="bg-amber-100 p-4 rounded-full">
            <Camera className="w-8 h-8 text-amber-700" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-stone-700">Tap to Capture Copper</p>
            <p className="text-sm text-stone-500 mt-1">or upload from gallery</p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden shadow-md border border-stone-200">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-64 object-cover" 
          />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
             <p className="text-white text-sm font-medium">Image Ready for Analysis</p>
          </div>
        </div>
      )}
    </div>
  );
};