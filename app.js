/**
 * BIRTHDAY EXPERIENCE — INTERACTIVE BOTANICAL GARDEN
 * Progressive bloom sequence, ambient petals, scroll-reveal cat moments.
 */

(function () {
  'use strict';

  // DOM
  const openingStage = document.getElementById('openingStage');
  const giftButton = document.getElementById('giftButton');
  const storyExperience = document.getElementById('storyExperience');
  const bloomCenterMessage = document.getElementById('bloomCenterMessage');
  const ambientLayer = document.getElementById('ambientLayer');
  const burstLayer = document.getElementById('burstLayer');
  const btnTopReturn = document.getElementById('btnTopReturn');
  const btnScrollContinue = document.getElementById('btnScrollContinue');
  const scrollCue = document.getElementById('scrollCue');

  // Preload cat GIFs
  ['assets/cats/cat1_stare.gif?t=2026081601',
   'assets/cats/cat2_leaf.gif?t=2026081602',
   'assets/cats/cat3_hug.gif?t=2026081602',
   'assets/cats/cat4_pat.gif?t=2026081604'
  ].forEach(src => { const img = new Image(); img.src = src; });

  // Palette
  const PALETTE = [
    '#D4887C','#C66B60','#DE8F83','#F3BA9B','#F7CCB2',
    '#F5CE62','#E8B838','#B8A2D8','#C8B8E4','#8DAEC7',
    '#7A9A8B','#FFFDF9'
  ];

  /* ================================================================
     1. AMBIENT PETAL SYSTEM
     ================================================================ */
  class AmbientPetal {
    constructor() {
      this.el = document.createElement('div');
      this.el.className = 'ambient-petal';
      this.reset(true);
      ambientLayer.appendChild(this.el);
    }
    reset(initial = false) {
      this.x = Math.random() * window.innerWidth;
      this.y = initial ? Math.random() * window.innerHeight : -30;
      this.size = 8 + Math.random() * 10;
      this.speedY = 0.35 + Math.random() * 0.6;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 1;
      this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      this.opacity = 0.2 + Math.random() * 0.4;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = 0.012 + Math.random() * 0.018;
      this.el.style.width = this.size + 'px';
      this.el.style.height = (this.size * 1.25) + 'px';
      this.el.style.opacity = this.opacity;
      this.el.innerHTML = '<svg width="100%" height="100%" viewBox="0 0 20 25" fill="' + this.color + '"><path d="M10 0 C16 5, 20 12, 10 25 C0 12, 4 5, 10 0 Z"/></svg>';
    }
    update() {
      this.y += this.speedY;
      this.swayAngle += this.swaySpeed;
      this.x += this.speedX + Math.sin(this.swayAngle) * 0.5;
      this.rotation += this.rotSpeed;
      if (this.y > window.innerHeight + 35) this.reset();
      this.el.style.transform = 'translate3d(' + this.x.toFixed(1) + 'px,' + this.y.toFixed(1) + 'px,0) rotate(' + this.rotation.toFixed(1) + 'deg)';
    }
  }

  const petals = [];
  const isMobile = window.innerWidth < 768;
  for (let i = 0; i < (isMobile ? 8 : 16); i++) petals.push(new AmbientPetal());

  function addPetals(n) { for (let i = 0; i < n; i++) petals.push(new AmbientPetal()); }

  /* ================================================================
     2. ANIMATION LOOP
     ================================================================ */
  function animate() {
    petals.forEach(p => p.update());
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  /* ================================================================
     3. PARTICLE BURST
     ================================================================ */
  function burst(x, y, count, upBias) {
    count = count || 14;
    upBias = upBias || -25;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'burst-petal';
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const vel = 45 + Math.random() * 90;
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const sz = 8 + Math.random() * 9;
      const isStar = Math.random() > 0.6;
      el.innerHTML = isStar
        ? '<svg width="'+sz+'" height="'+sz+'" viewBox="0 0 24 24" fill="'+color+'"><path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"/></svg>'
        : '<svg width="'+sz+'" height="'+(sz*1.3)+'" viewBox="0 0 20 26" fill="'+color+'"><path d="M10 0 C16 6, 20 14, 10 26 C0 14, 4 6, 10 0 Z"/></svg>';
      burstLayer.appendChild(el);
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      const tx = Math.cos(angle) * vel;
      const ty = Math.sin(angle) * vel + upBias;
      const tr = (Math.random() - 0.5) * 360;
      const dur = 600 + Math.random() * 350;
      const anim = el.animate([
        { transform: 'translate(-50%,-50%) scale(0.3) rotate(0deg)', opacity: 1 },
        { transform: 'translate(calc(-50% + '+tx*0.6+'px),calc(-50% + '+ty*0.6+'px)) scale(1.1) rotate('+tr*0.5+'deg)', opacity: 0.95, offset: 0.45 },
        { transform: 'translate(calc(-50% + '+tx+'px),calc(-50% + '+(ty+30)+'px)) scale(0.5) rotate('+tr+'deg)', opacity: 0 }
      ], { duration: dur, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' });
      anim.onfinish = () => el.remove();
    }
  }

  /* ================================================================
     4. PROGRESSIVE BLOOM SEQUENCE
     Stems → Leaves → Small flowers → Main flowers → Details → Text
     ================================================================ */
  let hasBloomed = false;

  function triggerBloom(e) {
    if (hasBloomed) return;
    hasBloomed = true;

    const rect = giftButton.getBoundingClientRect();
    const cx = e.clientX || (rect.left + rect.width / 2);
    const cy = e.clientY || (rect.top + rect.height / 2);

    // Button burst
    burst(cx, cy, 16, -30);

    // Fade opening card
    setTimeout(() => {
      openingStage.classList.add('fading-away');
      addPetals(6);
      setTimeout(() => { openingStage.style.display = 'none'; }, 700);
    }, 250);

    // Reveal story
    setTimeout(() => {
      storyExperience.classList.add('revealed');
      storyExperience.setAttribute('aria-hidden', 'false');
      document.body.classList.add('can-scroll');
    }, 600);

    // Phase 1: Stems grow (1.2s after click)
    setTimeout(() => {
      document.body.classList.add('phase-stems');
    }, 1200);

    // Phase 2: Leaves unfurl (2.2s)
    setTimeout(() => {
      document.body.classList.add('phase-leaves');
    }, 2200);

    // Phase 3: Small wildflowers (3.0s)
    setTimeout(() => {
      document.body.classList.add('phase-small-flowers');
      burst(window.innerWidth / 2, window.innerHeight * 0.7, 6, -10);
    }, 3000);

    // Phase 4: Main roses & daisies (3.8s)
    setTimeout(() => {
      document.body.classList.add('phase-main-flowers');
    }, 3800);

    // Phase 5: Lavender, sparkles, details (4.5s)
    setTimeout(() => {
      document.body.classList.add('phase-details');
      addPetals(8);
    }, 4500);

    // Phase 6: Text reveals & bloom complete (5.2s)
    setTimeout(() => {
      document.body.classList.add('bloomed');
      bloomCenterMessage.classList.add('active');
    }, 5200);

    // Show scroll cue (6.5s)
    setTimeout(() => {
      if (scrollCue) scrollCue.classList.add('visible');
      initScrollObservers();
    }, 6500);
  }

  giftButton.addEventListener('click', triggerBloom);

  /* ================================================================
     5. SCROLL-REVEAL OBSERVER
     Text first → 0.9s pause → Cat GIF reveals
     ================================================================ */
  function initScrollObservers() {
    const els = document.querySelectorAll('.scroll-reveal');
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          const cat = entry.target.querySelector('.timed-cat-reveal');
          if (cat) {
            setTimeout(() => { cat.classList.add('cat-visible'); }, 900);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
  }

  // Scroll continue button
  if (btnScrollContinue) {
    btnScrollContinue.addEventListener('click', () => {
      burst(window.innerWidth / 2, window.innerHeight * 0.85, 8, -15);
      const target = document.getElementById('sectionHeartfelt');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Return to top
  if (btnTopReturn) {
    btnTopReturn.addEventListener('click', () => {
      burst(window.innerWidth / 2, window.innerHeight * 0.8, 10, -20);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ================================================================
     6. BLOOM CLICK INTERACTION
     ================================================================ */
  document.addEventListener('click', (e) => {
    const bloom = e.target.closest('.bloom-el');
    if (bloom) {
      const r = bloom.getBoundingClientRect();
      burst(e.clientX || (r.left + r.width / 2), e.clientY || (r.top + r.height / 2), 6, -12);
      bloom.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.06) rotate(2deg)' },
        { transform: 'scale(0.97) rotate(-1deg)' },
        { transform: 'scale(1)' }
      ], { duration: 350, easing: 'cubic-bezier(0.34,1.56,0.64,1)' });
    }
  });

  // Resize handler
  window.addEventListener('resize', () => {
    petals.forEach(p => {
      if (p.x > window.innerWidth) p.x = Math.random() * window.innerWidth;
    });
  }, { passive: true });

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--bloom-duration', '0.01s');
  }

})();
