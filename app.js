/**
 * BIRTHDAY EXPERIENCE — INTERACTIVE VINTAGE BOTANICAL GARDEN
 * 10-Phase Natural Blooming Timeline (Ground -> Stems -> Leaves -> Early Buds -> Mid Blooms -> Hero Roses -> Fauna/Sparkles -> Settle -> Text Reveal)
 * Read-first cadence for cat sections with explicit 1.0s pause
 */

(function () {
  'use strict';

  // DOM Elements
  const openingStage = document.getElementById('openingStage');
  const giftButton = document.getElementById('giftButton');
  const storyExperience = document.getElementById('storyExperience');
  const bloomCenterMessage = document.getElementById('bloomCenterMessage');
  const ambientLayer = document.getElementById('ambientLayer');
  const burstLayer = document.getElementById('burstLayer');

  // Preload all 4 cat GIFs to ensure instant, zero-flicker reveal
  const CAT_MEDIA = [
    'assets/cats/cat1_stare.gif?t=2026081601',
    'assets/cats/cat2_leaf.gif?t=2026081602',
    'assets/cats/cat3_hug.gif?t=2026081602',
    'assets/cats/cat4_pat.gif?t=2026081605'
  ];
  CAT_MEDIA.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Curated botanical palette for floating petals & particles
  const PALETTE = [
    '#D4887C', '#C66B60', '#DE8F83', '#F3BA9B', '#F7CCB2',
    '#F5CE62', '#E8B838', '#B8A2D8', '#C8B8E4', '#8DAEC7',
    '#7A9A8B', '#FFFDF9'
  ];

  /* ==========================================================================
     1. AMBIENT DRIFTING PETALS (Subtle, Slow, Natural)
     ========================================================================== */
  class AmbientPetal {
    constructor() {
      this.el = document.createElement('div');
      this.el.className = 'ambient-petal';
      this.reset(true);
      if (ambientLayer) ambientLayer.appendChild(this.el);
    }

    reset(initial = false) {
      this.x = Math.random() * window.innerWidth;
      this.y = initial ? Math.random() * window.innerHeight : -35;
      this.size = 7 + Math.random() * 9;
      this.speedY = 0.28 + Math.random() * 0.4;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 0.7;
      this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      this.opacity = 0.22 + Math.random() * 0.35;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = 0.009 + Math.random() * 0.014;

      this.el.style.width = this.size + 'px';
      this.el.style.height = (this.size * 1.3) + 'px';
      this.el.style.opacity = this.opacity;
      this.el.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 20 26" fill="${this.color}"><path d="M10 0 C16 5, 20 12, 10 26 C0 12, 4 5, 10 0 Z"/></svg>`;
    }

    update() {
      this.y += this.speedY;
      this.swayAngle += this.swaySpeed;
      this.x += this.speedX + Math.sin(this.swayAngle) * 0.4;
      this.rotation += this.rotSpeed;

      if (this.y > window.innerHeight + 40) {
        this.reset(false);
      }
      this.el.style.transform = `translate3d(${this.x.toFixed(1)}px, ${this.y.toFixed(1)}px, 0) rotate(${this.rotation.toFixed(1)}deg)`;
    }
  }

  const petals = [];
  const petalCount = window.innerWidth < 768 ? 8 : 16;
  for (let i = 0; i < petalCount; i++) {
    petals.push(new AmbientPetal());
  }

  function addPetals(count) {
    for (let i = 0; i < count; i++) {
      petals.push(new AmbientPetal());
    }
  }

  /* ==========================================================================
     2. RENDER LOOP
     ========================================================================== */
  function renderLoop() {
    petals.forEach(p => p.update());
    requestAnimationFrame(renderLoop);
  }
  requestAnimationFrame(renderLoop);

  /* ==========================================================================
     3. TACTILE PARTICLE BURST (Subtle & Organic)
     ========================================================================== */
  function burstParticles(x, y, count = 14, upBias = -25) {
    if (!burstLayer) return;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'burst-petal';

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const velocity = 35 + Math.random() * 75;
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const size = 7 + Math.random() * 8;
      const isStar = Math.random() > 0.65;

      el.innerHTML = isStar
        ? `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"/></svg>`
        : `<svg width="${size}" height="${size * 1.3}" viewBox="0 0 20 26" fill="${color}"><path d="M10 0 C16 6, 20 14, 10 26 C0 14, 4 6, 10 0 Z"/></svg>`;

      burstLayer.appendChild(el);
      el.style.left = x + 'px';
      el.style.top = y + 'px';

      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity + upBias;
      const tr = (Math.random() - 0.5) * 360;
      const duration = 650 + Math.random() * 280;

      const anim = el.animate([
        { transform: 'translate(-50%, -50%) scale(0.3) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${tx * 0.55}px), calc(-50% + ${ty * 0.55}px)) scale(1.05) rotate(${tr * 0.5}deg)`, opacity: 0.95, offset: 0.45 },
        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty + 25}px)) scale(0.4) rotate(${tr}deg)`, opacity: 0 }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards'
      });

      anim.onfinish = () => el.remove();
    }
  }

  /* ==========================================================================
     4. PROGRESSIVE 10-PHASE BOTANICAL BLOOM TIMELINE
     1. warm background & horizon mound appears
     2. slender stems slowly grow upward from ground
     3. delicate leaves unfold along stems
     4. small wildflower buds appear & open (blue periwinkles, coral florets)
     5. midground daisies, yellow buttercups & lavender blossom open
     6. large hero roses & daisies bloom last
     7. butterflies hover, tiny bees appear & golden sparkles twinkle
     8. the entire garden settles with living breeze sway
     9. centerpiece headline text reveals in the protected center
     10. automatic smooth transition to heartfelt message
     ========================================================================== */
  let bloomTriggered = false;

  function triggerBloomSequence(e) {
    if (bloomTriggered) return;
    bloomTriggered = true;

    const btnRect = giftButton.getBoundingClientRect();
    const clickX = e.clientX || (btnRect.left + btnRect.width / 2);
    const clickY = e.clientY || (btnRect.top + btnRect.height / 2);

    // Initial warm tactile click burst
    burstParticles(clickX, clickY, 14, -28);

    // Step 1: Opening card fades away softly
    setTimeout(() => {
      openingStage.classList.add('fading-away');
      addPetals(5);
      setTimeout(() => {
        openingStage.style.display = 'none';
      }, 750);
    }, 200);

    // Reveal story canvas container
    setTimeout(() => {
      storyExperience.classList.add('revealed');
      storyExperience.setAttribute('aria-hidden', 'false');
      document.body.classList.add('can-scroll');
    }, 550);

    // Phase 1: Background mound & atmospheric horizon appear (0.8s)
    setTimeout(() => {
      document.body.classList.add('phase-ground');
    }, 800);

    // Phase 2: Slender stems slowly grow upward from the ground (1.6s)
    setTimeout(() => {
      document.body.classList.add('phase-stems');
    }, 1600);

    // Phase 3: Delicate leaves unfold along stems (3.0s)
    setTimeout(() => {
      document.body.classList.add('phase-leaves');
    }, 3000);

    // Phase 4 & 5: Small wildflower buds appear & gently open (4.4s)
    setTimeout(() => {
      document.body.classList.add('phase-early-bloom');
      burstParticles(window.innerWidth / 2, window.innerHeight * 0.72, 6, -10);
    }, 4400);

    // Phase 6: Midground daisies, buttercups & lavender blossom open (5.8s)
    setTimeout(() => {
      document.body.classList.add('phase-mid-bloom');
    }, 5800);

    // Phase 7: Large hero roses & daisies bloom last (7.2s)
    setTimeout(() => {
      document.body.classList.add('phase-hero-bloom');
    }, 7200);

    // Phase 8: Butterflies, bees & sparkles twinkle into life (8.4s)
    setTimeout(() => {
      document.body.classList.add('phase-details');
      addPetals(6);
    }, 8400);

    // Phase 9: Garden settles with living gentle breeze sway (9.6s)
    setTimeout(() => {
      document.body.classList.add('phase-settle');
    }, 9600);

    // Phase 10: Centerpiece headline text reveals in the protected center (10.6s)
    setTimeout(() => {
      document.body.classList.add('bloomed');
      if (bloomCenterMessage) {
        bloomCenterMessage.classList.add('active');
      }
      initScrollObservers();
    }, 10600);

    // Step 11: After a quiet 3.6s reading pause, automatically & gently advance to heartfelt message
    setTimeout(() => {
      const heartfeltSection = document.getElementById('sectionHeartfelt');
      // Only auto-advance if the user hasn't already scrolled manually
      if (heartfeltSection && window.scrollY < 60) {
        heartfeltSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 14200);
  }

  giftButton.addEventListener('click', triggerBloomSequence);

  /* ==========================================================================
     5. SCROLL OBSERVER: READ -> PAUSE (1.0s) -> REVEAL CADENCE
     ========================================================================== */
  function initScrollObservers() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 1. Text reveals immediately as the user scrolls in
          entry.target.classList.add('in-view');

          // 2. Exact 1.0s reading pause before revealing the cat GIF
          const catMedia = entry.target.querySelector('.timed-cat-reveal');
          if (catMedia) {
            setTimeout(() => {
              catMedia.classList.add('cat-visible');
            }, 1000);
          }

          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  /* ==========================================================================
     6. SUBTLE BLOOM CLICK INTERACTION
     ========================================================================== */
  document.addEventListener('click', (e) => {
    const bloom = e.target.closest('.bloom-el');
    if (bloom && document.body.classList.contains('bloomed')) {
      const r = bloom.getBoundingClientRect();
      burstParticles(e.clientX || (r.left + r.width / 2), e.clientY || (r.top + r.height / 2), 6, -12);
      bloom.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.04) rotate(1.5deg)' },
        { transform: 'scale(0.98) rotate(-1deg)' },
        { transform: 'scale(1)' }
      ], {
        duration: 350,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      });
    }
  });

  // Responsive resize handler for floating petals
  window.addEventListener('resize', () => {
    petals.forEach(p => {
      if (p.x > window.innerWidth) {
        p.x = Math.random() * window.innerWidth;
      }
    });
  }, { passive: true });

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--bloom-duration', '0.01s');
  }

})();
