import React, { useState } from 'react';
import { Camera, Maximize2, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { FinalProductPhoto } from '../types';

interface FinalPhotosGalleryProps {
  photos: FinalProductPhoto[];
  orderNumber: string;
}

export const FinalPhotosGallery: React.FC<FinalPhotosGalleryProps> = ({ photos, orderNumber }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<FinalProductPhoto | null>(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-pink-50/50 border border-dashed border-pink-200 text-center space-y-1.5 my-3">
        <Camera className="w-6 h-6 text-pink-300 mx-auto" />
        <h5 className="font-serif font-bold text-xs text-gray-800">
          Galeria de Fotos do Produto Final
        </h5>
        <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
          O Ateliê publicará aqui as fotos reais dos seus mimos assim que forem produzidos e finalizados!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 my-4 bg-white border border-pink-200 rounded-2xl p-4 shadow-2xs">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-pink-100">
        <div className="flex items-center gap-2 text-[#e63946]">
          <Sparkles className="w-4 h-4" />
          <h5 className="font-serif font-bold text-sm text-gray-900">
            Fotos Reais do Produto Finalizado ({photos.length})
          </h5>
        </div>
        <span className="text-[10px] bg-pink-100 text-[#e63946] px-2 py-0.5 rounded-full font-bold">
          {orderNumber}
        </span>
      </div>

      {/* Grid of Photo Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative h-32 rounded-xl overflow-hidden border border-pink-200 bg-gray-100 cursor-pointer shadow-2xs hover:shadow-md transition-all hover:scale-[1.02]"
          >
            <img
              src={photo.url}
              alt={photo.caption || 'Foto do produto final'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 text-xs font-bold">
              <Maximize2 className="w-4 h-4" />
              <span>Ampliar</span>
            </div>

            {/* Upload Date Tag */}
            <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-md backdrop-blur-xs">
              {new Date(photo.uploadedAt).toLocaleDateString('pt-BR')}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Zoom Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl space-y-3 p-4 border border-pink-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-pink-100">
              <div className="flex items-center gap-2 text-gray-800 font-bold text-xs">
                <ImageIcon className="w-4 h-4 text-[#e63946]" />
                <span>Foto Real do Ateliê — {orderNumber}</span>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Expanded Image */}
            <div className="relative max-h-[70vh] flex items-center justify-center rounded-2xl overflow-hidden bg-gray-900">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || 'Foto do produto'}
                referrerPolicy="no-referrer"
                className="max-h-[68vh] w-auto object-contain"
              />
            </div>

            {/* Photo Caption */}
            {selectedPhoto.caption && (
              <div className="p-3 bg-pink-50 rounded-xl text-xs text-gray-700">
                <p className="font-medium">{selectedPhoto.caption}</p>
                <span className="text-[10px] text-gray-400 block mt-1">
                  Publicado em: {new Date(selectedPhoto.uploadedAt).toLocaleString('pt-BR')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
