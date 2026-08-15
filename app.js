/**
 * Interactive Birthday Experience — Stages 01, 02, 2.6 & 3.1
 * Stage 01: Warm Paper Note Card & Handwritten Display (Preserved)
 * Stage 02: Illustrated Botanical Garden & Centered Message (Preserved)
 * Stage 3.1: Natural, Meme-Like Personal Cat Moments (Non-Template)
 */

(function () {
  'use strict';

  // DOM Elements
  const worldScene = document.getElementById('worldScene');
  const cardWrapper = document.getElementById('cardWrapper');
  const giftButton = document.getElementById('giftButton');
  const bloomScene = document.getElementById('bloomScene');
  const bloomMessage = document.getElementById('bloomMessage');
  const ambientLayer = document.getElementById('ambientLayer');
  const burstLayer = document.getElementById('burstLayer');

  // Sprout Elements
  const sproutSparkle = document.getElementById('sproutSparkle');
  const firstStem = document.getElementById('firstStem');
  const firstLeaves = document.getElementById('firstLeaves');
  const firstFlower = document.getElementById('firstFlower');

  // Cat Overlay Elements
  const btnCatReveal = document.getElementById('btnCatReveal');
  const catStage = document.getElementById('catStage');
  const btnBackMeadow = document.getElementById('btnBackMeadow');
  const catBackdrop = document.getElementById('catBackdrop');
  const btnCatNext = document.getElementById('btnCatNext');
  const catNextLabel = document.getElementById('catNextLabel');
  const catMomentItems = Array.from(document.querySelectorAll('.cat-moment-item'));

  let currentCatIndex = 0;

  // Botanical Color Palette
  const PALETTE = [
    '#D4887C', // Dusty Rose
    '#C66B60', // Deep Rose
    '#DE8F83', // Rose Accent
    '#F3BA9B', // Soft Peach
    '#F7CCB2', // Light Peach
    '#F5CE62', // Butter Yellow
    '#E8B838', // Amber Gold
    '#B8A2D8', // Lilac Lavender
    '#C8B8E4', // Soft Lavender
    '#8DAEC7', // Periwinkle Blue
    '#7A9A8B', // Soft Sage
    '#FFFDF9'  // Warm Ivory Daisy Petal
  ];

  /* ==========================================================================
     1. AMBIENT DRIFTING PETALS SYSTEM
     ========================================================================== */
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
      this.speedY = 0.4 + Math.random() * 0.7;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 1.2;
      this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      this.opacity = 0.25 + Math.random() * 0.45;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = 0.015 + Math.random() * 0.02;

      this.el.style.width = `${this.size}px`;
      this.el.style.height = `${this.size * 1.25}px`;
      this.el.style.opacity = this.opacity;
      this.el.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 20 25" fill="${this.color}">
          <path d="M10 0 C16 5, 20 12, 10 25 C0 12, 4 5, 10 0 Z"/>
        </svg>
      `;
    }

    update() {
      this.y += this.speedY;
      this.swayAngle += this.swaySpeed;
      this.x += this.speedX + Math.sin(this.swayAngle) * 0.6;
      this.rotation += this.rotSpeed;

      if (this.y > window.innerHeight + 35) {
        this.reset();
      }

      this.el.style.transform = `translate3d(${this.x.toFixed(1)}px, ${this.y.toFixed(1)}px, 0) rotate(${this.rotation.toFixed(1)}deg)`;
    }
  }

  const ambientPetals = [];
  const isMobile = window.innerWidth < 768;
  const ambientCount = isMobile ? 10 : 18;

  for (let i = 0; i < ambientCount; i++) {
    ambientPetals.push(new AmbientPetal());
  }

  function addMoreAmbientPetals(extra = 12) {
    for (let i = 0; i < extra; i++) {
      ambientPetals.push(new AmbientPetal());
    }
  }

  /* ==========================================================================
     2. PARALLAX & AMBIENT ANIMATION LOOP
     ========================================================================== */
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let targetMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  window.addEventListener('pointermove', (e) => {
    targetMouse.x = e.clientX;
    targetMouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      targetMouse.x = e.touches[0].clientX;
      targetMouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  function animate() {
    mouse.x += (targetMouse.x - mouse.x) * 0.045;
    mouse.y += (targetMouse.y - mouse.y) * 0.045;

    ambientPetals.forEach(petal => petal.update());

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  /* ==========================================================================
     3. PARTICLE BURST HELPER
     ========================================================================== */
  function createPetalBurst(originX, originY, count = 16, upwardBias = -25) {
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'burst-petal';

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const velocity = 50 + Math.random() * 100;
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const size = 9 + Math.random() * 10;
      const isStar = Math.random() > 0.6;

      if (isStar) {
        petal.innerHTML = `
          <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">
            <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"/>
          </svg>
        `;
      } else {
        petal.innerHTML = `
          <svg width="${size}" height="${size * 1.3}" viewBox="0 0 20 26" fill="${color}">
            <path d="M10 0 C16 6, 20 14, 10 26 C0 14, 4 6, 10 0 Z"/>
          </svg>
        `;
      }

      burstLayer.appendChild(petal);

      petal.style.left = `${originX}px`;
      petal.style.top = `${originY}px`;
      petal.style.opacity = '1';
      petal.style.transform = `translate(-50%, -50%) scale(0.2) rotate(0deg)`;

      const targetX = Math.cos(angle) * velocity;
      const targetY = Math.sin(angle) * velocity + upwardBias;
      const targetRotate = (Math.random() - 0.5) * 360;
      const duration = 650 + Math.random() * 400;

      const animation = petal.animate([
        {
          transform: `translate(-50%, -50%) scale(0.3) rotate(0deg)`,
          opacity: 1
        },
        {
          transform: `translate(calc(-50% + ${targetX * 0.6}px), calc(-50% + ${targetY * 0.6}px)) scale(1.1) rotate(${targetRotate * 0.5}deg)`,
          opacity: 0.95,
          offset: 0.45
        },
        {
          transform: `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY + 30}px)) scale(0.6) rotate(${targetRotate}deg)`,
          opacity: 0,
          offset: 1
        }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards'
      });

      animation.onfinish = () => {
        petal.remove();
      };
    }
  }

  /* ==========================================================================
     4. CINEMATIC BOTANICAL STORY TIMELINE
     warm paper -> message -> pause -> ✦ sparkle -> 🌱 stem -> 🌿 leaves -> 🌸 first rose -> 🌼 MORE FLOWERS -> 🌷 FULL BLOOM
     ========================================================================== */
  let hasBloomed = false;

  function triggerBloomSequence(e) {
    if (hasBloomed) return;
    hasBloomed = true;

    const rect = giftButton.getBoundingClientRect();
    const clickX = e.clientX || (rect.left + rect.width / 2);
    const clickY = e.clientY || (rect.top + rect.height / 2);

    // 1. Button click reaction & soft particle burst
    createPetalBurst(clickX, clickY, 18, -30);

    // 2. Note card fades away gently into warm paper
    setTimeout(() => {
      cardWrapper.classList.add('fading-away');
      addMoreAmbientPetals(8);
    }, 300);

    // 3. "That's how the world bloomed when you were born." reveals on clean warm paper
    setTimeout(() => {
      bloomMessage.classList.add('revealed');
      bloomMessage.setAttribute('aria-hidden', 'false');
    }, 650);

    // 4. Small pause... then ✦ tiny sparkle ✦ glimmers
    setTimeout(() => {
      if (sproutSparkle) sproutSparkle.classList.add('sparkle-active');
      createPetalBurst(window.innerWidth / 2, window.innerHeight * 0.85, 6, -10);
    }, 2400);

    // 5. 🌱 First little stem sprouts upward
    setTimeout(() => {
      if (firstStem) firstStem.classList.add('stem-growing');
    }, 2900);

    // 6. 🌿 Leaves open
    setTimeout(() => {
      if (firstLeaves) firstLeaves.classList.add('leaves-opening');
    }, 3500);

    // 7. 🌸 First English Garden Rose blossoms open in the center clearing
    setTimeout(() => {
      if (firstFlower) firstFlower.classList.add('flower-blooming');
      createPetalBurst(window.innerWidth / 2, window.innerHeight * 0.84, 10, -25);
    }, 4000);

    // 8. 🌼🌸💜 MORE FLOWERS bloom outward in cascading waves
    setTimeout(() => {
      worldScene.classList.add('phase-meadow-mid');
    }, 4600);

    // 9. 🌷🌿🌸 FULL BLOOM surges across the whole world
    setTimeout(() => {
      worldScene.classList.add('bloomed');
      addMoreAmbientPetals(12);
    }, 5400);
  }

  giftButton.addEventListener('click', triggerBloomSequence);

  /* ==========================================================================
     5. STAGE 3.1: NATURAL MEME-LIKE CAT MOMENTS CONTROLLER
     ========================================================================== */
  function openCatStage() {
    catStage.classList.add('open');
    catStage.setAttribute('aria-hidden', 'false');
    showCatMoment(0);
    createPetalBurst(window.innerWidth / 2, window.innerHeight / 2, 12, -20);
  }

  function closeCatStage() {
    catStage.classList.remove('open');
    catStage.setAttribute('aria-hidden', 'true');
  }

  function showCatMoment(index) {
    if (index < 0 || index >= catMomentItems.length) return;
    currentCatIndex = index;

    catMomentItems.forEach((item, i) => {
      if (i === index) {
        // Reset animations on activate for timed memes
        item.classList.remove('active');
        void item.offsetWidth; // Trigger reflow
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    if (currentCatIndex === catMomentItems.length - 1) {
      catNextLabel.textContent = 'finish 🌸';
    } else {
      catNextLabel.textContent = 'next →';
    }
  }

  function nextCatMoment() {
    if (currentCatIndex < catMomentItems.length - 1) {
      showCatMoment(currentCatIndex + 1);
      createPetalBurst(window.innerWidth / 2, window.innerHeight * 0.6, 8, -15);
    } else {
      // Completed all 4 cats -> return back to bloomed garden
      closeCatStage();
      createPetalBurst(window.innerWidth / 2, window.innerHeight / 2, 16, -25);
    }
  }

  if (btnCatReveal) btnCatReveal.addEventListener('click', openCatStage);
  if (btnBackMeadow) btnBackMeadow.addEventListener('click', closeCatStage);
  if (catBackdrop) catBackdrop.addEventListener('click', closeCatStage);
  if (btnCatNext) btnCatNext.addEventListener('click', nextCatMoment);

  // Keyboard navigation (Arrow keys & Escape)
  window.addEventListener('keydown', (e) => {
    if (!catStage.classList.contains('open')) return;

    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      nextCatMoment();
    } else if (e.key === 'ArrowLeft' && currentCatIndex > 0) {
      e.preventDefault();
      showCatMoment(currentCatIndex - 1);
    } else if (e.key === 'Escape') {
      closeCatStage();
    }
  });

  /* ==========================================================================
     6. INTERACTIVE BLOOM DISCOVERIES (Subtle flower bounce)
     ========================================================================== */
  document.addEventListener('click', (e) => {
    const bloom = e.target.closest('.bloom-item, .foliage-item');
    if (bloom) {
      const rect = bloom.getBoundingClientRect();
      const originX = e.clientX || (rect.left + rect.width / 2);
      const originY = e.clientY || (rect.top + rect.height / 2);
      createPetalBurst(originX, originY, 8, -15);

      bloom.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.08) rotate(3deg)' },
        { transform: 'scale(0.96) rotate(-2deg)' },
        { transform: 'scale(1)' }
      ], {
        duration: 400,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      });
    }
  });

  // Window resize handler
  window.addEventListener('resize', () => {
    ambientPetals.forEach(p => {
      if (p.x > window.innerWidth) p.x = Math.random() * window.innerWidth;
      if (p.y > window.innerHeight) p.y = Math.random() * window.innerHeight;
    });
  }, { passive: true });

})();
