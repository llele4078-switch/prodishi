import React, { useState, useEffect } from 'react';
import { ShoppingCart, X } from 'lucide-react';

interface FloatingCTAProps {
  scrollY: number;
}

export const FloatingCTA: React.FC<FloatingCTAProps> = ({ scrollY }) => {
  // Zakomentarisano da se ukloni ceo CTA/popup – ako trebaš nazad, otkomentariši
  /*
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const shouldShow = scrollY > 800;
    setIsVisible(shouldShow);
  }, [scrollY]);

  if (!isVisible) return null;

  return (
    <>
      // Mobile floating CTA
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className={`transform transition-all duration-300 ${isMinimized ? 'translate-y-full' : 'translate-y-0'}`}>
          <div className="bg-gradient-to-r from-teal-500 to-blue-500 backdrop-blur-xl border border-teal-400/20 rounded-2xl p-4 shadow-2xl shadow-teal-500/40">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-white font-bold text-lg">PRO.DISHI</div>
                <div className="text-white/80 text-sm">1.590 RSD - 20% POPUST!</div>
              </div>
            
              <div className="flex items-center space-x-3">
                <a 
                  href="#order"
                  className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-white font-semibold transition-all duration-300"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Poruči</span>
                </a>
              
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      // Desktop floating CTA
      <div className="hidden md:block fixed bottom-8 right-8 z-50">
        <div className={`transform transition-all duration-300 ${isMinimized ? 'scale-0' : 'scale-100'}`}>
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl max-w-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-white font-bold text-lg">Prodiši!</div>
                <div className="text-teal-400 text-sm">Dok traje 20% popust!</div>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-all duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 line-through">1.990 RSD</span>
                <span className="text-2xl font-bold text-white">1.590 RSD</span>
              </div>
            
              <a 
                href="#order" 
                className="block w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 py-3 px-4 rounded-xl text-white font-bold text-center transition-all duration-300 transform hover:scale-105"
              >
                Poruči PRO.DISHI
              </a>
            
              <div className="text-center text-gray-400 text-xs">
                🔥 Samo dok ima zaliha
              </div>
            </div>
          </div>
        </div>
      </div>

      // Restore button when minimized
      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 rounded-full shadow-2xl shadow-teal-500/40 flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 animate-pulse"
        >
          <ShoppingCart className="w-6 h-6" />
        </button>
      )}
    </>
  );
  */

  // Vraća null da se ništa ne renderuje – popup je uklonjen
  return null;
};