import { useState, useEffect, useRef } from "react";

/* ============================================================
   DANAR CAPITAL — Black × Gold × Slate
   Ultra-Luxury Gulf Trading Ecosystem
   ============================================================ */

// ── Color Tokens ─────────────────────────────────────────────
const C = {
  bg0:      "#080808",        // deepest black
  bg1:      "#0E0E0E",        // card black
  bg2:      "#141414",        // elevated surface
  bg3:      "#1A1A1A",        // hover surface
  gold:     "#C9A84C",        // primary gold
  goldBright:"#E8C96A",       // highlight gold
  goldDim:  "#7A6328",        // muted gold
  goldGlow: "rgba(201,168,76,0.18)",
  slate:    "#6B7280",        // mid slate
  slateDim: "#374151",        // dark slate
  slateLight:"#9CA3AF",       // light slate
  white:    "#F5F0E8",        // warm white
  whiteDim: "#A89F90",        // dimmed warm white
  border:   "rgba(201,168,76,0.12)",
  borderBright:"rgba(201,168,76,0.3)",
  green:    "#4ADE80",
  red:      "#F87171",
};

// ── Intersection Observer ────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── Counter ──────────────────────────────────────────────────
function useCounter(target, duration = 2400, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0 = null;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(e * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return count;
}

// ── Particle Canvas ──────────────────────────────────────────
function GoldParticles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let raf;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const N = 60;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.2 + .4,
      o: Math.random() * .5 + .15,
    }));
    let mx = -999, my = -999;
    c.addEventListener("mousemove", e => { const r = c.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > c.width) p.vx *= -1;
        if (p.y < 0 || p.y > c.height) p.vy *= -1;
        const dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy);
        if (d < 140) { p.x += dx * .008; p.y += dy * .008; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.o})`; ctx.fill();
      });
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.hypot(dx, dy);
        if (d < 110) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(201,168,76,${.1 * (1 - d / 110)})`; ctx.lineWidth = .6; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

// ── Live Ticker ──────────────────────────────────────────────
const TICKERS = [
  { sym: "XAUUSD", val: "2,384.50", chg: "+1.82%", up: true },
  { sym: "EURUSD", val: "1.0842",   chg: "-0.23%", up: false },
  { sym: "GBPUSD", val: "1.2715",   chg: "+0.41%", up: true },
  { sym: "USDJPY", val: "157.34",   chg: "+0.18%", up: true },
  { sym: "USOIL",  val: "78.62",    chg: "-1.05%", up: false },
  { sym: "BTCUSD", val: "67,420",   chg: "+2.34%", up: true },
  { sym: "SP500",  val: "5,432",    chg: "+0.67%", up: true },
  { sym: "XAGUSD", val: "28.14",    chg: "+0.93%", up: true },
];

function LiveTicker() {
  const doubled = [...TICKERS, ...TICKERS];
  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.bg1, padding: "10px 0" }}>
      <div style={{ display: "flex", animation: "ticker 28s linear infinite", width: "max-content" }}>
        {doubled.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 28px", borderRight: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: ".08em", fontFamily: "'DM Mono',monospace" }}>{t.sym}</span>
            <span style={{ fontSize: 12, color: C.white, fontFamily: "'DM Mono',monospace" }}>{t.val}</span>
            <span style={{ fontSize: 11, color: t.up ? C.green : C.red, fontWeight: 600 }}>{t.chg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Gold Button ───────────────────────────────────────────────
function GoldBtn({ children, href, solid, onClick, style }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href || "#"} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        padding: "13px 30px", borderRadius: 4, cursor: "pointer",
        fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: 14, fontWeight: 700,
        textDecoration: "none", letterSpacing: ".03em",
        transition: "all .3s cubic-bezier(.4,0,.2,1)",
        ...(solid ? {
          background: hov
            ? `linear-gradient(135deg,${C.goldBright},${C.gold})`
            : `linear-gradient(135deg,${C.gold},#A8873A)`,
          color: "#080808",
          boxShadow: hov ? `0 0 32px rgba(201,168,76,.5), 0 6px 24px rgba(0,0,0,.6)` : `0 4px 16px rgba(201,168,76,.25)`,
          transform: hov ? "translateY(-2px)" : "none",
        } : {
          background: hov ? "rgba(201,168,76,0.06)" : "transparent",
          color: hov ? C.goldBright : C.slateLight,
          border: `1px solid ${hov ? C.borderBright : C.border}`,
          transform: hov ? "translateY(-2px)" : "none",
        }),
        ...style,
      }}>{children}</a>
  );
}

// ── Floating Metric Card ──────────────────────────────────────
function MetricCard({ label, value, change, up = true, style, delay = 0 }) {
  return (
    <div style={{
      ...style, position: "absolute",
      background: "rgba(14,14,14,0.92)", backdropFilter: "blur(24px)",
      border: `1px solid ${C.border}`, borderRadius: 8,
      padding: "14px 18px", minWidth: 150,
      animation: `floatCard 7s ease-in-out ${delay}s infinite`,
      boxShadow: `0 8px 40px rgba(0,0,0,.7), inset 0 1px 0 rgba(201,168,76,.08)`,
    }}>
      <div style={{ fontSize: 10, color: C.slate, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.white, fontFamily: "'DM Mono',monospace", marginBottom: 4 }}>{value}</div>
      {change && <div style={{ fontSize: 11, color: up ? C.green : C.red, display: "flex", alignItems: "center", gap: 3 }}><span>{up ? "▲" : "▼"}</span>{change}</div>}
    </div>
  );
}

