import React, { useEffect, useState } from 'react';
import { ChevronDown, Play } from 'lucide-react';

interface HeroSectionProps {
  scrollY: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ scrollY }) => {
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'exhale'>('inhale');

  useEffect(() => {
    const interval = setInterval(() => {
      setBreathingPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-visible"> 
      {/* Background with parallax effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />
    
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-teal-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Breathing visualization – dodan niži z-index da ne prekriva tekst */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div 
          className={`w-96 h-96 border-2 border-teal-400/30 rounded-full transition-all duration-3000 ease-in-out ${
            breathingPhase === 'inhale' ? 'scale-110 border-teal-400/50' : 'scale-90 border-teal-400/20'
          }`}
        >
          <div 
            className={`w-full h-full border border-teal-400/20 rounded-full transition-all duration-3000 ease-in-out ${
              breathingPhase === 'inhale' ? 'scale-90 border-teal-400/40' : 'scale-110 border-teal-400/10'
            }`}
          >
            <div 
              className={`w-full h-full border border-teal-400/10 rounded-full transition-all duration-3000 ease-in-out ${
                breathingPhase === 'inhale' ? 'scale-75 border-teal-400/30' : 'scale-125 border-teal-400/5'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 md:pt-24">  
        <div className="space-y-4">  
          <h1 className="font-neuropol text-3xl md:text-5xl lg:text-6xl font-bold leading-tight pb-2 overflow-visible tracking-wide mt-6">  
            Transformiši svoj  {/* Dodao &nbsp; za ne-lomljivi razmak */}
            <span className="block bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse py-1"> 
              način disanja
            </span>
          </h1> 

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Revolucionarni nazalni dilatator koji poboljšava performanse, san i kvalitet života kroz optimalno disanje
          </p>
        
          {/* CTA Buttons – dodao mt-8 mb-12 za više prostora gore/dole oko dugmeta */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-8 mb-12">  
            <a 
              href="#order" 
              className="group relative overflow-hidden bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 px-8 py-4 rounded-2xl font-bold text-lg text-white transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-teal-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="font-neuropol relative">Poruči PRO.DISHI</span>
            </a>
          </div>

         {/* Feature highlights – povećao gap-4 na gap-6 za više prostora između ikona – sve kartice iste visine */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-8 items-stretch">
  {[
    { emoji: '🏋🏻‍♀️', text: 'Bolje performanse' },
    { emoji: '😴', text: 'Zdravije i tiše spavanje' },
    { emoji: '🌱', text: 'Bez alergija' },
    { emoji: '✨', text: 'Nova energija' }
  ].map((item, i) => (
    <div key={i} className="group">
      <div
        className="h-full min-h-28 sm:min-h-32 rounded-2xl border border-gray-800/50
                   bg-gray-800/30 backdrop-blur-sm px-4 py-6
                   transition-all duration-300 transform hover:scale-105 hover:border-teal-500/30"
      >
        <div className="flex h-full flex-col items-center justify-center text-center gap-2">
          <div className="text-3xl leading-none group-hover:scale-110 transition-transform duration-300">
            {item.emoji}
          </div>
          <p className="text-gray-300 font-medium">{item.text}</p>
        </div>
      </div>
    </div>
  ))}
</div>

      
          {/* Badge – ostavio sam ga ovde, kao u originalu */}
          <div className="flex justify-center">
            <div className="font-neuropol inline-flex items-center px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-sm font-medium backdrop-blur-sm mt-4">
              <div className="w-2 h-2 bg-teal-400 rounded-full mr-2 animate-pulse" />
              Novi standard disanja
            </div>
          </div>
       
        </div>
      </div>
    </section>
  );
};