/**
 * CrownCAD — Modern Industrial B2B Landing Page JavaScript
 * Sections: 1. Scroll Progress  2. Header Scroll  3. Mobile Menu
 * 4. Product Tabs  5. Capability Tabs  6. Intersection Animations
 * 7. Smooth Scroll  8. Back to Top  9. Parallax Hero  10. Staggered Reveal
 * 11. Active Nav Highlight  12. Keyboard Navigation  13. Image Lazy Loading
 * 14. News Card Tilt  15. Analytics Event Tracking
 */

(function() {
  'use strict';

  // ─── 1. Scroll Progress Bar ──────────────────────────────────
  const scrollProgress = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    scrollProgress.style.transform = `scaleX(${progress})`;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ─── 2. Header Scroll Effect ─────────────────────────────────
  const header = document.querySelector('.header');
  function handleHeaderScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // ─── 3. Mobile Menu ──────────────────────────────────────────
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('.nav-link, .btn') : [];

  function toggleMobileMenu() {
    const isOpen = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !isOpen);
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeMobileMenu() {
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
  mobileMenuLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // Close on escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMobileMenu();
  });

  // ─── 4. Product Tabs (Solusi Produk) ────────────────────────
  const productTabs = document.querySelectorAll('.tab-btn[data-tab]');
  const productPanels = document.querySelectorAll('.tab-panel[data-tab]');

  function activateProductTab(targetTab) {
    productTabs.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === targetTab);
      btn.setAttribute('aria-selected', btn.dataset.tab === targetTab);
    });
    productPanels.forEach(panel => {
      panel.classList.toggle('active', panel.dataset.tab === targetTab);
    });
  }

  productTabs.forEach(btn => {
    btn.addEventListener('click', () => activateProductTab(btn.dataset.tab));
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateProductTab(btn.dataset.tab);
      }
    });
  });

  // ─── 5. Capability Tabs (Kemampuan Inti) ────────────────────
  const capabilityTabs = document.querySelectorAll('.capability-tab[data-cap]');
  const capabilityPanels = document.querySelectorAll('.capability-panel[data-cap]');

  function activateCapabilityTab(targetCap) {
    capabilityTabs.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cap === targetCap);
      btn.setAttribute('aria-selected', btn.dataset.cap === targetCap);
    });
    capabilityPanels.forEach(panel => {
      panel.classList.toggle('active', panel.dataset.cap === targetCap);
    });
    // Re-trigger staggered animation for new panel
    const newPanel = document.querySelector(`.capability-panel[data-cap="${targetCap}"]`);
    if (newPanel) {
      const cards = newPanel.querySelectorAll('.capability-card');
      cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 80 + 100);
      });
    }
  }

  capabilityTabs.forEach(btn => {
    btn.addEventListener('click', () => activateCapabilityTab(btn.dataset.cap));
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateCapabilityTab(btn.dataset.cap);
      }
    });
  });

  // ─── 6. Intersection Observer Animations ─────────────────────
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const fadeUpElements = document.querySelectorAll('.animate-fade-up');
    const fadeInElements = document.querySelectorAll('.animate-fade-in');
    const scaleInElements = document.querySelectorAll('.animate-scale-in');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    [...fadeUpElements, ...fadeInElements, ...scaleInElements].forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  } else {
    // For reduced motion, just show everything immediately
    document.querySelectorAll('[class*="animate-"]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.animation = 'none';
    });
  }

  // ─── 7. Staggered Reveal for Grids ───────────────────────────
  function staggerReveal(selector, baseDelay = 80) {
    const items = document.querySelectorAll(selector);
    const gridObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(items).indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * baseDelay}ms`;
          entry.target.classList.add('revealed');
          gridObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    items.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(24px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      gridObserver.observe(item);
    });
  }

  // Apply to various grids after DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    staggerReveal('.product-card');
    staggerReveal('.capability-card');
    staggerReveal('.feature-card');
    staggerReveal('.arch-card');
    staggerReveal('.industry-card');
    staggerReveal('.news-card');
  });

  // ─── 8. Smooth Scroll for Anchor Links ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  // ─── 9. Back to Top Button ───────────────────────────────────
  const backToTop = document.querySelector('.back-to-top');
  function toggleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── 10. Parallax Hero Visual ────────────────────────────────
  const heroVisual = document.querySelector('.hero-visual img');
  if (heroVisual && !prefersReducedMotion) {
    let ticking = false;
    function updateParallax() {
      const scrollY = window.scrollY;
      const speed = 0.3;
      heroVisual.style.transform = `translateY(${scrollY * speed}px)`;
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // ─── 11. Active Nav Highlight on Scroll ──────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  function highlightActiveNav() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', highlightActiveNav, { passive: true });
  highlightActiveNav();

  // ─── 12. Keyboard Navigation for Tabs ────────────────────────
  function setupTabKeyboardNavigation(tabs) {
    tabs.forEach((tab, i, arr) => {
      tab.addEventListener('keydown', e => {
        let target = null;
        if (e.key === 'ArrowRight') target = arr[(i + 1) % arr.length];
        else if (e.key === 'ArrowLeft') target = arr[(i - 1 + arr.length) % arr.length];
        else if (e.key === 'Home') target = arr[0];
        else if (e.key === 'End') target = arr[arr.length - 1];
        if (target) {
          e.preventDefault();
          target.focus();
          target.click();
        }
      });
    });
  }
  setupTabKeyboardNavigation(productTabs);
  setupTabKeyboardNavigation(capabilityTabs);

  // ─── 13. Image Lazy Loading Enhancement ──────────────────────
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
  } else {
    // Fallback for older browsers
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imgObserver.observe(img));
  }

  // ─── 14. News Card Tilt Effect (Desktop only) ────────────────
  const newsCards = document.querySelectorAll('.news-card');
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    newsCards.forEach(card => {
      const thumb = card.querySelector('.news-thumb img');
      card.addEventListener('mousemove', e => {
        if (!thumb) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        thumb.style.transform = `perspective(1000px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) scale(1.05)`;
      });
      card.addEventListener('mouseleave', () => {
        if (thumb) thumb.style.transform = '';
      });
    });
  }

  // ─── 15. Analytics Event Tracking ────────────────────────────
  window.CrownCAD = {
    trackEvent: (eventName, data) => {
      // Integration point for analytics
      console.log('[CrownCAD Event]', eventName, data);
    }
  };

})();