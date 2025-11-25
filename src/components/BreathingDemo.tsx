import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface BreathingDemoProps {
  scrollY: number;
}

export const BreathingDemo: React.FC<BreathingDemoProps> = ({ scrollY }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (phase === 'inhale' && prev >= 4000) {
          setPhase('hold');
          return 0;
        } else if (phase === 'hold' && prev >= 1000) {
          setPhase('exhale');
          return 0;
        } else if (phase === 'exhale' && prev >= 6000) {
          setPhase('inhale');
          return 0;
        }
        return prev + 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, phase]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Udišite kroz nos';
      case 'hold': return 'Zadržite dah';
      case 'exhale': return 'Izdišite kroz usta';
    }
  };

  const getCircleScale = () => {
    if (phase === 'inhale') return 'scale-150';
    if (phase === 'exhale') return 'scale-75';
    return 'scale-125';
  };

  const reset = () => {
    setIsPlaying(false);
    setPhase('inhale');
    setTimer(0);
  };

  return (
    <section className="relative py-32 bg-gradient-to-b from-gray-950 to-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-sm font-medium backdrop-blur-sm mb-6">
            Interaktivni demo
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-snug">
            Naučite pravilno
            <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent leading-snug">
              disanje sa PRO.DISHI
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Pratite naš vodič za optimalno disanje i osetite razliku već nakon nekoliko minuta vežbe
          </p>
        </div>

        {/* Breathing visualization */}
        <div className="relative mb-12">
          <div className="flex items-center justify-center h-96">
            <div className="relative w-80 h-80 flex items-center justify-center">
              {/* Outer rings - properly centered */}
              <div className="absolute w-80 h-80 border-2 border-teal-400/20 rounded-full animate-pulse" />
              <div className="absolute w-64 h-64 border border-teal-400/30 rounded-full" />

              {/* Main breathing circle - centered */}
              <div
                className={`w-48 h-48 bg-gradient-to-br from-teal-400/30 to-blue-500/30 backdrop-blur-xl border-2 border-teal-400/50 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out ${getCircleScale()}`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">
                    {Math.ceil((
                      phase === 'inhale' ? (4000 - timer) / 1000 :
                      phase === 'hold' ? (1000 - timer) / 1000 :
                      (6000 - timer) / 1000
                    ))}s
                  </div>
                  <div className="text-teal-400 font-medium">
                    {getPhaseText()}
                  </div>
                </div>
              </div>

              {/* Particle effects - properly positioned around center */}
              {isPlaying && [...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-teal-400 rounded-full animate-ping"
                  style={{
                    left: `calc(50% + ${Math.cos(i * Math.PI / 6) * 140}px - 4px)`,
                    top: `calc(50% + ${Math.sin(i * Math.PI / 6) * 140}px - 4px)`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 mb-12">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-teal-500/25"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            <span>{isPlaying ? 'Pauziraj' : 'Počni vežbu'}</span>
          </button>
          
          <button
            onClick={reset}
            className="flex items-center space-x-3 px-6 py-4 border-2 border-gray-700 hover:border-teal-400 rounded-2xl font-semibold text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Priprema',
                description: 'Postavite PRO.DISHI u nos i zauzite udobnu poziciju. Opustite ramena i zatvorite oči.'
              },
              {
                step: '02', 
                title: 'Disanje',
                description: 'Pratite krugove na ekranu - udišite 4s, zadržite 1s, izdišite 6s. Osetićete razliku odmah.'
              },
              {
                step: '03',
                title: 'Rutina',
                description: 'Ponavljajte 5-10 minuta dnevno. Kombinujte sa treninzima za maksimalne rezultate.'
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/50 transition-all duration-300">
                <div className="text-teal-400 font-bold text-lg mb-3">{item.step}</div>
                <h3 className="text-white font-semibold text-lg mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};