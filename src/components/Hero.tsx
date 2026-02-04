import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

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

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    setIsLowEnd(isLowEndDevice());
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-full flex-1 overflow-hidden">
      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100, 116, 139, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 116, 139, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      
      {/* Ambient glows - static for performance */}
      <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] bg-slate-400/5 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none opacity-40" />
      <div className="absolute bottom-1/3 right-1/4 w-[250px] sm:w-[300px] lg:w-[400px] h-[250px] sm:h-[300px] lg:h-[400px] bg-slate-500/5 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none opacity-30" />
      
      {/* Main centered content - centered both horizontally and vertically */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-4xl mx-auto">
        
          {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={isLoaded ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 100 }}
          className="mb-3 sm:mb-4 lg:mb-6"
        >
          <motion.div 
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/90 border border-slate-200 backdrop-blur-sm shadow-sm"
            whileHover={isLowEnd ? {} : { scale: 1.05, borderColor: 'rgba(244, 63, 94, 0.3)' }}
          >
            <div
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-rose-500 rounded-full status-pulse"
            />
            <span className="text-rose-600 text-[11px] sm:text-sm font-medium tracking-wide">
              Ready to Build Your Vision
            </span>
          </motion.div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4, type: 'spring', stiffness: 50 }}
          className="font-display font-bold text-slate-800 leading-[1.1] sm:leading-[0.95] tracking-tight mb-4 sm:mb-4 lg:mb-6"
          style={{ fontSize: 'clamp(2.5rem, 10vw, 6rem)' }}
        >
          <motion.span 
            className="block"
            initial={{ opacity: 0, x: -50 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            We Build
          </motion.span>
          <motion.span 
            className="block mt-1 sm:mt-1 lg:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-rose-600 to-rose-500"
            initial={{ opacity: 0, x: 50 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <TypeAnimation
              sequence={[
                'Digital Dreams',
                2500,
                'Stunning Apps',
                2500,
                'Future Tech',
                2500,
                'Your Vision',
                2500,
              ]}
              wrapper="span"
              speed={40}
              repeat={Infinity}
            />
          </motion.span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={isLoaded ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-slate-600 max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed font-light px-2 sm:px-0"
          style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.125rem)' }}
        >
          A fresh digital studio bringing your ideas to life with 
          <span className="text-slate-700 font-medium"> modern technology</span> and 
          <span className="text-slate-700 font-medium"> creative solutions</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.1, type: 'spring', stiffness: 80 }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
        >
          <motion.button
            onClick={scrollToServices}
            whileHover={isLowEnd ? {} : { scale: 1.05, boxShadow: '0 0 40px rgba(244, 63, 94, 0.2)' }}
            whileTap={{ scale: 0.98 }}
            className="group relative w-full sm:w-auto px-6 sm:px-6 lg:px-8 py-3 sm:py-3 lg:py-4 bg-gradient-to-r from-rose-500 to-rose-600 rounded-full font-semibold text-white overflow-hidden text-base sm:text-base shadow-lg shadow-rose-500/25"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Explore Our Work
              <svg
                className="w-5 h-5 sm:w-5 sm:h-5 arrow-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            {!isLowEnd && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-700"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
          
          <motion.button
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-6 sm:px-6 lg:px-8 py-3 sm:py-3 lg:py-4 rounded-full font-semibold text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-white transition-all duration-300 text-base sm:text-base bg-white/50 backdrop-blur-sm"
          >
            Get in Touch
          </motion.button>
        </motion.div>
        
        </div>
      </div>

      {/* Scroll Indicator - fixed at bottom of screen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5 sm:gap-2 cursor-pointer"
          onClick={scrollToServices}
        >
          <span className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-2 border-slate-300 flex justify-center p-1.5 sm:p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-slate-500 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
