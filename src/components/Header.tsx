import React, { useState, useCallback, useEffect } from 'react';
import { Menu, X, Instagram } from 'lucide-react';

interface HeaderProps {
  scrollY: number;
}

export const Header: React.FC<HeaderProps> = ({ scrollY }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Umesto dodavanja/uklanjanja bordera, uvek imamo border-b (nema hairline “seam”).
  // Na vrhu je transparentan, kad se skroluje dobija blag kontrast.
  const headerBg =
    scrollY > 50
      ? 'bg-gray-950/90 backdrop-blur-xl border-b border-white/10'
      : 'bg-transparent border-b border-transparent';

  // zatvori na klik linka (ne diraj default anchor behavior)
  const handleNavClick = useCallback(() => setIsMenuOpen(false), []);

  // (opciono) zatvori na Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform-gpu will-change-transform ${headerBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-3 cursor-pointer group transition-transform duration-300 hover:scale-105"
            aria-label="Scroll to top"
          >
            <img 
  src="/images/ikonica.png" 
  alt="PRO.DISHI Icon" 
  className="h-10 w-auto transition-transform duration-500 ease-in-out group-hover:rotate-360" 
/>
            <span className="gradient-text font-neuropol text-xl font-bold group-hover:from-teal-300 group-hover:to-blue-300 transition-all duration-300">
              PRO.DISHI
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#benefits" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">Prednosti</a>
            <a href="#product" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">Proizvod</a>
            <a href="#kako-radi" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">Kako radi</a>
          </nav>

          {/* CTA (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://www.instagram.com/prodishi.rs/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-teal-400 transition-colors duration-300"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="#order"
              className="font-neuropol bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/25"
            >
              Poruči sada
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(o => !o)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-nav"
          className={`md:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 backdrop-blur-xl rounded-2xl mt-4 border border-gray-800/50">
            <a
              href="#benefits"
              onClick={handleNavClick}
              className="block px-3 py-2 rounded-lg text-gray-300 hover:text-teal-400 hover:bg-gray-800/50 transition-all duration-300"
            >
              Prednosti
            </a>
            <a
              href="#product"
              onClick={handleNavClick}
              className="block px-3 py-2 rounded-lg text-gray-300 hover:text-teal-400 hover:bg-gray-800/50 transition-all duration-300"
            >
              Proizvod
            </a>
            <a
              href="#kako-radi"
              onClick={handleNavClick}
              className="block px-3 py-2 rounded-lg text-gray-300 hover:text-teal-400 hover:bg-gray-800/50 transition-all duration-300"
            >
              Kako radi
            </a>

            <div className="flex items-center justify-center pt-4 space-x-4">
              <a
                href="https://www.instagram.com/prodishi.rs/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleNavClick}
                className="text-gray-400 hover:text-teal-400 transition-colors duration-300"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#order"
                onClick={handleNavClick}
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105"
              >
                Poruči sada
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
