/* =============================================
   TAXI OFICIAL AEROPUERTO INTI SPA
   Main JavaScript
   ============================================= */

(function () {
  'use strict';

  /* ---- Navbar scroll effect ---- */
  const header = document.getElementById('header');

  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNavLink();
    toggleBackToTop();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
      navToggle.setAttribute('aria-expanded', false);
    });
  });

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollY = window.scrollY + 90;
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 100) {
        current = section.getAttribute('id');
      }
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  /* ---- Back to top ---- */
  const backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen   = btn.getAttribute('aria-expanded') === 'true';
      const answer   = btn.nextElementSibling;
      const faqItem  = btn.closest('.faq-item');

      // Close all open answers
      document.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(openBtn => {
        openBtn.setAttribute('aria-expanded', 'false');
        openBtn.nextElementSibling.classList.remove('open');
        openBtn.closest('.faq-item').style.background = '';
      });

      // Open clicked (if it was closed)
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });

  /* ---- Booking form ---- */
  const bookingForm   = document.getElementById('bookingForm');
  const formSuccess   = document.getElementById('formSuccess');
  const dateInput     = document.getElementById('fecha');

  // Set min date to today
  if (dateInput) {
    const today = new Date();
    const yyyy  = today.getFullYear();
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const dd    = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm()) return;

      const btn = bookingForm.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = `
        <svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        Enviando...
      `;

      // Simulate form submission (replace with real backend/API call)
      setTimeout(() => {
        bookingForm.classList.add('hidden');
        formSuccess.classList.remove('hidden');
        // Scroll into view
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1800);
    });
  }

  function validateForm() {
    let valid = true;
    const required = bookingForm.querySelectorAll('[required]');

    required.forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    // Email validation
    const emailField = document.getElementById('email');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.classList.add('error');
      valid = false;
    }

    if (!valid) {
      const firstError = bookingForm.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return valid;
  }

  // Remove error state on input
  if (bookingForm) {
    bookingForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => field.classList.remove('error'));
    });
  }

  /* ---- Scroll reveal animations ---- */
  const revealEls = document.querySelectorAll(
    '.service-card, .rate-card, .testimonial-card, .why-item, .step, .faq-item, .contact-item, .trust-item'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (entry.target.dataset.delay || 0) * 1000);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, index) => {
    el.dataset.delay = (index % 4) * 0.1;
    observer.observe(el);
  });

  /* ---- Section reveals ---- */
  const sectionHeaders = document.querySelectorAll('.section-header, .why-visual, .why-content, .booking-info, .booking-form-wrap, .contact-info, .map-wrap');
  sectionHeaders.forEach(el => el.classList.add('reveal'));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  sectionHeaders.forEach(el => sectionObserver.observe(el));

  /* ---- Smooth anchor links for inline hrefs ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });

  /* ---- Spinner CSS (injected dynamically) ---- */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .spin { animation: spin .8s linear infinite; }
  `;
  document.head.appendChild(style);

  /* ---- Initial call ---- */
  onScroll();

})();
