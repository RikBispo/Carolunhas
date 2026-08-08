/*
  Carolunhas - Interactive Frutiger Aero Script
  Created for Ana Carolinni Nail Designer
*/

document.addEventListener('DOMContentLoaded', () => {
  initAeroCanvas();
  initSparkleCursor();
  initPortfolioFilters();
  initNailCustomizer();
  initModalLightbox();
  initContactForm();
  initMobileMenu();
});

/* -------------------------------------------------------------
   1. Interactive Frutiger Aero Canvas (Bubbles & Water Ripples)
   ------------------------------------------------------------- */
function initAeroCanvas() {
  const canvas = document.getElementById('aero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Bubble objects
  const bubbles = [];
  const bubbleCount = Math.floor(width / 35);

  class Bubble {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 100;
      this.radius = Math.random() * 20 + 8;
      this.speed = Math.random() * 1.2 + 0.4;
      this.opacity = Math.random() * 0.4 + 0.15;
      this.swing = Math.random() * 0.02 + 0.005;
      this.swingOffset = Math.random() * Math.PI * 2;
      // Glossy color gradient hues (Cyan, Mint, Pink, Aqua)
      const hues = [185, 160, 330, 200];
      this.hue = hues[Math.floor(Math.random() * hues.length)];
    }

    update() {
      this.y -= this.speed;
      this.swingOffset += this.swing;
      this.x += Math.sin(this.swingOffset) * 0.5;

      if (this.y < -this.radius * 2) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;

      // Outer Bubble Circle Gradient
      const grad = ctx.createRadialGradient(
        this.x - this.radius * 0.3,
        this.y - this.radius * 0.3,
        this.radius * 0.1,
        this.x,
        this.y,
        this.radius
      );
      grad.addColorStop(0, `hsla(${this.hue}, 100%, 90%, 0.9)`);
      grad.addColorStop(0.5, `hsla(${this.hue}, 100%, 65%, 0.4)`);
      grad.addColorStop(1, `hsla(${this.hue}, 100%, 45%, 0.1)`);

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Frutiger Aero Top Specular Reflection Arc
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.85, Math.PI * 1.2, Math.PI * 1.8);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = Math.max(1.5, this.radius * 0.15);
      ctx.stroke();

      ctx.restore();
    }
  }

  for (let i = 0; i < bubbleCount; i++) {
    const b = new Bubble();
    b.y = Math.random() * height; // initial spread
    bubbles.push(b);
  }

  // Water Ripple Ripples
  const ripples = [];
  window.addEventListener('click', (e) => {
    ripples.push({
      x: e.clientX,
      y: e.clientY,
      radius: 5,
      maxRadius: Math.random() * 60 + 40,
      opacity: 0.8
    });
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Render & update bubbles
    bubbles.forEach((b) => {
      b.update();
      b.draw();
    });

    // Render & update ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += 2.5;
      r.opacity -= 0.02;

      if (r.opacity <= 0 || r.radius >= r.maxRadius) {
        ripples.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 229, 255, ${r.opacity})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* -------------------------------------------------------------
   2. Sparkle Particle Trail Cursor
   ------------------------------------------------------------- */
function initSparkleCursor() {
  let lastTime = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTime < 45) return; // throttle
    lastTime = now;

    const sparkle = document.createElement('div');
    sparkle.className = 'cursor-sparkle';
    sparkle.style.left = `${e.clientX}px`;
    sparkle.style.top = `${e.clientY}px`;
    document.body.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 800);
  });
}

