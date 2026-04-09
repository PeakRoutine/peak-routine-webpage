(function () {
  "use strict";

  /* ============================================================
     PeakRoutine — main.js
     Modern scroll animations, interactions, and UI logic
     ============================================================ */

  // ── Spinner ──
  (function initSpinner() {
    const spinner = document.getElementById('spinner');
    if (spinner) {
      setTimeout(() => spinner.classList.remove('show'), 1);
    }
  })();

  // ── Scroll Progress Bar ──
  (function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  })();

  // ── Intersection Observer — Scroll Reveal ──
  (function initReveal() {
    const selectors = [
      '.reveal', '.reveal-up', '.reveal-left', '.reveal-right',
      '.reveal-scale', '.reveal-stagger', '.showcase-step',
      '.step-connector'
    ];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => observer.observe(el));
    });
  })();

  // ── Navbar: Glassmorphism on scroll ──
  (function initNavbar() {
    const navbar = document.querySelector('.navbar-glass');
    const logoText = document.querySelector('.logo-text');
    if (!navbar) return;

    function handleScroll() {
      const isMobile = window.innerWidth < 992;
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
        if (logoText) logoText.style.color = '#1C85E8';
      } else {
        navbar.classList.remove('scrolled');
        if (logoText) {
          logoText.style.color = isMobile ? '#1C85E8' : '#ffffff';
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Close mobile menu on link click
    document.querySelectorAll('.navbar-nav a').forEach(link => {
      link.addEventListener('click', () => {
        const collapse = document.getElementById('navbarCollapse');
        if (collapse && collapse.classList.contains('show')) {
          new bootstrap.Collapse(collapse).hide();
        }
      });
    });
  })();

  // ── Back To Top ──
  (function initBackToTop() {
    const btn = document.querySelector('.back-to-top-modern');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  // ── Hero Headline Animation ──
  (function initHeroHeadline() {
    const headline = document.querySelector('.hero-headline-animated');
    if (!headline) return;

    // Keep headline visually straight and centered without per-word skew/stagger.
    headline.style.opacity = '0';
    headline.style.transform = 'translateY(18px)';
    headline.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        headline.style.opacity = '1';
        headline.style.transform = 'none';
      });
    });
  })();

  // ── Stats Count-Up ──
  (function initCountUp() {
    const stats = document.querySelectorAll('[data-count]');
    if (!stats.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1800;
        const start = performance.now();
        const isDecimal = target % 1 !== 0;

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const eased = 1 - Math.pow(2, -10 * progress);
          const current = eased * target;
          el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = prefix + target + suffix;
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    }, { threshold: 0.4 });

    stats.forEach(el => observer.observe(el));
  })();

  // ── Magnetic Buttons ──
  (function initMagneticButtons() {
    const btns = document.querySelectorAll('.btn-magnetic');
    if (!btns.length) return;

    btns.forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  })();

  // ── Smooth Scroll for anchor links ──
  (function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const id = link.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  })();

  // ── Pricing Toggle (Monthly / Annual) ──
  (function initPricingToggle() {
    const toggle = document.getElementById('pricingToggle');
    const proPrice = document.getElementById('proPrice');
    const elitePrice = document.getElementById('elitePrice');
    const proPeriod = document.getElementById('proPeriod');
    const elitePeriod = document.getElementById('elitePeriod');
    const savingsBadge = document.getElementById('savingsBadge');

    const prices = {
      monthly: { pro: '$5.99', elite: '$10.99', period: '/month', label: 'Billed monthly' },
      annual:  { pro: '$3.99', elite: '$7.99',  period: '/month', label: 'Billed annually' }
    };

    function updatePrices(isAnnual) {
      const p = isAnnual ? prices.annual : prices.monthly;
      if (proPrice)   proPrice.textContent   = p.pro;
      if (elitePrice) elitePrice.textContent = p.elite;
      if (proPeriod)  proPeriod.textContent  = p.period;
      if (elitePeriod) elitePeriod.textContent = p.period;

      document.querySelectorAll('.pricing-period-label').forEach(el => {
        el.textContent = p.label;
      });

      if (savingsBadge) {
        savingsBadge.style.opacity = isAnnual ? '1' : '0';
        savingsBadge.style.transform = isAnnual ? 'none' : 'translateY(-4px)';
      }
    }

    if (toggle) {
      toggle.addEventListener('change', () => updatePrices(toggle.checked));
      updatePrices(toggle.checked);
    }
  })();

  // ── FAQ Accordion ──
  (function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (!question) return;
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        items.forEach(i => i.classList.remove('open'));
        // Open clicked if was closed
        if (!isOpen) item.classList.add('open');
      });
    });
  })();

  // ── Hero 3D Carousel ──
  (function initHeroCarousel() {
    const carousel = document.getElementById('heroCarousel');
    if (!carousel) return;

    let isDragging = false, hasMoved = false;
    let startX = 0, currentAngle = 0, dragAngle = 0;
    let autoResumeTimer = null;
    const DRAG_THRESHOLD = 8;

    function getX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }

    function captureAngle() {
      const matrix = getComputedStyle(carousel).transform;
      if (matrix && matrix !== 'none') {
        const v = matrix.split('(')[1].split(')')[0].split(',');
        if (v.length >= 6) {
          currentAngle = Math.round(Math.atan2(+v[1], +v[0]) * (180 / Math.PI));
        } else {
          currentAngle = dragAngle;
        }
      }
    }

    carousel.addEventListener('mouseenter', () => { if (!isDragging) carousel.classList.add('paused'); });
    carousel.addEventListener('mouseleave', () => { if (!isDragging) carousel.classList.remove('paused'); });

    function onStart(e) {
      isDragging = true; hasMoved = false;
      startX = getX(e);
      clearTimeout(autoResumeTimer);
      e.preventDefault();
    }

    function onMove(e) {
      if (!isDragging) return;
      const dx = getX(e) - startX;
      if (!hasMoved && Math.abs(dx) >= DRAG_THRESHOLD) {
        hasMoved = true;
        captureAngle();
        carousel.classList.add('dragging');
        carousel.style.transform = `rotateY(${currentAngle}deg)`;
      }
      if (hasMoved) {
        dragAngle = currentAngle + dx * 0.4;
        carousel.style.transform = `rotateY(${dragAngle}deg)`;
      }
      e.preventDefault();
    }

    function onEnd() {
      if (!isDragging) return;
      isDragging = false;
      if (hasMoved) {
        currentAngle = dragAngle;
        carousel.classList.remove('dragging');
        autoResumeTimer = setTimeout(() => {
          carousel.style.transform = '';
          carousel.classList.remove('paused');
        }, 2000);
      } else {
        if (carousel.classList.contains('paused')) {
          carousel.classList.remove('paused');
          carousel.style.transform = '';
        } else {
          captureAngle();
          carousel.classList.add('paused');
          carousel.style.transform = `rotateY(${currentAngle}deg)`;
        }
      }
    }

    carousel.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    carousel.addEventListener('touchstart', onStart, { passive: false });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
    carousel.querySelectorAll('img').forEach(img => {
      img.addEventListener('dragstart', e => e.preventDefault());
    });

    function setRadius() {
      const items = carousel.querySelectorAll('.hero-carousel-item');
      const w = window.innerWidth;
      let r = 420;
      if (w <= 400) r = 165;
      else if (w <= 576) r = 210;
      else if (w <= 768) r = 270;
      else if (w <= 992) r = 340;
      const step = 360 / items.length;
      items.forEach((item, i) => {
        item.style.transform = `rotateY(${step * i}deg) translateZ(${r}px)`;
      });
    }

    setRadius();
    window.addEventListener('resize', setRadius, { passive: true });
  })();

  // ── Contact Form ──
  (function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    function validateField(field, errorId, validator) {
      const val = field.value.trim();
      const err = document.getElementById(errorId);
      const ok = validator(val);
      field.classList.toggle('is-invalid', !ok);
      if (err) err.style.display = ok ? 'none' : 'block';
      return ok;
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name    = form.querySelector('#name');
      const email   = form.querySelector('#email');
      const subject = form.querySelector('#subject');
      const message = form.querySelector('#message');

      const valid = [
        validateField(name,    'name-error',    v => v.length >= 2),
        validateField(email,   'email-error',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)),
        validateField(subject, 'subject-error', v => v.length >= 3),
        validateField(message, 'message-error', v => v.length >= 5),
      ].every(Boolean);

      if (!valid) return;

      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fa fa-spinner fa-spin me-2"></i>Sending...';
      btn.disabled = true;

      try {
        const res = await fetch('https://peakroutine-hfffebbwc4bjbcer.westus-01.azurewebsites.net/app/website/contactUs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.value.trim(),
            email: email.value.trim(),
            subject: subject.value.trim(),
            message: message.value.trim()
          })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showPopup('success');
        form.reset();
      } catch (err) {
        showPopup('error', err.message);
      } finally {
        btn.innerHTML = orig;
        btn.disabled = false;
      }
    });
  })();

  // ── Popup System ──
  window.showPopup = function(type, errorMsg) {
    const overlay = document.getElementById('popupOverlay');
    const success = document.getElementById('successPopup');
    const error   = document.getElementById('errorPopup');
    if (!overlay) return;

    if (type === 'success') {
      success && success.classList.add('show');
    } else {
      if (error && errorMsg) {
        const msgEl = error.querySelector('.popup-message');
        if (msgEl) msgEl.textContent = `Couldn't send your message. Error: ${errorMsg}. Please email us directly.`;
      }
      error && error.classList.add('show');
    }
    overlay.classList.add('show');
  };

  window.closePopup = function() {
    document.getElementById('popupOverlay')?.classList.remove('show');
    document.getElementById('successPopup')?.classList.remove('show');
    document.getElementById('errorPopup')?.classList.remove('show');
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('popupOverlay')?.addEventListener('click', window.closePopup);
    document.querySelectorAll('.popup-close-btn').forEach(btn => {
      btn.addEventListener('click', window.closePopup);
    });
  });

  // ── Dodo Payments ──
  const PAYMENT_API_BASE = (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'file:'
  )
    ? 'http://localhost:8083/app/website/payment'
    : 'https://peakroutine-hfffebbwc4bjbcer.westus-01.azurewebsites.net/app/website/payment';

  window.initiatePurchase = async function(plan, buttonEl) {
    const btn = buttonEl || event?.target;
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin me-2"></i>Processing...';

    try {
      const res = await fetch(PAYMENT_API_BASE + '/createCheckout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });
      if (!res.ok) throw new Error('Failed to create checkout session.');
      const data = await res.json();
      const url = data?.payload?.checkoutUrl;
      if (url) window.location.href = url;
      else throw new Error('No checkout URL received.');
    } catch (err) {
      showPopup('error', err.message);
    } finally {
      setTimeout(() => { btn.disabled = false; btn.innerHTML = orig; }, 2000);
    }
  };

  // Handle Dodo return
  (function handleDodoReturn() {
    const p = new URLSearchParams(window.location.search);
    if (p.get('payment_id') && p.get('status') === 'paid') {
      setTimeout(() => {
        const sp = document.getElementById('successPopup');
        if (sp) {
          const t = sp.querySelector('.popup-title');
          const m = sp.querySelector('.popup-message');
          if (t) t.textContent = 'Payment Successful!';
          if (m) m.textContent = 'Thank you for subscribing! Check your email for your welcome message with download instructions.';
        }
        showPopup('success');
        window.history.replaceState({}, '', window.location.pathname + '#pricing');
      }, 600);
    }
  })();

})();