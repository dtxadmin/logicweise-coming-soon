/* ================================================================
   LOGIC WEISE LLC - Main JavaScript
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {
  // Year
  var yrEl = document.getElementById('yr');
  if (yrEl) {
    yrEl.textContent = new Date().getFullYear();
  }

  // Mobile nav (accessible)
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  var mobileClose = document.querySelector('.mobile-nav-close');
  var lastFocusedEl = null;

  function getFocusable(container) {
    if (!container) return [];
    return Array.prototype.slice.call(
      container.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
  }

  function isMobileNavOpen() {
    return !!(mobileNav && mobileNav.classList.contains('open'));
  }

  function openMobileNav() {
    if (!mobileNav) return;
    lastFocusedEl = document.activeElement;
    mobileNav.hidden = false;
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (toggle) {
      toggle.setAttribute('aria-expanded', 'true');
    }

    var focusables = getFocusable(mobileNav);
    if (focusables.length) {
      focusables[0].focus();
    }
  }

  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove('open');
    mobileNav.hidden = true;
    document.body.style.overflow = '';

    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    } else if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  }

  function handleNavKeydown(event) {
    if (!isMobileNavOpen()) return;

    if (event.key === 'Escape') {
      closeMobileNav();
      return;
    }

    if (event.key !== 'Tab') return;

    var focusables = getFocusable(mobileNav);
    if (!focusables.length) return;

    var first = focusables[0];
    var last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      if (isMobileNavOpen()) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', closeMobileNav);
    }

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', handleNavKeydown);
  }

  // FAQ toggles (accessible accordion)
  function closeFaqItem(item) {
    var btn = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');

    item.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (answer) {
      answer.style.maxHeight = '0';
      answer.hidden = true;
    }
  }

  function openFaqItem(item) {
    var btn = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');

    item.classList.add('open');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    if (answer) {
      answer.hidden = false;
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  }

  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        closeFaqItem(openItem);
      });

      if (!isOpen) {
        openFaqItem(item);
      }
    });
  });

  // Scroll fade-in
  var fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(function (el) {
      obs.observe(el);
    });
  } else {
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var id = link.getAttribute('href').slice(1);
      if (!id) return;

      var target = document.getElementById(id);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Active nav highlighting
  var currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;

    var normalizedHref = href.replace(/\/$/, '') || '/';
    if (normalizedHref === currentPath || (normalizedHref !== '/' && currentPath.indexOf(normalizedHref) === 0)) {
      link.classList.add('active');
    }
  });

  // CTA click tracking hooks (GA4/dataLayer compatible)
  function trackInteraction(eventName, destination) {
    var payload = {
      event: 'cta_click',
      cta_name: eventName,
      destination: destination || '',
      page_path: window.location.pathname,
      page_title: document.title
    };

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(payload);
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'cta_click', {
        cta_name: eventName,
        destination: destination || '',
        page_path: window.location.pathname
      });
    }
  }

  document.querySelectorAll('[data-track]').forEach(function (el) {
    el.addEventListener('click', function () {
      var eventName = el.getAttribute('data-track') || 'cta_click';
      var destination = el.getAttribute('href') || '';
      trackInteraction(eventName, destination);
    });
  });

  // Preserve campaign params when sending users to embedded Zoho lead forms.
  var paramsToForward = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
  var pageParams = new URLSearchParams(window.location.search || '');

  document.querySelectorAll('iframe[title="Logic Weise lead form"]').forEach(function (iframe) {
    var currentSrc = iframe.getAttribute('src');
    if (!currentSrc) return;

    try {
      var formUrl = new URL(currentSrc, window.location.origin);
      var hasUpdated = false;

      paramsToForward.forEach(function (key) {
        var value = pageParams.get(key);
        if (value && !formUrl.searchParams.has(key)) {
          formUrl.searchParams.set(key, value);
          hasUpdated = true;
        }
      });

      if (hasUpdated) {
        iframe.setAttribute('src', formUrl.toString());
      }

      iframe.addEventListener('load', function () {
        trackInteraction('zoho_iframe_loaded', formUrl.pathname || '');
      }, { once: true });
    } catch (err) {
      // Ignore malformed URLs to avoid blocking core interactions.
    }
  });
});


