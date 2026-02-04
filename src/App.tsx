import React, { useEffect, useState, useRef, createContext, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyCarbonCrew from './components/WhyCarbonCrew';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Antimatter from './components/Antimatter';

// Detect low-end devices
const isLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  const nav = navigator as any;
  if (nav.deviceMemory && nav.deviceMemory < 4) return true;
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) return true;
  if (window.innerWidth < 768) return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  return false;
};

// Detect very low-end devices where Antimatter should be completely disabled
const isVeryLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  const nav = navigator as any;
  
  // Very low memory (< 2GB)
  if (nav.deviceMemory && nav.deviceMemory < 2) return true;
  
  // Single core or dual core with small screen (likely old phone)
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2 && window.innerWidth < 768) return true;
  
  // Very small screen (likely old/budget phone)
  if (window.innerWidth < 375) return true;
  
  // Check for reduced motion preference (accessibility)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  
  // Check connection speed if available (slow connection = likely low-end)
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  if (connection) {
    // Slow 2G or slower
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') return true;
    // Very low bandwidth
    if (connection.downlink && connection.downlink < 0.5) return true;
  }
  
  // Check if device has touch and small screen (mobile) with low pixel ratio (budget device)
  if ('ontouchstart' in window && window.innerWidth < 768 && window.devicePixelRatio < 2) return true;
  
  return false;
};

// Create context for section management
interface SectionContextType {
  currentSection: number;
  setCurrentSection: (section: number) => void;
  scrollToSection: (index: number) => void;
  isScrollLocked: boolean;
  setScrollLocked: (locked: boolean) => void;
}

export const SectionContext = createContext<SectionContextType>({
  currentSection: 0,
  setCurrentSection: () => {},
  scrollToSection: () => {},
  isScrollLocked: false,
  setScrollLocked: () => {},
});

export const useSectionContext = () => useContext(SectionContext);

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [isVeryLowEnd, setIsVeryLowEnd] = useState(false);
  const [isScrollLocked, setScrollLocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sections = ['hero', 'services', 'why', 'projects', 'contact', 'footer'];

  // Check for low-end device on mount
  useEffect(() => {
    setIsLowEnd(isLowEndDevice());
    setIsVeryLowEnd(isVeryLowEndDevice());
  }, []);

  // Generate star positions only once - reduced count for performance
  // Very low-end devices get minimal stars, low-end gets reduced, normal gets standard
  const stars = useMemo(() => {
    const count = isVeryLowEnd ? 15 : (isLowEnd ? 30 : 50);
    return [...Array(count)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));
  }, [isLowEnd, isVeryLowEnd]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Don't update section if scroll is locked (e.g., when scrolling inside Contact)
      if (isScrollLocked) return;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPosition = container.scrollTop;
        const windowHeight = window.innerHeight;
        const newSection = Math.round(scrollPosition / windowHeight);
        
        if (newSection !== currentSection && newSection >= 0 && newSection < sections.length) {
          setCurrentSection(newSection);
        }
      }, 50);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentSection, sections.length, isScrollLocked]);

  const scrollToSection = (index: number) => {
    const container = containerRef.current;
    if (container && index >= 0 && index < sections.length) {
      setIsTransitioning(true);
      container.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      });
      setCurrentSection(index);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  };

  // Section indicator dots
  const SectionIndicator = () => (
    <motion.div 
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
    >
      {sections.map((section, index) => (
        <motion.button
          key={section}
          onClick={() => scrollToSection(index)}
          className="group flex items-center gap-3"
          whileHover={{ x: -4 }}
        >
          <motion.span 
            className={`text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-300 opacity-0 group-hover:opacity-100 ${
              currentSection === index ? 'text-slate-700' : 'text-slate-400'
            }`}
          >
            {section}
          </motion.span>
          <motion.div
            className={`relative w-3 h-3 rounded-full transition-all duration-500 ${
              currentSection === index 
                ? 'bg-transparent' 
                : 'bg-slate-200 hover:bg-slate-300'
            }`}
          >
            {currentSection === index && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-600 to-slate-800"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {currentSection === index && (
              <motion.div
                className="absolute inset-0 rounded-full bg-slate-600"
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        </motion.button>
      ))}
    </motion.div>
  );

  return (
    <SectionContext.Provider value={{ currentSection, setCurrentSection, scrollToSection, isScrollLocked, setScrollLocked }}>
      <div className="min-h-screen font-sans antialiased overflow-hidden bg-white text-slate-800" style={{ backgroundColor: '#ffffff', background: '#ffffff' }}>
        {/* Star field background - subtle on white */}
        <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundColor: '#ffffff', background: '#ffffff' }}>
          <div className="absolute inset-0 bg-white" />
          {/* Animated stars - very subtle on light bg */}
          {!isLowEnd && stars.map((star) => (
            <div
              key={star.id}
              className="absolute w-[2px] h-[2px] bg-slate-300 rounded-full star-twinkle"
              style={{
                left: star.left,
                top: star.top,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
        </div>
        
        {/* Navigation */}
        <Navigation />
        
        {/* Section Indicator */}
        <SectionIndicator />
        
        {/* Antimatter 3D - Only visible on first two pages, disabled on very low-end devices */}
        {!isVeryLowEnd && <Antimatter currentSection={currentSection} />}
        
        {/* Main content */}
        <main 
          ref={containerRef}
          className="scroll-snap-container relative z-10"
        >
          {/* Page transition overlay */}
          <AnimatePresence>
            {isTransitioning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at center, transparent 0%, rgba(200,200,200,0.1) 100%)',
                }}
              />
            )}
          </AnimatePresence>
          
          {/* Sections */}
          <section id="hero" className="snap-section">
            <Hero />
          </section>
          
          <section id="services" className="snap-section">
            <Services />
          </section>
          
          <section id="why" className="snap-section">
            <WhyCarbonCrew />
          </section>
          
          <section id="projects" className="snap-section">
            <Projects />
          </section>
          
          <section id="contact" className="snap-section">
            <Contact />
          </section>
          
          <section id="footer" className="snap-section">
            <Footer />
          </section>
        </main>
      </div>
    </SectionContext.Provider>
  );
};

export default App;
