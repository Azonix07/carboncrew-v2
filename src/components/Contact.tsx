import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Contact: React.FC = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [headerRef, headerInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [formState, setFormState] = useState({ name: '', email: '', message: '', service: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const services = ['Web Development', 'Mobile App', 'UI/UX Design', 'Cloud Solutions', 'AI Integration', 'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: '', email: '', message: '', service: '' });
  };

  const contactInfo = [
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ), 
      label: 'Email', 
      value: 'contact@carboncrew.dev', 
      href: 'mailto:contact@carboncrew.dev' 
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ), 
      label: 'Location', 
      value: 'Remote / Worldwide', 
      href: '#' 
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ), 
      label: 'Response Time', 
      value: 'Within 24 hours', 
      href: '#' 
    },
  ];

  return (
    <section className="relative w-full h-full flex-1 flex flex-col justify-center overflow-hidden bg-transparent py-2 xs:py-4 sm:pt-24">
      {/* Nebula backgrounds - static */}
      <div className="absolute inset-0 overflow-hidden z-[5] pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[200px] sm:w-[300px] md:w-[350px] lg:w-[400px] xl:w-[500px] h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[500px] bg-rose-500/5 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] lg:blur-[120px] opacity-30" />
        <div className="absolute bottom-1/4 left-1/3 w-[160px] sm:w-[250px] md:w-[300px] lg:w-[350px] xl:w-[450px] h-[160px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[450px] bg-red-500/5 rounded-full blur-[50px] sm:blur-[70px] md:blur-[80px] lg:blur-[100px] opacity-25" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-6 xl:px-8 relative z-20">
        <div className="grid lg:grid-cols-2 gap-3 xs:gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 items-center max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
          {/* Left Column - Info */}
          <div className="text-center lg:text-left">
            {/* Header */}
            <motion.div ref={headerRef} className="mb-2 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6">
              <motion.span 
                initial={{ opacity: 0, x: -30, scale: 0.9 }}
                animate={headerInView ? { opacity: 1, x: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                className="inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-2 xs:px-2.5 sm:px-3 md:px-3.5 py-0.5 xs:py-1 sm:py-1.5 md:py-2 rounded-full text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-medium mb-2 xs:mb-3 sm:mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400"
              >
                <motion.div 
                  className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-rose-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Get In Touch
              </motion.span>
              
              <motion.h2 
                initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                animate={headerInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white mb-1 xs:mb-1.5 sm:mb-2 md:mb-3"
              >
                Let's Start a{' '}
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500 inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={headerInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.4, type: 'spring' }}
                >
                  Conversation
                </motion.span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-gray-400 text-[10px] xs:text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-lg leading-relaxed hidden xs:block"
              >
                Have a project in mind? Let's create something amazing together.
              </motion.p>
            </motion.div>
            
            {/* Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="space-y-2 sm:space-y-2.5 md:space-y-3 mb-3 sm:mb-4 md:mb-5 lg:mb-6"
            >
              {contactInfo.map((item, i) => (
                <motion.a 
                  key={i}
                  href={item.href}
                  initial={{ opacity: 0, x: -40 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.4 + i * 0.15,
                    type: 'spring',
                    stiffness: 100
                  }}
                  className="flex items-center gap-3 sm:gap-3 md:gap-4 p-3 sm:p-3 md:p-4 lg:p-4 rounded-xl group cursor-pointer bg-white/[0.03] border border-white/[0.06] hover:border-rose-500/30 transition-all"
                  whileHover={{ x: 8, scale: 1.02, boxShadow: '0 8px 30px rgba(225, 29, 72, 0.12)' }}
                >
                  <motion.div 
                    className="w-10 h-10 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-colors flex-shrink-0"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-5 h-5 sm:w-5 sm:h-5 md:w-5 md:h-5">{item.icon}</div>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className="text-white text-xs sm:text-sm md:text-base font-medium group-hover:text-rose-400 transition-colors truncate">{item.value}</p>
                  </div>
                  <svg className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-rose-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.a>
              ))}
            </motion.div>
            
            {/* Social Links - Hidden on smallest screens */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="hidden xs:flex flex-col items-center lg:items-start"
            >
              <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-gray-500 mb-1 xs:mb-1.5 sm:mb-2 md:mb-3">Follow us</p>
              <div className="flex gap-1 xs:gap-1.5 sm:gap-2">
                {[
                  { name: 'Twitter', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                  { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                  { name: 'GitHub', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
                ].map((social, i) => (
                  <motion.a
                    key={social.name}
                    href="#"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                    className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-md sm:rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all"
                    whileHover={{ y: -4, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - Form */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 60, rotateY: 10 }}
            animate={inView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 1, delay: 0.5, type: 'spring', stiffness: 60 }}
          >
            <motion.div 
              className="relative p-2.5 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 rounded-lg xs:rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] backdrop-blur-sm"
              whileHover={{ borderColor: 'rgba(225, 29, 72, 0.2)' }}
            >
              {/* Decorative glow */}
              <div className="absolute -top-8 xs:-top-12 sm:-top-16 -right-8 xs:-right-12 sm:-right-16 w-16 xs:w-24 sm:w-32 h-16 xs:h-24 sm:h-32 bg-rose-500/20 rounded-full blur-[40px] xs:blur-[50px] sm:blur-[60px] pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-rose-500/10 border-2 border-rose-500/30"
                    >
                      <motion.svg 
                        className="w-8 h-8 text-rose-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <motion.path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2.5} 
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    </motion.div>
                    
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-1.5 sm:mb-2">Message Sent Successfully!</h3>
                    <p className="text-gray-400 text-[11px] sm:text-xs md:text-sm lg:text-base mb-3 sm:mb-4">We'll get back to you within 24 hours.</p>
                    
                    <motion.button
                      onClick={() => setIsSubmitted(false)}
                      className="px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs md:text-sm font-medium text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Send Another Message
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-2 xs:space-y-2.5 sm:space-y-4 relative z-10"
                  >
                    <div className="grid grid-cols-2 gap-2 xs:gap-2.5 sm:gap-4">
                      {/* Name */}
                      <div className="space-y-0.5 xs:space-y-1 sm:space-y-1.5">
                        <label className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-gray-400 font-medium">Your Name</label>
                        <motion.input
                          type="text"
                          placeholder="Name"
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-2 xs:px-2.5 sm:px-3 md:px-4 py-1.5 xs:py-2 sm:py-2.5 md:py-3 rounded-md xs:rounded-lg text-white placeholder-gray-500 text-[10px] xs:text-[11px] sm:text-xs md:text-sm outline-none transition-all duration-300 bg-white/[0.03]"
                          style={{
                            border: focusedField === 'name' 
                              ? '1px solid rgba(225, 29, 72, 0.5)' 
                              : '1px solid rgba(255, 255, 255, 0.06)',
                            boxShadow: focusedField === 'name' 
                              ? '0 0 20px rgba(225, 29, 72, 0.15)' 
                              : 'none',
                          }}
                        />
                      </div>
                      
                      {/* Email */}
                      <div className="space-y-0.5 xs:space-y-1 sm:space-y-1.5">
                        <label className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-gray-400 font-medium">Email</label>
                        <motion.input
                          type="email"
                          placeholder="abc@example.com"
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-2 xs:px-2.5 sm:px-3 md:px-4 py-1.5 xs:py-2 sm:py-2.5 md:py-3 rounded-md xs:rounded-lg text-white placeholder-gray-500 text-[10px] xs:text-[11px] sm:text-xs md:text-sm outline-none transition-all duration-300 bg-white/[0.03]"
                          style={{
                            border: focusedField === 'email' 
                              ? '1px solid rgba(225, 29, 72, 0.5)' 
                              : '1px solid rgba(255, 255, 255, 0.06)',
                            boxShadow: focusedField === 'email' 
                              ? '0 0 20px rgba(225, 29, 72, 0.15)' 
                              : 'none',
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Service Select */}
                    <div className="space-y-0.5 xs:space-y-1 sm:space-y-1.5">
                      <label className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-gray-400 font-medium">Service</label>
                      <motion.select
                        value={formState.service}
                        onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                        onFocus={() => setFocusedField('service')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-2 xs:px-2.5 sm:px-3 md:px-4 py-1.5 xs:py-2 sm:py-2.5 md:py-3 rounded-md xs:rounded-lg text-white text-[10px] xs:text-[11px] sm:text-xs md:text-sm outline-none transition-all duration-300 cursor-pointer appearance-none bg-white/[0.03]"
                        style={{
                          border: focusedField === 'service' 
                            ? '1px solid rgba(225, 29, 72, 0.5)' 
                            : '1px solid rgba(255, 255, 255, 0.06)',
                          boxShadow: focusedField === 'service' 
                            ? '0 0 20px rgba(225, 29, 72, 0.15)' 
                            : 'none',
                        }}
                      >
                        <option value="" className="bg-[#030014]">Select a service...</option>
                        {services.map((service) => (
                          <option key={service} value={service} className="bg-[#030014]">{service}</option>
                        ))}
                      </motion.select>
                    </div>
                    
                    {/* Message */}
                    <div className="space-y-0.5 xs:space-y-1 sm:space-y-1.5">
                      <label className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-gray-400 font-medium">Message</label>
                      <motion.textarea
                        placeholder="Tell us about your project..."
                        required
                        rows={2}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-2 xs:px-2.5 sm:px-3 md:px-4 py-1.5 xs:py-2 sm:py-2.5 md:py-3 rounded-md xs:rounded-lg text-white placeholder-gray-500 text-[10px] xs:text-[11px] sm:text-xs md:text-sm outline-none resize-none transition-all duration-300 bg-white/[0.03] sm:rows-4"
                        style={{
                          border: focusedField === 'message' 
                            ? '1px solid rgba(225, 29, 72, 0.5)' 
                            : '1px solid rgba(255, 255, 255, 0.06)',
                          boxShadow: focusedField === 'message' 
                            ? '0 0 20px rgba(225, 29, 72, 0.15)' 
                            : 'none',
                        }}
                      />
                    </div>
                    
                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 xs:py-2.5 sm:py-3 md:py-4 rounded-md xs:rounded-lg font-semibold text-[10px] xs:text-xs sm:text-sm md:text-base text-white flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 relative overflow-hidden group bg-gradient-to-r from-rose-500 to-red-500"
                      whileHover={{ scale: 1.01, boxShadow: '0 10px 40px rgba(225, 29, 72, 0.3)' }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      
                      <span className="relative z-10">
                        {isSubmitting ? (
                          <span className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                            <motion.span
                              className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                            Send Message
                            <motion.svg 
                              className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </motion.svg>
                          </span>
                        )}
                      </span>
                    </motion.button>
                    
                    <p className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs text-gray-500 text-center">
                      By submitting, you agree to our{' '}
                      <span className="text-rose-400">Privacy Policy</span>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

