/* ============================================================
   PeakRoutine — main-v2.js
   All interactions, animations, payment logic
   ============================================================ */
(function () {
  "use strict";

  /* ── Spinner ── */
  const spinner = document.getElementById('pr-spinner');
  if (spinner) {
    window.addEventListener('load', () => {
      setTimeout(() => spinner.classList.add('hidden'), 300);
    });
    // Fallback
    setTimeout(() => spinner.classList.add('hidden'), 2000);
  }

  /* ── Scroll Progress ── */
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
    }, { passive: true });
  }

  /* ── Dynamic Island Navbar ── */
  const nav = document.querySelector('.pr-nav');
  const navToggle = document.querySelector('.pr-nav-toggle');
  const navMobile = document.querySelector('.pr-nav-mobile');

  if (nav) {
    let lastScroll = 0;

    function handleNavScroll() {
      const y = window.scrollY;

      // Scrolled state
      if (y > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      // Hide/show on scroll direction (optional — subtle UX)
      lastScroll = y;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // Mobile toggle
    if (navToggle && navMobile) {
      navToggle.addEventListener('click', () => {
        const isOpen = navMobile.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen);
      });

      // Close on link click
      navMobile.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navMobile.classList.remove('open');
          navToggle.classList.remove('open');
        });
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!nav.contains(e.target)) {
          navMobile.classList.remove('open');
          navToggle.classList.remove('open');
        }
      });
    }
  }

  /* ── Smooth Scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 100;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });

  /* ── Scroll Reveal ── */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ── Showcase Step Reveal ── */
  const showcaseSteps = document.querySelectorAll('.showcase-step');
  if (showcaseSteps.length) {
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          stepObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    showcaseSteps.forEach(step => stepObserver.observe(step));
  }

  /* ── Stats Count-Up ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
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
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(2, -10 * progress);
          const current = eased * target;
          el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = prefix + target + suffix;
        }

        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  /* ── Back to Top ── */
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Pricing Toggle ── */
  const pricingToggle = document.getElementById('pricingToggle');
  const proPrice   = document.getElementById('proPrice');
  const elitePrice = document.getElementById('elitePrice');
  const proPeriodLabel   = document.querySelectorAll('.period-label');
  const savingsBadge = document.getElementById('savingsBadge');

  const prices = {
    monthly: { pro: '$5.99', elite: '$10.99', label: 'Billed monthly' },
    annual:  { pro: '$3.99', elite: '$7.99',  label: 'Billed annually' }
  };

  let isAnnual = true;

  function updatePricing() {
    const p = isAnnual ? prices.annual : prices.monthly;
    if (proPrice) proPrice.textContent = p.pro;
    if (elitePrice) elitePrice.textContent = p.elite;
    document.querySelectorAll('.pricing-period-lbl').forEach(el => el.textContent = p.label);
    if (savingsBadge) {
      savingsBadge.style.opacity = isAnnual ? '1' : '0';
      savingsBadge.style.transform = isAnnual ? 'none' : 'translateY(-4px)';
    }
    // Update toggle labels
    const lblMonthly = document.getElementById('lblMonthly');
    const lblAnnual  = document.getElementById('lblAnnual');
    if (lblMonthly) lblMonthly.classList.toggle('active', !isAnnual);
    if (lblAnnual) lblAnnual.classList.toggle('active', isAnnual);

    // Toggle switch visual
    if (pricingToggle) pricingToggle.classList.toggle('annual', isAnnual);
  }

  if (pricingToggle) {
    pricingToggle.addEventListener('click', () => {
      isAnnual = !isAnnual;
      updatePricing();
    });
    updatePricing();
  }

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ── Contact Form ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    function validate(field, errorId, test) {
      const val = field.value.trim();
      const err = document.getElementById(errorId);
      const ok = test(val);
      field.classList.toggle('error', !ok);
      if (err) err.style.display = ok ? 'none' : 'block';
      return ok;
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name    = contactForm.querySelector('#name');
      const email   = contactForm.querySelector('#email');
      const subject = contactForm.querySelector('#subject');
      const message = contactForm.querySelector('#message');

      const valid = [
        validate(name,    'nameError',    v => v.length >= 2),
        validate(email,   'emailError',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)),
        validate(subject, 'subjectError', v => v.length >= 3),
        validate(message, 'msgError',     v => v.length >= 5),
      ].every(Boolean);

      if (!valid) return;

      const btn = contactForm.querySelector('[type="submit"]');
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

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
        contactForm.reset();
        contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      } catch (err) {
        showPopup('error', err.message);
      } finally {
        btn.innerHTML = orig;
        btn.disabled = false;
      }
    });
  }

  /* ── Popup System ── */
  window.showPopup = function (type, errMsg) {
    const overlay  = document.getElementById('popupOverlay');
    const successP = document.getElementById('successPopup');
    const errorP   = document.getElementById('errorPopup');
    if (!overlay) return;

    if (type === 'success') {
      successP && successP.classList.add('show');
    } else {
      if (errorP && errMsg) {
        const m = errorP.querySelector('.popup-msg');
        if (m) m.textContent = `Couldn't send. Error: ${errMsg}. Please email us directly.`;
      }
      errorP && errorP.classList.add('show');
    }
    overlay.classList.add('show');
  };

  window.closePopup = function () {
    document.getElementById('popupOverlay')?.classList.remove('show');
    document.getElementById('successPopup')?.classList.remove('show');
    document.getElementById('errorPopup')?.classList.remove('show');
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('popupOverlay')?.addEventListener('click', window.closePopup);
    document.querySelectorAll('.popup-close').forEach(btn => {
      btn.addEventListener('click', window.closePopup);
    });
  });

  /* ── Dodo Payments ── */
  const PAYMENT_API = (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'file:'
  )
    ? 'http://localhost:8083/app/website/payment'
    : 'https://peakroutine-hfffebbwc4bjbcer.westus-01.azurewebsites.net/app/website/payment';

  window.initiatePurchase = async function (plan, buttonEl) {
    const btn = buttonEl || event?.target;
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    try {
      const res = await fetch(PAYMENT_API + '/createCheckout', {
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

  /* ── Handle Payment Return ── */
  (function handlePaymentReturn() {
    const p = new URLSearchParams(window.location.search);
    if (p.get('payment_id') && p.get('status') === 'paid') {
      setTimeout(() => {
        const sp = document.getElementById('successPopup');
        if (sp) {
          const t = sp.querySelector('.popup-title');
          const m = sp.querySelector('.popup-msg');
          if (t) t.textContent = 'Payment Successful! 🎉';
          if (m) m.textContent = 'Thank you for subscribing to PeakRoutine! Check your email — your TestFlight download link is on its way.';
        }
        showPopup('success');
        window.history.replaceState({}, '', window.location.pathname + '#pricing');
      }, 600);
    }
  })();

  /* ── Micro-interactions: Button ripple ── */
  document.querySelectorAll('.btn-pr').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;
        width:10px;height:10px;
        background:rgba(255,255,255,0.4);
        border-radius:50%;
        transform:scale(0);
        animation:ripple 0.5s ease-out forwards;
        left:${e.clientX - rect.left - 5}px;
        top:${e.clientY - rect.top - 5}px;
        pointer-events:none;
      `;
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple animation
  const style = document.createElement('style');
  style.textContent = `@keyframes ripple { to { transform: scale(40); opacity: 0; } }`;
  document.head.appendChild(style);

})();