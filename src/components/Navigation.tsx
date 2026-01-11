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
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-400 via-red-500 to-rose-400 origin-left z-[60]"
        style={{ scaleX }}
      />
      
      <motion.nav
        ref={navRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#030014]/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-lg shadow-black/10' 
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
                className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center overflow-hidden"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-lg sm:rounded-xl"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(225, 29, 72, 0.4)',
                      '0 0 0 10px rgba(225, 29, 72, 0)',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-white font-bold text-base sm:text-lg md:text-xl relative z-10">C</span>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm sm:text-base md:text-lg leading-tight">
                  Carbon<span className="text-rose-400 group-hover:text-rose-300 transition-colors">Crew</span>
                </span>
                <span className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-500 tracking-widest uppercase">Digital Studio</span>
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
                          background: 'rgba(225, 29, 72, 0.1)',
                          border: '1px solid rgba(225, 29, 72, 0.2)',
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  <span className={`relative z-10 transition-colors duration-200 ${
                    activeSection === link.id ? 'text-rose-400' : 'text-gray-400 hover:text-white'
                  }`}>
                    {link.name}
                  </span>
                </motion.button>
              ))}
              
              <motion.button
                onClick={() => scrollToSection('contact')}
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(225, 29, 72, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="ml-2 lg:ml-3 xl:ml-4 px-4 lg:px-5 xl:px-6 py-1.5 lg:py-2 xl:py-2.5 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-full text-xs lg:text-sm font-semibold"
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
                className="w-5 sm:w-6 h-0.5 bg-white rounded-full"
              />
              <motion.span
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-5 sm:w-6 h-0.5 bg-white rounded-full"
              />
              <motion.span
                animate={isMobileMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                className="w-5 sm:w-6 h-0.5 bg-white rounded-full"
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
<<<<<<< HEAD
            className="fixed inset-0 z-40 md:hidden overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
=======
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
>>>>>>> aa114e6d22ef164a8c2030369b9ba769eb6df2cd
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
<<<<<<< HEAD
              className="absolute right-0 top-0 bottom-0 w-[70vw] max-w-[280px] bg-[#030014] border-l border-rose-500/20 flex flex-col overflow-hidden"
            >
              {/* Header with close button - solid background */}
              <div className="flex items-center justify-between px-4 pt-4 pb-3 bg-[#030014] border-b border-white/5 flex-shrink-0">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                    <span className="text-white font-bold text-base">C</span>
                  </div>
                  <div>
                    <span className="text-white font-bold text-sm">Carbon<span className="text-rose-400">Crew</span></span>
                    <p className="text-[8px] text-gray-500 uppercase tracking-wider">Digital Studio</p>
                  </div>
                </div>
                
                {/* Close button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-rose-500/30 hover:bg-white/10 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </motion.button>
              </div>
              
              {/* Navigation links - scrollable area */}
              <div className="flex-1 overflow-y-auto py-4 px-3 bg-[#030014]">
                <p className="text-[9px] uppercase tracking-wider text-gray-500 px-2 mb-3">Navigation</p>
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, index) => (
                    <motion.button
                      key={link.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + index * 0.05 }}
                      onClick={() => scrollToSection(link.id)}
                      className={`relative flex items-center gap-3 text-left px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        activeSection === link.id 
                          ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' 
                          : 'text-gray-300 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      {/* Active indicator */}
                      {activeSection === link.id && (
                        <motion.div 
                          layoutId="mobileActiveIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-rose-500 to-red-500 rounded-r-full"
                        />
                      )}
                      {/* SVG Icon for each link */}
                      <span className={`w-5 h-5 ${activeSection === link.id ? 'text-rose-400' : 'text-gray-500'}`}>
                        {link.id === 'hero' && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                          </svg>
                        )}
                        {link.id === 'services' && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                          </svg>
                        )}
                        {link.id === 'why' && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        )}
                        {link.id === 'projects' && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                          </svg>
                        )}
                        {link.id === 'contact' && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                          </svg>
                        )}
                      </span>
                      <span className="font-medium text-sm">{link.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* CTA Button - fixed at bottom */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex-shrink-0 p-4 pt-3 bg-[#030014] border-t border-white/5"
              >
                <motion.button
                  onClick={() => scrollToSection('contact')}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-lg font-semibold text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2"
                >
                  <span>Start Your Project</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </motion.button>
                <p className="text-center text-[9px] text-gray-500 mt-2">Let's build something amazing</p>
              </motion.div>
=======
              className="absolute right-0 top-0 h-full w-64 sm:w-72 bg-[#030014]/95 backdrop-blur-xl border-l border-white/10 p-4 sm:p-6 pt-16 sm:pt-20"
            >
              <div className="flex flex-col gap-3 sm:gap-4">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => scrollToSection(link.id)}
                    className={`text-left text-base sm:text-lg py-1.5 sm:py-2 border-b border-white/10 transition-colors ${
                      activeSection === link.id ? 'text-rose-400' : 'text-gray-300 hover:text-rose-400'
                    }`}
                  >
                    {link.name}
                  </motion.button>
                ))}
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  onClick={() => scrollToSection('contact')}
                  className="mt-3 sm:mt-4 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-full font-semibold text-sm sm:text-base text-center"
                >
                  Start Project
                </motion.button>
              </div>
>>>>>>> aa114e6d22ef164a8c2030369b9ba769eb6df2cd
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
