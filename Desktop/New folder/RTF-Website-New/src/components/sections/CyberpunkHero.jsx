// import { useEffect, useRef, useState, useCallback } from 'react';
// import { motion, useMotionValue, useTransform, useSpring, useInView } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { Cpu, Zap, ChevronRight, Rocket } from 'lucide-react';

// /* ─── Constants ────────────────────────────────────────── */
// const PARTICLE_COUNT = 90;
// const NODE_COUNT = 18;
// const STAR_COUNT = 160;

// /* ─── Utility ─────────────────────────────────────────── */
// const rand = (min, max) => Math.random() * (max - min) + min;
// const randInt = (min, max) => Math.floor(rand(min, max));

// /* ─── Main Section ────────────────────────────────────── */
// export default function CyberpunkHero() {
//   const sectionRef = useRef(null);
//   const canvasRef = useRef(null);
//   const particleCanvasRef = useRef(null);
//   const animRef = useRef(null);
//   const mouseRef = useRef({ x: 0.5, y: 0.5 });
//   const [cursorTrail, setCursorTrail] = useState([]);
//   const isInView = useInView(sectionRef, { once: false, margin: '-10%' });

//   /* Mouse parallax springs */
//   const rawX = useMotionValue(0);
//   const rawY = useMotionValue(0);
//   const springX = useSpring(rawX, { stiffness: 50, damping: 20 });
//   const springY = useSpring(rawY, { stiffness: 50, damping: 20 });

//   const layer1X = useTransform(springX, [-1, 1], [-28, 28]);
//   const layer1Y = useTransform(springY, [-1, 1], [-18, 18]);
//   const layer2X = useTransform(springX, [-1, 1], [-14, 14]);
//   const layer2Y = useTransform(springY, [-1, 1], [-8, 8]);
//   const layer3X = useTransform(springX, [-1, 1], [-6, 6]);
//   const layer3Y = useTransform(springY, [-1, 1], [-4, 4]);

//   /* ── Mouse move handler ── */
//   const handleMouseMove = useCallback((e) => {
//     const rect = sectionRef.current?.getBoundingClientRect();
//     if (!rect) return;
//     const nx = (e.clientX - rect.left) / rect.width;
//     const ny = (e.clientY - rect.top) / rect.height;
//     mouseRef.current = { x: nx, y: ny };
//     rawX.set((nx - 0.5) * 2);
//     rawY.set((ny - 0.5) * 2);

//     // Cursor trail
//     setCursorTrail(prev => [
//       { x: e.clientX, y: e.clientY, id: Date.now() },
//       ...prev.slice(0, 14),
//     ]);
//   }, [rawX, rawY]);

//   /* ── Canvas: starfield + circuit grid ── */
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');

//     const resize = () => {
//       canvas.width = canvas.offsetWidth;
//       canvas.height = canvas.offsetHeight;
//     };
//     resize();
//     window.addEventListener('resize', resize);

//     /* Generate static stars */
//     const stars = Array.from({ length: STAR_COUNT }, () => ({
//       x: rand(0, 1), y: rand(0, 1),
//       r: rand(0.3, 1.8),
//       alpha: rand(0.2, 0.9),
//       twinkleSpeed: rand(0.003, 0.012),
//       twinklePhase: rand(0, Math.PI * 2),
//     }));

//     /* Generate AI circuit nodes */
//     const nodes = Array.from({ length: NODE_COUNT }, () => ({
//       x: rand(0.05, 0.95), y: rand(0.05, 0.95),
//       r: rand(2, 5),
//       pulsePhase: rand(0, Math.PI * 2),
//       pulseSpeed: rand(0.02, 0.06),
//     }));

//     /* Build circuit connections (sparse graph) */
//     const edges = [];
//     for (let i = 0; i < nodes.length; i++) {
//       const closest = nodes
//         .map((n, j) => ({ j, dist: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }))
//         .filter(({ j }) => j !== i)
//         .sort((a, b) => a.dist - b.dist)
//         .slice(0, 2);
//       closest.forEach(({ j }) => edges.push([i, j]));
//     }

//     /* Generate digital lines */
//     const lines = Array.from({ length: 22 }, () => ({
//       x: rand(0, 1), y: rand(0, 1),
//       angle: [0, 90, 45, -45][randInt(0, 4)],
//       len: rand(0.04, 0.14),
//       progress: rand(0, 1),
//       speed: rand(0.002, 0.006),
//       alpha: rand(0.1, 0.35),
//     }));

//     let t = 0;
//     const draw = () => {
//       t++;
//       const W = canvas.width, H = canvas.height;
//       ctx.clearRect(0, 0, W, H);