// ── Section Reveal ────────────────────────────────────────────
function Reveal({ children, delay = 0, style }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : "translateY(36px)",
      transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

// ── Section Label ─────────────────────────────────────────────
function Label({ children }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ width: 20, height: 1, background: C.gold }} />
      <span style={{ fontSize: 11, color: C.gold, letterSpacing: ".18em", fontWeight: 700, textTransform: "uppercase" }}>{children}</span>
      <div style={{ width: 20, height: 1, background: C.gold }} />
    </div>
  );
}

// ── Service Card ──────────────────────────────────────────────
function SvcCard({ icon, title, desc, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: hov ? C.bg2 : C.bg1,
      border: `1px solid ${hov ? C.borderBright : C.border}`,
      borderRadius: 8, padding: "32px 26px", cursor: "pointer",
      transition: "all .35s cubic-bezier(.4,0,.2,1)",
      transform: hov ? "translateY(-6px)" : "none",
      boxShadow: hov ? `0 24px 60px rgba(0,0,0,.8), 0 0 0 1px rgba(201,168,76,.1)` : "none",
      position: "relative", overflow: "hidden",
    }}>
      {hov && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />}
      <div style={{
        width: 50, height: 50, borderRadius: 8, marginBottom: 22,
        background: C.goldGlow, border: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
        boxShadow: hov ? `0 0 24px rgba(201,168,76,.25)` : "none", transition: "box-shadow .35s",
      }}>{icon}</div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 10, fontFamily: "'IBM Plex Sans Arabic',sans-serif" }}>{title}</h3>
      <p style={{ fontSize: 13, color: C.slate, lineHeight: 1.75, fontFamily: "'IBM Plex Sans Arabic',sans-serif" }}>{desc}</p>
    </div>
  );
}

// ── Stat ──────────────────────────────────────────────────────
function Stat({ target, suffix, prefix, label, inView }) {
  const n = useCounter(target, 2400, inView);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 48, fontWeight: 800, fontFamily: "'DM Mono',monospace", color: C.gold, lineHeight: 1 }}>{prefix}{n.toLocaleString()}{suffix}</div>
      <div style={{ fontSize: 13, color: C.slate, marginTop: 8, letterSpacing: ".05em", fontFamily: "'IBM Plex Sans Arabic',sans-serif" }}>{label}</div>
    </div>
  );
}

// ── Testimonial ───────────────────────────────────────────────
function Testi({ name, role, text, result, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: hov ? C.bg2 : C.bg1,
      border: `1px solid ${hov ? C.borderBright : C.border}`,
      borderRadius: 8, padding: "26px 22px",
      transition: "all .3s", transform: hov ? "translateY(-4px)" : "none",
    }}>
      <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
        {[...Array(5)].map((_, i) => <span key={i} style={{ color: C.gold, fontSize: 13 }}>★</span>)}
      </div>
      <p style={{ fontSize: 13, color: C.slateLight, lineHeight: 1.8, marginBottom: 18, fontFamily: "'IBM Plex Sans Arabic',sans-serif", direction: "rtl" }}>"{text}"</p>
      {result && (
        <div style={{ display: "inline-block", padding: "5px 12px", background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 4, marginBottom: 14 }}>
          <span style={{ color: C.green, fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>+{result}</span>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${C.gold},${C.goldDim})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#080808" }}>{name[0]}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: "'IBM Plex Sans Arabic',sans-serif" }}>{name}</div>
          <div style={{ fontSize: 11, color: C.slate, fontFamily: "'IBM Plex Sans Arabic',sans-serif" }}>{role}</div>
        </div>
      </div>
    </div>
  );
}

// ── Performance Chart ─────────────────────────────────────────
function PerfChart({ active }) {
  const ref = useRef(null);
  const data = [5,11,8,19,15,27,23,35,30,44,40,52,48,61,58,72,68,80,77,88,85,95];
  useEffect(() => {
    if (!active) return;
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const W = c.width, H = c.height, pad = 24;
    const pts = data.map((v, i) => ({ x: pad + (i / (data.length - 1)) * (W - pad * 2), y: H - pad - (v / 100) * (H - pad * 2) }));
    let prog = 0;
    const anim = () => {
      ctx.clearRect(0, 0, W, H);
      prog = Math.min(prog + .018, 1);
      const cnt = Math.floor(prog * (pts.length - 1));
      const frac = prog * (pts.length - 1) - cnt;
      // grid
      for (let g = 0; g <= 4; g++) {
        const y = pad + (g / 4) * (H - pad * 2);
        ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y);
        ctx.strokeStyle = "rgba(107,114,128,.12)"; ctx.lineWidth = 1; ctx.stroke();
      }
      // fill
      const grd = ctx.createLinearGradient(0, 0, 0, H);
      grd.addColorStop(0, "rgba(201,168,76,.18)");
      grd.addColorStop(1, "rgba(201,168,76,0)");
      ctx.beginPath(); ctx.moveTo(pts[0].x, H - pad);
      pts.slice(0, cnt + 1).forEach(p => ctx.lineTo(p.x, p.y));
      if (cnt < pts.length - 1) {
        const ep = { x: pts[cnt].x + frac * (pts[cnt+1].x - pts[cnt].x), y: pts[cnt].y + frac * (pts[cnt+1].y - pts[cnt].y) };
        ctx.lineTo(ep.x, ep.y); ctx.lineTo(ep.x, H - pad);
      } else ctx.lineTo(pts[cnt].x, H - pad);
      ctx.closePath(); ctx.fillStyle = grd; ctx.fill();
      // line
      ctx.beginPath();
      pts.slice(0, cnt + 1).forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      if (cnt < pts.length - 1) {
        const ep = { x: pts[cnt].x + frac * (pts[cnt+1].x - pts[cnt].x), y: pts[cnt].y + frac * (pts[cnt+1].y - pts[cnt].y) };
        ctx.lineTo(ep.x, ep.y);
      }
      ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.stroke();
      // dot
      const lp = cnt < pts.length - 1
        ? { x: pts[cnt].x + frac * (pts[cnt+1].x - pts[cnt].x), y: pts[cnt].y + frac * (pts[cnt+1].y - pts[cnt].y) }
        : pts[cnt];
      ctx.beginPath(); ctx.arc(lp.x, lp.y, 5, 0, Math.PI * 2); ctx.fillStyle = C.gold; ctx.fill();
      ctx.beginPath(); ctx.arc(lp.x, lp.y, 10, 0, Math.PI * 2); ctx.fillStyle = "rgba(201,168,76,.2)"; ctx.fill();
      if (prog < 1) requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
  }, [active]);
  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ── Navbar ────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["الرئيسية","الخدمات","الأداء","الأكاديمية","المجتمع","التواصل"];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: scrolled ? "10px 0" : "18px 0",
      background: scrolled ? "rgba(8,8,8,.96)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition: "all .4s cubic-bezier(.4,0,.2,1)",
    }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 6, background: `linear-gradient(135deg,${C.gold},${C.goldDim})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px rgba(201,168,76,.4)` }}>
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: "none", stroke: "#080808", strokeWidth: 2.5 }}>
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: C.white, letterSpacing: ".02em", lineHeight: 1 }}>DANAR</div>
            <div style={{ fontSize: 8, color: C.gold, letterSpacing: ".28em", fontWeight: 600 }}>CAPITAL</div>
          </div>
        </div>
        {/* Links */}
        <div style={{ display: "flex", gap: 2 }}>
          {links.map(l => (
            <a key={l} href="#" style={{ padding: "8px 14px", fontSize: 13, color: C.slate, textDecoration: "none", borderRadius: 4, fontFamily: "'IBM Plex Sans Arabic',sans-serif", transition: "color .2s" }}
              onMouseEnter={e => e.target.style.color = C.white} onMouseLeave={e => e.target.style.color = C.slate}>{l}</a>
          ))}
        </div>
        <GoldBtn solid href="https://www.xtb.com/ar/live-account/?partnerId=7794172" style={{ fontSize: 13, padding: "10px 22px" }}>ابدأ الآن</GoldBtn>
      </div>
    </nav>
  );
}