/* -------------------------------------------------------------
   3. Portfolio Filtering System
   ------------------------------------------------------------- */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach((item) => {
        const cat = item.getAttribute('data-category');
        if (filterValue === 'all' || cat === filterValue) {
          item.style.display = 'block';
          item.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------
   4. Interactive Nail Customizer Studio
   ------------------------------------------------------------- */
function initNailCustomizer() {
  const previewNail = document.getElementById('preview-nail');
  const summaryText = document.getElementById('customizer-summary-text');
  const ctaBtn = document.getElementById('customizer-cta-btn');

  if (!previewNail) return;

  let currentConfig = {
    shape: 'Amendoada',
    finish: 'Top Coat Mirror Gloss',
    length: 'Médio'
  };

  const gradientMap = {
    'Top Coat Mirror Gloss': 'linear-gradient(135deg, #ff70a6, #00e5ff)',
    'Glitter 3D Aurora': 'linear-gradient(135deg, #e0aaff, #00f5d4, #ff2a85)',
    'Cromo Holo Polish': 'linear-gradient(135deg, #70e000, #00b4d8, #ff70a6)',
    'Encapsulada Rose Gold': 'linear-gradient(135deg, #ff9eaf, #ffc2d1, #ff2a85)'
  };

  const radiusMap = {
    'Amendoada': '120px 120px 30px 30px',
    'Stiletto': '160px 10px 20px 20px',
    'Quadrada': '20px 20px 30px 30px',
    'Bailarina': '100px 100px 15px 15px'
  };

  const lengthHeightMap = {
    'Curto': '180px',
    'Médio': '240px',
    'Longo': '290px'
  };

  function updatePreview() {
    previewNail.style.background = gradientMap[currentConfig.finish] || gradientMap['Top Coat Mirror Gloss'];
    previewNail.style.borderRadius = radiusMap[currentConfig.shape] || radiusMap['Amendoada'];
    previewNail.style.height = lengthHeightMap[currentConfig.length] || '240px';

    if (summaryText) {
      summaryText.textContent = `Formato ${currentConfig.shape} • Acabamento ${currentConfig.finish} • Tamanho ${currentConfig.length}`;
    }

    if (ctaBtn) {
      const msg = encodeURIComponent(
        `Olá Ana! Criei uma personalização no seu site Carolunhas:\n- Formato: ${currentConfig.shape}\n- Acabamento: ${currentConfig.finish}\n- Tamanho: ${currentConfig.length}\nGostaria de consultar valores e horários disponíveis!`
      );
      ctaBtn.href = `https://wa.me/5511945056292?text=${msg}`;
    }
  }

  // Handle pill selections
  document.querySelectorAll('.control-group').forEach((group) => {
    const type = group.getAttribute('data-config-type');
    group.querySelectorAll('.pill-opt').forEach((pill) => {
      pill.addEventListener('click', () => {
        group.querySelectorAll('.pill-opt').forEach((p) => p.classList.remove('selected'));
        pill.classList.add('selected');
        currentConfig[type] = pill.getAttribute('data-value');
        updatePreview();
      });
    });
  });

  updatePreview();
}

/* -------------------------------------------------------------
   5. Modal Lightbox for Portfolio Photos
   ------------------------------------------------------------- */
function initModalLightbox() {
  const modal = document.getElementById('portfolio-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalCta = document.getElementById('modal-cta');
  const closeBtn = document.getElementById('modal-close');

  if (!modal) return;

  document.querySelectorAll('.portfolio-card').forEach((card) => {
    card.addEventListener('click', () => {
      const imgSrc = card.querySelector('img').src;
      const title = card.querySelector('.portfolio-title').textContent;
      const category = card.querySelector('.portfolio-category').textContent;

      modalImg.src = imgSrc;
      modalTitle.textContent = title;
      modalCategory.textContent = category;

      const msg = encodeURIComponent(
        `Olá Ana! Vi o seu trabalho "${title}" (${category}) no site Carolunhas e amei! Gostaria de saber disponibilidade para agendar esse modelo.`
      );
      modalCta.href = `https://wa.me/5511945056292?text=${msg}`;

      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/* -------------------------------------------------------------
   6. Contact Form WhatsApp Generator
   ------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value;
    const service = document.getElementById('form-service').value;
    const msgInput = document.getElementById('form-message').value;

    const fullMsg = encodeURIComponent(
      `Olá Ana (Carolunhas)!\nMeu nome é ${name}.\nInteresse em: ${service}.\nMensagem: ${msgInput}`
    );

    window.open(`https://wa.me/5511945056292?text=${fullMsg}`, '_blank');
  });
}

/* -------------------------------------------------------------
   7. Mobile Navigation Toggle
   ------------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('mobile-active');
  });

  // Close menu when clicking link
  document.querySelectorAll('#nav-links .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
      navLinks.classList.remove('mobile-active');
    }
  });
}

