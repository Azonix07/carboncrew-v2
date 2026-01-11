import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyCarbonCrew from './components/WhyCarbonCrew';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Antimatter from './components/Antimatter';

// Create context for section management
interface SectionContextType {
  currentSection: number;
  setCurrentSection: (section: number) => void;
  scrollToSection: (index: number) => void;
}

export const SectionContext = createContext<SectionContextType>({
  currentSection: 0,
  setCurrentSection: () => {},
  scrollToSection: () => {},
});

export const useSectionContext = () => useContext(SectionContext);

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sections = ['hero', 'services', 'why', 'projects', 'contact', 'footer'];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
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
  }, [currentSection, sections.length]);

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
              currentSection === index ? 'text-rose-400' : 'text-gray-500'
            }`}
          >
            {section}
          </motion.span>
          <motion.div
            className={`relative w-3 h-3 rounded-full transition-all duration-500 ${
              currentSection === index 
                ? 'bg-transparent' 
                : 'bg-gray-700/50 hover:bg-gray-600'
            }`}
          >
            {currentSection === index && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-400 to-red-500"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {currentSection === index && (
              <motion.div
                className="absolute inset-0 rounded-full bg-rose-400"
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
    <SectionContext.Provider value={{ currentSection, setCurrentSection, scrollToSection }}>
      <div className="min-h-screen font-sans antialiased overflow-hidden bg-[#030014]">
        {/* Star field background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(15,23,42,1)_0%,_rgba(3,0,20,1)_100%)]" />
          {/* Animated stars */}
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[2px] h-[2px] bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        {/* Navigation */}
        <Navigation />
        
        {/* Section Indicator */}
        <SectionIndicator />
        
        {/* Antimatter 3D - Only visible on first two pages */}
        <Antimatter currentSection={currentSection} />
        
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
                  background: 'radial-gradient(circle at center, transparent 0%, rgba(3,0,20,0.3) 100%)',
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
