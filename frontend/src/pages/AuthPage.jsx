import { useState, useEffect, useRef } from 'react';
import LoginComponent from '../components/LoginForm';
import RegisterComponent from '../components/RegisterForm';
const ParticleField = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let raf;

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.6 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        g.addColorStop(0, `rgba(120,220,255,${p.alpha})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });
      // connect nearby
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(100,200,255,${0.08 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

// ─── Glitch Text ────────────────────────────────────────────────────────────
const GlitchText = ({ children, className = '' }) => (
  <span className={`relative inline-block ${className}`} style={{ fontFamily: "'Space Mono', monospace" }}>
    <span className="relative z-10">{children}</span>
    <span aria-hidden className="absolute inset-0 text-cyan-400 opacity-0 hover:opacity-60 transition-opacity duration-75"
      style={{ clipPath: 'inset(30% 0 50% 0)', transform: 'translateX(-2px)', mixBlendMode: 'screen' }}>
      {children}
    </span>
  </span>
);

// ─── Input ───────────────────────────────────────────────────────────────────
const FuturisticInput = ({ label, type = 'text', icon, value, onChange, placeholder }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative group">
      <label style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em' }}
        className="block text-cyan-400/70 uppercase mb-1.5 ml-1">{label}</label>
      <div className={`relative flex items-center transition-all duration-300 ${focused ? 'scale-[1.01]' : ''}`}>
        {/* border glow */}
        <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
          focused
            ? 'shadow-[0_0_0_1px_rgba(34,211,238,0.7),0_0_18px_rgba(34,211,238,0.25)]'
            : 'shadow-[0_0_0_1px_rgba(34,211,238,0.2)]'
        }`} />
        <span className="absolute left-3.5 text-cyan-400/50 text-sm z-10" style={{ fontSize: '0.85rem' }}>{icon}</span>
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="w-full bg-slate-900/60 text-cyan-50 rounded-xl pl-9 pr-4 py-3 text-sm outline-none placeholder-slate-600 backdrop-blur-sm"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.82rem' }}
        />
        {focused && (
          <span className="absolute right-3.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        )}
      </div>
    </div>
  );
};

// ─── Button ───────────────────────────────────────────────────────────────────
const NeonButton = ({ children, onClick, loading = false }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <button onClick={onClick}
      onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)}
      className={`relative w-full py-3.5 rounded-xl font-semibold text-sm tracking-widest uppercase overflow-hidden group transition-all duration-200 ${
        pressed ? 'scale-[0.98]' : 'hover:scale-[1.01]'
      }`}
      style={{ fontFamily: "'Space Mono', monospace" }}>
      {/* base */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 opacity-90 group-hover:opacity-100 transition-opacity" />
      {/* shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      {/* glow */}
      <div className="absolute inset-0 shadow-[0_0_30px_rgba(34,211,238,0.5)] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
      <span className="relative z-10 text-slate-950 flex items-center justify-center gap-2">
        {loading ? (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : children}
      </span>
    </button>
  );
};

// ─── Login Panel ─────────────────────────────────────────────────────────────
const Login = ({ onSwitch }) => {
  return (
    <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center space-y-6">
      <div>
        <p className="text-cyan-400/60 text-xs tracking-[0.3em] uppercase mb-1" style={{ fontFamily: "'Space Mono', monospace" }}>
          &gt; access terminal
        </p>
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
          Sign In
        </h2>
      </div>
      <LoginComponent onSwitch={onSwitch} />
    </div>
  );
};

// ─── Register Panel ───────────────────────────────────────────────────────────
const Register = ({ onSwitch }) => {
  return (
    <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center space-y-5">
      <div>
        <p className="text-cyan-400/60 text-xs tracking-[0.3em] uppercase mb-1" style={{ fontFamily: "'Space Mono', monospace" }}>
          &gt; new node
        </p>
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
          Create Account
        </h2>
      </div>
      <RegisterComponent onSwitch={onSwitch} />
    </div>
  );
};

