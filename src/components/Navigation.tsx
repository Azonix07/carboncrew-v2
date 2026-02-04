import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const navRef = useRef<HTMLDivElement>(null);
  
  // Scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.scroll-snap-container');
      const scrollTop = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      
      setIsScrolled(scrollTop > 50);
      
      // Detect active section
      const sections = ['hero', 'services', 'why', 'projects', 'contact'];
      const viewportHeight = window.innerHeight;
      const scrollPosition = scrollTop + viewportHeight * 0.35;
      
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const offsetTop = el.offsetTop;
          const offsetHeight = el.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    
    const scrollContainer = document.querySelector('.scroll-snap-container');
    handleScroll();
    
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', id: 'hero' },
    { name: 'Services', id: 'services' },
    { name: 'Why Us', id: 'why' },
    { name: 'Projects', id: 'projects' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-slate-400 via-slate-600 to-slate-400 origin-left z-[60]"
        style={{ scaleX }}
      />
      
      <motion.nav
        ref={navRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-2xl border-b border-slate-100 shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-3 sm:px-5 md:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 cursor-pointer group"
              onClick={() => scrollToSection('hero')}
            >
              <motion.div 
                className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center overflow-hidden"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-lg sm:rounded-xl"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(244, 63, 94, 0.4)',
                      '0 0 0 10px rgba(244, 63, 94, 0)',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-white font-bold text-base sm:text-lg md:text-xl relative z-10">C</span>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-slate-800 font-bold text-sm sm:text-base md:text-lg leading-tight">
                  Carbon<span className="text-rose-500 group-hover:text-rose-600 transition-colors">Crew</span>
                </span>
                <span className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 tracking-widest uppercase">Digital Studio</span>
              </div>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
              {navLinks.map((link) => (
                <motion.button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="relative px-2.5 lg:px-3 xl:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-medium transition-colors"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence>
                    {activeSection === link.id && (
                      <motion.span
                        layoutId="navHighlight"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 rounded-md lg:rounded-lg"
                        style={{
                          background: 'rgba(71, 85, 105, 0.08)',
                          border: '1px solid rgba(71, 85, 105, 0.15)',
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  <span className={`relative z-10 transition-colors duration-200 ${
                    activeSection === link.id ? 'text-slate-800' : 'text-slate-500 hover:text-slate-800'
                  }`}>
                    {link.name}
                  </span>
                </motion.button>
              ))}
              
              <motion.button
                onClick={() => scrollToSection('contact')}
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(71, 85, 105, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                className="ml-2 lg:ml-3 xl:ml-4 px-4 lg:px-5 xl:px-6 py-1.5 lg:py-2 xl:py-2.5 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-full text-xs lg:text-sm font-semibold shadow-lg shadow-slate-500/20"
              >
                Start Project
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-8 h-8 sm:w-9 sm:h-9 flex flex-col items-center justify-center gap-1 sm:gap-1.5"
            >
              <motion.span
                animate={isMobileMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                className="w-5 sm:w-6 h-0.5 bg-slate-800 rounded-full"
              />
              <motion.span
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-5 sm:w-6 h-0.5 bg-slate-800 rounded-full"
              />
              <motion.span
                animate={isMobileMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                className="w-5 sm:w-6 h-0.5 bg-slate-800 rounded-full"
              />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-slate-100/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 w-3/4 max-w-sm h-full bg-white border-l border-slate-100 shadow-xl flex flex-col p-6 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-6 mt-12">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.id}
                    href={`#${link.id}`}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    onClick={() => {
                        scrollToSection(link.id);
                        setIsMobileMenuOpen(false);
                    }}
                    className={`text-xl font-medium ${
                      activeSection === link.id ? 'text-slate-800' : 'text-slate-600'
                    }`}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
