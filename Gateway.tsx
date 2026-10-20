// @ts-nocheck
// Page 1 "Gateway": full-screen locked scene with a Tap-to-open button.
// Layout is measured from the real frame size, so it fits phones, desktops and
// Google Sites embed boxes of any height. Plain JSX (no type annotations) because
// the same source is embedded into downloaded HTML invitations (compiled by Babel).
import React from 'react';

export const GW_EFFECTS = [
  { key: 'double_gate', label: 'Double Gate', emoji: '🏛️' },
  { key: 'elevator', label: 'Elevator Doors', emoji: '🛗' },
  { key: 'wax_seal', label: 'Wax Seal', emoji: '💌' },
  { key: 'petals', label: 'Blooming Petals', emoji: '🌸' },
  { key: 'iris', label: 'Iris Aperture', emoji: '📷' },
  { key: 'confetti', label: 'Confetti Burst', emoji: '🎉' },
  { key: 'envelope', label: 'Envelope', emoji: '✉️' },
];

const GW_MS = { double_gate: 2000, elevator: 2200, wax_seal: 2300, petals: 2100, iris: 2000, confetti: 2400, envelope: 2600, fade: 900 };

const GW_CSS = `
.gw-root{inset:0;z-index:9999;overflow:hidden;touch-action:none;overscroll-behavior:contain;user-select:none;-webkit-user-select:none;perspective:1400px;font-family:inherit}
.gw-fixed{position:fixed}.gw-abs{position:absolute}
.gw-root *{box-sizing:border-box}
.gw-col{position:absolute;inset:0;z-index:6;display:flex;flex-direction:column;align-items:center;pointer-events:none}
.gw-text{flex:none;width:100%;padding:calc(env(safe-area-inset-top,0px) + clamp(10px,4vh,48px)) 20px 0;text-align:center;transition:opacity .45s ease}
.gw-lamp-pad .gw-text{padding-top:calc(env(safe-area-inset-top,0px) + clamp(36px,8vh,60px))}
.gw-dear{font-size:clamp(13px,2.4vh,17px);font-style:italic;margin:0 0 6px;opacity:.95}
.gw-eyebrow{display:inline-block;font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:700;padding:5px 14px;border-radius:999px;background:rgba(255,255,255,.14);border:1px solid currentColor;margin-bottom:clamp(6px,1.6vh,12px);max-width:100%}
.gw-title{font-size:clamp(24px,min(9vw,6.5vh),54px);line-height:1.15;font-weight:700;margin:0 0 6px}
.gw-tag{font-size:13px;font-style:italic;opacity:.9;max-width:420px;margin:0 auto 8px}
.gw-date{display:inline-block;font-size:12px;font-weight:700;padding:5px 14px;border-radius:999px;background:rgba(255,255,255,.16);border:1px solid currentColor}
@media (max-height:560px){.gw-tag{display:none}}
@media (max-height:430px){.gw-eyebrow,.gw-date{display:none}.gw-lamp{display:none}}
.gw-stage{flex:1 1 0;min-height:0;width:100%}
.gw-foot{flex:none;width:100%;padding:0 16px calc(env(safe-area-inset-bottom,0px) + clamp(12px,5vh,44px));pointer-events:auto;display:flex;justify-content:center}
.gw-piece{position:absolute;left:50%;z-index:5;transform:translate(-50%,-50%)}
.gw-btn{cursor:pointer;border:0;color:#fff;font-weight:800;font-size:15px;letter-spacing:.02em;padding:14px 30px;border-radius:999px;box-shadow:0 10px 28px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.35);animation:gw-pulse 1.8s ease-in-out infinite;transition:opacity .35s ease,transform .35s ease;max-width:92%}
.gw-btn:active{transform:scale(.96)}
.gw-opening .gw-btn{opacity:0;transform:scale(.7);pointer-events:none;animation:none}
.gw-opening .gw-text{opacity:0}
@keyframes gw-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes gw-fade-out{to{opacity:0}}
/* Double gate */
.gw-gate{position:absolute;top:0;bottom:0;width:50.2%;z-index:3;background:
 linear-gradient(90deg,rgba(0,0,0,.35),transparent 18%,transparent 82%,rgba(0,0,0,.35)),
 repeating-linear-gradient(90deg,var(--gw-acc) 0 4px,transparent 4px 46px),#2a1b12;
 box-shadow:inset 0 0 0 8px var(--gw-acc),inset 0 0 0 14px #2a1b12,inset 0 0 0 16px var(--gw-acc)}
.gw-gate-l{left:0;transform-origin:left center}.gw-gate-r{right:0;transform-origin:right center}
.gw-opening .gw-gate-l{animation:gw-gl 1.7s cubic-bezier(.65,0,.35,1) .3s forwards}
.gw-opening .gw-gate-r{animation:gw-gr 1.7s cubic-bezier(.65,0,.35,1) .3s forwards}
@keyframes gw-gl{to{transform:rotateY(-105deg);opacity:0}}
@keyframes gw-gr{to{transform:rotateY(105deg);opacity:0}}
.gw-lock{border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff3c4,var(--gw-acc) 55%,#6b4a12);box-shadow:0 6px 18px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;transition:transform .4s ease,opacity .4s ease}
.gw-opening .gw-lock{transform:rotate(360deg) scale(.4);opacity:0}
/* Elevator */
.gw-lift{position:absolute;top:0;bottom:0;width:50.2%;z-index:3;background:linear-gradient(90deg,#8d949b,#e5e8eb 18%,#b7bcc2 50%,#e5e8eb 82%,#8d949b);box-shadow:inset 0 0 40px rgba(0,0,0,.18)}
.gw-lift-l{left:0;border-right:2px solid #50565c}.gw-lift-r{right:0;border-left:2px solid #50565c}
.gw-opening .gw-lift-l{animation:gw-ll 1.7s cubic-bezier(.7,0,.3,1) .45s forwards}
.gw-opening .gw-lift-r{animation:gw-lr 1.7s cubic-bezier(.7,0,.3,1) .45s forwards}
@keyframes gw-ll{to{transform:translateX(-101%)}}@keyframes gw-lr{to{transform:translateX(101%)}}
.gw-lamp{position:absolute;left:50%;top:calc(env(safe-area-inset-top,0px) + 2.5vh);transform:translateX(-50%);z-index:8;background:#16181a;color:#ffd36b;font-weight:800;padding:4px 16px;border-radius:8px;font-size:15px;box-shadow:0 0 14px rgba(255,211,107,.45)}
.gw-opening .gw-lamp{animation:gw-ding .5s ease 2}
@keyframes gw-ding{50%{box-shadow:0 0 28px rgba(255,211,107,.95)}}
/* Wax seal */
.gw-flap{position:absolute;left:0;width:100%;z-index:3}
.gw-flap-top{top:0;height:var(--gw-cy);clip-path:polygon(0 0,100% 0,50% 100%);transform-origin:top center;background:linear-gradient(160deg,var(--gw-flap1),var(--gw-flap2))}
.gw-flap-bot{bottom:0;height:calc(100% - var(--gw-cy));clip-path:polygon(0 100%,100% 100%,50% 0);background:linear-gradient(20deg,var(--gw-flap2),var(--gw-flap1))}
.gw-opening .gw-flap-top{animation:gw-flaptop 1s ease-in-out .7s forwards}
.gw-opening .gw-flap-bot{animation:gw-flapbot 1s ease-in-out .9s forwards}
@keyframes gw-flaptop{to{transform:rotateX(180deg);opacity:0}}
@keyframes gw-flapbot{to{transform:translateY(60%);opacity:0}}
.gw-seal{position:relative;cursor:pointer}
.gw-seal-half{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 35% 30%,#e0505a,#a3141f 60%,#650a12);box-shadow:0 8px 20px rgba(0,0,0,.4),inset 0 0 0 5px rgba(255,255,255,.12),inset 0 0 0 9px rgba(0,0,0,.12);display:flex;align-items:center;justify-content:center;color:rgba(255,230,200,.85)}
.gw-seal-l{clip-path:polygon(0 0,52% 0,46% 22%,56% 40%,44% 62%,54% 80%,48% 100%,0 100%)}
.gw-seal-r{clip-path:polygon(52% 0,100% 0,100% 100%,48% 100%,54% 80%,44% 62%,56% 40%,46% 22%)}
.gw-opening .gw-seal-l{animation:gw-sl .8s ease-in .35s forwards}
.gw-opening .gw-seal-r{animation:gw-sr .8s ease-in .35s forwards}
@keyframes gw-sl{20%{transform:translateX(-4px) rotate(-3deg)}to{transform:translate(-70px,50px) rotate(-30deg);opacity:0}}
@keyframes gw-sr{20%{transform:translateX(4px) rotate(3deg)}to{transform:translate(70px,50px) rotate(30deg);opacity:0}}
.gw-root.gw-bgfade.gw-opening{animation:gw-fade-out .8s ease 1.4s forwards}
/* Petals */
.gw-flower{position:absolute;left:50%;width:0;height:0;z-index:3}
.gw-petal{position:absolute;left:calc(var(--gw-pw)/-2);top:calc(var(--gw-ph)*-1);width:var(--gw-pw);height:var(--gw-ph);transform-origin:50% 100%;border-radius:50% 50% 50% 50%/78% 78% 22% 22%;background:linear-gradient(to top,var(--gw-p1),var(--gw-p2));box-shadow:inset 0 -10px 18px rgba(0,0,0,.12);opacity:.96}
.gw-opening .gw-petal{animation:gw-pout 1.5s cubic-bezier(.5,0,.4,1) var(--d) forwards}
@keyframes gw-pout{to{transform:rotate(calc(var(--a) + 35deg)) translateY(-90vmax) scale(1.8);opacity:0}}
.gw-core{border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff1a8,#e0a926 65%,#a06f10);box-shadow:0 4px 14px rgba(0,0,0,.35);transition:transform .8s ease,opacity .8s ease}
.gw-opening .gw-core{transform:scale(6);opacity:0}
/* Iris */
.gw-blades{position:absolute;z-index:1;background:repeating-conic-gradient(from 0deg at 50% 50%,#34292a 0 22.5deg,#1d1617 22.5deg 45deg)}
.gw-opening .gw-blades{animation:gw-spin 2s ease-in forwards}
@keyframes gw-spin{to{transform:rotate(70deg)}}
.gw-ring{border-radius:50%;border:3px solid var(--gw-acc);opacity:.8;box-shadow:0 0 30px rgba(255,255,255,.12)}
/* Envelope */
.gw-env2{position:absolute;left:50%;z-index:4;transform:translate(-50%,-50%);filter:drop-shadow(0 18px 24px rgba(0,0,0,.28))}
.gw-env2 > div{position:absolute}
.gw-env2-back{inset:0;border-radius:6px;background:linear-gradient(#d6bf9b,#c4a97f)}
.gw-env2-letter{left:5%;right:5%;top:8%;bottom:6%;z-index:2;background:#fffdf7;border-radius:4px;border:2px solid var(--gw-acc);box-shadow:0 2px 10px rgba(0,0,0,.18);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:6px;color:#4a3426;overflow:hidden}
.gw-env2-letter .l1{font-size:calc(var(--gw-ew)*.032);letter-spacing:.2em;text-transform:uppercase;opacity:.7}
.gw-env2-letter .l2{font-size:calc(var(--gw-ew)*.075);font-weight:700;margin-top:4px;line-height:1.15}
.gw-env2-front{inset:0;z-index:3;border-radius:6px;background:linear-gradient(180deg,#efe0c8,#e2cfae);clip-path:polygon(0 0,50% 56%,100% 0,100% 100%,0 100%)}
.gw-env2-flap{left:0;top:0;width:100%;height:58%;z-index:4;transform-origin:top center;clip-path:polygon(0 0,100% 0,50% 100%);background:linear-gradient(180deg,#e9d7b9,#d5bc96)}
.gw-env2-seal{left:50%;top:48%;z-index:5;border-radius:50%;background:radial-gradient(circle at 35% 30%,#e0505a,#a3141f 65%,#650a12);box-shadow:0 3px 8px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;color:rgba(255,230,200,.9);transition:opacity .3s,transform .3s}
.gw-opening .gw-env2-seal{opacity:0;transform:scale(.4)}
.gw-opening .gw-env2-flap{animation:gw-env-flap .9s ease-in-out .25s forwards}
@keyframes gw-env-flap{0%{transform:rotateX(0);z-index:4}49%{transform:rotateX(90deg);z-index:4}50%{transform:rotateX(90deg);z-index:1}100%{transform:rotateX(180deg);z-index:1}}
.gw-opening .gw-env2-letter{animation:gw-env-letter 1.7s cubic-bezier(.5,0,.3,1) .95s forwards}
@keyframes gw-env-letter{0%{transform:translateY(0);z-index:2}8%{z-index:5}38%{transform:translateY(-68%);z-index:5}100%{transform:translateY(-68%) scale(8);z-index:5;opacity:0}}
/* Confetti */
.gw-conf{position:absolute;left:50%;top:var(--gw-cy);z-index:9;opacity:0;width:var(--w);height:var(--h);background:var(--c);border-radius:var(--r);animation:gw-cf 1.9s cubic-bezier(.15,.7,.3,1) var(--d) forwards}
@keyframes gw-cf{0%{opacity:1;transform:translate(0,0) rotate(0)}55%{opacity:1;transform:translate(calc(var(--dx)*.75),calc(var(--dy)*.7 - 18vh)) rotate(calc(var(--rot)*.6))}100%{opacity:0;transform:translate(var(--dx),calc(var(--dy) + 40vh)) rotate(var(--rot))}}
.gw-popper{line-height:1;animation:gw-bounce 1.3s ease-in-out infinite;transition:transform .3s,opacity .3s}
.gw-opening .gw-popper{transform:scale(1.8);opacity:0;animation:none}
@keyframes gw-bounce{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-14px) rotate(6deg)}}
`;

