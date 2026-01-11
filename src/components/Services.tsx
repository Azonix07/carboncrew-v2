import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

<<<<<<< HEAD
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

=======
>>>>>>> aa114e6d22ef164a8c2030369b9ba769eb6df2cd
// Vector icons as SVG components
const icons = {
  web: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  mobile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
      <path d="M12 18h.01"/>
    </svg>
  ),
  design: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z"/>
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
      <path d="M2 2l7.586 7.586"/>
      <circle cx="11" cy="11" r="2"/>
    </svg>
  ),
  automation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Gear/Cog icon for automation */}
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  ecommerce: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
    </svg>
  ),
};

const services = [
  { 
    iconKey: 'web' as keyof typeof icons,
    title: 'Web Development', 
    description: 'Custom websites and web apps built with cutting-edge technologies. From responsive landing pages to complex web platforms.',
    shortDesc: 'Modern web solutions',
    tags: ['React', 'Next.js', 'TypeScript', 'Node.js'],
    gradient: 'from-rose-500 to-red-500',
    accentColor: 'rose',
    features: ['Custom Development', 'API Integration', 'Performance Optimization', 'SEO Ready'],
    stats: { projects: 'New', satisfaction: '100%' },
  },
  { 
    iconKey: 'mobile' as keyof typeof icons,
    title: 'Mobile Apps', 
    description: 'Native and cross-platform mobile experiences that users love. iOS, Android, and hybrid solutions for any business need.',
    shortDesc: 'iOS & Android apps',
    tags: ['React Native', 'iOS', 'Android', 'Flutter'],
    gradient: 'from-violet-500 to-purple-500',
    accentColor: 'violet',
    features: ['Cross-Platform', 'Native Performance', 'App Store Ready', 'Offline Support'],
    stats: { projects: 'New', satisfaction: '100%' },
  },
  { 
    iconKey: 'design' as keyof typeof icons,
    title: 'UI/UX Design', 
    description: 'Beautiful, intuitive designs that convert visitors into customers. User-centered design philosophy with modern aesthetics.',
    shortDesc: 'User-first design',
    tags: ['Figma', 'Prototyping', 'Design Systems'],
    gradient: 'from-amber-500 to-orange-500',
    accentColor: 'amber',
    features: ['User Research', 'Wireframing', 'Interactive Prototypes', 'Brand Identity'],
    stats: { projects: 'New', satisfaction: '100%' },
  },
  { 
    iconKey: 'automation' as keyof typeof icons,
    title: 'Automation', 
    description: 'Smart automation solutions to streamline your business operations and increase efficiency with custom workflows.',
    shortDesc: 'Smart automation',
    tags: ['Python', 'APIs', 'Workflows', 'Integration'],
    gradient: 'from-emerald-500 to-teal-500',
    accentColor: 'emerald',
    features: ['Process Automation', 'Custom Scripts', 'Data Processing', 'System Integration'],
    stats: { projects: '2', satisfaction: '100%' },
  },
  { 
    iconKey: 'ecommerce' as keyof typeof icons,
    title: 'E-Commerce', 
    description: 'Complete e-commerce solutions from online stores to booking systems. Get your business online with powerful platforms.',
    shortDesc: 'Online stores & booking',
    tags: ['Shopify', 'WooCommerce', 'Custom'],
    gradient: 'from-sky-500 to-blue-500',
    accentColor: 'sky',
    features: ['Online Stores', 'Payment Integration', 'Inventory Management', 'Booking Systems'],
    stats: { projects: '2', satisfaction: '100%' },
  },
  { 
    iconKey: 'cloud' as keyof typeof icons,
    title: 'Cloud Solutions', 
    description: 'Scalable infrastructure and deployment for your applications. Secure, reliable, and cost-effective cloud architecture.',
    shortDesc: 'Scalable infrastructure',
    tags: ['AWS', 'Docker', 'CI/CD', 'Deployment'],
    gradient: 'from-rose-500 to-pink-500',
    accentColor: 'rose',
    features: ['Cloud Hosting', 'Auto Scaling', 'Security', 'Monitoring'],
    stats: { projects: 'New', satisfaction: '100%' },
  },
];

const Services: React.FC = () => {
  const [headerRef, headerInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [cardsRef, cardsInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(1);
<<<<<<< HEAD
  const [isLowEnd, setIsLowEnd] = useState(false);
  
  // Touch/swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    setIsLowEnd(isLowEndDevice());
  }, []);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false); // Pause auto-play on touch
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      rotateRight();
    } else if (isRightSwipe) {
      rotateLeft();
    }
    
    // Resume auto-play after a delay
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };
=======
>>>>>>> aa114e6d22ef164a8c2030369b9ba769eb6df2cd

  // Get the three visible services
  const getVisibleServices = useCallback(() => {
    const prev = (currentIndex - 1 + services.length) % services.length;
    const next = (currentIndex + 1) % services.length;
    return {
      left: services[prev],
      center: services[currentIndex],
      right: services[next],
    };
  }, [currentIndex]);

  const rotateRight = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % services.length);
  }, []);

  const rotateLeft = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
  }, []);