// ─── Main AuthPage ─────────────────────────────────────────────────────────────
export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;700;800&display=swap');

        .auth-bg {
          background: radial-gradient(ellipse at 20% 50%, #0a0f1e 0%, #050810 60%, #000 100%);
        }
        .hex-grid {
          background-image:
            repeating-linear-gradient(60deg, rgba(34,211,238,0.03) 0px, rgba(34,211,238,0.03) 1px, transparent 1px, transparent 30px),
            repeating-linear-gradient(120deg, rgba(34,211,238,0.03) 0px, rgba(34,211,238,0.03) 1px, transparent 1px, transparent 30px),
            repeating-linear-gradient(0deg, rgba(34,211,238,0.03) 0px, rgba(34,211,238,0.03) 1px, transparent 1px, transparent 30px);
        }
        .nebula-1 {
          background: radial-gradient(ellipse, rgba(34,211,238,0.08) 0%, transparent 60%);
          animation: drift1 20s ease-in-out infinite;
        }
        .nebula-2 {
          background: radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 60%);
          animation: drift2 27s ease-in-out infinite;
        }
        .nebula-3 {
          background: radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 55%);
          animation: drift1 34s ease-in-out infinite reverse;
        }
        @keyframes drift1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(2%,3%) scale(1.05); }
          66% { transform: translate(-2%,-1%) scale(0.97); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          40% { transform: translate(-3%,2%) scale(1.08); }
          70% { transform: translate(2%,-2%) scale(0.95); }
        }
        .scanlines::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.04) 2px,
            rgba(0,0,0,0.04) 4px
          );
          pointer-events: none;
        }
        .card-glow {
          box-shadow:
            0 0 0 1px rgba(34,211,238,0.12),
            0 0 60px rgba(34,211,238,0.06),
            0 30px 80px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(34,211,238,0.08);
        }
        .brand-panel {
          background: linear-gradient(135deg,
            rgba(5,12,35,0.95) 0%,
            rgba(10,15,40,0.9) 50%,
            rgba(15,10,50,0.85) 100%
          );
          position: relative;
          overflow: hidden;
        }
        .brand-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 80% 20%, rgba(34,211,238,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, rgba(99,102,241,0.1) 0%, transparent 50%);
        }
        .form-panel {
          background: rgba(5,8,20,0.85);
          backdrop-filter: blur(20px);
        }
        .circuit-line {
          position: absolute;
          background: linear-gradient(90deg, transparent, rgba(34,211,238,0.3), transparent);
          height: 1px;
          animation: scan 4s ease-in-out infinite;
        }
        @keyframes scan {
          0% { width: 0; left: 0; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { width: 100%; left: 0; opacity: 0; }
        }
        .corner-bracket {
          position: absolute;
          width: 14px; height: 14px;
          border-color: rgba(34,211,238,0.5);
          border-style: solid;
        }
        .slide-up {
          animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tag-blink::after {
          content: '█';
          animation: blink 1s step-end infinite;
          color: rgba(34,211,238,0.7);
          margin-left: 1px;
        }
        @keyframes blink { 50% { opacity: 0; } }
        .logo-pulse {
          animation: logoPulse 3s ease-in-out infinite;
        }
        @keyframes logoPulse {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(34,211,238,0.5)); }
          50% { filter: drop-shadow(0 0 12px rgba(34,211,238,0.9)); }
        }
        .metric-card {
          background: rgba(34,211,238,0.04);
          border: 1px solid rgba(34,211,238,0.1);
          border-radius: 12px;
        }
        .metric-card:hover {
          border-color: rgba(34,211,238,0.3);
          background: rgba(34,211,238,0.07);
        }
        .ring {
          animation: ringPulse 2s ease-out infinite;
        }
        @keyframes ringPulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          70% { transform: scale(1.3); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        .tab-active {
          color: #22d3ee;
          border-bottom: 1px solid #22d3ee;
          text-shadow: 0 0 8px rgba(34,211,238,0.6);
        }
        .tab-inactive {
          color: rgba(100,120,150,0.8);
        }
        .tab-inactive:hover { color: rgba(150,200,220,0.9); }
      `}</style>

      <div className={`auth-bg hex-grid h-screen w-screen overflow-hidden flex items-center justify-center relative transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

        {/* Particle field */}
        <div className="absolute inset-0">
          <ParticleField />
        </div>

        {/* Nebula blobs */}
        <div className="nebula-1 absolute top-[-10%] left-[-5%] w-[60vmax] h-[60vmax]" />
        <div className="nebula-2 absolute bottom-[-15%] right-[-5%] w-[70vmin] h-[70vmin]" />
        <div className="nebula-3 absolute top-[20%] right-[20%] w-[50vmin] h-[50vmin]" />

        {/* Main card */}
        <div className={`relative w-full max-w-5xl mx-4 md:mx-8 slide-up scanlines`}
          style={{ animationDelay: '0.15s' }}>

          {/* Corner brackets on card */}
          <div className="corner-bracket top-0 left-0 border-t-2 border-l-2 rounded-tl-md" style={{ borderRadius: '4px 0 0 0' }} />
          <div className="corner-bracket top-0 right-0 border-t-2 border-r-2" style={{ borderRadius: '0 4px 0 0' }} />
          <div className="corner-bracket bottom-0 left-0 border-b-2 border-l-2" style={{ borderRadius: '0 0 0 4px' }} />
          <div className="corner-bracket bottom-0 right-0 border-b-2 border-r-2" style={{ borderRadius: '0 0 4px 0' }} />

          <div className="card-glow rounded-[2rem] flex flex-col md:flex-row overflow-hidden">

            {/* ── BRAND PANEL ── */}
            <div className="brand-panel w-full md:w-[44%] p-8 lg:p-10 flex flex-col justify-between">

              {/* Animated scan line */}
              <div className="circuit-line" style={{ top: '35%', animationDelay: '1s' }} />
              <div className="circuit-line" style={{ top: '65%', animationDelay: '2.5s' }} />

              {/* Logo */}
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  {/* Logo icon */}
                  <div className="relative w-9 h-9 logo-pulse">
                    <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
                      <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" stroke="rgba(34,211,238,0.9)" strokeWidth="1.5" fill="rgba(34,211,238,0.08)" />
                      <polygon points="18,8 28,13 28,23 18,28 8,23 8,13" stroke="rgba(99,102,241,0.7)" strokeWidth="1" fill="rgba(99,102,241,0.05)" />
                      <circle cx="18" cy="18" r="4" fill="rgba(34,211,238,0.8)" />
                    </svg>
                    {/* Pulse ring */}
                    <div className="ring absolute inset-0 rounded-full border border-cyan-400/40" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                      iris<span className="text-cyan-400">HR</span>
                    </span>
                    <div className="text-[9px] text-cyan-400/40 tracking-[0.25em] uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
                      v2.4.1 · online
                    </div>
                  </div>
                </div>
              </div>

              {/* Headline */}
              <div className="relative z-10 mt-6">
                <div className="text-cyan-400/50 text-[10px] tracking-[0.4em] uppercase mb-3" style={{ fontFamily: "'Space Mono', monospace" }}>
                  // people ops platform
                </div>
                <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                  where talent<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-400">
                    meets clarity
                  </span>
                </h1>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-xs" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.78rem' }}>
                  Smart people operations, simplified. One auth layer for your entire HR universe.
                </p>
              </div>

              {/* Stats */}
              <div className="relative z-10 grid grid-cols-3 gap-2 mt-6">
                {[
                  { val: '12k+', label: 'users' },
                  { val: '99.9%', label: 'uptime' },
                  { val: '140ms', label: 'latency' },
                ].map(s => (
                  <div key={s.label} className="metric-card p-2.5 text-center transition-all duration-200 cursor-default">
                    <div className="text-base font-bold text-cyan-300" style={{ fontFamily: "'Syne', sans-serif" }}>{s.val}</div>
                    <div className="text-[9px] text-slate-600 uppercase tracking-wider mt-0.5" style={{ fontFamily: "'Space Mono', monospace" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="relative z-10 mt-5 p-4 rounded-2xl border border-slate-700/60 bg-white/[0.02]">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-slate-900 shrink-0 mt-0.5"
                    style={{ fontFamily: "'Space Mono', monospace" }}>JD</div>
                  <div>
                    <p className="text-xs text-slate-400 leading-relaxed italic" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.72rem' }}>
                      "Finally an HR interface that feels like a modern tool — not a spreadsheet from 2010."
                    </p>
                    <p className="mt-1.5 text-[9px] text-cyan-400/60 tracking-wider uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
                      Jamie · people lead
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="relative z-10 flex items-center gap-2 mt-5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] text-slate-600 tracking-widest uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
                  ISO 27001 · end-to-end encrypted
                </span>
              </div>
            </div>

            {/* ── FORM PANEL ── */}
            <div className="form-panel flex-1 flex flex-col">
              {/* Tabs */}
              <div className="flex border-b border-slate-800">
                {[
                  { label: 'sign_in', active: isLogin, fn: () => setIsLogin(true) },
                  { label: 'register', active: !isLogin, fn: () => setIsLogin(false) },
                ].map(tab => (
                  <button key={tab.label} onClick={tab.fn}
                    className={`flex-1 py-4 text-xs tracking-[0.2em] uppercase transition-all duration-200 ${tab.active ? 'tab-active' : 'tab-inactive'}`}
                    style={{ fontFamily: "'Space Mono', monospace" }}>
                    {tab.active && <span className="mr-1.5 text-cyan-400/60">&gt;</span>}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Form */}
              <div className="overflow-hidden flex-1">
                <div className={`transition-all duration-500 ${isLogin ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 absolute pointer-events-none'}`}>
                  {isLogin && <Login onSwitch={() => setIsLogin(false)} />}
                </div>
                <div className={`transition-all duration-500 ${!isLogin ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute pointer-events-none'}`}>
                  {!isLogin && <Register onSwitch={() => setIsLogin(true)} />}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;