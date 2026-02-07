import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface AntimatterProps {
  currentSection: number;
}

interface ShapeConfig {
  name: string;
  getPosition: (index: number, total: number, radius: number) => { x: number; y: number; z: number };
}

// Detect low-end devices
const isLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for low memory (if available)
  const nav = navigator as any;
  if (nav.deviceMemory && nav.deviceMemory < 4) return true;
  
  // Check for low core count
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) return true;
  
  // Check screen size as proxy for mobile
  if (window.innerWidth < 768) return true;
  
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  
  return false;
};

// Clean, recognizable 3D shapes for the particle animation - matching service icons
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
  
  // Globe - World/Web with latitude and longitude lines (Web Development)
  globe: {
    name: 'globe',
    getPosition: (index, total, radius) => {
      const r = radius * 0.9;
      const t = index / total;
      
      // More precise globe with clear lat/long grid lines
      if (t < 0.5) {
        // Main sphere surface
        const phi = Math.acos(1 - 2 * (t / 0.5));
        const theta = Math.PI * (1 + Math.sqrt(5)) * index;
        return {
          x: r * Math.sin(phi) * Math.cos(theta),
          y: r * Math.cos(phi),
          z: r * Math.sin(phi) * Math.sin(theta),
        };
      } else if (t < 0.75) {
        // Horizontal latitude lines (8 lines)
        const localT = (t - 0.5) / 0.25;
        const latIndex = Math.floor(localT * 8);
        const angleProgress = (localT * 8) % 1;
        const lat = ((latIndex / 7) - 0.5) * Math.PI * 0.9;
        const lon = angleProgress * Math.PI * 2;
        const latRadius = r * Math.cos(lat);
        return {
          x: latRadius * Math.cos(lon),
          y: r * Math.sin(lat),
          z: latRadius * Math.sin(lon),
        };
      } else {
        // Vertical longitude lines (12 lines)
        const localT = (t - 0.75) / 0.25;
        const lonIndex = Math.floor(localT * 12);
        const angleProgress = (localT * 12) % 1;
        const lon = (lonIndex / 12) * Math.PI * 2;
        const lat = (angleProgress - 0.5) * Math.PI * 0.95;
        const latRadius = r * Math.cos(lat);
        return {
          x: latRadius * Math.cos(lon),
          y: r * Math.sin(lat),
          z: latRadius * Math.sin(lon),
        };
      }
    },
  },
  
  // Mobile Phone shape (Mobile Apps) - Just borders, narrower width
  mobile: {
    name: 'mobile',
    getPosition: (index, total, radius) => {
      const r = radius * 0.85;
      const t = index / total;
      const width = r * 0.32; // Reduced width for more realistic phone proportions
      const height = r * 0.95;
      const depth = r * 0.05;
      
      if (t < 0.6) {
        // Outer border rectangle with rounded corners
        const localT = t / 0.6;
        const perimeterProgress = localT * 4; // 4 sides
        const side = Math.floor(perimeterProgress);
        const sideProgress = perimeterProgress % 1;
        
        let x = 0, y = 0;
        
        switch (side) {
          case 0: // Top edge (left to right)
            x = -width + sideProgress * (width * 2);
            y = height * 0.5;
            break;
          case 1: // Right edge (top to bottom)
            x = width;
            y = height * 0.5 - sideProgress * height;
            break;
          case 2: // Bottom edge (right to left)
            x = width - sideProgress * (width * 2);
            y = -height * 0.5;
            break;
          case 3: // Left edge (bottom to top)
            x = -width;
            y = -height * 0.5 + sideProgress * height;
            break;
        }
        
        return { x, y, z: 0 };
      } else if (t < 0.85) {
        // Inner screen border (also just border)
        const localT = (t - 0.6) / 0.25;
        const screenWidth = width * 0.8;
        const screenHeight = height * 0.75;
        const perimeterProgress = localT * 4;
        const side = Math.floor(perimeterProgress);
        const sideProgress = perimeterProgress % 1;
        
        let x = 0, y = 0;
        
        switch (side) {
          case 0:
            x = -screenWidth + sideProgress * (screenWidth * 2);
            y = screenHeight * 0.45;
            break;
          case 1:
            x = screenWidth;
            y = screenHeight * 0.45 - sideProgress * screenHeight;
            break;
          case 2:
            x = screenWidth - sideProgress * (screenWidth * 2);
            y = -screenHeight * 0.45;
            break;
          case 3:
            x = -screenWidth;
            y = -screenHeight * 0.45 + sideProgress * screenHeight;
            break;
        }
        
        return { x, y, z: depth };
      } else {
        // Notch/camera at top
        const localT = (t - 0.85) / 0.15;
        const angle = localT * Math.PI * 2;
        const notchR = r * 0.04;
        return {
          x: notchR * Math.cos(angle),
          y: height * 0.42,
          z: depth * 2,
        };
      }
    },
  },
  
  // Pen/Pencil shape (UI/UX Design) - More refined
  pen: {
    name: 'pen',
    getPosition: (index, total, radius) => {
      const r = radius * 0.95;
      const t = index / total;
      
      // Pen oriented at 45 degrees
      const penLength = r * 1.3;
      const penRadius = r * 0.07;
      
      if (t < 0.55) {
        // Main pen body (hexagonal cylinder for realism)
        const localT = t / 0.55;
        const sides = 6;
        const sideIndex = Math.floor(localT * sides * 10);
        const angle = (sideIndex % sides) * (Math.PI * 2 / sides);
        const heightPos = localT * penLength * 0.65;
        
        const bodyX = penRadius * Math.cos(angle);
        const bodyY = heightPos - penLength * 0.25;
        const bodyZ = penRadius * Math.sin(angle);
        
        // Rotate 45 degrees
        return {
          x: (bodyX + bodyY) * 0.707,
          y: (bodyY - bodyX) * 0.707,
          z: bodyZ,
        };
      } else if (t < 0.7) {
        // Pen tip (sharp cone)
        const localT = (t - 0.55) / 0.15;
        const angle = localT * Math.PI * 2 * 3;
        const tipRadius = penRadius * 0.9 * (1 - localT * 0.95);
        const tipY = -penLength * 0.25 - localT * penLength * 0.2;
        
        const tipX = tipRadius * Math.cos(angle);
        const tipZ = tipRadius * Math.sin(angle);
        
        return {
          x: (tipX + tipY) * 0.707,
          y: (tipY - tipX) * 0.707,
          z: tipZ,
        };
      } else if (t < 0.85) {
        // Pen clip
        const localT = (t - 0.7) / 0.15;
        const clipY = penLength * 0.3 + localT * penLength * 0.15;
        const clipX = penRadius * 1.5;
        
        return {
          x: (clipX + clipY) * 0.707,
          y: (clipY - clipX) * 0.707,
          z: 0,
        };
      } else {
        // Pen cap end (small circle)
        const localT = (t - 0.85) / 0.15;
        const angle = localT * Math.PI * 2;
        const capY = penLength * 0.4;
        const capRadius = penRadius * 0.8;
        
        const capX = capRadius * Math.cos(angle);
        const capZ = capRadius * Math.sin(angle);
        
        return {
          x: (capX + capY) * 0.707,
          y: (capY - capX) * 0.707,
          z: capZ,
        };
      }
    },
  },
  
  // Gear/Cog shape (Automation) - Settings icon style with 8 teeth
  gear: {
    name: 'gear',
    getPosition: (index, total, radius) => {
      const r = radius * 0.85;
      const t = index / total;
      const teeth = 8; // 8 teeth like standard settings icon
      const innerR = r * 0.32;
      const midR = r * 0.58;
      const outerR = r * 0.78;
      const depth = r * 0.08;
      
      if (t < 0.12) {
        // Center hole (perfect circle)
        const localT = t / 0.12;
        const angle = localT * Math.PI * 2;
        return {
          x: innerR * Math.cos(angle),
          y: innerR * Math.sin(angle),
          z: 0,
        };
      } else if (t < 0.28) {
        // Inner ring/disc
        const localT = (t - 0.12) / 0.16;
        const angle = localT * Math.PI * 2;
        const ringR = innerR + (midR - innerR) * 0.3;
        return {
          x: ringR * Math.cos(angle),
          y: ringR * Math.sin(angle),
          z: 0,
        };
      } else {
        // Gear teeth - settings icon style (smooth rounded teeth)
        const localT = (t - 0.28) / 0.72;
        const toothIndex = Math.floor(localT * teeth);
        const toothProgress = (localT * teeth) % 1;
        const baseAngle = (toothIndex / teeth) * Math.PI * 2;
        const toothAngleWidth = (Math.PI * 2 / teeth) * 0.45;
        
        let toothR, toothAngle;
        
        if (toothProgress < 0.15) {
          // Smooth rise to tooth (curved)
          const rise = toothProgress / 0.15;
          toothR = midR + (outerR - midR) * Math.sin(rise * Math.PI * 0.5);
          toothAngle = baseAngle - toothAngleWidth * 0.5;
        } else if (toothProgress < 0.5) {
          // Top of tooth (flat but slightly rounded)
          const topProgress = (toothProgress - 0.15) / 0.35;
          toothR = outerR - (outerR - midR) * 0.02 * Math.sin(topProgress * Math.PI);
          toothAngle = baseAngle + toothAngleWidth * (topProgress - 0.5);
        } else if (toothProgress < 0.65) {
          // Smooth fall from tooth (curved)
          const fall = (toothProgress - 0.5) / 0.15;
          toothR = outerR - (outerR - midR) * Math.sin(fall * Math.PI * 0.5);
          toothAngle = baseAngle + toothAngleWidth * 0.5;
        } else {
          // Gap between teeth (circular arc on inner circle)
          const gapProgress = (toothProgress - 0.65) / 0.35;
          toothR = midR;
          const gapAngleWidth = (Math.PI * 2 / teeth) - toothAngleWidth;
          toothAngle = baseAngle + toothAngleWidth * 0.5 + gapAngleWidth * gapProgress;
        }
        
        return {
          x: toothR * Math.cos(toothAngle),
          y: toothR * Math.sin(toothAngle),
          z: (Math.random() - 0.5) * depth,
        };
      }
    },
  },
  
  // Shopping Cart/Trolley shape (E-Commerce)
  trolley: {
    name: 'trolley',
    getPosition: (index, total, radius) => {
      const r = radius * 0.75;
      const t = index / total;
      
      const cartWidth = r * 0.8;
      const cartHeight = r * 0.5;
      const cartDepth = r * 0.5;
      
      if (t < 0.5) {
        // Cart basket (wireframe box)
        const localT = t / 0.5;
        const edge = Math.floor(localT * 12);
        const edgeProgress = (localT * 12) % 1;
        
        let x = 0, y = 0, z = 0;
        
        // 12 edges of the basket
        switch (edge % 12) {
          case 0: x = -cartWidth + edgeProgress * cartWidth * 2; y = cartHeight; z = cartDepth; break;
          case 1: x = cartWidth; y = cartHeight; z = cartDepth - edgeProgress * cartDepth * 2; break;
          case 2: x = cartWidth - edgeProgress * cartWidth * 2; y = cartHeight; z = -cartDepth; break;
          case 3: x = -cartWidth; y = cartHeight; z = -cartDepth + edgeProgress * cartDepth * 2; break;
          case 4: x = -cartWidth; y = cartHeight - edgeProgress * cartHeight; z = cartDepth; break;
          case 5: x = cartWidth; y = cartHeight - edgeProgress * cartHeight; z = cartDepth; break;
          case 6: x = cartWidth; y = cartHeight - edgeProgress * cartHeight; z = -cartDepth; break;
          case 7: x = -cartWidth; y = cartHeight - edgeProgress * cartHeight; z = -cartDepth; break;
          case 8: x = -cartWidth + edgeProgress * cartWidth * 2; y = 0; z = cartDepth; break;
          case 9: x = cartWidth; y = 0; z = cartDepth - edgeProgress * cartDepth * 2; break;
          case 10: x = cartWidth - edgeProgress * cartWidth * 2; y = 0; z = -cartDepth; break;
          default: x = -cartWidth; y = 0; z = -cartDepth + edgeProgress * cartDepth * 2; break;
        }
        
        return { x, y: y - r * 0.2, z };
      } else if (t < 0.7) {
        // Handle
        const localT = (t - 0.5) / 0.2;
        const handleX = -cartWidth - r * 0.3 + localT * r * 0.3;
        const handleY = cartHeight * 0.3 + localT * cartHeight * 0.4;
        return {
          x: handleX,
          y: handleY - r * 0.2,
          z: 0,
        };
      } else if (t < 0.85) {
        // Left wheel
        const localT = (t - 0.7) / 0.15;
        const angle = localT * Math.PI * 2;
        const wheelR = r * 0.15;
        return {
          x: -cartWidth * 0.6 + wheelR * Math.cos(angle) * 0.3,
          y: -r * 0.35 + wheelR * Math.sin(angle),
          z: cartDepth * 0.5,
        };
      } else {
        // Right wheel
        const localT = (t - 0.85) / 0.15;
        const angle = localT * Math.PI * 2;
        const wheelR = r * 0.15;
        return {
          x: cartWidth * 0.6 + wheelR * Math.cos(angle) * 0.3,
          y: -r * 0.35 + wheelR * Math.sin(angle),
          z: cartDepth * 0.5,
        };
      }
    },
  },
  
  // Cloud shape (Cloud Solutions) - Classic cloud with 2 humps on top
  cloud: {
    name: 'cloud',
    getPosition: (index, total, radius) => {
      const r = radius * 0.9;
      const t = index / total;
      
      // Classic cloud: flat bottom with 2 distinct humps on top
      // Left hump, center valley, right hump structure
      const cloudBumps = [
        // Left hump (larger)
        { cx: -r * 0.35, cy: r * 0.15, cz: 0, cr: r * 0.38 },
        // Right hump (larger)
        { cx: r * 0.35, cy: r * 0.15, cz: 0, cr: r * 0.38 },
        // Center valley (smaller, lower)
        { cx: 0, cy: r * 0.05, cz: 0, cr: r * 0.32 },
        // Left base
        { cx: -r * 0.5, cy: -r * 0.05, cz: 0, cr: r * 0.28 },
        // Right base
        { cx: r * 0.5, cy: -r * 0.05, cz: 0, cr: r * 0.28 },
        // Center base (fills bottom)
        { cx: 0, cy: -r * 0.15, cz: 0, cr: r * 0.45 },
      ];
      
      // Distribute particles across bumps
      const bumpIndex = Math.floor(t * cloudBumps.length * 1.5) % cloudBumps.length;
      const bump = cloudBumps[bumpIndex];
      
      // Create sphere surface for each bump
      const localT = (t * cloudBumps.length * 1.5) % 1;
      const phi = Math.acos(1 - 2 * localT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * index;
      
      // Only upper hemisphere for cloud appearance, flatten bottom
      const sphereY = bump.cr * Math.cos(phi);
      
      // For top bumps, show more of upper hemisphere
      // For bottom parts, flatten significantly
      let adjustedY;
      if (bump.cy > 0) {
        // Top bumps - show upper 70%
        adjustedY = sphereY > -bump.cr * 0.3 ? sphereY : -bump.cr * 0.3;
      } else {
        // Bottom parts - show upper 50% only and flatten
        adjustedY = sphereY > -bump.cr * 0.1 ? sphereY : -bump.cr * 0.1;
      }
      
      return {
        x: bump.cx + bump.cr * Math.sin(phi) * Math.cos(theta) * 0.9,
        y: bump.cy + adjustedY * 0.85,
        z: bump.cz + bump.cr * Math.sin(phi) * Math.sin(theta) * 0.5,
      };
    },
  },
};

