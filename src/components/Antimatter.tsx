import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AntimatterProps {
  currentSection: number;
}

interface ShapeConfig {
  name: string;
  getPosition: (index: number, total: number, radius: number) => { x: number; y: number; z: number };
}

// Clean, recognizable 3D shapes for the particle animation
const SHAPES: Record<string, ShapeConfig> = {
  // Sphere - Classic elegant shape (default for Hero)
  sphere: {
    name: 'sphere',
    getPosition: (index, total, radius) => {
      const r = radius * 0.9;
      const phi = Math.acos(1 - 2 * (index / total));
      const theta = Math.PI * (1 + Math.sqrt(5)) * index;
      return {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.cos(phi),
        z: r * Math.sin(phi) * Math.sin(theta),
      };
    },
  },
  
  // Cube - Solid, structured (Web Development)
  cube: {
    name: 'cube',
    getPosition: (index, total, radius) => {
      const r = radius * 0.65;
      const particlesPerFace = Math.ceil(total / 6);
      const face = Math.floor(index / particlesPerFace);
      const localIndex = index % particlesPerFace;
      const gridSize = Math.ceil(Math.sqrt(particlesPerFace));
      const u = ((localIndex % gridSize) / (gridSize - 1) - 0.5) * 2;
      const v = (Math.floor(localIndex / gridSize) / (gridSize - 1) - 0.5) * 2;
      
      switch (face % 6) {
        case 0: return { x: r, y: u * r, z: v * r };
        case 1: return { x: -r, y: u * r, z: v * r };
        case 2: return { x: u * r, y: r, z: v * r };
        case 3: return { x: u * r, y: -r, z: v * r };
        case 4: return { x: u * r, y: v * r, z: r };
        default: return { x: u * r, y: v * r, z: -r };
      }
    },
  },
  
  // Torus/Ring - Connectivity (Mobile Apps)
  torus: {
    name: 'torus',
    getPosition: (index, total, radius) => {
      const R = radius * 0.6;  // Major radius
      const rr = radius * 0.25; // Minor radius
      const u = (index % 40) / 40 * Math.PI * 2;
      const v = Math.floor(index / 40) / Math.ceil(total / 40) * Math.PI * 2;
      
      return {
        x: (R + rr * Math.cos(v)) * Math.cos(u),
        y: rr * Math.sin(v),
        z: (R + rr * Math.cos(v)) * Math.sin(u),
      };
    },
  },
  
  // Diamond - Premium quality (UI/UX Design)
  diamond: {
    name: 'diamond',
    getPosition: (index, total, radius) => {
      const t = index / total;
      const r = radius * 0.85;
      
      if (t < 0.5) {
        // Top pyramid
        const localT = t / 0.5;
        const angle = localT * Math.PI * 2 * 6;
        const height = (1 - localT) * r * 0.8;
        const ringR = localT * r * 0.7;
        return {
          x: ringR * Math.cos(angle),
          y: -height,
          z: ringR * Math.sin(angle),
        };
      } else {
        // Bottom point
        const localT = (t - 0.5) / 0.5;
        const angle = localT * Math.PI * 2 * 4;
        const height = localT * r * 0.9;
        const ringR = (1 - localT) * r * 0.7;
        return {
          x: ringR * Math.cos(angle),
          y: height,
          z: ringR * Math.sin(angle),
        };
      }
    },
  },
  
  // Helix/DNA - Innovation (Automation)
  helix: {
    name: 'helix',
    getPosition: (index, total, radius) => {
      const t = index / total;
      const r = radius;
      const turns = 3;
      const angle = t * Math.PI * 2 * turns;
      const strand = index % 2;
      const helixR = r * 0.5;
      const height = (t - 0.5) * r * 1.8;
      
      return {
        x: helixR * Math.cos(angle + strand * Math.PI),
        y: height,
        z: helixR * Math.sin(angle + strand * Math.PI),
      };
    },
  },
  
  // Octahedron - Precision (E-Commerce)
  octahedron: {
    name: 'octahedron',
    getPosition: (index, total, radius) => {
      const t = index / total;
      const r = radius * 0.8;
      
      if (t < 0.5) {
        // Top half
        const localT = t / 0.5;
        const angle = localT * Math.PI * 2 * 6;
        const height = (1 - localT * 2) * r;
        const ringR = Math.sin(localT * Math.PI) * r * 0.75;
        return {
          x: ringR * Math.cos(angle),
          y: -height,
          z: ringR * Math.sin(angle),
        };
      } else {
        // Bottom half
        const localT = (t - 0.5) / 0.5;
        const angle = localT * Math.PI * 2 * 6;
        const height = (localT * 2 - 1) * r;
        const ringR = Math.sin((1 - localT) * Math.PI) * r * 0.75;
        return {
          x: ringR * Math.cos(angle),
          y: height,
          z: ringR * Math.sin(angle),
        };
      }
    },
  },
  
  // Spiral Galaxy - Infinite scale (Cloud Solutions)
  galaxy: {
    name: 'galaxy',
    getPosition: (index, total, radius) => {
      const t = index / total;
      const r = radius;
      const arms = 3;
      const armOffset = (index % arms) * (Math.PI * 2 / arms);
      const spiralT = t * 3;
      const spiralR = spiralT * r * 0.3;
      const angle = spiralT * Math.PI * 2 + armOffset;
      const wobble = Math.sin(t * Math.PI * 8) * r * 0.05;
      
      return {
        x: spiralR * Math.cos(angle) + wobble,
        y: (Math.random() - 0.5) * r * 0.15,
        z: spiralR * Math.sin(angle) + wobble,
      };
    },
  },
};

