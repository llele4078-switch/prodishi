import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Zap, Target, Trophy } from 'lucide-react';

interface HowItWorksProps {
  scrollY: number;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ scrollY }) => {
  const [activeStep, setActiveStep] = useState(0);
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

  const steps = [
    {
      icon: Target,
      title: 'Postavka',
      description: 'Jednostavno postavite PRO.DISHI u nosne otvore',
      detail: 'Ergonomski dizajniran da se savršeno prilagodi vašoj anatomiji bez ikakvog diskomfora. Materijal od medicinskog silikona osigurava potpunu bezbednost.',
      time: '10 sekundi'
    },
    {
      icon: Zap,
      title: 'Aktivacija',
      description: 'Nazalni dilatator odmah počinje da deluje',
      detail: 'Blago proširuje nosne otvore omogućavajući do 40% veći protok vazduha. Osećaćete razliku u prvom udahu - kristalno čist i dubak vazduh.',
      time: '1 minut'
    },
    {
      icon: Trophy,
      title: 'Rezultat',
      description: 'Uživajte u transformaciji vašeg disanja',
      detail: 'Bolje performanse, mirniji san, manje alergija i poboljšan kvalitet života. Rezultati su vidljivi od prvog dana korišćenja.',
      time: 'Ceo dan'
    }
  ];

  return (
    <section id="kako-radi" ref={sectionRef} className="relative py-32 bg-gradient-to-b from-gray-950 to-gray-900 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-teal-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-sm font-medium backdrop-blur-sm mb-6">
            Kako funkcioniše
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Tri jednostavna
            <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent leading-snug">
              koraka do transformacije
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            PRO.DISHI je dizajniran da bude jednostavan za korišćenje, ali moćan u rezultatima
          </p>
        </div>

        {/* Steps visualization */}
        <div className="mb-20">
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              {steps.map((_, index) => (
                <React.Fragment key={index}>
                  <div 
                    className={`w-4 h-4 rounded-full transition-all duration-500 ${
                      index <= activeStep ? 'bg-teal-400 scale-125' : 'bg-gray-600'
                    }`}
                  />
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 transition-all duration-500 ${
                      index < activeStep ? 'bg-teal-400' : 'bg-gray-600'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Steps content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              
              return (
                <div
                  key={index}
                  onMouseEnter={() => setActiveStep(index)}
                  className={`group relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border rounded-3xl p-8 transition-all duration-700 transform hover:scale-105 cursor-pointer ${
                    isActive ? 'border-teal-400/50 shadow-2xl shadow-teal-500/20' : 'border-gray-700/50 hover:border-gray-600/50'
                  }`}
                >
                  {/* Background effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl`} />
                  
                  {/* Step number */}
                  <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-teal-400 font-bold text-lg">{String(index + 1).padStart(2, '0')}</span>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl mb-6 transition-transform duration-500 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title and time */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-white group-hover:text-teal-300 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <span className="text-teal-400 text-sm font-medium px-3 py-1 bg-teal-500/10 rounded-full">
                        {step.time}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Detailed explanation - always visible now */}
                    <div className="mt-4">
                      <p className="text-gray-400 text-sm leading-relaxed border-t border-gray-700/50 pt-4">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Science section */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nauka iza PRO.DISHI
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Baziran na godinama medicinskih istraživanja o optimalnom disanju i nosnoj anatomiji
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Bosonski efekat',
                description: 'Proširenje nosnih otvora za do 40% povećava protok vazduha',
                stat: '+40%'
              },
              {
                title: 'Nosno filtriranje',
                description: 'Prirodno zagrevanje i vlaženje vazduha kroz nos',
                stat: '99.9%'
              },
              {
                title: 'Oksigenizacija',
                description: 'Poboljšana dostava kiseonika u krv i mišiće',
                stat: '+25%'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {item.stat}
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};