function GW_isDark(hex) {
  try {
    let h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) < 140;
  } catch (e) { return false; }
}

function GW_clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

function GatewayScene({ effect, buttonText, accent, bg, eyebrow, title, tagline, dateText, guestName, position, onStart, onDone }) {
  const [phase, setPhase] = React.useState('idle');
  const [irisR, setIrisR] = React.useState(0);
  const [m, setM] = React.useState({ w: 390, h: 700, cy: 360, sw: 340, sh: 320 });
  const rootRef = React.useRef(null);
  const stageRef = React.useRef(null);
  const accentCol = accent || '#d4a373';
  const bgCol = bg || '#f4ece4';

  // Measure the real frame so every effect fits any screen / embed height
  React.useLayoutEffect(() => {
    const measure = () => {
      const r = rootRef.current, s = stageRef.current;
      if (!r || !s) return;
      const w = r.clientWidth, h = r.clientHeight;
      const sh = s.offsetHeight, sw = s.offsetWidth;
      const cy = s.offsetTop + sh / 2;
      setM((p) => (Math.abs(p.w - w) < 1 && Math.abs(p.h - h) < 1 && Math.abs(p.cy - cy) < 1 && Math.abs(p.sh - sh) < 1 && Math.abs(p.sw - sw) < 1) ? p : { w, h, cy, sw, sh });
    };
    measure();
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      if (rootRef.current) ro.observe(rootRef.current);
      if (stageRef.current) ro.observe(stageRef.current);
    }
    window.addEventListener('resize', measure);
    return () => { if (ro) ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  // Very slow devices get a simple fade instead of the heavy animation
  const simple = React.useMemo(() => {
    try {
      const lowCpu = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
      const lowMem = navigator.deviceMemory && navigator.deviceMemory <= 1;
      return !!(lowCpu || lowMem);
    } catch (e) { return false; }
  }, []);
  const fx = simple ? 'fade' : (effect || 'double_gate');
  const ms = GW_MS[fx] || 2000;

  const confetti = React.useMemo(() => {
    const colors = ['#f94144', '#f3722c', '#f9c74f', '#90be6d', '#43aa8b', '#4d908e', '#577590', '#e879f9', '#ffffff'];
    return Array.from({ length: 84 }, () => ({
      dx: (Math.random() * 2 - 1) * 90 + 'vw',
      dy: (Math.random() * 2 - 1) * 55 + 'vh',
      rot: Math.round((Math.random() * 2 - 1) * 900) + 'deg',
      w: 6 + Math.random() * 8 + 'px',
      h: 8 + Math.random() * 12 + 'px',
      c: colors[Math.floor(Math.random() * colors.length)],
      r: Math.random() > 0.6 ? '50%' : '2px',
      d: (Math.random() * 0.25).toFixed(2) + 's',
    }));
  }, []);

  const petals = React.useMemo(() => {
    const list = [];
    for (let i = 0; i < 12; i++) list.push({ a: i * 30, k: 'o' + i, s: 1, d: (i % 3) * 0.08 + 's' });
    for (let i = 0; i < 8; i++) list.push({ a: i * 45 + 22, k: 'i' + i, s: 0.68, d: 0.15 + (i % 2) * 0.08 + 's' });
    return list;
  }, []);

  const open = () => {
    if (phase !== 'idle') return;
    setPhase('opening');
    if (onStart) onStart();
    if (fx === 'iris') {
      const t0 = Date.now();
      const tick = () => {
        const p = Math.min(1, (Date.now() - t0) / (ms - 250));
        const e = 1 - Math.pow(1 - p, 3);
        setIrisR(e * 104);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
    setTimeout(() => { if (onDone) onDone(); }, ms);
  };

  const dark = fx === 'double_gate' || fx === 'iris' ? true : fx === 'elevator' ? false : GW_isDark(bgCol);
  const textCol = fx === 'double_gate' ? '#f6e7c8' : fx === 'iris' ? '#f3ece6' : fx === 'elevator' ? '#23272b' : dark ? '#fff7e6' : '#4a3426';

  let rootBg = 'transparent';
  let extra = '';
  if (fx === 'wax_seal') { rootBg = bgCol; extra = ' gw-bgfade'; }
  else if (fx === 'petals') { rootBg = 'radial-gradient(circle at 50% ' + m.cy + 'px, #ffffff55, transparent 60%), ' + bgCol; extra = ' gw-bgfade'; }
  else if (fx === 'confetti') { rootBg = 'linear-gradient(160deg,' + accentCol + '33,' + accentCol + '66), ' + bgCol; extra = ' gw-bgfade'; }
  else if (fx === 'envelope') { rootBg = 'radial-gradient(circle at 50% ' + m.cy + 'px, #ffffff66, transparent 65%), ' + bgCol; extra = ' gw-bgfade'; }
  else if (fx === 'iris') rootBg = '#1d1617';
  else if (fx === 'fade') rootBg = bgCol;

  const backdrop = (fx === 'double_gate' || fx === 'elevator') ? (fx === 'double_gate' ? '#1a110b' : '#cfd3d7') : null;

  const rootStyle = {
    background: rootBg,
    color: textCol,
    '--gw-acc': accentCol,
    '--gw-flap1': bgCol,
    '--gw-flap2': dark ? '#00000040' : '#b8946a55',
    '--gw-cy': m.cy + 'px',
  };
  if (fx === 'iris') {
    const mk = 'radial-gradient(circle at 50% ' + m.cy + 'px, transparent ' + irisR + '%, #000 ' + irisR + '%)';
    rootStyle.WebkitMaskImage = mk;
    rootStyle.maskImage = mk;
  }
  if (fx === 'fade' && phase === 'opening') rootStyle.animation = 'gw-fade-out .8s ease forwards';

  const cls = 'gw-root ' + (position === 'absolute' ? 'gw-abs' : 'gw-fixed') + extra + (fx === 'elevator' ? ' gw-lamp-pad' : '') + (phase === 'opening' ? ' gw-opening' : '');

  const cmin = GW_clamp(Math.min(m.sw, m.sh), 40, 2000);
  const piece = { top: m.cy };

  const btn = (
    <button className="gw-btn" style={{ background: accentCol, color: GW_isDark(accentCol) ? '#fff' : '#2b1d10' }} onClick={open} type="button">
      {buttonText || 'Tap to open'}
    </button>
  );

  const textBlock = (
    <div className="gw-text">
      {guestName ? <p className="gw-dear inv-body">Dear {guestName},</p> : null}
      {eyebrow ? <div className="gw-eyebrow">{eyebrow}</div> : null}
      <h1 className="gw-title inv-heading">{title}</h1>
      {tagline ? <p className="gw-tag inv-body">{tagline}</p> : null}
      {dateText ? <div className="gw-date inv-body">📅 {dateText}</div> : null}
    </div>
  );

  // sizes for the centerpiece, derived from the stage (space between text and button)
  const lockS = GW_clamp(cmin * 0.5, 40, 74);
  const sealS = GW_clamp(cmin * 0.55, 56, 116);
  const ringS = GW_clamp(cmin * 0.6, 70, 150);
  const petalH = GW_clamp(cmin * 0.46, 36, 170);
  const petalW = petalH * 0.56;
  const coreS = petalH * 0.4;
  const popperS = GW_clamp(cmin * 0.55, 40, 76);
  const envW = GW_clamp(Math.min(m.sw * 0.92, (m.sh * 0.94) / 0.64, 360), 120, 360);
  const envH = envW * 0.64;
  const bladeS = Math.max(m.w, m.h) * 2.6;

  return (
    <div className={cls} style={rootStyle} ref={rootRef}>
      <style>{GW_CSS}</style>
      {backdrop && phase === 'idle' ? <div style={{ position: 'absolute', inset: 0, background: backdrop, zIndex: 0 }} /> : null}

      {fx === 'double_gate' && (
        <>
          <div className="gw-gate gw-gate-l" />
          <div className="gw-gate gw-gate-r" />
          <div className="gw-piece" style={piece}>
            <div className="gw-lock" style={{ width: lockS, height: lockS, fontSize: lockS * 0.4 }}>🔒</div>
          </div>
        </>
      )}

      {fx === 'elevator' && (
        <>
          <div className="gw-lamp">▲ ▼</div>
          <div className="gw-lift gw-lift-l" />
          <div className="gw-lift gw-lift-r" />
        </>
      )}

      {fx === 'wax_seal' && (
        <>
          <div className="gw-flap gw-flap-bot" />
          <div className="gw-flap gw-flap-top" />
          <div className="gw-piece" style={piece}>
            <div className="gw-seal" style={{ width: sealS, height: sealS, fontSize: sealS * 0.38 }} onClick={open}>
              <div className="gw-seal-half gw-seal-l">❦</div>
              <div className="gw-seal-half gw-seal-r">❦</div>
            </div>
          </div>
        </>
      )}

      {fx === 'petals' && (
        <>
          <div className="gw-flower" style={{ top: m.cy, '--gw-pw': petalW + 'px', '--gw-ph': petalH + 'px', '--gw-p1': '#f9a8c4', '--gw-p2': '#ffe4ee' }}>
            {petals.map((p) => (
              <div key={p.k} className="gw-petal" style={{ '--a': p.a + 'deg', '--d': p.d, transform: 'rotate(' + p.a + 'deg) scale(' + p.s + ')' }} />
            ))}
          </div>
          <div className="gw-piece" style={{ ...piece, zIndex: 4 }}>
            <div className="gw-core" style={{ width: coreS, height: coreS }} />
          </div>
        </>
      )}

      {fx === 'iris' && (
        <>
          <div className="gw-blades" style={{ width: bladeS, height: bladeS, left: m.w / 2 - bladeS / 2, top: m.cy - bladeS / 2 }} />
          <div className="gw-piece" style={{ ...piece, zIndex: 2 }}>
            <div className="gw-ring" style={{ width: ringS, height: ringS }} />
          </div>
        </>
      )}

      {fx === 'confetti' && (
        <>
          <div className="gw-piece" style={piece}>
            <div className="gw-popper" style={{ fontSize: popperS }}>🎉</div>
          </div>
          {phase === 'opening' && confetti.map((c, i) => (
            <span key={i} className="gw-conf" style={{ '--dx': c.dx, '--dy': c.dy, '--rot': c.rot, '--w': c.w, '--h': c.h, '--c': c.c, '--r': c.r, '--d': c.d }} />
          ))}
        </>
      )}

      {fx === 'envelope' && (
        <div className="gw-env2" style={{ top: m.cy, width: envW, height: envH, '--gw-ew': envW + 'px' }}>
          <div className="gw-env2-back" />
          <div className="gw-env2-letter">
            <div className="l1 inv-body">You are invited</div>
            <div className="l2 inv-heading">{title}</div>
          </div>
          <div className="gw-env2-front" />
          <div className="gw-env2-flap" />
          <div className="gw-env2-seal" style={{ width: envW * 0.13, height: envW * 0.13, marginLeft: -envW * 0.065, marginTop: -envW * 0.065, fontSize: envW * 0.055 }}>❦</div>
        </div>
      )}

      <div className="gw-col">
        {textBlock}
        <div className="gw-stage" ref={stageRef} />
        <div className="gw-foot">{btn}</div>
      </div>
    </div>
  );
}

export default GatewayScene;
