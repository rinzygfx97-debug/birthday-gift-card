/**
 * STAGE 01 & STAGE 02 — BloomScene INTERACTIVITY
 * 
 * 1. Stage 01: Handcrafted opening note card with "Click Here" interaction
 * 2. Stage 02: BloomScene — Multi-stage organic botanical blooming sequence,
 *    spring physics parallax, ambient petals, and mathematically centered message.
 */

(function () {
  'use strict';

  // DOM Elements
  const worldScene = document.getElementById('worldScene');
  const cardWrapper = document.getElementById('cardWrapper');
  const giftButton = document.getElementById('giftButton');
  const ambientLayer = document.getElementById('ambientLayer');
  const burstLayer = document.getElementById('burstLayer');
  const bloomMessage = document.getElementById('bloomMessage');
  const parallaxNodes = document.querySelectorAll('[data-parallax]');

  // Botanical Color Palette for Petals & Particles
  const PALETTE = [
    '#D4887C', // Dusty rose
    '#F3BA9B', // Soft peach
    '#7A9A8B', // Sage
    '#B8A2D8', // Lavender
    '#8DAEC7', // Periwinkle blue
    '#F5CE62', // Butter yellow
    '#FFFDF9'  // Warm ivory
  ];

  /* ==========================================================================
     1. AMBIENT DRIFTING PETALS
     ========================================================================== */
  let ambientCount = 8;
  const ambientPetals = [];

  class AmbientPetal {
    constructor() {
      this.el = document.createElement('div');
      this.el.className = 'ambient-petal';
      this.reset(true);
      this.render();
      ambientLayer.appendChild(this.el);
    }

    reset(initial = false) {
      this.x = Math.random() * window.innerWidth;
      this.y = initial ? Math.random() * window.innerHeight : -40;
      this.size = 11 + Math.random() * 14;
      this.speedY = 0.28 + Math.random() * 0.42;
      this.speedX = -0.2 + Math.random() * 0.45;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 0.6;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.012 + Math.random() * 0.018;
      this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      this.opacity = 0.32 + Math.random() * 0.45;

      this.el.innerHTML = `
        <svg width="${this.size}" height="${this.size * 1.3}" viewBox="0 0 20 26" fill="none">
          <path d="M10 0 C16 6, 20 14, 10 26 C0 14, 4 6, 10 0 Z" fill="${this.color}" opacity="${this.opacity}"/>
        </svg>
      `;
    }

    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.4;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;

      if (this.y > window.innerHeight + 50 || this.x < -60 || this.x > window.innerWidth + 60) {
        this.reset(false);
      }

      this.render();
    }

    render() {
      this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) rotate(${this.rotation}deg)`;
    }
  }

  for (let i = 0; i < ambientCount; i++) {
    ambientPetals.push(new AmbientPetal());
  }

  function addMoreAmbientPetals(extra = 12) {
    for (let i = 0; i < extra; i++) {
      ambientPetals.push(new AmbientPetal());
    }
  }

  /* ==========================================================================
     2. PARALLAX SYSTEM (Subtle Spring Physics)
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

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const offsetX = (mouse.x - centerX);
    const offsetY = (mouse.y - centerY);

    parallaxNodes.forEach(node => {
      const depth = parseFloat(node.getAttribute('data-parallax')) || 0.012;
      const moveX = offsetX * depth;
      const moveY = offsetY * depth;
      const rotate = (offsetX * depth * 0.06);
      node.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg)`;
    });

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
      const velocity = 60 + Math.random() * 120;
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const size = 11 + Math.random() * 12;
      const isStar = Math.random() > 0.7;

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
      const targetRotate = (Math.random() - 0.5) * 440;
      const duration = 750 + Math.random() * 450;

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
          transform: `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY + 35}px)) scale(0.65) rotate(${targetRotate}deg)`,
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
     4. BloomScene CONTROLLER & ORGANIC BLOOM SEQUENCE
     ========================================================================== */
  let hasBloomed = false;

  function triggerBloomSequence(e) {
    if (hasBloomed) return;
    hasBloomed = true;

    const rect = giftButton.getBoundingClientRect();
    const clickX = e.clientX || (rect.left + rect.width / 2);
    const clickY = e.clientY || (rect.top + rect.height / 2);

    // Step 1: Physical button press reaction & soft petal burst
    createPetalBurst(clickX, clickY, 18, -30);

    // Step 2: Note card fades away gently
    setTimeout(() => {
      cardWrapper.classList.add('fading-away');
      addMoreAmbientPetals(12);
    }, 350);

    // Step 3-9: Botanical meadow grows and unfolds in staggered organic progression
    setTimeout(() => {
      worldScene.classList.add('bloomed');
    }, 550);

    // Step 10: Environment settles peacefully -> Reveal message in clean central frame
    setTimeout(() => {
      bloomMessage.classList.add('revealed');
      bloomMessage.setAttribute('aria-hidden', 'false');
    }, 4200);
  }

  giftButton.addEventListener('click', triggerBloomSequence);

  /* ==========================================================================
     5. INTERACTIVE BLOOM DISCOVERIES
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
