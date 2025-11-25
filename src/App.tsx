import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { BenefitsSection } from './components/BenefitsSection';
import { ProductShowcase } from './components/ProductShowcase';
import { TestimonialsSection } from './components/TestimonialsSection';
import { HowItWorks } from './components/HowItWorks';
import { BreathingDemo } from './components/BreathingDemo';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { FloatingCTA } from './components/FloatingCTA';

//  novo: uvoz shop bloka (picker + modal)
import ShopSplit from './components/ShopSplit';

function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

// Generički hash routing za sve sekcije
useEffect(() => {
  const scrollToHash = () => {
    const hash = window.location.hash;
    if (hash) {
      // Ukloni # sa početka
      const id = hash.substring(1);
      const element = document.getElementById(id);
      
      if (element) {
        // Malo kašnjenje da se stranica učita
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  };

  // Pozovi odmah pri učitavanju (za direktne linkove)
  scrollToHash();

  // Slušaj promene hash-a (za klikove na linkove)
  window.addEventListener('hashchange', scrollToHash);
  
  return () => window.removeEventListener('hashchange', scrollToHash);
}, []);
  
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      <Header scrollY={scrollY} />
      <HeroSection scrollY={scrollY} />
      <BenefitsSection scrollY={scrollY} />

      {/* Postojeći showcase zadržavam (može i da se ukloni ako ne treba) */}
      <ProductShowcase scrollY={scrollY} />

       <ShopSplit />


      <BreathingDemo scrollY={scrollY} />
      {/* <TestimonialsSection scrollY={scrollY} /> */}
      <HowItWorks scrollY={scrollY} />
      <CTASection scrollY={scrollY} />
      <Footer />
      <FloatingCTA scrollY={scrollY} />
    </div>
  );
}

export default App;
