/**
 * BIRTHDAY EXPERIENCE — MASTER INTERACTIVE VINTAGE BOTANICAL STORY
 * Bulletproof mobile touch, automatic story progression & manual scrolling support
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
  const storyScrollHint = document.getElementById('storyScrollHint');

  // Preload all 4 cat GIFs immediately into memory
  const CAT_MEDIA = [
    'assets/cats/cat1_stare.gif',
    'assets/cats/cat2_leaf.gif',
    'assets/cats/cat3_hug.gif',
    'assets/cats/cat4_pat.gif'
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
     1. AMBIENT DRIFTING PETALS
     ========================================================================== */
  class AmbientPetal {
    constructor() {
      this.el = document.createElement('div');
      this.el.className = 'ambient-petal';
      this.reset(true);
      if (ambientLayer) ambientLayer.appendChild(this.el);
    }

    reset(initial = false) {
      this.x = Math.random() * (window.innerWidth || 390);
      this.y = initial ? Math.random() * (window.innerHeight || 844) : -35;
      this.size = 7 + Math.random() * 8;
      this.speedY = 0.28 + Math.random() * 0.35;
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

      if (this.y > (window.innerHeight || 844) + 40) {
        this.reset(false);
      }
      this.el.style.transform = `translate3d(${this.x.toFixed(1)}px, ${this.y.toFixed(1)}px, 0) rotate(${this.rotation.toFixed(1)}deg)`;
    }
  }

  const petals = [];
  const petalCount = window.innerWidth < 768 ? 8 : 14;
  for (let i = 0; i < petalCount; i++) {
    petals.push(new AmbientPetal());
  }

  function addPetals(count) {
    for (let i = 0; i < count; i++) {
      petals.push(new AmbientPetal());
    }
  }

  function renderLoop() {
    petals.forEach(p => p.update());
    requestAnimationFrame(renderLoop);
  }
  requestAnimationFrame(renderLoop);

  /* ==========================================================================
     2. TACTILE PARTICLE BURST
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

      if (el.animate) {
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
      } else {
        setTimeout(() => el.remove(), 700);
      }
    }
  }

  /* ==========================================================================
     3. BLOOM & STORY CONTROLLER
     ========================================================================== */
  let bloomTriggered = false;
  let userHasScrolledManually = false;

  // Track manual user interaction
  window.addEventListener('wheel', () => { userHasScrolledManually = true; }, { passive: true });
  window.addEventListener('touchmove', () => { userHasScrolledManually = true; }, { passive: true });
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space'].includes(e.code)) {
      userHasScrolledManually = true;
    }
  }, { passive: true });

  function autoAdvanceToSection(sectionId, delay) {
    setTimeout(() => {
      if (userHasScrolledManually) return;
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, delay);
  }

  function triggerBloomSequence(e) {
    if (bloomTriggered) return;
    bloomTriggered = true;

    const btnRect = giftButton ? giftButton.getBoundingClientRect() : null;
    const clickX = (e && e.clientX) ? e.clientX : (btnRect ? (btnRect.left + btnRect.width / 2) : (window.innerWidth / 2));
    const clickY = (e && e.clientY) ? e.clientY : (btnRect ? (btnRect.top + btnRect.height / 2) : (window.innerHeight / 2));

    // Tactile particle burst
    burstParticles(clickX, clickY, 14, -28);

    // Fade away opening stage
    if (openingStage) {
      openingStage.classList.add('fading-away');
      addPetals(5);
      setTimeout(() => {
        openingStage.style.display = 'none';
      }, 750);
    }

    // Reveal story experience
    if (storyExperience) {
      storyExperience.classList.add('revealed');
      storyExperience.setAttribute('aria-hidden', 'false');
    }

    // 10-Phase Natural Bloom Timeline
    // Phase 1: Background mound (0.3s)
    setTimeout(() => { document.body.classList.add('phase-ground'); }, 300);

    // Phase 2: Slender stems grow upward (0.7s)
    setTimeout(() => { document.body.classList.add('phase-stems'); }, 700);

    // Phase 3: Delicate leaves unfold (1.2s)
    setTimeout(() => { document.body.classList.add('phase-leaves'); }, 1200);

    // Phase 4 & 5: Wildflower buds appear & open (1.7s)
    setTimeout(() => {
      document.body.classList.add('phase-early-bloom');
      burstParticles(window.innerWidth / 2, window.innerHeight * 0.72, 6, -10);
    }, 1700);

    // Phase 6: Daisies, buttercups & lavender bloom (2.2s)
    setTimeout(() => { document.body.classList.add('phase-mid-bloom'); }, 2200);

    // Phase 7: Hero roses & daisies open (2.7s)
    setTimeout(() => { document.body.classList.add('phase-hero-bloom'); }, 2700);

    // Phase 8: Butterflies, bees & sparkles twinkle (3.2s)
    setTimeout(() => {
      document.body.classList.add('phase-details');
      addPetals(6);
    }, 3200);

    // Phase 9: Garden settles with gentle breeze (3.6s)
    setTimeout(() => { document.body.classList.add('phase-settle'); }, 3600);

    // Phase 10: Centerpiece headline text reveals (4.0s)
    setTimeout(() => {
      document.body.classList.add('bloomed');
      if (bloomCenterMessage) {
        bloomCenterMessage.classList.add('active');
      }
    }, 4000);

    // Automatic Gentle Story Playthrough (unless user scrolls manually)
    autoAdvanceToSection('sectionHeartfelt', 6500);
    autoAdvanceToSection('moment1', 10500);
    autoAdvanceToSection('moment2', 14500);
    autoAdvanceToSection('moment3', 18500);
    autoAdvanceToSection('moment4', 22500);
    autoAdvanceToSection('sectionFinale', 26500);
  }

  // Bind opening events: Button tap, Card tap, or Swipe-up
  if (giftButton) {
    giftButton.addEventListener('click', triggerBloomSequence);
    giftButton.addEventListener('touchend', (e) => {
      e.preventDefault();
      triggerBloomSequence(e);
    });
  }

  if (openingStage) {
    openingStage.addEventListener('click', (e) => {
      triggerBloomSequence(e);
    });
  }

  // Scroll hint interactive click
  if (storyScrollHint) {
    storyScrollHint.addEventListener('click', () => {
      userHasScrolledManually = true;
      const el = document.getElementById('sectionHeartfelt');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Bloom petal touch micro-interaction
  document.addEventListener('click', (e) => {
    const bloom = e.target.closest('.bloom-el');
    if (bloom && document.body.classList.contains('bloomed')) {
      const r = bloom.getBoundingClientRect();
      burstParticles(e.clientX || (r.left + r.width / 2), e.clientY || (r.top + r.height / 2), 6, -12);
    }
  });

  // Interactive Birthday Wish Sparkle Finale
  const wishSparkleBtn = document.getElementById('wishSparkleBtn');
  if (wishSparkleBtn) {
    wishSparkleBtn.addEventListener('click', (e) => {
      const rect = wishSparkleBtn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      
      // Giant celebratory sparkle burst
      burstParticles(cx, cy, 28, -35);
      setTimeout(() => burstParticles(cx - 60, cy - 20, 16, -25), 180);
      setTimeout(() => burstParticles(cx + 60, cy - 20, 16, -25), 360);
      addPetals(12);

      wishSparkleBtn.innerHTML = '<span class="sparkle-icon">✨</span><span class="wish-btn-text">Wish Made! Have a magical year :D</span><span class="sparkle-icon">✨</span>';
      wishSparkleBtn.style.background = 'linear-gradient(135deg, #FDE8D0 0%, #F8D0C0 100%)';
    });
  }

  // Responsive resize handler
  window.addEventListener('resize', () => {
    petals.forEach(p => {
      if (p.x > window.innerWidth) {
        p.x = Math.random() * window.innerWidth;
      }
    });
  }, { passive: true });

})();
