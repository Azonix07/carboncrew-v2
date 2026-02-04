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
      const r = radius * 0.85;
      const t = index / total;
      
      // Create latitude and longitude lines on a sphere
      if (t < 0.6) {
        // Sphere surface with denser equator
        const phi = Math.acos(1 - 2 * (t / 0.6));
        const theta = Math.PI * (1 + Math.sqrt(5)) * index;
        return {
          x: r * Math.sin(phi) * Math.cos(theta),
          y: r * Math.cos(phi),
          z: r * Math.sin(phi) * Math.sin(theta),
        };
      } else if (t < 0.8) {
        // Horizontal latitude lines
        const localT = (t - 0.6) / 0.2;
        const latIndex = Math.floor(localT * 5);
        const angleProgress = (localT * 5) % 1;
        const lat = ((latIndex / 4) - 0.5) * Math.PI * 0.8;
        const lon = angleProgress * Math.PI * 2;
        return {
          x: r * Math.cos(lat) * Math.cos(lon),
          y: r * Math.sin(lat),
          z: r * Math.cos(lat) * Math.sin(lon),
        };
      } else {
        // Vertical longitude lines
        const localT = (t - 0.8) / 0.2;
        const lonIndex = Math.floor(localT * 6);
        const angleProgress = (localT * 6) % 1;
        const lon = (lonIndex / 6) * Math.PI * 2;
        const lat = (angleProgress - 0.5) * Math.PI;
        return {
          x: r * Math.cos(lat) * Math.cos(lon),
          y: r * Math.sin(lat),
          z: r * Math.cos(lat) * Math.sin(lon),
        };
      }
    },
  },
  
  // Mobile Phone shape (Mobile Apps)
  mobile: {
    name: 'mobile',
    getPosition: (index, total, radius) => {
      const r = radius * 0.75;
      const t = index / total;
      const width = r * 0.5;
      const height = r * 1.0;
      const depth = r * 0.08;
      
      if (t < 0.7) {
        // Phone body outline with rounded corners
        const localT = (t / 0.7) * 4; // 4 sides
        const side = Math.floor(localT);
        const sideProgress = localT % 1;
        
        let x = 0, y = 0, z = 0;
        
        switch (side) {
          case 0: // Right side
            x = width;
            y = height * (sideProgress - 0.5);
            break;
          case 1: // Top
            x = width * (1 - sideProgress * 2);
            y = height * 0.5;
            break;
          case 2: // Left side
            x = -width;
            y = height * (0.5 - sideProgress);
            break;
          default: // Bottom
            x = width * (sideProgress * 2 - 1);
            y = -height * 0.5;
        }
        z = (Math.random() - 0.5) * depth;
        
        return { x, y, z };
      } else if (t < 0.85) {
        // Screen area (inner rectangle)
        const localT = (t - 0.7) / 0.15;
        const screenWidth = width * 0.85;
        const screenHeight = height * 0.8;
        const gridX = (localT * 5) % 1;
        const gridY = Math.floor(localT * 5) / 5;
        return {
          x: (gridX - 0.5) * screenWidth * 2,
          y: (gridY - 0.5) * screenHeight * 2,
          z: depth * 0.5,
        };
      } else {
        // Home button / notch at bottom
        const localT = (t - 0.85) / 0.15;
        const angle = localT * Math.PI * 2;
        const buttonR = r * 0.08;
        return {
          x: buttonR * Math.cos(angle),
          y: -height * 0.4,
          z: depth,
        };
      }
    },
  },
  
  // Pen/Pencil shape (UI/UX Design)
  pen: {
    name: 'pen',
    getPosition: (index, total, radius) => {
      const r = radius * 0.9;
      const t = index / total;
      
      // Pen oriented diagonally
      const penLength = r * 1.2;
      const penRadius = r * 0.08;
      
      if (t < 0.65) {
        // Pen body (cylinder)
        const localT = t / 0.65;
        const angle = localT * Math.PI * 2 * 8;
        const heightPos = localT * penLength * 0.7;
        
        // Rotate pen 45 degrees
        const bodyX = penRadius * Math.cos(angle);
        const bodyY = heightPos - penLength * 0.3;
        const bodyZ = penRadius * Math.sin(angle);
        
        return {
          x: (bodyX + bodyY) * 0.707,
          y: (bodyY - bodyX) * 0.707,
          z: bodyZ,
        };
      } else if (t < 0.85) {
        // Pen tip (cone)
        const localT = (t - 0.65) / 0.2;
        const angle = localT * Math.PI * 2 * 4;
        const tipRadius = penRadius * (1 - localT);
        const tipY = -penLength * 0.3 - localT * penLength * 0.2;
        
        const tipX = tipRadius * Math.cos(angle);
        const tipZ = tipRadius * Math.sin(angle);
        
        return {
          x: (tipX + tipY) * 0.707,
          y: (tipY - tipX) * 0.707,
          z: tipZ,
        };
      } else {
        // Pen cap (top cylinder)
        const localT = (t - 0.85) / 0.15;
        const angle = localT * Math.PI * 2 * 3;
        const capY = penLength * 0.4 + localT * penLength * 0.15;
        const capRadius = penRadius * 1.1;
        
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
  
  // Gear/Cog shape (Automation)
  gear: {
    name: 'gear',
    getPosition: (index, total, radius) => {
      const r = radius * 0.8;
      const t = index / total;
      const teeth = 8;
      const innerR = r * 0.35;
      const outerR = r * 0.65;
      const toothHeight = r * 0.18;
      const depth = r * 0.15;
      
      if (t < 0.15) {
        // Center hole
        const localT = t / 0.15;
        const angle = localT * Math.PI * 2;
        const holeR = innerR * 0.5;
        return {
          x: holeR * Math.cos(angle),
          y: holeR * Math.sin(angle),
          z: (Math.random() - 0.5) * depth,
        };
      } else if (t < 0.5) {
        // Inner disc
        const localT = (t - 0.15) / 0.35;
        const angle = localT * Math.PI * 2 * 3;
        const discR = innerR + (outerR - innerR) * (localT % 1);
        return {
          x: discR * Math.cos(angle),
          y: discR * Math.sin(angle),
          z: (Math.random() - 0.5) * depth,
        };
      } else {
        // Gear teeth
        const localT = (t - 0.5) / 0.5;
        const toothIndex = Math.floor(localT * teeth);
        const toothProgress = (localT * teeth) % 1;
        const baseAngle = (toothIndex / teeth) * Math.PI * 2;
        
        // Create tooth profile
        const toothAngleWidth = (Math.PI * 2 / teeth) * 0.4;
        let toothR, toothAngle;
        
        if (toothProgress < 0.3) {
          // Left side of tooth
          toothR = outerR + toothHeight * (toothProgress / 0.3);
          toothAngle = baseAngle - toothAngleWidth * 0.5;
        } else if (toothProgress < 0.7) {
          // Top of tooth
          toothR = outerR + toothHeight;
          toothAngle = baseAngle + toothAngleWidth * ((toothProgress - 0.3) / 0.4 - 0.5);
        } else {
          // Right side of tooth
          toothR = outerR + toothHeight * (1 - (toothProgress - 0.7) / 0.3);
          toothAngle = baseAngle + toothAngleWidth * 0.5;
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
  
  // Cloud shape (Cloud Solutions)
  cloud: {
    name: 'cloud',
    getPosition: (index, total, radius) => {
      const r = radius * 0.8;
      const t = index / total;
      
      // Cloud made of multiple overlapping spheres
      const cloudParts = [
        { cx: 0, cy: 0, cz: 0, cr: r * 0.45 },        // Center
        { cx: -r * 0.35, cy: r * 0.05, cz: 0, cr: r * 0.35 },  // Left
        { cx: r * 0.35, cy: r * 0.05, cz: 0, cr: r * 0.38 },   // Right
        { cx: -r * 0.55, cy: -r * 0.1, cz: 0, cr: r * 0.28 },  // Far left
        { cx: r * 0.55, cy: -r * 0.08, cz: 0, cr: r * 0.3 },   // Far right
        { cx: r * 0.15, cy: r * 0.15, cz: 0, cr: r * 0.32 },   // Top right
        { cx: -r * 0.15, cy: r * 0.12, cz: 0, cr: r * 0.3 },   // Top left
      ];
      
      // Distribute particles across cloud parts
      const partIndex = Math.floor(t * cloudParts.length * 1.5) % cloudParts.length;
      const part = cloudParts[partIndex];
      
      // Create sphere surface for each part
      const localT = (t * cloudParts.length * 1.5) % 1;
      const phi = Math.acos(1 - 2 * localT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * index;
      
      // Only show upper hemisphere for fluffy cloud look
      const sphereY = part.cr * Math.cos(phi);
      const adjustedY = sphereY > -part.cr * 0.3 ? sphereY : -part.cr * 0.3 + Math.random() * part.cr * 0.1;
      
      return {
        x: part.cx + part.cr * Math.sin(phi) * Math.cos(theta) * 0.9,
        y: part.cy + adjustedY * 0.8,
        z: part.cz + part.cr * Math.sin(phi) * Math.sin(theta) * 0.5,
      };
    },
  },
};

// Shape sequence for morphing animation - matches service icons
const SHAPE_SEQUENCE = ['sphere', 'globe', 'mobile', 'pen', 'gear', 'trolley', 'cloud'];

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
    if (isLowEnd) return 100;
    if (isMobile) return 110;
    return 150;
  }, [isMobile, isLowEnd]);
  
  const CANVAS_SIZE = useMemo(() => {
    if (isLowEnd) return 350;
    if (isMobile) return 400;
    return 600;
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
  const targetScale = 1 - (clampedProgress * 0.25); // 1 to 0.75
  
  return (
    <motion.div
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