//       /* Starfield */
//       stars.forEach(s => {
//         const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.twinkleSpeed + s.twinklePhase));
//         ctx.beginPath();
//         ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(180,220,255,${a})`;
//         ctx.fill();
//       });

//       /* Circuit edges */
//       edges.forEach(([i, j]) => {
//         const a = nodes[i], b = nodes[j];
//         const pulse = 0.04 + 0.06 * Math.sin(t * 0.015 + i);
//         ctx.beginPath();
//         ctx.moveTo(a.x * W, a.y * H);
//         ctx.lineTo(b.x * W, b.y * H);
//         ctx.strokeStyle = `rgba(0,212,255,${pulse})`;
//         ctx.lineWidth = 0.8;
//         ctx.stroke();

//         /* Travelling data pulse along edge */
//         const prog = ((t * 0.008 + i * 0.3) % 1);
//         const px = (a.x + (b.x - a.x) * prog) * W;
//         const py = (a.y + (b.y - a.y) * prog) * H;
//         ctx.beginPath();
//         ctx.arc(px, py, 1.5, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(100,220,255,0.8)`;
//         ctx.fill();
//       });

//       /* AI Nodes */
//       nodes.forEach(n => {
//         const pulse = 0.5 + 0.5 * Math.sin(t * n.pulseSpeed + n.pulsePhase);
//         const glow = ctx.createRadialGradient(n.x * W, n.y * H, 0, n.x * W, n.y * H, n.r * 6);
//         glow.addColorStop(0, `rgba(0,212,255,${0.4 * pulse})`);
//         glow.addColorStop(1, 'transparent');
//         ctx.fillStyle = glow;
//         ctx.beginPath();
//         ctx.arc(n.x * W, n.y * H, n.r * 6, 0, Math.PI * 2);
//         ctx.fill();

//         ctx.beginPath();
//         ctx.arc(n.x * W, n.y * H, n.r * pulse, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(0,212,255,${0.7 + 0.3 * pulse})`;
//         ctx.fill();
//       });

//       /* Digital scan lines */
//       lines.forEach(l => {
//         l.progress = (l.progress + l.speed) % 1;
//         const rad = (l.angle * Math.PI) / 180;
//         const sx = l.x * W + Math.cos(rad) * l.progress * l.len * W;
//         const sy = l.y * H + Math.sin(rad) * l.progress * l.len * H;
//         const ex = sx + Math.cos(rad) * 0.04 * W;
//         const ey = sy + Math.sin(rad) * 0.04 * H;
//         ctx.beginPath();
//         ctx.moveTo(sx, sy);
//         ctx.lineTo(ex, ey);
//         ctx.strokeStyle = `rgba(0,180,255,${l.alpha * (1 - l.progress)})`;
//         ctx.lineWidth = 1;
//         ctx.stroke();
//       });

//       /* Holographic horizontal scan sweep */
//       const scanY = ((t * 0.5) % H);
//       const scanGrad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
//       scanGrad.addColorStop(0, 'transparent');
//       scanGrad.addColorStop(0.5, 'rgba(0,212,255,0.025)');
//       scanGrad.addColorStop(1, 'transparent');
//       ctx.fillStyle = scanGrad;
//       ctx.fillRect(0, scanY - 60, W, 120);

//       animRef.current = requestAnimationFrame(draw);
//     };

//     animRef.current = requestAnimationFrame(draw);
//     return () => {
//       cancelAnimationFrame(animRef.current);
//       window.removeEventListener('resize', resize);
//     };
//   }, []);

//   /* ── Canvas: floating particles ── */
//   useEffect(() => {
//     const canvas = particleCanvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     let rafId;

//     const resize = () => {
//       canvas.width = canvas.offsetWidth;
//       canvas.height = canvas.offsetHeight;
//     };
//     resize();
//     window.addEventListener('resize', resize);

//     const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
//       x: rand(0, canvas.width || 1200),
//       y: rand(0, canvas.height || 800),
//       vx: rand(-0.3, 0.3),
//       vy: rand(-0.4, -0.1),
//       r: rand(1, 3.5),
//       alpha: rand(0.3, 0.9),
//       color: Math.random() > 0.5 ? '0,212,255' : '120,180,255',
//     }));

//     const draw = () => {
//       const W = canvas.width, H = canvas.height;
//       ctx.clearRect(0, 0, W, H);

//       /* Mouse attraction force */
//       const mx = mouseRef.current.x * W;
//       const my = mouseRef.current.y * H;

