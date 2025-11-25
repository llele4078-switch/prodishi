import React, { useState, useRef, useEffect } from 'react';
import { Check, Shield, Award, Sparkles } from 'lucide-react';

interface ProductShowcaseProps {
  scrollY: number;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({ scrollY }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Sprečava selekciju teksta
    setIsDragging(true);
    updateSliderPosition(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      updateSliderPosition(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateSliderPosition(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) {
      e.preventDefault();
      updateSliderPosition(e.touches[0].clientX);
    }
  };

  const updateSliderPosition = (clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const position = ((clientX - rect.left) / rect.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, position)));
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
      
      // Dodaje cursor za ceo dokument tokom drag-a
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      // Vraća normalan cursor
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  const features = [
    {
      icon: Shield,
      title: 'Medicinski bezbedan materijal',
      description: 'Hipoalergijski materijal testiran dermatološki'
    },
    {
      icon: Award,
      title: 'Ergonomski dizajn',
      description: 'Savršeno se prilagođava anatomiji vašeg nosa'
    },
    {
      icon: Sparkles,
      title: 'Višekratna upotreba',
      description: 'Trajan i lako se čisti - do 6 meseci upotrebe'
    }
  ];

  return (
    <section id="product" ref={sectionRef} className="relative py-32 bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden">
      {/* Background elemdents */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Before/After Slider Side */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 overflow-hidden">
              {/* Ambient lighting effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-transparent to-blue-500/20 rounded-3xl opacity-60" />
              
              {/* Before/After Container */}
              <div 
                ref={containerRef}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-col-resize select-none"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                {/* Before Image (Right side) */}
                <div className="absolute inset-0">
                  <img
                    src="/images/before.webp"
                    alt="Pre korišćenja PRO.DISHI"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold">
                    PRE
                  </div>
                </div>

                {/* After Image (Left side) */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <img
                    src="/images/after.webp"
                    alt="Posle korišćenja PRO.DISHI"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold">
                    POSLE
                  </div>
                </div>

                {/* Slider Line - UKLONJENA TRANSITION! */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-gray-700 shadow-lg z-10"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                >
                  {/* Slider Handle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-700 rounded-full shadow-lg border-2 border-gray-300 flex items-center justify-center cursor-col-resize">
                    <div className="flex space-x-0.5">
                      <div className="w-0.5 h-4 bg-gray-400 rounded-full"></div>
                      <div className="w-0.5 h-4 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm">
                  Povucite slider da vidite razliku
                </p>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-sm font-medium backdrop-blur-sm mb-6">
                Premijum proizvod
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-snug">
                Nazalni dilatator
                <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent leading-snug">
                  nove generacije
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Vidite razliku pre i posle korišćenja PRO.DISHI nazalnog dilatatora. Rezultati govore sami za sebe.
              </p>
            </div>

            {/* Feature details */}
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-2xl transition-all duration-300 hover:bg-gray-800/30"
                  >
                    <div className="p-3 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Product specs */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Specifikacije proizvoda:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-teal-400" />
                  <span className="text-gray-300">Medicinski polimer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-teal-400" />
                  <span className="text-gray-300">Hipoalergijski</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-teal-400" />
                  <span className="text-gray-300">Višekratna upotreba</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-teal-400" />
                  <span className="text-gray-300">Lako čišćenje</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <a 
              href="#order" 
              className="font-neuropol inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 rounded-2xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-teal-500/25"
            >
              Naručite PRO.DISHI
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};