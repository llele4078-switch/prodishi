import React from 'react';
import { Sparkles, Shield, Truck, Headphones } from 'lucide-react';

interface CTASectionProps {
  scrollY: number;
}

export const CTASection: React.FC<CTASectionProps> = ({ scrollY }) => {
  const guarantees = [
    {
      icon: Shield,
      title: '30 dana garancije',
      description: 'Potpuni povraćaj novca'
    },
    {
      icon: Truck,
      title: 'Besplatna dostava',
      description: 'Širom Srbije'
    },
    {
      icon: Headphones,
      title: '24/7 podrška',
      description: 'Uvek tu za vas'
    },
    {
      icon: Sparkles,
      title: 'Premijum kvalitet',
      description: 'Medicinski sertifikovan'
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-t from-gray-950 to-gray-900 overflow-hidden">
      {/* Epic background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-blue-500/10" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-teal-500/5 to-transparent" />
        
        {/* Animated particles */}
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-teal-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main CTA */}
        <div className="mb-20">
         {/*  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-full text-red-400 font-bold text-sm backdrop-blur-sm mb-8 animate-pulse">
            🔥 OGRANIČENA PONUDA - SAMO OVU NEDELJU
          </div> */}
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
            Transformišite svoj život
            <span className="block bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              DANAS
            </span>
          </h2>
          
          <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Ne čekajte sutra. Vaš novi život počinje sa prvim udahom kroz PRO.DISHI
          </p>

          {/* Price section */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border-2 border-teal-400/50 rounded-3xl p-8 md:p-12 max-w-2xl mx-auto mb-12 shadow-2xl shadow-teal-500/20">
            <div className="flex items-center justify-center mb-6">
              <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                20% POPUST
              </div>
            </div>
            
            <div className="text-center mb-8">
              <div className="text-gray-400 text-lg line-through mb-2">Redovna cena: 1.990 RSD</div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                Samo <span className="text-teal-400">1.590 RSD</span>
              </div>
              <div className="text-red-400 font-semibold">Uštedi: 400 RSD!</div>
            </div>

            <div className="space-y-6">
              <a 
                href="#order" 
                className="group relative block w-full overflow-hidden bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 hover:from-teal-400 hover:via-blue-400 hover:to-purple-400 py-6 rounded-2xl font-black text-2xl text-white transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-teal-500/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center justify-center space-x-3">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                  <span>PORUČI PRO.DISHI SADA</span>
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
              </a>
              
              <p className="text-gray-400 text-sm">
                ⏰ Ponuda važi do kraja nedelje ili dok ima zaliha
              </p>
            </div>
          </div>
        </div>

        {/* Guarantees */}
        <div className="mb-20">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-12">
            Vaša sigurnost je naša garancija
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {guarantees.map((item, index) => {
              const Icon = item.icon;
              
              return (
                <div key={index} className="group">
                  <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/50 hover:border-teal-400/30 transition-all duration-300 transform hover:scale-105">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgency section 
        <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-2 border-red-500/30 rounded-3xl p-8 md:p-12 backdrop-blur-xl">
          <div className="text-center">
            <div className="text-6xl md:text-8xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-6 animate-pulse">
              POSLEDNJA ŠANSA
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Kada se zalihe istroše, sledeća dostava je za 3 meseca. Ne propustite priliku da transformišete svoj život danas!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href="https://www.instagram.com/prodishi.rs/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-12 py-6 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 rounded-2xl font-black text-2xl text-white transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-red-500/40 animate-pulse"
              >
                REZERVIŠI ODMAH!
              </a>
              
              <div className="text-gray-400">
                ili se pokajte zauvek... 😢
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};