<<<<<<< HEAD
  // Auto-rotate every 6 seconds on desktop, 8 seconds on low-end (slower for better performance)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(rotateRight, isLowEnd ? 8000 : 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isLowEnd, rotateRight]);
=======
  // Auto-rotate every 5 seconds (slower for better performance)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(rotateRight, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, rotateRight]);
>>>>>>> aa114e6d22ef164a8c2030369b9ba769eb6df2cd

  const { left, center, right } = getVisibleServices();

  return (
<<<<<<< HEAD
    <section className="relative w-full h-full flex-1 flex items-center overflow-hidden pt-12 sm:pt-20 pb-4 sm:pb-6">
=======
    <section className="relative w-full h-full flex-1 flex items-center overflow-hidden pt-16 sm:pt-20 pb-4 sm:pb-6">
>>>>>>> aa114e6d22ef164a8c2030369b9ba769eb6df2cd
      {/* Static background - no animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[250px] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px] h-[250px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] bg-rose-500/5 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] lg:blur-[150px] opacity-30" />
        <div className="absolute bottom-1/4 left-1/3 w-[200px] sm:w-[350px] md:w-[400px] lg:w-[500px] xl:w-[600px] h-[200px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[600px] bg-red-500/5 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] lg:blur-[120px] opacity-20" />
      </div>
      
      {/* Top accent line - static */}
      <div className="absolute top-0 left-0 w-full h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/40 to-transparent" />
      </div>
      
      {/* Content - full width on mobile, positioned right on desktop */}
      <div className="w-full relative z-20 flex justify-center lg:justify-end">
        <div className="w-full lg:w-[65%] xl:w-[60%] 2xl:w-[55%] px-3 sm:px-5 md:px-6 lg:pr-6 xl:pr-10 2xl:pr-12">
        {/* Header */}
        <motion.div ref={headerRef} className="text-center mb-5 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12">
          <motion.span 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={headerInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-3.5 lg:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-medium mb-2.5 sm:mb-3 md:mb-4"
            style={{
              background: 'rgba(225, 29, 72, 0.1)',
              border: '1px solid rgba(225, 29, 72, 0.2)',
              color: '#FB7185'
            }}
          >
<<<<<<< HEAD
            <span className={isLowEnd ? '' : 'emoji-rotate'}>
              ⚡
            </span>
=======
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              ⚡
            </motion.span>
>>>>>>> aa114e6d22ef164a8c2030369b9ba769eb6df2cd
            What We Offer
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={headerInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-display font-bold text-white mb-1.5 sm:mb-2 md:mb-3"
          >
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-400">Services</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-400 text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-lg max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-2"
          >
            Comprehensive digital solutions tailored to transform your business
          </motion.p>
        </motion.div>

        {/* 3-Card Carousel */}
        <div 
          ref={cardsRef}
<<<<<<< HEAD
          className="relative max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto touch-pan-y"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
=======
          className="relative max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
>>>>>>> aa114e6d22ef164a8c2030369b9ba769eb6df2cd
        >
          {/* Cards Container */}
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={cardsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, type: 'spring', stiffness: 80 }}
<<<<<<< HEAD
            className="flex items-center justify-center gap-2 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5 py-3 sm:py-4 md:py-5 lg:py-6 px-0 sm:px-3 md:px-4 lg:px-6 xl:px-8"
          >
            {/* Left Card - Peek on mobile, full on tablet+ */}
            <motion.div
              key={`left-${left.title}`}
              className="w-10 sm:w-16 md:w-28 lg:w-36 xl:w-44 2xl:w-48 flex-shrink-0 cursor-pointer overflow-hidden"
              initial={false}
              animate={{ scale: 0.8, opacity: 0.4 }}
=======
            className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5 py-3 sm:py-4 md:py-5 lg:py-6 px-1.5 sm:px-3 md:px-4 lg:px-6 xl:px-8"
          >
            {/* Left Card - Hidden on mobile */}
            <motion.div
              key={`left-${left.title}`}
              className="hidden md:block w-28 lg:w-36 xl:w-44 2xl:w-48 flex-shrink-0 cursor-pointer"
              initial={false}
              animate={{ scale: 0.8, opacity: 0.5 }}
>>>>>>> aa114e6d22ef164a8c2030369b9ba769eb6df2cd
              whileHover={{ scale: 0.85, opacity: 0.7 }}
              transition={{ duration: 0.2 }}
              onClick={rotateLeft}
            >
              <div 
<<<<<<< HEAD
                className="relative p-2 sm:p-2.5 md:p-3 lg:p-4 xl:p-5 rounded-lg sm:rounded-xl h-[180px] sm:h-[200px] md:h-[180px] lg:h-[210px] xl:h-[240px] 2xl:h-[260px] flex flex-col overflow-hidden"
=======
                className="relative p-2.5 md:p-3 lg:p-4 xl:p-5 rounded-xl h-[160px] md:h-[180px] lg:h-[210px] xl:h-[240px] 2xl:h-[260px] flex flex-col overflow-hidden"
>>>>>>> aa114e6d22ef164a8c2030369b9ba769eb6df2cd
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                {/* Large Background Icon - Bottom Right */}
                <div className="absolute -right-4 -bottom-4 w-[70%] h-[70%] text-white/[0.04]">
                  {icons[left.iconKey]}
                </div>
                
<<<<<<< HEAD
                <h3 className="text-[8px] sm:text-[9px] md:text-xs lg:text-sm xl:text-base font-semibold text-white/70 mb-1 relative z-10 line-clamp-1">{left.title}</h3>
                <p className="text-gray-500 text-[7px] sm:text-[8px] md:text-[10px] lg:text-[11px] xl:text-xs line-clamp-2 relative z-10 hidden sm:block">{left.shortDesc}</p>
                <div className="mt-auto flex flex-wrap gap-1 relative z-10 hidden md:flex">
=======
                <h3 className="text-[10px] md:text-xs lg:text-sm xl:text-base font-semibold text-white/70 mb-1 relative z-10">{left.title}</h3>
                <p className="text-gray-500 text-[9px] md:text-[10px] lg:text-[11px] xl:text-xs line-clamp-2 relative z-10">{left.shortDesc}</p>
                <div className="mt-auto flex flex-wrap gap-1 relative z-10">
>>>>>>> aa114e6d22ef164a8c2030369b9ba769eb6df2cd
                  {left.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[7px] md:text-[8px] lg:text-[9px] xl:text-[10px] px-1 py-0.5 rounded bg-white/5 text-gray-600">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Center Card - Full width on mobile */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`center-${center.title}`}
                className="w-full max-w-[260px] sm:max-w-[280px] md:max-w-xs lg:max-w-sm xl:max-w-md 2xl:max-w-lg flex-shrink-0"
                initial={{ opacity: 0, x: direction * 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -30 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="p-3 sm:p-4 md:p-4 lg:p-5 xl:p-6 2xl:p-7 rounded-2xl h-[240px] sm:h-[260px] md:h-[280px] lg:h-[320px] xl:h-[360px] 2xl:h-[400px] flex flex-col relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(225, 29, 72, 0.3)',
                    boxShadow: '0 20px 50px rgba(225, 29, 72, 0.12), 0 0 60px rgba(225, 29, 72, 0.06)',
                  }}
                >
                  {/* Large Background Icon - Bottom Right */}
                  <div className="absolute -right-4 -bottom-2 sm:-right-6 sm:-bottom-0 md:-right-8 md:bottom-2 w-[70%] h-[70%] sm:w-[65%] sm:h-[65%] text-rose-500/[0.08]">
                    {icons[center.iconKey]}
                  </div>
                  
                  <div className={`absolute inset-0 bg-gradient-to-br ${center.gradient} opacity-5`} />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-white">{center.title}</h3>
                      <div className="flex gap-1.5 sm:gap-2">
                        <div className="text-center">
                          <div className="text-rose-400 font-bold text-[10px] sm:text-[11px] md:text-xs lg:text-sm xl:text-base">{center.stats.projects}</div>
                          <div className="text-gray-500 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs">Projects</div>
                        </div>
                        <div className="text-center">
                          <div className="text-rose-400 font-bold text-[10px] sm:text-[11px] md:text-xs lg:text-sm xl:text-base">{center.stats.satisfaction}</div>
                          <div className="text-gray-500 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs">Happy</div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-[10px] sm:text-[11px] md:text-xs lg:text-sm xl:text-base leading-relaxed mb-2 sm:mb-3 line-clamp-3">
                      {center.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                      {center.features.map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] xl:text-xs 2xl:text-sm text-gray-300"
                        >
                          <span className="text-rose-400 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px]">✓</span>
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-auto flex flex-wrap gap-0.5 sm:gap-1">
                      {center.tags.map((tag, i) => (
                        <span 
                          key={i}
                          className="px-1 sm:px-1.5 lg:px-2 py-0.5 rounded text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] xl:text-xs text-rose-300"
                          style={{
                            background: 'rgba(225, 29, 72, 0.1)',
                            border: '1px solid rgba(225, 29, 72, 0.2)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

<<<<<<< HEAD
            {/* Right Card - Peek on mobile, full on tablet+ */}
            <motion.div
              key={`right-${right.title}`}
              className="w-10 sm:w-16 md:w-32 lg:w-44 xl:w-52 2xl:w-56 flex-shrink-0 cursor-pointer overflow-hidden"
              initial={false}
              animate={{ scale: 0.9, opacity: 0.5 }}
=======
            {/* Right Card - Hidden on mobile */}
            <motion.div
              key={`right-${right.title}`}
              className="hidden md:block w-32 lg:w-44 xl:w-52 2xl:w-56 flex-shrink-0 cursor-pointer"
              initial={false}
              animate={{ scale: 0.9, opacity: 0.65 }}
>>>>>>> aa114e6d22ef164a8c2030369b9ba769eb6df2cd
              whileHover={{ scale: 0.92, opacity: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={rotateRight}
            >
              <div 
<<<<<<< HEAD
                className="relative p-2 sm:p-2.5 md:p-3 lg:p-4 xl:p-5 rounded-lg sm:rounded-xl h-[200px] sm:h-[220px] md:h-[200px] lg:h-[250px] xl:h-[290px] 2xl:h-[320px] flex flex-col overflow-hidden"
=======
                className="relative p-2.5 md:p-3 lg:p-4 xl:p-5 rounded-xl h-[180px] md:h-[200px] lg:h-[250px] xl:h-[290px] 2xl:h-[320px] flex flex-col overflow-hidden"
>>>>>>> aa114e6d22ef164a8c2030369b9ba769eb6df2cd
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {/* Large Background Icon - Bottom Right */}
                <div className="absolute -right-4 -bottom-4 w-[65%] h-[65%] text-white/[0.05]">
                  {icons[right.iconKey]}
                </div>
                
<<<<<<< HEAD
                <h3 className="text-[8px] sm:text-[9px] md:text-xs lg:text-sm xl:text-base 2xl:text-lg font-semibold text-white/80 mb-1 relative z-10 line-clamp-1">{right.title}</h3>
                <p className="text-gray-400 text-[7px] sm:text-[8px] md:text-[10px] lg:text-[11px] xl:text-xs line-clamp-2 mb-1 relative z-10 hidden sm:block">{right.shortDesc}</p>
                
                <div className="space-y-0.5 mb-auto relative z-10 hidden md:block">
=======
                <h3 className="text-[11px] md:text-xs lg:text-sm xl:text-base 2xl:text-lg font-semibold text-white/80 mb-1 relative z-10">{right.title}</h3>
                <p className="text-gray-400 text-[9px] md:text-[10px] lg:text-[11px] xl:text-xs line-clamp-2 mb-1 relative z-10">{right.shortDesc}</p>
                
                <div className="space-y-0.5 mb-auto relative z-10">
>>>>>>> aa114e6d22ef164a8c2030369b9ba769eb6df2cd
                  {right.features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="flex items-center gap-0.5 sm:gap-1 text-[8px] md:text-[9px] lg:text-[10px] xl:text-[11px] 2xl:text-xs text-gray-500">
                      <span className="text-rose-500/50">•</span>
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>
                
<<<<<<< HEAD
                <div className="flex flex-wrap gap-1 mt-1 relative z-10 hidden md:flex">
=======
                <div className="flex flex-wrap gap-1 mt-1 relative z-10">
>>>>>>> aa114e6d22ef164a8c2030369b9ba769eb6df2cd
                  {right.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[7px] md:text-[8px] lg:text-[9px] xl:text-[10px] px-1 py-0.5 rounded bg-white/5 text-gray-500">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Swipe hint for mobile */}
<<<<<<< HEAD
          <motion.div 
            className="flex sm:hidden justify-center items-center gap-2 text-gray-500 text-[9px] sm:text-[10px] mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.span
              animate={{ x: [-3, 3, -3] }}
              transition={{ duration: 1.5, repeat: 3, ease: "easeInOut" }}
            >
              ←
            </motion.span>
            <span>Swipe or tap cards</span>
            <motion.span
              animate={{ x: [3, -3, 3] }}
              transition={{ duration: 1.5, repeat: 3, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </motion.div>
=======
          <div className="flex md:hidden justify-center items-center gap-2 text-gray-500 text-[9px] sm:text-[10px] mb-2">
            <span>← Swipe to explore →</span>
          </div>
>>>>>>> aa114e6d22ef164a8c2030369b9ba769eb6df2cd

          {/* Pagination Dots */}
          <div className="flex justify-center gap-1 sm:gap-1.5 md:gap-2 mt-1.5 sm:mt-2 md:mt-3">
            {services.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className={`h-1 sm:h-1.5 md:h-2 rounded-full transition-all duration-200 ${
                  i === currentIndex ? 'bg-rose-500 w-3 sm:w-4 md:w-5' : 'bg-white/20 w-1 sm:w-1.5 md:w-2 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
