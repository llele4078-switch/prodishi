import React from 'react';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-t from-gray-950 to-gray-900 py-20 border-t border-gray-800/50">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-12">
          
          {/* Brand section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <img
                src="/images/logo.png"
                alt="PRO.DISHI Logo"
                className="h-12 w-auto"
              />
            </div>
            
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Revolucija disanja u Srbiji.
Transformišite svoj život boljim disanjem, boljim snom i boljim performansama.
            </p>
            
            <div className="flex items-center space-x-6">
              <a 
                href="https://www.instagram.com/prodishi.rs/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 rounded-xl text-white transition-all duration-300 transform hover:scale-110"
              >
                <Instagram className="w-6 h-6" />
              </a>
              
              <a 
                href="mailto:info@prodishi.rs"
                className="flex items-center justify-center w-12 h-12 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-teal-400/50 rounded-xl text-gray-400 hover:text-teal-400 transition-all duration-300 transform hover:scale-110"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Brze veze</h3>
            <ul className="space-y-3">
              {[
                { name: 'O nama', href: '#' },
                { name: 'Kako funkcioniše', href: '#kako-radi' },
                { name: 'Poručivanje', href:"#order"  },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Kontakt</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                <span>Srbija</span>
              </div>
              
              <div className="flex items-start space-x-3 text-gray-400">
                <Instagram className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                <div>
                  <p>Poručite na sajtu ili u DM</p>
                  <a 
                    href="https://www.instagram.com/prodishi.rs/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:text-teal-300 transition-colors duration-300"
                  >
                    @prodishi.rs
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800/50 mt-16 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} PRO.DISHI. Sva prava zadržana.
            </p>

            
            
            
          </div>
        </div>
      </div>
    </footer>
  );
};