// @ts-nocheck
// Section entrance animations (slide up, fade, zoom, bounce, flip, blur, float).
// Triggers: on-scroll (animates when the section scrolls into view), immediate, after-delay.
// Plain JSX (no type annotations) because it is also embedded into downloaded HTML cards.
import React from 'react';

export const REVEAL_CSS = `
[data-reveal]:not(.inv-in){opacity:0}
.inv-in[data-anim="none"]{opacity:1}
.inv-in[data-anim="slide_up"]{animation:inv_slideUp .75s cubic-bezier(.16,1,.3,1) both}
.inv-in[data-anim="fade"]{animation:inv_fadeIn .8s ease-out both}
.inv-in[data-anim="zoom"]{animation:inv_zoomIn .7s ease-out both}
.inv-in[data-anim="bounce"]{animation:inv_bounceIn .8s cubic-bezier(.175,.885,.32,1.275) both}
.inv-in[data-anim="flip"]{animation:inv_flipIn .8s cubic-bezier(.16,1,.3,1) both}
.inv-in[data-anim="blur"]{animation:inv_blurIn .9s ease-out both}
.inv-in[data-anim="float"]{animation:inv_float 1.1s ease-out both}
@keyframes inv_slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes inv_fadeIn{from{opacity:0}to{opacity:1}}
@keyframes inv_zoomIn{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
@keyframes inv_bounceIn{0%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1.05)}70%{transform:scale(.92)}100%{opacity:1;transform:scale(1)}}
@keyframes inv_flipIn{from{opacity:0;transform:perspective(800px) rotateX(35deg) translateY(24px)}to{opacity:1;transform:perspective(800px) rotateX(0) translateY(0)}}
@keyframes inv_blurIn{from{opacity:0;filter:blur(10px);transform:scale(.98)}to{opacity:1;filter:blur(0);transform:scale(1)}}
@keyframes inv_float{0%{opacity:0;transform:translateY(26px)}60%{opacity:1;transform:translateY(-6px)}100%{opacity:1;transform:translateY(0)}}
`;

export function RevealStyles() {
  return <style>{REVEAL_CSS}</style>;
}

// rootRef: scroll container ref (or null to use the window). ready: sections are on the page.
// startDelay: wait (ms) before the first sections animate (lets the gateway transition clear).
export function useReveal(rootRef, ready, startDelay, dep) {
  React.useEffect(() => {
    if (!ready) return undefined;
    const scope = (rootRef && rootRef.current) || document;
    const timers = [];
    let io = null;
    const show = (el) => { el.classList.add('inv-in'); };

    const run = () => {
      const els = Array.prototype.slice.call(scope.querySelectorAll('[data-reveal]'));
      if (typeof IntersectionObserver !== 'undefined') {
        io = new IntersectionObserver((entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
          });
        }, { root: (rootRef && rootRef.current) || null, threshold: 0.05 });
      }
      els.forEach((el, i) => {
        if (el.classList.contains('inv-in')) return;
        const trig = el.getAttribute('data-reveal');
        const anim = el.getAttribute('data-anim');
        if (anim === 'none') { show(el); return; }
        if (trig === 'immediate') { timers.push(setTimeout(() => show(el), i * 120)); return; }
        if (trig === 'after-delay') { timers.push(setTimeout(() => show(el), 700 + i * 250)); return; }
        if (io) io.observe(el); else show(el);
      });
    };

    const t0 = setTimeout(run, startDelay || 0);
    return () => {
      clearTimeout(t0);
      timers.forEach(clearTimeout);
      if (io) io.disconnect();
    };
  }, [ready, startDelay, dep]);
}