//       particles.forEach(p => {
//         /* Gentle mouse repulsion */
//         const dx = p.x - mx, dy = p.y - my;
//         const dist = Math.hypot(dx, dy);
//         if (dist < 120) {
//           p.vx += (dx / dist) * 0.04;
//           p.vy += (dy / dist) * 0.04;
//         }

//         p.x += p.vx;
//         p.y += p.vy;
//         p.vx *= 0.99;
//         p.vy *= 0.99;
//         if (p.y < -10) { p.y = H + 10; p.x = rand(0, W); }
//         if (p.x < -10) p.x = W + 10;
//         if (p.x > W + 10) p.x = -10;

//         /* Glow halo */
//         const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
//         g.addColorStop(0, `rgba(${p.color},${p.alpha * 0.6})`);
//         g.addColorStop(1, 'transparent');
//         ctx.fillStyle = g;
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
//         ctx.fill();

//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
//         ctx.fill();
//       });

//       rafId = requestAnimationFrame(draw);
//     };
//     rafId = requestAnimationFrame(draw);
//     return () => {
//       cancelAnimationFrame(rafId);
//       window.removeEventListener('resize', resize);
//     };
//   }, []);

//   /* ── Clean up cursor trail ── */
//   useEffect(() => {
//     const id = setInterval(() => {
//       setCursorTrail(prev => prev.slice(0, -1));
//     }, 60);
//     return () => clearInterval(id);
//   }, []);

//   return (
//     <section
//       ref={sectionRef}
//       id="cyberpunk-hero"
//       onMouseMove={handleMouseMove}
//       className="relative w-full overflow-hidden"
//       style={{
//         background: 'linear-gradient(180deg, #020408 0%, #030810 40%, #040c18 70%, #020408 100%)',
//         minHeight: '100vh',
//       }}
//     >
//       {/* ── Cursor trail ── */}
//       <div className="fixed inset-0 pointer-events-none z-[9999]">
//         {cursorTrail.map((pt, i) => (
//           <div
//             key={pt.id}
//             className="absolute rounded-full pointer-events-none"
//             style={{
//               left: pt.x,
//               top: pt.y,
//               width: `${Math.max(2, 12 - i)}px`,
//               height: `${Math.max(2, 12 - i)}px`,
//               transform: 'translate(-50%,-50%)',
//               background: `rgba(0,212,255,${Math.max(0, 0.8 - i * 0.06)})`,
//               boxShadow: `0 0 ${8 - i * 0.5}px rgba(0,212,255,0.6)`,
//               filter: `blur(${i * 0.5}px)`,
//             }}
//           />
//         ))}
//       </div>

//       {/* ── Static canvas: stars + circuits ── */}
//       <canvas
//         ref={canvasRef}
//         className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
//       />

//       {/* ── Particle canvas ── */}
//       <canvas
//         ref={particleCanvasRef}
//         className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
//       />

//       {/* ── Radial vignette + top/bottom gradient fades ── */}
//       <div
//         className="absolute inset-0 pointer-events-none z-[3]"
//         style={{
//           background:
//             'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(2,4,8,0.85) 100%)',
//         }}
//       />
//       <div className="absolute inset-x-0 top-0 h-40 pointer-events-none z-[4]"
//         style={{ background: 'linear-gradient(to bottom, rgba(2,4,8,1), transparent)' }} />
//       <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none z-[4]"
//         style={{ background: 'linear-gradient(to top, rgba(2,4,8,1), transparent)' }} />

//       {/* ── Content Layer ── */}
//       <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 text-center pt-16 pb-20">

//         {/* Top status badge */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
//           transition={{ duration: 0.8, delay: 0.1 }}
//           style={{ x: layer3X, y: layer3Y }}
//           className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-md"
//         >
//           <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
//           <span className="text-xs font-mono tracking-[0.3em] text-cyan-400 uppercase">
//             // SYSTEM ONLINE — GCoEA AMRAVATI · EST. 2014
//           </span>
//           <Cpu size={12} className="text-cyan-500" />
//         </motion.div>

//         {/* ── Giant title block ── */}
//         <motion.div
//           style={{ x: layer2X, y: layer2Y }}
//           className="w-full max-w-7xl mx-auto"
//         >
//           {/* THE-ROBOTECH */}
//           <motion.div
//             initial={{ opacity: 0, y: 60, skewY: 2 }}
//             animate={isInView ? { opacity: 1, y: 0, skewY: 0 } : { opacity: 0, y: 60, skewY: 2 }}
//             transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
//           >
//             <h2
//               className="block font-black uppercase leading-none select-none"
//               style={{
//                 fontSize: 'clamp(2.5rem, 8vw, 7rem)',
//                 letterSpacing: '-0.02em',
//                 color: 'transparent',
//                 WebkitTextStroke: '1.5px rgba(0,212,255,0.6)',
//                 textShadow: '0 0 80px rgba(0,212,255,0.25)',
//                 fontFamily: "'Space Grotesk', sans-serif",
//               }}
//             >
//               THE-ROBOTECH
//             </h2>
//           </motion.div>