// ── Floating Social ───────────────────────────────────────────
function Social() {
  const items = [
    { icon: "𝕏",  href: "https://x.com/Danar_Capital" },
    { icon: "📸", href: "https://www.instagram.com/danarcapital/" },
    { icon: "💼", href: "https://www.linkedin.com/company/danar-capital/" },
    { icon: "👻", href: "https://snapchat.com/t/dTiudKnV" },
    { icon: "🎵", href: "https://www.tiktok.com/@danar.capital" },
  ];
  return (
    <div style={{ position: "fixed", left: 18, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 6, zIndex: 800 }}>
      {items.map((s, i) => (
        <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{
          width: 34, height: 34, borderRadius: 6,
          background: "rgba(20,20,20,.9)", border: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
          textDecoration: "none", backdropFilter: "blur(8px)",
          transition: "all .25s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderBright; e.currentTarget.style.background = C.goldGlow; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "rgba(20,20,20,.9)"; }}
        >{s.icon}</a>
      ))}
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function DanarCapital() {
  const [statsRef, statsInView] = useInView(.3);
  const [chartRef, chartInView] = useInView(.3);

  const services = [
    { icon: "📡", title: "إشارات التداول", desc: "إشارات احترافية مبنية على تحليل دقيق مع إدارة واضحة للمخاطر في كل صفقة." },
    { icon: "📊", title: "تحليل السوق", desc: "تحليل يومي للأسواق بأسلوب مؤسسي يشمل الفوركس، الذهب، والأسهم الخليجية." },
    { icon: "💼", title: "المحفظة الاستثمارية", desc: "محافظ مُدارة بمنهجية مؤسسية لحفظ رأس المال وتحقيق نمو مستدام طويل الأمد." },
    { icon: "🎓", title: "الأكاديمية التعليمية", desc: "برامج تعليمية من الصفر حتى الاحتراف مع محتوى حصري ومتابعة شخصية." },
    { icon: "🎯", title: "الجلسات المباشرة", desc: "جلسات تداول مباشرة أسبوعية مع خبراء لمناقشة الأسواق وتحليل الفرص." },
    { icon: "🤝", title: "مجتمع النخبة", desc: "شبكة حصرية من المتداولين الخليجيين للتبادل المعرفي والدعم المستمر." },
  ];

  const testimonials = [
    { name: "خالد العتيبي", role: "مستثمر — الكويت",   text: "منذ انضمامي لدانار تغير أسلوبي في الاستثمار كلياً. التحليل والتعليم على مستوى مؤسسي حقيقي.", result: "38% عائد سنوي" },
    { name: "سارة الزهراني", role: "متداولة — الرياض",  text: "أخيراً منصة خليجية تفهم سوقنا وتتحدث بلغتنا. التحليلات دقيقة والمجتمع داعم بشكل حقيقي.", result: "27% عائد سنوي" },
    { name: "فهد الدوسري",  role: "رجل أعمال — الدوحة", text: "المحفظة الاستثمارية حققت عائداً ثابتاً مع إدارة مخاطر احترافية. ما كنت أبحث عنه منذ سنوات.", result: "44% عائد سنوي" },
    { name: "محمد البلوشي", role: "متداول — مسقط",      text: "الجلسات المباشرة غيّرت طريقة تداولي كلياً. شرح معمّق وإجابة على كل سؤال.", result: "31% عائد سنوي" },
    { name: "نورة الخالد",  role: "مديرة مالية — أبوظبي", text: "مستوى الاحترافية مذهل. من التحليلات إلى الدعم المستمر — استثماري الأفضل كان الانضمام هنا.", result: "52% عائد سنوي" },
    { name: "عبدالله الشمري", role: "مهندس — الكويت",  text: "بدأت كمبتدئ تام. الأكاديمية أوصلتني لمستوى أتداول فيه بثقة وانضباط حقيقي.", result: "19% عائد سنوي" },
  ];

  const eduSteps = [
    { lvl: "BEGINNER", ar: "مبتدئ", color: C.green,  items: ["أساسيات أسواق المال", "فهم الفوركس والذهب", "قراءة الرسوم البيانية", "أساسيات إدارة المخاطر", "بناء خطة التداول الأولى"] },
    { lvl: "INTERMEDIATE", ar: "متوسط", color: C.gold, items: ["التحليل الفني المتقدم", "الشموع اليابانية", "التحليل الأساسي", "استراتيجيات الدخول والخروج", "تحليل حجم التداول"] },
    { lvl: "ADVANCED",  ar: "متقدم", color: "#BF5FFF", items: ["منهجية المؤسسات المالية", "بناء المحافظ", "تحليل السيولة", "إدارة المخاطر المتقدمة", "نظام التداول الاحترافي"] },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;0,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${C.bg0}; color: ${C.white}; font-family: 'IBM Plex Sans Arabic', sans-serif; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: ${C.bg0}; }
        ::-webkit-scrollbar-thumb { background: ${C.goldDim}; border-radius: 2px; }

        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes floatCard {
          0%,100% { transform: translateY(0) rotate(0deg); }
          40%  { transform: translateY(-14px) rotate(.4deg); }
          70%  { transform: translateY(-7px) rotate(-.2deg); }
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:none; } }
        @keyframes pulseGold { 0%,100% { box-shadow: 0 0 0 0 rgba(201,168,76,.4); } 50% { box-shadow: 0 0 0 12px rgba(201,168,76,0); } }
        @keyframes rotateCW  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes rotateCCW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes shimmerGold {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes liveDot { 0%,100% { opacity:1; } 50% { opacity:.3; } }

        .fade-hero-1 { animation: fadeUp .9s ease .2s both; }
        .fade-hero-2 { animation: fadeUp .9s ease .4s both; }
        .fade-hero-3 { animation: fadeUp .9s ease .6s both; }
        .fade-hero-4 { animation: fadeUp .9s ease .8s both; }
      `}</style>

      <Navbar />
      <Social />

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: C.bg0 }}>
        {/* Background: subtle gold radials */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 60% at 60% 0%, rgba(201,168,76,.07) 0%, transparent 60%)` }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 50% 40% at 10% 70%, rgba(201,168,76,.04) 0%, transparent 55%)` }} />

        {/* Diagonal slate line accent */}
        <div style={{
          position: "absolute", top: 0, right: "35%", width: 1, height: "100%",
          background: `linear-gradient(transparent, ${C.border} 30%, ${C.border} 70%, transparent)`,
        }} />
        <div style={{
          position: "absolute", top: 0, right: "65%", width: 1, height: "100%",
          background: `linear-gradient(transparent, rgba(107,114,128,.06) 30%, rgba(107,114,128,.06) 70%, transparent)`,
        }} />

        {/* Particles */}
        <div style={{ position: "absolute", inset: 0 }}><GoldParticles /></div>

        {/* Orbital rings */}
        <div style={{ position: "absolute", top: "12%", right: "4%", width: 420, height: 420, borderRadius: "50%", border: `1px solid rgba(201,168,76,.08)`, animation: "rotateCW 35s linear infinite" }}>
          <div style={{ position: "absolute", top: -5, left: "50%", transform: "translateX(-50%)", width: 10, height: 10, borderRadius: "50%", background: C.gold, boxShadow: `0 0 16px ${C.gold}, 0 0 32px rgba(201,168,76,.4)`, animation: "pulseGold 2s infinite" }} />
        </div>
        <div style={{ position: "absolute", top: "18%", right: "8%", width: 290, height: 290, borderRadius: "50%", border: `1px solid rgba(107,114,128,.07)`, animation: "rotateCCW 25s linear infinite" }}>
          <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, borderRadius: "50%", background: C.slate, boxShadow: `0 0 12px ${C.slate}` }} />
        </div>

        {/* Floating cards */}
        <MetricCard label="XAUUSD — الذهب"   value="$2,384.50" change="1.82%" up   style={{ top: "22%", right: "3%" }}  delay={0}   />
        <MetricCard label="EUR / USD"         value="1.0842"    change="0.23%" up={false} style={{ top: "44%", right: "1%" }} delay={1.8} />
        <MetricCard label="المحفظة — شهر"    value="+47.3%"    style={{ bottom: "26%", right: "5%" }} delay={1}   />
        <MetricCard label="أعضاء المجتمع"    value="1,240+"    style={{ top: "28%", left: "3.5%" }} delay={.6}  />

        {/* Hero content */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", maxWidth: 1320, margin: "0 auto", padding: "140px 36px 80px", width: "100%", position: "relative", zIndex: 5 }}>
          <div style={{ maxWidth: 680, direction: "rtl" }}>

            {/* Badge */}
            <div className="fade-hero-1">
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 14px", borderRadius: 4, border: `1px solid ${C.border}`, background: C.goldGlow, marginBottom: 28 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, display: "inline-block", animation: "liveDot 1.6s infinite" }} />
                <span style={{ fontSize: 11, color: C.gold, letterSpacing: ".1em", fontWeight: 600 }}>المنظومة الاستثمارية الخليجية — منذ 2018</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="fade-hero-2" style={{ fontSize: "clamp(34px,4.5vw,64px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 22 }}>
              منصة استثمارية خليجية
              <br />
              <span style={{
                background: `linear-gradient(90deg, ${C.gold} 0%, ${C.goldBright} 40%, ${C.gold} 80%)`,
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                animation: "shimmerGold 4s linear infinite",
              }}>بمعايير المؤسسات العالمية</span>
            </h1>

            <p className="fade-hero-3" style={{ fontSize: 17, color: C.slateLight, lineHeight: 1.85, marginBottom: 40, maxWidth: 580 }}>
              نجمع التحليل والتعليم وإدارة المخاطر والمحافظ الاستثمارية في منظومة متكاملة صُممت خصيصاً للمستثمر الخليجي.
            </p>

            <div className="fade-hero-4" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <GoldBtn solid href="https://www.xtb.com/ar/live-account/?partnerId=7794172" style={{ fontSize: 15, padding: "14px 34px" }}>ابدأ الآن ←</GoldBtn>
              <GoldBtn href="#performance" style={{ fontSize: 15, padding: "14px 34px" }}>استكشف النتائج</GoldBtn>
            </div>

            {/* Trust row */}
            <div style={{ display: "flex", gap: 28, marginTop: 52, paddingTop: 28, borderTop: `1px solid ${C.border}`, flexWrap: "wrap" }}>
              {[["🛡️","إدارة مؤسسية للمخاطر"],["📊","شفافية كاملة"],["🌍","6 أسواق خليجية"]].map(([ic, lb]) => (
                <div key={lb} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{ic}</span>
                  <span style={{ fontSize: 12, color: C.slate }}>{lb}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 180, background: `linear-gradient(transparent,${C.bg0})` }} />
      </div>

      {/* ── LIVE TICKER ──────────────────────────────────────── */}
      <LiveTicker />

      {/* ══════════════════════════════════════════════════════
          TRUST STATS
      ══════════════════════════════════════════════════════ */}
      <div style={{ padding: "80px 0", background: C.bg1, borderBottom: `1px solid ${C.border}` }}>
        <div ref={statsRef} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 36px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 48 }}>
            <Stat target={2018} suffix="+"        label="تأسست عام"           inView={statsInView} />
            <Stat target={1240} suffix="+"        label="عضو في المجتمع"       inView={statsInView} />
            <Stat target={6}    suffix=""         label="أسواق خليجية"         inView={statsInView} />
            <Stat target={47}   suffix="%" prefix="+" label="متوسط العائد السنوي" inView={statsInView} />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          WHY DANAR
      ══════════════════════════════════════════════════════ */}
      <div style={{ padding: "110px 0" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

            {/* Left: text */}
            <Reveal>
              <div style={{ direction: "rtl" }}>
                <Label>لماذا دانار كابيتال</Label>
                <h2 style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.2, marginBottom: 18 }}>
                  ليست مجرد إشارات
                  <br /><span style={{ color: C.gold }}>منظومة متكاملة</span>
                </h2>
                <p style={{ fontSize: 15, color: C.slate, lineHeight: 1.85, marginBottom: 32 }}>
                  في دانار كابيتال نبني متداولين واعين ومستثمرين ناجحين من خلال التعليم والتحليل وإدارة المخاطر كأساس لكل قرار — لا للنتائج العشوائية.
                </p>
                <div style={{ padding: "20px 22px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ width: 3, height: 56, background: `linear-gradient(${C.gold},${C.goldDim})`, borderRadius: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, color: C.slate, marginBottom: 4 }}>الفلسفة الجوهرية</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: C.white }}>تداول بوعي. استثمر بثقة.</div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right: features */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { ic: "🛡️", t: "المخاطر أولاً دائماً",     d: "كل قرار يبدأ بتقييم المخاطر — هذا ما يميزنا عن مقدمي الإشارات العاديين." },
                { ic: "🔬", t: "تحليل مؤسسي",              d: "نطبق منهجيات أكبر صناديق التحوط والمؤسسات المالية العالمية." },
                { ic: "📚", t: "التعليم في صلب كل شيء",    d: "المتداول الواعي هو المتداول الناجح — التعليم ليس خياراً بل أساس." },
                { ic: "📈", t: "شفافية تامة في النتائج",    d: "نعرض أداءنا كما هو — لا مبالغات ولا وعود فارغة." },
                { ic: "🌐", t: "خبرة خليجية عميقة",        d: "فهم معمّق لأسواق المنطقة وظروفها الاقتصادية الفريدة." },
                { ic: "🏆", t: "مجتمع النخبة الاستثمارية", d: "شبكة من المستثمرين الخليجيين الذين يجمعهم الانضباط والتفوق." },
              ].map((f, i) => (
                <Reveal key={f.t} delay={i * .07}>
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start", direction: "rtl" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: C.goldGlow, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{f.ic}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 4 }}>{f.t}</div>
                      <div style={{ fontSize: 13, color: C.slate, lineHeight: 1.7 }}>{f.d}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SERVICES
      ══════════════════════════════════════════════════════ */}
      <div style={{ padding: "100px 0", background: C.bg1, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64, direction: "rtl" }}>
              <Label>خدماتنا</Label>
              <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 12 }}>منظومة خدمية <span style={{ color: C.gold }}>متكاملة</span></h2>
              <p style={{ fontSize: 15, color: C.slate }}>كل ما تحتاجه في رحلتك الاستثمارية — في مكان واحد</p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 20 }}>
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * .08}>
                <SvcCard {...s} delay={i * .08} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          PERFORMANCE
      ══════════════════════════════════════════════════════ */}
      <div id="performance" style={{ padding: "110px 0" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 60, alignItems: "center" }}>
            <Reveal>
              <div style={{ direction: "rtl" }}>
                <Label>الأداء والنتائج</Label>
                <h2 style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.2, marginBottom: 18 }}>
                  نتائج حقيقية
                  <br /><span style={{ color: C.gold }}>شفافية تامة</span>
                </h2>
                <p style={{ fontSize: 15, color: C.slate, lineHeight: 1.85, marginBottom: 36 }}>لا نخفي الخسائر ولا نضخم الأرباح. نعرض أداءنا كما هو — لأن ثقتك أهم من أي إحصاء.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {[
                    ["47%+","متوسط عائد سنوي"],
                    ["87%", "نسبة صفقات رابحة"],
                    ["1:3", "نسبة المخاطرة/العائد"],
                    ["5 سنوات","سجل أداء موثق"],
                  ].map(([v, l]) => (
                    <div key={l} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 16px" }}>
                      <div style={{ fontSize: 26, fontWeight: 800, color: C.gold, fontFamily: "'DM Mono',monospace" }}>{v}</div>
                      <div style={{ fontSize: 12, color: C.slate, marginTop: 4 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Chart box */}
            <Reveal delay={.15}>
              <div ref={chartRef} style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 28, height: 320 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, direction: "rtl" }}>
                  <span style={{ fontSize: 13, color: C.slate }}>نمو المحفظة (12 شهراً)</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.gold, fontFamily: "'DM Mono',monospace" }}>+95.2%</span>
                </div>
                <div style={{ height: 250 }}><PerfChart active={chartInView} /></div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          PORTFOLIO
      ══════════════════════════════════════════════════════ */}
      <div style={{ padding: "100px 0", background: C.bg1, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <Reveal>
            <div style={{ textAlign: "center", direction: "rtl", marginBottom: 60 }}>
              <Label>المحفظة الاستثمارية</Label>
              <h2 style={{ fontSize: 40, fontWeight: 900 }}>استثمار <span style={{ color: C.gold }}>بمعايير مؤسسية</span></h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {[
              { ic: "🛡️", t: "حفظ رأس المال",   d: "استراتيجيات متقدمة لحماية رأس مالك من تقلبات السوق" },
              { ic: "🌍", t: "تنويع ذكي",        d: "توزيع عبر أسواق وأصول متعددة لتقليل المخاطر" },
              { ic: "📈", t: "نمو مستدام",       d: "عوائد طويلة الأمد بمنهجية انضباطية مدروسة" },
              { ic: "⚖️", t: "توازن المخاطر",   d: "نسب مخاطرة/عائد محسوبة بدقة في كل قرار" },
            ].map((item, i) => (
              <Reveal key={item.t} delay={i * .1}>
                <div style={{ background: C.bg0, border: `1px solid ${C.border}`, borderRadius: 8, padding: "28px 22px", direction: "rtl", transition: "all .3s", cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderBright; e.currentTarget.style.background = C.bg2; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bg0; e.currentTarget.style.transform = "none"; }}
                >
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{item.ic}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: C.gold, marginBottom: 8 }}>{item.t}</h3>
                  <p style={{ fontSize: 13, color: C.slate, lineHeight: 1.7 }}>{item.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          EDUCATION
      ══════════════════════════════════════════════════════ */}
      <div style={{ padding: "110px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 36px" }}>
          <Reveal>
            <div style={{ textAlign: "center", direction: "rtl", marginBottom: 64 }}>
              <Label>الأكاديمية التعليمية</Label>
              <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 12 }}>مسار <span style={{ color: C.gold }}>تعليمي منظم</span></h2>
              <p style={{ fontSize: 15, color: C.slate }}>من الصفر حتى الاحتراف — برنامج شامل ومنظم</p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, position: "relative" }}>
            {/* Connector */}
            <div style={{ position: "absolute", top: "50%", left: "17%", right: "17%", height: 1, background: `linear-gradient(90deg,${C.green},${C.gold},#BF5FFF)`, opacity: .25 }} />
            {eduSteps.map((s, i) => (
              <Reveal key={s.lvl} delay={i * .1}>
                <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: "28px 22px", position: "relative", direction: "rtl", transition: "all .3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + "50"; e.currentTarget.style.transform = "translateY(-6px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; }}
                >
                  <div style={{ position: "absolute", top: -1, right: 24, background: s.color, color: "#080808", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", padding: "4px 12px", borderRadius: "0 0 6px 6px" }}>{s.lvl}</div>
                  <div style={{ marginTop: 16, marginBottom: 16, fontSize: 16, fontWeight: 700, color: C.white }}>{s.ar}</div>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {s.items.map((it, j) => (
                      <li key={j} style={{ display: "flex", alignItems: "center", gap: 10, flexDirection: "row-reverse" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: C.slate }}>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          LIVE SESSIONS
      ══════════════════════════════════════════════════════ */}
      <div style={{ padding: "100px 0", background: C.bg1, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 36px" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, direction: "rtl" }}>
              <div>
                <Label>الجلسات المباشرة</Label>
                <h2 style={{ fontSize: 36, fontWeight: 900 }}>جلسات <span style={{ color: C.gold }}>تداول مباشرة</span></h2>
              </div>
              <GoldBtn style={{ fontSize: 13 }}>عرض الجدول الكامل</GoldBtn>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18 }}>
            {[
              { day: "الأحد",    time: "9:00 م",  title: "تحليل الأسواق الأسبوعي",       type: "تحليل" },
              { day: "الثلاثاء", time: "8:30 م",  title: "جلسة تداول الذهب المباشرة",    type: "تداول مباشر" },
              { day: "الخميس",   time: "9:30 م",  title: "مراجعة المحافظ والنتائج",      type: "متابعة" },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * .1}>
                <div style={{ background: C.bg0, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24, direction: "rtl", transition: "all .3s", cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderBright; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 20, background: C.goldGlow, color: C.gold, fontWeight: 700, border: `1px solid ${C.border}` }}>{s.type}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, animation: "liveDot 1.5s infinite" }} />
                      <span style={{ fontSize: 11, color: C.green }}>مباشر</span>
                    </div>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: C.white }}>{s.title}</h3>
                  <div style={{ display: "flex", gap: 18, fontSize: 12, color: C.slate }}>
                    <span>📅 {s.day}</span><span>🕐 {s.time}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          COMMUNITY
      ══════════════════════════════════════════════════════ */}
      <div style={{ padding: "110px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 36px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>

            {/* Telegram mockup */}
            <Reveal>
              <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                {/* Header */}
                <div style={{ background: C.bg2, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${C.gold},${C.goldDim})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📊</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>DANAR CAPITAL Community</div>
                    <div style={{ fontSize: 11, color: C.green }}>1,240 عضو نشط</div>
                  </div>
                </div>
                {/* Messages */}
                <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { u: "أ.م", col: C.gold,  msg: "تحليل ممتاز للذهب اليوم! الهدف الأول وصل 🎯", t: "09:14" },
                    { u: "خ.ع", col: C.green, msg: "جلسة البارحة كانت استثنائية، شرح مفصل من الأستاذ 🙏", t: "09:22" },
                    { u: "ف.د", col: C.slate, msg: "المحفظة +3.2% هذا الأسبوع 📈 الحمد لله", t: "09:31" },
                  ].map((m, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: m.col, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#080808", flexShrink: 0 }}>{m.u}</div>
                      <div>
                        <div style={{ background: C.bg2, borderRadius: "10px 10px 10px 0", padding: "9px 13px", fontSize: 12, color: C.slateLight, maxWidth: 280, direction: "rtl" }}>{m.msg}</div>
                        <div style={{ fontSize: 10, color: C.slateDim, marginTop: 3 }}>{m.t}</div>
                      </div>
                    </div>
                  ))}
                  {/* Input */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 24, padding: "10px 14px", marginTop: 6 }}>
                    <span style={{ fontSize: 12, color: C.slateDim, flex: 1, direction: "rtl" }}>انضم للمحادثة...</span>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg,${C.gold},${C.goldDim})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#080808" }}>→</div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={.15}>
              <div style={{ direction: "rtl" }}>
                <Label>مجتمع النخبة</Label>
                <h2 style={{ fontSize: 38, fontWeight: 900, marginBottom: 18 }}>انضم لمجتمع<br /><span style={{ color: C.gold }}>المستثمرين الناجحين</span></h2>
                <p style={{ fontSize: 15, color: C.slate, lineHeight: 1.85, marginBottom: 32 }}>مجتمع حصري من المتداولين والمستثمرين الخليجيين الذين يشتركون في قيم الانضباط والتعلم المستمر.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
                  {["تحليلات يومية حصرية","إشارات لحظية للأعضاء","جلسات تعليمية أسبوعية","دعم مباشر من الخبراء"].map(b => (
                    <div key={b} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 18, height: 18, borderRadius: 4, background: C.goldGlow, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.gold }}>✓</div>
                      <span style={{ fontSize: 14, color: C.slateLight }}>{b}</span>
                    </div>
                  ))}
                </div>
                <GoldBtn solid style={{ fontSize: 14 }}>انضم للمجتمع</GoldBtn>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          BROKER XTB
      ══════════════════════════════════════════════════════ */}
      <div style={{ padding: "80px 0", background: C.bg1, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 36px" }}>
          <Reveal>
            <div style={{ background: C.bg0, border: `1px solid ${C.border}`, borderRadius: 12, padding: "44px 40px", direction: "rtl", display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: C.slate, letterSpacing: ".15em", marginBottom: 10, textTransform: "uppercase" }}>الشريك الرسمي</div>
                <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 12 }}>XTB — <span style={{ color: C.gold }}>وسيط عالمي موثوق</span></h2>
                <p style={{ fontSize: 14, color: C.slate, lineHeight: 1.85, marginBottom: 24 }}>تعاون استراتيجي مع XTB، أحد أكبر الوسطاء تنظيماً في العالم. افتح حسابك عبرنا واستفد من دعمنا الكامل ومتابعتنا الشخصية.</p>
                <div style={{ display: "flex", gap: 20, marginBottom: 28, flexWrap: "wrap" }}>
                  {["تنظيم دولي","رسوم تنافسية","منصة متطورة","دعم عربي"].map(b => (
                    <div key={b} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.green }}><span>✓</span>{b}</div>
                  ))}
                </div>
                <GoldBtn solid href="https://www.xtb.com/ar/live-account/?partnerId=7794172&utm_campaign=7794172&campaignId=31&utm_term=31&utm_content=product_real_account&refType=1&utm_source=pso&utm_medium=affiliate" style={{ fontSize: 14 }}>فتح حساب XTB ←</GoldBtn>
              </div>
              <div style={{ width: 90, height: 90, borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: "#ff5722", boxShadow: "0 16px 48px rgba(0,0,0,.6)", flexShrink: 0 }}>XTB</div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <div style={{ padding: "110px 0" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <Reveal>
            <div style={{ textAlign: "center", direction: "rtl", marginBottom: 60 }}>
              <Label>شهادات الأعضاء</Label>
              <h2 style={{ fontSize: 40, fontWeight: 900 }}>قصص نجاح <span style={{ color: C.gold }}>حقيقية</span></h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 18 }}>
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * .07}>
                <Testi {...t} delay={i * .07} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════ */}
      <div style={{ padding: "120px 0", position: "relative", overflow: "hidden", borderTop: `1px solid ${C.border}` }}>
        {/* BG */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 80% at 50% 50%, rgba(201,168,76,.06) 0%, transparent 65%)` }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", border: `1px solid rgba(201,168,76,.05)`, animation: "rotateCW 50s linear infinite" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 480, height: 480, borderRadius: "50%", border: `1px solid rgba(107,114,128,.05)`, animation: "rotateCCW 35s linear infinite" }} />

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 36px", textAlign: "center", direction: "rtl", position: "relative", zIndex: 1 }}>
          <Reveal>
            <Label>ابدأ رحلتك الاستثمارية</Label>
            <h2 style={{ fontSize: "clamp(34px,4.5vw,58px)", fontWeight: 900, lineHeight: 1.2, marginBottom: 18 }}>
              جاهز للتداول
              <br /><span style={{ background: `linear-gradient(90deg,${C.gold},${C.goldBright})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>بوعي وثقة؟</span>
            </h2>
            <p style={{ fontSize: 16, color: C.slate, lineHeight: 1.85, marginBottom: 44 }}>
              انضم إلى أكثر من 1,200 متداول ومستثمر خليجي يثقون في منظومة دانار كابيتال لتحقيق أهدافهم المالية.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 44 }}>
              <GoldBtn solid href="https://www.xtb.com/ar/live-account/?partnerId=7794172" style={{ fontSize: 15, padding: "16px 38px" }}>افتح حسابك الآن ←</GoldBtn>
              <GoldBtn style={{ fontSize: 15, padding: "16px 38px" }}>تواصل معنا</GoldBtn>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 36, flexWrap: "wrap" }}>
              {[["🔒","آمن ومنظم"],["⚡","انضمام فوري"],["🎓","تعليم مجاني"]].map(([ic, lb]) => (
                <div key={lb} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: C.slateDim }}>
                  <span>{ic}</span>{lb}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "60px 0 28px", background: C.bg1 }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 36px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48, direction: "rtl" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 30, height: 30, borderRadius: 6, background: `linear-gradient(135deg,${C.gold},${C.goldDim})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 24 24" style={{ width: 17, height: 17, fill: "none", stroke: "#080808", strokeWidth: 2.5 }}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: C.white }}>DANAR CAPITAL</div>
                  <div style={{ fontSize: 9, color: C.gold, letterSpacing: ".2em" }}>المنظومة الاستثمارية الخليجية</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: C.slateDim, lineHeight: 1.8, maxWidth: 270 }}>منظومة استثمارية متكاملة مبنية على التعليم وإدارة المخاطر والشفافية.</p>
              <div style={{ marginTop: 18, fontSize: 14, color: C.gold, fontWeight: 700 }}>تداول بوعي. استثمر بثقة.</div>
            </div>
            {[
              { t: "الخدمات",  ls: ["إشارات التداول","تحليل السوق","المحفظة الاستثمارية","الأكاديمية"] },
              { t: "الشركة",   ls: ["عن دانار","النتائج والأداء","شركاؤنا","تواصل معنا"] },
              { t: "المجتمع",  ls: ["قناة تيليغرام","الجلسات المباشرة","مكتبة التعلم","قصص النجاح"] },
            ].map(col => (
              <div key={col.t}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 16, letterSpacing: ".04em" }}>{col.t}</div>
                {col.ls.map(l => (
                  <a key={l} href="#" style={{ display: "block", fontSize: 12, color: C.slateDim, textDecoration: "none", marginBottom: 10, transition: "color .2s" }}
                    onMouseEnter={e => e.target.style.color = C.gold} onMouseLeave={e => e.target.style.color = C.slateDim}>{l}</a>
                ))}
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", direction: "rtl" }}>
            <div style={{ fontSize: 11, color: C.slateDim }}>© 2024 DANAR CAPITAL. جميع الحقوق محفوظة. التداول ينطوي على مخاطر.</div>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { h: "https://x.com/Danar_Capital",                           ic: "𝕏"  },
                { h: "https://www.instagram.com/danarcapital/",                ic: "📸" },
                { h: "https://www.linkedin.com/company/danar-capital/",        ic: "💼" },
                { h: "https://snapchat.com/t/dTiudKnV",                        ic: "👻" },
                { h: "https://www.tiktok.com/@danar.capital",                  ic: "🎵" },
              ].map(s => (
                <a key={s.ic} href={s.h} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 15, textDecoration: "none", opacity: .5, transition: "opacity .2s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                  onMouseLeave={e => e.currentTarget.style.opacity = ".5"}
                >{s.ic}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