// Shape sequence for morphing animation - precise shapes only
const SHAPE_SEQUENCE = ['globe', 'mobile', 'gear', 'pen', 'cloud'];

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

// Rose/Red theme colors for white background
const CHERRY_COLORS = [
  { h: 350, s: 85, l: 55 },  // Rose primary
  { h: 355, s: 80, l: 50 },  // Rose darker
  { h: 345, s: 75, l: 60 },  // Rose lighter
  { h: 0, s: 70, l: 55 },    // Red
  { h: 352, s: 82, l: 52 },  // Rose deep
  { h: 348, s: 78, l: 58 },  // Rose soft
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
  const frameCountRef = useRef(0);
  
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);
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
  
  // Visibility based on current section - visible on first 2 pages (Hero and Services)
  // Use currentSection prop as the primary source since snap-scroll jumps directly
  // scrollProgress is used for smooth fade during transition
  const isOnVisibleSection = currentSection < 2;
  const fadeOpacity = isOnVisibleSection 
    ? (scrollProgress < 1.5 ? 1 : Math.max(0.1, 1 - (scrollProgress - 1.5) * 2))
    : 0;
  const isVisible = isOnVisibleSection;
  
  // Significantly reduced particle count for performance
  // Low-end: 80 particles, Mobile: 120 particles, Desktop: 200 particles
  const PARTICLE_COUNT = useMemo(() => {
    if (isLowEnd) return 80;
    if (isMobile) return 120;
    return 200;
  }, [isMobile, isLowEnd]);
  
  const BASE_RADIUS = useMemo(() => {
    if (isLowEnd) return 350;
    if (isMobile) return 400;
    return 550;
  }, [isMobile, isLowEnd]);
  
  const CANVAS_SIZE = useMemo(() => {
    if (isLowEnd) return 1100;
    if (isMobile) return 1250;
    return 1700;
  }, [isMobile, isLowEnd]);
  
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
        size: 3.5 + Math.random() * 3.5,
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
      }, 4500); // Slower morphing for better viewing
      
      return () => clearInterval(morphInterval);
    }
  }, [isVisible, currentSection, morphToShape]);
  
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setIsLowEnd(isLowEndDevice());
    };
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
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    // Use lower DPR on low-end devices for better performance
    const dpr = isLowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    canvas.style.width = CANVAS_SIZE + 'px';
    canvas.style.height = CANVAS_SIZE + 'px';
    ctx.scale(dpr, dpr);
    
    // Frame skip for low-end devices (render every 2nd frame)
    const frameSkip = isLowEnd ? 2 : 1;
    
    const animate = () => {
      frameCountRef.current++;
      
      // Skip frames on low-end devices
      if (frameCountRef.current % frameSkip !== 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const cx = CANVAS_SIZE / 2;
      const cy = CANVAS_SIZE / 2;
      
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      
      timeRef.current += isLowEnd ? 0.012 : 0.008;
      
      // Check if mouse has stopped moving (for recovery)
      const now = Date.now();
      if (now - mouseRef.current.lastMoveTime > 100) {
        mouseRef.current.isMoving = false;
        // Gradually reduce velocity when mouse stops
        mouseRef.current.velocityX *= 0.9;
        mouseRef.current.velocityY *= 0.9;
      }
      
      // Smooth rotation
      rotationRef.current.y += isLowEnd ? 0.006 : 0.004;
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
      const isHovering = mouseRef.current.isHovering && !isLowEnd; // Disable hover on low-end
      const velX = mouseRef.current.velocityX;
      const velY = mouseRef.current.velocityY;
      
      // Sort by Z for depth - only every few frames on low-end
      const shouldSort = !isLowEnd || frameCountRef.current % 4 === 0;
      const sorted = shouldSort 
        ? [...particlesRef.current].sort((a, b) => a.currentZ - b.currentZ)
        : particlesRef.current;
      
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
        
        // Perspective - increased for larger visual size
        const perspective = 800;
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
        const light = color.l - clampedDepth * 15; // Darker on light background
        
        // Skip outer glow on low-end devices for performance
        if (!isLowEnd) {
          // Outer glow - simple filled circle
          ctx.beginPath();
          ctx.arc(finalPx, finalPy, finalSize * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue},${sat}%,${light}%,${finalOpacity * 0.15})`;
          ctx.fill();
        }
        
        // Core particle
        ctx.beginPath();
        ctx.arc(finalPx, finalPy, finalSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue},${sat}%,${Math.max(20, light - 15)}%,${finalOpacity})`; // Darker core
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isMobile, isLowEnd, BASE_RADIUS, CANVAS_SIZE]);
  
  // Smooth position interpolation based on scroll progress
  // On desktop: moves from 50% (center) to 15% (left) as scroll progresses through first section
  // On mobile: stays centered at 50%
  const clampedProgress = Math.min(scrollProgress, 1); // Clamp position movement to first transition
  const targetLeft = isMobile ? 50 : 50 - (clampedProgress * 35); // 50% to 15%
  const targetScale = 1.2 - (clampedProgress * 0.45); // 1.2 to 0.75
  
  return (
    <motion.div
      className="fixed z-[5]"
      initial={{ opacity: 0, scale: 1.2 }}
      animate={{ 
        opacity: fadeOpacity, 
        scale: targetScale,
        left: `${targetLeft}%`,
        top: '50%',
        x: '-50%',
        y: '-50%',
      }}
      transition={{
        opacity: { type: 'tween', duration: 0.2, ease: 'easeOut' },
        scale: { type: 'tween', duration: 0.1, ease: 'linear' },
        left: { type: 'tween', duration: 0.1, ease: 'linear' },
      }}
      style={{
        pointerEvents: isVisible ? 'auto' : 'none',
        visibility: isVisible ? 'visible' : 'hidden',
      }}
    >
      {/* Ambient glow */}
      <motion.div 
        className="absolute inset-0 -m-32 rounded-full blur-3xl pointer-events-none"
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          background: 'radial-gradient(circle, rgba(100, 116, 139, 0.15) 0%, rgba(148, 163, 184, 0.1) 50%, transparent 70%)',
        }}
      />
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="cursor-pointer"
          onMouseMove={(e) => handleMouseMove(e.nativeEvent)}
          onMouseLeave={handleMouseLeave}
          style={{
            filter: isLowEnd ? 'none' : 'drop-shadow(0 0 40px rgba(100, 116, 139, 0.15))',
          }}
        />
      </div>
    </motion.div>
  );
};

export default Antimatter;
