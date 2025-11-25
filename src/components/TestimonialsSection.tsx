import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface TestimonialsSectionProps {
  scrollY: number;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ scrollY }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      name: 'Marko Petrović',
      role: 'Profesionalni biciklista',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5,
      text: 'PRO.DISHI mi je potpuno promenio performanse na biciklu. Stabilniji puls, bolja koncentracija i značajno manji umor. Ne mogu da treniram bez njega!',
      result: '+30% izdržljivost'
    },
    {
      name: 'Ana Jovanović',
      role: 'Majka dvoje dece',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5,
      text: 'Godinama sam imala problem sa hrkanjem koje je uticalo na celu porodicu. Nakon korišćenja PRO.DISHI, hrkanje je prestalo. Spavam mirno i ne budim muža!',
      result: '0% hrkanje'
    },
    {
      name: 'Stefan Nikolić',
      role: 'IT konsultant',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5,
      text: 'Alergije su mi otežavale svaki dan. PRO.DISHI mi je omogućio da dišem slobodno bez lekova.',
      result: '-80% alergija'
    },
    {
      name: 'Milica Stojanović',
      role: 'Yoga instruktorka',
      image: 'https://images.pexels.com/photos/30500781/pexels-photo-30500781.jpeg?...',
      rating: 5,
      text: 'Kao instruktor yoge, pravilno disanje mi je ključno. PRO.DISHI je podigao moje tehnike disanja na potpuno novi nivo. Preporučujem svim klijentima!',
      result: '100% poboljšanje'
    },
    {
      name: 'Nikola Milošević',
      role: 'Trener',
      image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5,
      text: 'Devijacija nosne pregrade me je ograničavala godinama. Sa PRO.DISHI mogu da dišem kroz oba nosna otvora. Moji treninzi su drastično bolji!',
      result: '+25% kapacitet'
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => setTouchStartX(e.touches[0].clientX);
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartX !== null) {
        const diff = e.changedTouches[0].clientX - touchStartX;
        if (diff > 50) prevTestimonial();
        else if (diff < -50) nextTestimonial();
      }
      setTouchStartX(null);
    };

    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [touchStartX]);

  return (
    <section id="testimonials" className="relative py-32 bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-sm font-medium backdrop-blur-sm mb-6">
            Iskustva korisnika
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Priče o
            <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              transformaciji
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Hiljade korisnika širom Srbije već je transformisalo svoj način života sa PRO.DISHI
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              ref={carouselRef}
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                      <div className="absolute top-6 right-6 opacity-20">
                        <Quote className="w-16 h-16 text-teal-400" />
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center mb-6">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                          ))}
                        </div>

                        <blockquote className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-8 font-medium">
                          "{testimonial.text}"
                        </blockquote>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-semibold text-white text-lg">{testimonial.name}</div>
                              <div className="text-gray-400">{testimonial.role}</div>
                            </div>
                          </div>

                          <div className="hidden md:block px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl text-white font-bold">
                            {testimonial.result}
                          </div>
                        </div>

                        <div className="md:hidden mt-4 inline-flex px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl text-white font-bold">
                          {testimonial.result}
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5 rounded-3xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-gray-800/80 backdrop-blur-sm border border-gray-700 hover:border-teal-400 rounded-full text-gray-400 hover:text-teal-400 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-gray-800/80 backdrop-blur-sm border border-gray-700 hover:border-teal-400 rounded-full text-gray-400 hover:text-teal-400 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="flex items-center justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-teal-400 scale-125' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
          {[
            { number: '5000+', label: 'Zadovoljnih korisnika' },
            { number: '98%', label: 'Preporučuje prijateljima' },
            { number: '4.9/5', label: 'Prosečna ocena' },
            { number: '30 dana', label: 'Garancija povraćaja' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