//           {/* FORUM — solid neon fill */}
//           <motion.div
//             initial={{ opacity: 0, y: 80, skewY: 3 }}
//             animate={isInView ? { opacity: 1, y: 0, skewY: 0 } : { opacity: 0, y: 80, skewY: 3 }}
//             transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
//           >
//             <h1
//               className="block font-black uppercase leading-none select-none"
//               style={{
//                 fontSize: 'clamp(3.5rem, 12vw, 10.5rem)',
//                 letterSpacing: '-0.03em',
//                 background: 'linear-gradient(135deg, #00d4ff 0%, #22d3ee 30%, #a78bfa 70%, #00d4ff 100%)',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 backgroundClip: 'text',
//                 filter: 'drop-shadow(0 0 40px rgba(0,212,255,0.5)) drop-shadow(0 0 80px rgba(167,139,250,0.3))',
//                 fontFamily: "'Space Grotesk', sans-serif",
//               }}
//             >
//               FORUM
//             </h1>
//           </motion.div>
//         </motion.div>

//         {/* Subtitle */}
//         <motion.div
//           style={{ x: layer1X, y: layer1Y }}
//           initial={{ opacity: 0, y: 30 }}
//           animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
//           transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
//           className="mt-4 mb-2"
//         >
//           <p
//             className="text-base sm:text-lg md:text-xl font-mono tracking-[0.25em] uppercase"
//             style={{ color: 'rgba(148,210,255,0.75)', letterSpacing: '0.2em' }}
//           >
//             Government College of Engineering Amravati
//           </p>
//         </motion.div>

//         {/* Divider line */}
//         <motion.div
//           initial={{ scaleX: 0, opacity: 0 }}
//           animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
//           transition={{ duration: 1, delay: 0.8 }}
//           className="w-64 h-px my-6"
//           style={{
//             background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.7), rgba(167,139,250,0.7), transparent)',
//             boxShadow: '0 0 12px rgba(0,212,255,0.4)',
//           }}
//         />

//         {/* Tagline */}
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={isInView ? { opacity: 1 } : { opacity: 0 }}
//           transition={{ duration: 1, delay: 0.95 }}
//           className="text-sm sm:text-base font-mono text-cyan-400/60 max-w-lg mx-auto leading-relaxed mb-10"
//         >
//           <span className="text-cyan-400/40">// </span>
//           Engineering the future. One robot at a time.
//         </motion.p>

//         {/* ── CTA Buttons ── */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
//           transition={{ duration: 0.8, delay: 1.1 }}
//           className="flex flex-col sm:flex-row items-center gap-4"
//         >
//           {/* Primary CTA */}
//           <Link to="/contact">
//             <motion.div
//               whileHover={{ scale: 1.04, y: -2 }}
//               whileTap={{ scale: 0.97 }}
//               className="group relative flex items-center gap-3 px-7 py-3.5 rounded-xl cursor-pointer overflow-hidden"
//               style={{
//                 background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,180,255,0.05))',
//                 border: '1px solid rgba(0,212,255,0.5)',
//                 backdropFilter: 'blur(20px)',
//                 boxShadow: '0 0 30px rgba(0,212,255,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
//               }}
//             >
//               {/* Shimmer sweep on hover */}
//               <div
//                 className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
//                 style={{
//                   background: 'linear-gradient(105deg, transparent 30%, rgba(0,212,255,0.15) 50%, transparent 70%)',
//                   transform: 'translateX(-100%)',
//                   animation: 'shimmerBtn 0.8s ease forwards',
//                 }}
//               />
//               <Zap size={17} className="text-cyan-400" />
//               <span className="font-mono font-bold text-cyan-300 text-sm tracking-wider uppercase">
//                 Join Forum
//               </span>
//               <ChevronRight size={15} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
//             </motion.div>
//           </Link>

//           {/* Secondary CTA */}
//           <Link to="/projects">
//             <motion.div
//               whileHover={{ scale: 1.04, y: -2 }}
//               whileTap={{ scale: 0.97 }}
//               className="group flex items-center gap-3 px-7 py-3.5 rounded-xl cursor-pointer"
//               style={{
//                 background: 'rgba(255,255,255,0.03)',
//                 border: '1px solid rgba(167,139,250,0.35)',
//                 backdropFilter: 'blur(20px)',
//                 boxShadow: '0 0 20px rgba(167,139,250,0.08)',
//               }}
//             >
//               <Rocket size={17} className="text-purple-400" />
//               <span className="font-mono font-bold text-purple-300 text-sm tracking-wider uppercase">
//                 Explore Projects
//               </span>
//               <ChevronRight size={15} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
//             </motion.div>
//           </Link>
//         </motion.div>

