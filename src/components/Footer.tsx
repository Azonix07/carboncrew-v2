import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };
  
  const scrollToTop = () => {
    const scrollContainer = document.querySelector('.scroll-snap-container');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const footerLinks = {
    services: [
      { name: 'Web Development', href: '#services' },
      { name: 'Automation', href: '#services' },
      { name: 'E-Commerce', href: '#services' },
      { name: 'UI/UX Design', href: '#services' },
    ],
    company: [
      { name: 'About Us', href: '#why' },
      { name: 'Our Work', href: '#projects' },
      { name: 'Contact', href: '#contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z', href: '#' },
    { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', href: '#' },
    { name: 'GitHub', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z', href: '#' },
  ];

  return (
    <footer className="relative w-full h-full flex-1 bg-transparent overflow-hidden z-10 flex flex-col justify-end">
      {/* Background decoration - same as other sections */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-[200px] sm:w-[300px] md:w-[350px] lg:w-[400px] xl:w-[500px] h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[500px] bg-rose-500/5 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] lg:blur-[150px] opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-[160px] sm:w-[220px] md:w-[260px] lg:w-[300px] xl:w-[400px] h-[160px] sm:h-[220px] md:h-[260px] lg:h-[300px] xl:h-[400px] bg-red-500/5 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] lg:blur-[120px] opacity-20" />
      </div>
      
      {/* Footer content at bottom */}
      <div className="w-full relative z-20 bg-[#030014]/80 backdrop-blur-sm border-t border-white/5">
        {/* Main footer content */}
        <div className="container mx-auto px-3 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-6 sm:py-10 md:py-12 lg:py-14">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12">
            {/* Brand column */}
            <div className="col-span-1 xs:col-span-2 lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {/* Logo */}
                <div className="flex items-center gap-2 sm:gap-2.5 mb-4 sm:mb-5 md:mb-6">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center">
                    <span className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl">C</span>
                  </div>
                  <div>
                    <span className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                      Carbon<span className="text-rose-400">Crew</span>
                    </span>
                    <p className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs text-gray-500 tracking-widest uppercase">Digital Studio</p>
                  </div>
                </div>
                
                <p className="text-gray-400 text-[11px] sm:text-xs md:text-sm lg:text-base leading-relaxed mb-4 sm:mb-5 md:mb-6 max-w-xs sm:max-w-sm">
                  A fresh digital studio ready to bring your ideas to life. 
                  Building innovative web solutions, one project at a time.
                </p>
                
                {/* Newsletter */}
                <div className="mb-4 sm:mb-5 md:mb-6">
                  <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-white font-medium mb-2 sm:mb-2.5 md:mb-3">Subscribe to our newsletter</p>
                  <form onSubmit={handleSubscribe} className="flex flex-col xs:flex-row gap-2 xs:gap-1.5 sm:gap-2">
                    <div className="relative flex-1">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-white text-[11px] sm:text-xs md:text-sm outline-none transition-all duration-200 placeholder-gray-500 bg-white/[0.03] border border-white/[0.06] focus:border-rose-500/50"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      className="px-4 xs:px-3 sm:px-4 md:px-5 py-2.5 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-red-500"
                      whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(225, 29, 72, 0.3)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubscribed ? '✓' : 'Subscribe'}
                    </motion.button>
                  </form>
                  {isSubscribed && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-rose-400 text-[10px] sm:text-xs mt-1.5 sm:mt-2"
                    >
                      Thanks for subscribing!
                    </motion.p>
                  )}
                </div>
                
                {/* Social links */}
                <div className="flex gap-2 sm:gap-3">
                  {socialLinks.map((social, i) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-lg sm:rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d={social.icon} />
                      </svg>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Links columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-white font-semibold text-xs sm:text-sm md:text-base mb-2.5 sm:mb-3 md:mb-4">Services</h4>
              <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 text-[11px] sm:text-xs md:text-sm hover:text-rose-400 transition-colors inline-flex items-center gap-1 group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-white font-semibold text-xs sm:text-sm md:text-base mb-2.5 sm:mb-3 md:mb-4">Company</h4>
              <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 text-[11px] sm:text-xs md:text-sm hover:text-rose-400 transition-colors inline-flex items-center gap-1 group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="text-white font-semibold text-xs sm:text-sm md:text-base mb-2.5 sm:mb-3 md:mb-4">Legal</h4>
              <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 text-[11px] sm:text-xs md:text-sm hover:text-rose-400 transition-colors inline-flex items-center gap-1 group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-white/5">
          <div className="container mx-auto px-3 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-5 md:py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <motion.p 
              className="text-gray-500 text-[10px] sm:text-xs md:text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              © {new Date().getFullYear()} CarbonCrew. All rights reserved.
            </motion.p>
            
            {/* Back to top button */}
            <motion.button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 sm:gap-2 text-gray-400 text-[10px] sm:text-xs md:text-sm hover:text-rose-400 transition-colors group"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Back to top</span>
              <motion.div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md sm:rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/[0.06] group-hover:border-rose-500/30">
                <motion.svg 
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </motion.svg>
              </motion.div>
            </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
