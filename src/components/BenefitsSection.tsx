import React, { useState, useRef, useEffect } from 'react';
import { Activity, Moon, Leaf, Zap } from 'lucide-react';

interface BenefitsSectionProps {
  scrollY: number;
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ scrollY }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      icon: Activity,
      title: 'Efikasnije treniraj - stabilizuj puls',
      description: 'Optimalno disanje kroz nos poboljšava dostavu kiseonika mišićima, stabilizuje srčani ritam i povećava izdržljivost tokom treninga.',
      stats: '+25% bolje performanse',
      color: 'teal',
      gradient: 'from-teal-500 to-green-500'
    },
    {
      icon: Moon,
      title: 'Mirno spavaj - bez hrkanja',
      description: 'Poboljšan protok vazduha kroz nos eliminiše hrkanje i omogućava dublji, mirniji san za vas i vašeg partnera.',
      stats: '90% manje hrkanja',
      color: 'blue',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      icon: Leaf,
      title: 'Alergije - više nisu problem',
      description: 'Prirodno filtriranje i zagrevanje vazduha kroz nos smanjuje alergijske reakcije i iritacije respiratornog sistema.',
      stats: '-70% alergijskih simptoma',
      color: 'green',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      icon: Zap,
      title: 'Devijacija - tvoja prošlost',
      description: 'Revolucionaran dizajn pomaže pri devijaciji nosne pregrade, omogućavajući slobodan protok vazduha kroz oba nosna otvora.',
      stats: '100% prirodno rešenje',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section id="benefits" ref={sectionRef} className="relative py-32 bg-gradient-to-b from-gray-950 to-gray-900 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-sm font-medium backdrop-blur-sm mb-6">
            Naučno dokazane prednosti
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Četiri načina da
            <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent leading-snug">
              promenite svoj život
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            PRO.DISHI ne samo da poboljšava disanje - transformiše vaš način života kroz četiri ključne prednosti
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const isActive = activeIndex === index;
            
            return (
              <div
                key={index}
                onMouseEnter={() => setActiveIndex(index)}
                className={`group relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 transition-all duration-700 transform hover:scale-105 ${
                  isActive ? 'border-teal-400/50 shadow-2xl shadow-teal-500/10' : 'hover:border-gray-600/50'
                }`}
              >
                {/* Background gradient effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-700 rounded-3xl`} />
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-teal-300 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    {benefit.description}
                  </p>
                  
                  {/* Stats badge */}
                  <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${benefit.gradient} rounded-xl text-white font-bold text-sm shadow-lg`}>
                    {benefit.stats}
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <a 
            href="#order" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 rounded-2xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-teal-500/25"
          >
            Iskusi sva četiri benefita
          </a>
        </div>
      </div>
    </section>
  );
};