// Shape sequence for morphing animation
const SHAPE_SEQUENCE = ['sphere', 'cube', 'torus', 'diamond', 'helix', 'octahedron', 'galaxy'];

interface Particle {
  id: number;
  currentX: number;
  currentY: number;
  currentZ: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  velocityX: number;
  velocityY: number;
  velocityZ: number;
  size: number;
  baseOpacity: number;
  colorIndex: number;
  orbitOffset: number;
}

// Cherry/Red theme colors
const CHERRY_COLORS = [
  { h: 350, s: 90, l: 55 },  // Cherry red
  { h: 0, s: 85, l: 60 },    // Bright red
  { h: 340, s: 80, l: 65 },  // Rose
  { h: 10, s: 90, l: 50 },   // Crimson
  { h: 355, s: 85, l: 70 },  // Soft pink-red
  { h: 330, s: 75, l: 55 },  // Magenta-red
];

const Antimatter: React.FC<AntimatterProps> = ({ currentSection }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const rotationRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ 
    x: 0, 
    y: 0, 
    prevX: 0, 
    prevY: 0, 
    velocityX: 0, 
    velocityY: 0, 
    isHovering: false,
    isMoving: false,
    lastMoveTime: 0
  });
  const scatterRef = useRef(0);
  const timeRef = useRef(0);
  const currentShapeRef = useRef('sphere');
  const shapeIndexRef = useRef(0);
  
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Track scroll progress for smooth position interpolation and visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.scroll-snap-container');
      if (scrollContainer) {
        const scrollTop = scrollContainer.scrollTop;
        const viewportHeight = window.innerHeight;
        // Calculate progress: 0 at top, 1 at section 1, 2 at section 2, etc.
        const progress = scrollTop / viewportHeight;
        setScrollProgress(progress);
      }
    };
    
    const scrollContainer = document.querySelector('.scroll-snap-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial call
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
  // Visibility based on scroll progress - visible on first 2 pages (Hero and Services)
  // Fade starts at 1.5 (halfway to 3rd page) and completes at 2.0
  const isVisible = scrollProgress < 2;
  const fadeOpacity = scrollProgress < 1.5 ? 1 : Math.max(0, 1 - (scrollProgress - 1.5) * 2);
  
  const PARTICLE_COUNT = useMemo(() => isMobile ? 200 : 350, [isMobile]);
  const BASE_RADIUS = useMemo(() => isMobile ? 120 : 170, [isMobile]);
  const CANVAS_SIZE = useMemo(() => isMobile ? 450 : 720, [isMobile]);
  
  const initializeParticles = useCallback((shape: string) => {
    const shapeConfig = SHAPES[shape] || SHAPES.sphere;
    const particles: Particle[] = [];
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const pos = shapeConfig.getPosition(i, PARTICLE_COUNT, BASE_RADIUS);
      const colorIndex = Math.floor(Math.random() * CHERRY_COLORS.length);
      
      particles.push({
        id: i,
        currentX: (Math.random() - 0.5) * 100,
        currentY: (Math.random() - 0.5) * 100,
        currentZ: (Math.random() - 0.5) * 100,
        targetX: pos.x,
        targetY: pos.y,
        targetZ: pos.z,
        velocityX: 0,
        velocityY: 0,
        velocityZ: 0,
        size: 1.5 + Math.random() * 1.8,
        baseOpacity: 0.7 + Math.random() * 0.3,
        colorIndex,
        orbitOffset: Math.random() * Math.PI * 2,
      });
    }
    
    particlesRef.current = particles;
    currentShapeRef.current = shape;
  }, [PARTICLE_COUNT, BASE_RADIUS]);
  
  const morphToShape = useCallback((shape: string) => {
    if (currentShapeRef.current === shape) return;
    
    const shapeConfig = SHAPES[shape] || SHAPES.sphere;
    
    particlesRef.current.forEach((particle, index) => {
      const pos = shapeConfig.getPosition(index, PARTICLE_COUNT, BASE_RADIUS);
      particle.targetX = pos.x;
      particle.targetY = pos.y;
      particle.targetZ = pos.z;
    });
    
    currentShapeRef.current = shape;
  }, [PARTICLE_COUNT, BASE_RADIUS]);
  
  // Auto-morph shapes only on page 2 (Services)
  // Page 1 (Hero) stays as sphere with rotation only
  useEffect(() => {
    if (!isVisible) return;
    
    // On Hero page (section 0), always stay as sphere
    if (currentSection === 0) {
      if (currentShapeRef.current !== 'sphere') {
        morphToShape('sphere');
        shapeIndexRef.current = 0;
      }
      return;
    }
    
    // On Services page (section 1), enable morphing
    if (currentSection === 1) {
      const morphInterval = setInterval(() => {
        shapeIndexRef.current = (shapeIndexRef.current + 1) % SHAPE_SEQUENCE.length;
        morphToShape(SHAPE_SEQUENCE[shapeIndexRef.current]);
      }, 2500); // Slightly slower for smoother experience
      
      return () => clearInterval(morphInterval);
    }
  }, [isVisible, currentSection, morphToShape]);
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  
  useEffect(() => {
    initializeParticles('sphere');
  }, [initializeParticles]);
  
  // Mouse event handlers - defined outside useEffect for stability
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const newX = e.clientX - rect.left - rect.width / 2;
    const newY = e.clientY - rect.top - rect.height / 2;
    
    // Calculate mouse velocity for scatter effect
    mouseRef.current.velocityX = newX - mouseRef.current.x;
    mouseRef.current.velocityY = newY - mouseRef.current.y;
    mouseRef.current.prevX = mouseRef.current.x;
    mouseRef.current.prevY = mouseRef.current.y;
    mouseRef.current.x = newX;
    mouseRef.current.y = newY;
    mouseRef.current.isHovering = true;
    mouseRef.current.isMoving = true;
    mouseRef.current.lastMoveTime = Date.now();
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    mouseRef.current.isHovering = false;
    mouseRef.current.isMoving = false;
    mouseRef.current.velocityX = 0;
    mouseRef.current.velocityY = 0;
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    canvas.style.width = CANVAS_SIZE + 'px';
    canvas.style.height = CANVAS_SIZE + 'px';
    ctx.scale(dpr, dpr);
    
    const animate = () => {
      const cx = CANVAS_SIZE / 2;
      const cy = CANVAS_SIZE / 2;
      
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      
      timeRef.current += 0.008;
      
      // Check if mouse has stopped moving (for recovery)
      const now = Date.now();
      if (now - mouseRef.current.lastMoveTime > 100) {
        mouseRef.current.isMoving = false;
        // Gradually reduce velocity when mouse stops
        mouseRef.current.velocityX *= 0.9;
        mouseRef.current.velocityY *= 0.9;
      }
      
      // Smooth rotation
      rotationRef.current.y += 0.004;
      rotationRef.current.x = Math.sin(timeRef.current * 0.2) * 0.05;
      
      // Scatter effect based on mouse activity
      const targetScatter = mouseRef.current.isMoving ? 1 : 0;
      scatterRef.current += (targetScatter - scatterRef.current) * 0.1;
      
      // Pre-calculate rotation values
      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);
      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);
      const time = timeRef.current;
      const scatter = scatterRef.current;
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const isHovering = mouseRef.current.isHovering;
      const velX = mouseRef.current.velocityX;
      const velY = mouseRef.current.velocityY;
      
      // Sort by Z for depth (less frequent sorting)
      const sorted = [...particlesRef.current].sort((a, b) => a.currentZ - b.currentZ);
      
      sorted.forEach((p) => {
        // First, calculate projected screen position for scatter detection
        const tempX = p.currentX;
        const tempY = p.currentY;
        const tempZ = p.currentZ;
        
        // Subtle orbit
        const orbit = 1.2;
        const orbitTime = time * 0.5 + p.orbitOffset;
        const ox = Math.sin(orbitTime) * orbit;
        const oy = Math.cos(orbitTime) * orbit;
        
        // 3D rotation for screen position
        const rx = (tempX + ox) * cosY - tempZ * sinY;
        const rz = (tempX + ox) * sinY + tempZ * cosY;
        const ry = (tempY + oy) * cosX - rz * sinX;
        const fz = (tempY + oy) * sinX + rz * cosX;
        
        // Perspective
        const perspective = 450;
        const scale = perspective / (perspective + fz);
        const px = cx + rx * scale;
        const py = cy + ry * scale;
        
        // SCATTER EFFECT - Apply BEFORE spring physics
        if (isHovering) {
          const particleScreenX = px - cx;
          const particleScreenY = py - cy;
          
          const mdx = particleScreenX - mouseX;
          const mdy = particleScreenY - mouseY;
          const distSq = mdx * mdx + mdy * mdy;
          
          const scatterRadius = 100;
          const scatterRadiusSq = scatterRadius * scatterRadius;
          
          if (distSq < scatterRadiusSq) {
            const dist = Math.sqrt(distSq);
            const intensity = Math.pow(1 - (dist / scatterRadius), 2);
            const mouseSpeed = Math.sqrt(velX * velX + velY * velY);
            
            const angle = Math.atan2(mdy, mdx);
            const baseForce = 15;
            const speedMultiplier = Math.min(mouseSpeed * 3, 50);
            const pushForce = intensity * (baseForce + speedMultiplier);
            
            // Directly push particle position away from mouse
            p.currentX += Math.cos(angle) * pushForce;
            p.currentY += Math.sin(angle) * pushForce;
            p.currentZ += (p.orbitOffset - Math.PI) * pushForce * 0.3;
          }
        }
        
        // Spring physics - pull back to target
        const spring = 0.06;
        const damping = 0.88;
        
        const dx = p.targetX - p.currentX;
        const dy = p.targetY - p.currentY;
        const dz = p.targetZ - p.currentZ;
        
        p.velocityX = p.velocityX * damping + dx * spring;
        p.velocityY = p.velocityY * damping + dy * spring;
        p.velocityZ = p.velocityZ * damping + dz * spring;
        
        p.currentX += p.velocityX;
        p.currentY += p.velocityY;
        p.currentZ += p.velocityZ;
        
        // Recalculate final position for rendering
        const x = p.currentX;
        const y = p.currentY;
        const z = p.currentZ;
        
        const finalRx = (x + ox) * cosY - z * sinY;
        const finalRz = (x + ox) * sinY + z * cosY;
        const finalRy = (y + oy) * cosX - finalRz * sinX;
        const finalFz = (y + oy) * sinX + finalRz * cosX;
        
        const finalScale = perspective / (perspective + finalFz);
        const finalPx = cx + finalRx * finalScale;
        const finalPy = cy + finalRy * finalScale;
        
        // Depth effects
        const depth = (finalFz + BASE_RADIUS) / (BASE_RADIUS * 2);
        const clampedDepth = depth < 0 ? 0 : depth > 1 ? 1 : depth;
        const size = p.size * finalScale * (0.5 + clampedDepth * 0.6);
        const finalSize = size < 0.5 ? 0.5 : size;
        const opacity = p.baseOpacity * (0.4 + clampedDepth * 0.6) * (1 - scatter * 0.15);
        const finalOpacity = opacity < 0 ? 0 : opacity;
        
        // Simple glow (no gradient for performance)
        const color = CHERRY_COLORS[p.colorIndex];
        const hue = color.h + Math.sin(time + p.id * 0.02) * 8;
        const sat = color.s;
        const light = color.l + clampedDepth * 15;
        
        // Outer glow - simple filled circle
        ctx.beginPath();
        ctx.arc(finalPx, finalPy, finalSize * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue},${sat}%,${light}%,${finalOpacity * 0.25})`;
        ctx.fill();
        
        // Core particle
        ctx.beginPath();
        ctx.arc(finalPx, finalPy, finalSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue},100%,90%,${finalOpacity})`;
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isMobile, BASE_RADIUS, CANVAS_SIZE]);
  
  // Smooth position interpolation based on scroll progress
  // On desktop: moves from 50% (center) to 15% (left) as scroll progresses through first section
  // On mobile: stays centered at 50%
  const clampedProgress = Math.min(scrollProgress, 1); // Clamp position movement to first transition
  const targetLeft = isMobile ? 50 : 50 - (clampedProgress * 35); // 50% to 15%
  const targetScale = 1 - (clampedProgress * 0.25); // 1 to 0.75
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="antimatter-container"
          className="fixed z-[5]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: fadeOpacity, 
            scale: targetScale,
            left: `${targetLeft}%`,
            top: '50%',
            x: '-50%',
            y: '-50%',
          }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
          transition={{
            opacity: { type: 'tween', duration: 0.2, ease: 'easeOut' },
            scale: { type: 'tween', duration: 0.1, ease: 'linear' },
            left: { type: 'tween', duration: 0.1, ease: 'linear' },
          }}
        >
          {/* Ambient glow */}
          <motion.div 
            className="absolute inset-0 -m-32 rounded-full blur-3xl pointer-events-none"
            animate={{
              opacity: [0.15, 0.25, 0.15],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              background: 'radial-gradient(circle, rgba(225, 29, 72, 0.3) 0%, rgba(251, 113, 133, 0.15) 50%, transparent 70%)',
            }}
          />
          
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="cursor-pointer"
              onMouseMove={(e) => handleMouseMove(e.nativeEvent)}
              onMouseLeave={handleMouseLeave}
              style={{
                filter: 'drop-shadow(0 0 40px rgba(225, 29, 72, 0.35))',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Antimatter;