//         {/* ── Stats row ── */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
//           transition={{ duration: 0.9, delay: 1.3 }}
//           className="mt-16 grid grid-cols-3 gap-6 sm:gap-12 max-w-xl mx-auto"
//         >
//           {[
//             { value: '120+', label: 'Engineers' },
//             { value: '50+', label: 'Projects' },
//             { value: '8+', label: 'Years' },
//           ].map(({ value, label }) => (
//             <div key={label} className="text-center">
//               <p
//                 className="text-2xl sm:text-3xl font-black font-mono"
//                 style={{
//                   background: 'linear-gradient(135deg, #00d4ff, #22d3ee)',
//                   WebkitBackgroundClip: 'text',
//                   WebkitTextFillColor: 'transparent',
//                   backgroundClip: 'text',
//                   filter: 'drop-shadow(0 0 10px rgba(0,212,255,0.5))',
//                 }}
//               >
//                 {value}
//               </p>
//               <p className="text-xs font-mono tracking-widest text-cyan-400/50 uppercase mt-1">
//                 {label}
//               </p>
//             </div>
//           ))}
//         </motion.div>

//         {/* ── Holographic floating tech symbol cards ── */}
//         <motion.div
//           style={{ x: layer2X, y: layer2Y }}
//           className="absolute inset-0 pointer-events-none"
//         >
//           {[
//             { icon: '⬡', x: '8%', y: '20%', size: '1.5rem', delay: 0.2 },
//             { icon: '◈', x: '88%', y: '18%', size: '1.2rem', delay: 0.5 },
//             { icon: '⬡', x: '92%', y: '72%', size: '1rem', delay: 0.8 },
//             { icon: '◉', x: '5%', y: '78%', size: '1.4rem', delay: 1.1 },
//             { icon: '▲', x: '15%', y: '50%', size: '0.8rem', delay: 0.6 },
//             { icon: '◈', x: '82%', y: '48%', size: '1rem', delay: 0.3 },
//           ].map((sym, i) => (
//             <motion.div
//               key={i}
//               className="absolute font-mono select-none"
//               style={{ left: sym.x, top: sym.y, fontSize: sym.size, color: 'rgba(0,212,255,0.25)' }}
//               animate={{ y: ['0%', '-12%', '0%'], opacity: [0.2, 0.5, 0.2] }}
//               transition={{ duration: 4 + i, repeat: Infinity, delay: sym.delay, ease: 'easeInOut' }}
//             >
//               {sym.icon}
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* Corner decorative HUD brackets */}
//         {[
//           { pos: 'top-6 left-6', rot: '0deg' },
//           { pos: 'top-6 right-6', rot: '90deg' },
//           { pos: 'bottom-6 right-6', rot: '180deg' },
//           { pos: 'bottom-6 left-6', rot: '270deg' },
//         ].map(({ pos, rot }, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, scale: 0.5 }}
//             animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
//             transition={{ delay: 1.4 + i * 0.1, duration: 0.6 }}
//             className={`absolute ${pos} w-10 h-10 pointer-events-none`}
//             style={{ transform: `rotate(${rot})` }}
//           >
//             <div
//               className="w-full h-full"
//               style={{
//                 borderTop: '2px solid rgba(0,212,255,0.4)',
//                 borderLeft: '2px solid rgba(0,212,255,0.4)',
//                 boxShadow: '-2px -2px 8px rgba(0,212,255,0.15)',
//               }}
//             />
//           </motion.div>
//         ))}

//         {/* Scroll indicator */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={isInView ? { opacity: 1 } : { opacity: 0 }}
//           transition={{ delay: 1.8 }}
//           className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
//         >
//           <span className="text-[10px] font-mono tracking-[0.3em] text-cyan-400/40 uppercase">Scroll</span>
//           <motion.div
//             animate={{ y: [0, 8, 0] }}
//             transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
//             className="w-px h-8"
//             style={{ background: 'linear-gradient(to bottom, rgba(0,212,255,0.5), transparent)' }}
//           />
//         </motion.div>
//       </div>

//       {/* Shimmer keyframe for button */}
//       <style>{`
//         @keyframes shimmerBtn {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(200%); }
//         }
//       `}</style>
//     </section>
//   );
// }
