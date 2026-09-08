/**
 * Apex Abroad - Primary JavaScript Functionality
 * Handles:
 * - Sticky header
 * - Mobile nav drawer & submenus
 * - Testimonial carousel (Auto-slide, pause-on-hover, dots, prev/next)
 * - FAQ accordions
 * - Form validation (Booking & Contact) with localStorage persistence
 * - Interactive statistics counter with IntersectionObserver
 * - Back to top button
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initTestimonialCarousel();
  initFaqAccordion();
  initStatsCounter();
  initBookingForm();
  initContactForm();
  initBackToTop();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   Sticky Header
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close');

  if (!drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Mobile Dropdown toggles
  const dropdownToggles = drawer.querySelectorAll('.mobile-dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const submenu = toggle.nextElementSibling;
      if (submenu && submenu.classList.contains('mobile-submenu')) {
        const isOpen = submenu.classList.contains('open');
        // Close others
        drawer.querySelectorAll('.mobile-submenu').forEach(sm => sm.classList.remove('open'));
        if (!isOpen) {
          submenu.classList.add('open');
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Testimonial Carousel
   -------------------------------------------------------------------------- */
function initTestimonialCarousel() {
  const container = document.querySelector('.testimonials-cards-container');
  if (!container) return;

  const track = container.querySelector('.testimonials-track');
  const cards = container.querySelectorAll('.testimonial-card');
  const dotsContainer = document.querySelector('.carousel-controls');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  if (!track || cards.length === 0) return;

  let currentIndex = 0;
  let autoSlideTimer = null;
  const totalSlides = cards.length;

  // Determine items per view based on window width
  const getItemsPerView = () => (window.innerWidth <= 992 ? 1 : 2);

  // Generate dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    const maxDots = Math.ceil(totalSlides / getItemsPerView());
    for (let i = 0; i < maxDots; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(i * getItemsPerView());
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    }
  }

  const updateCarousel = () => {
    const itemsPerView = getItemsPerView();
    const cardWidth = cards[0].offsetWidth;
    const gap = 20; // 20px gap
    const shift = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${shift}px)`;

    // Update dots
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];
    const activeDotIndex = Math.floor(currentIndex / itemsPerView);
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeDotIndex);
    });
  };

  const goToSlide = (index) => {
    const itemsPerView = getItemsPerView();
    const maxIndex = Math.max(0, totalSlides - itemsPerView);
    if (index > maxIndex) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = maxIndex;
    } else {
      currentIndex = index;
    }
    updateCarousel();
  };

  const nextSlide = () => {
    const itemsPerView = getItemsPerView();
    const maxIndex = Math.max(0, totalSlides - itemsPerView);
    if (currentIndex >= maxIndex) {
      goToSlide(0);
    } else {
      goToSlide(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex <= 0) {
      const itemsPerView = getItemsPerView();
      goToSlide(Math.max(0, totalSlides - itemsPerView));
    } else {
      goToSlide(currentIndex - 1);
    }
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });
  }

  // Auto slide with pause on hover
  const startAutoSlide = () => {
    autoSlideTimer = setInterval(nextSlide, 5000);
  };

  const stopAutoSlide = () => {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
  };

  const resetAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
  };

  container.addEventListener('mouseenter', stopAutoSlide);
  container.addEventListener('mouseleave', startAutoSlide);
  container.addEventListener('touchstart', stopAutoSlide, { passive: true });
  container.addEventListener('touchend', startAutoSlide, { passive: true });

  window.addEventListener('resize', updateCarousel);
  startAutoSlide();
}

/* --------------------------------------------------------------------------
   FAQ Accordions
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (!accordionItems.length) return;

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items in the same container
      const parent = item.parentElement;
      if (parent) {
        parent.querySelectorAll('.accordion-item').forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherContent = other.querySelector('.accordion-content');
            if (otherContent) otherContent.style.maxHeight = null;
          }
        });
      }

      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Animated Statistics Counter (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('[data-counter]');
  if (!statNumbers.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;
    }, stepTime);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  statNumbers.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Booking Counseling Form
   -------------------------------------------------------------------------- */
function initBookingForm() {
  const form = document.getElementById('counselingBookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const getVal = (id) => (form.querySelector(`#${id}`) ? form.querySelector(`#${id}`).value.trim() : '');
    const showError = (id, msg) => {
      const errEl = form.querySelector(`#${id}Error`);
      if (errEl) {
        errEl.textContent = msg;
        errEl.classList.add('visible');
      }
      isValid = false;
    };
    const clearError = (id) => {
      const errEl = form.querySelector(`#${id}Error`);
      if (errEl) {
        errEl.textContent = '';
        errEl.classList.remove('visible');
      }
    };

    // Fields
    const fullName = getVal('fullName');
    const email = getVal('email');
    const phone = getVal('phone');
    const preferredCountry = getVal('preferredCountry');
    const interestedCourse = getVal('interestedCourse');
    const preferredDate = getVal('preferredDate');
    const preferredTime = getVal('preferredTime');
    const message = getVal('message');

    // Validation
    if (!fullName) showError('fullName', 'Please enter your full name');
    else clearError('fullName');

    if (!email || !/\S+@\S+\.\S+/.test(email)) showError('email', 'Please provide a valid email address');
    else clearError('email');

    if (!phone || phone.length < 7) showError('phone', 'Please enter a valid phone number');
    else clearError('phone');

    if (!preferredCountry) showError('preferredCountry', 'Please select your preferred study destination');
    else clearError('preferredCountry');

    if (!interestedCourse) showError('interestedCourse', 'Please select a test prep or course');
    else clearError('interestedCourse');

    if (!preferredDate) showError('preferredDate', 'Please choose a preferred consultation date');
    else clearError('preferredDate');

    if (!preferredTime) showError('preferredTime', 'Please choose a preferred time slot');
    else clearError('preferredTime');

    if (!isValid) return;

    // Loading State
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" style="width:16px;height:16px;animation:spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        Scheduling Session...
      `;
    }

    setTimeout(() => {
      // Generate reference ID
      const refNumber = 'APX-' + Math.floor(100000 + Math.random() * 900000);
      const bookingData = {
        refNumber,
        fullName,
        email,
        phone,
        preferredCountry,
        interestedCourse,
        preferredDate,
        preferredTime,
        message,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('apex_counseling_bookings') || '[]');
        saved.unshift(bookingData);
        localStorage.setItem('apex_counseling_bookings', JSON.stringify(saved));
      } catch (err) {
        console.error('Storage error', err);
      }

      // Show Success Card
      const successCard = document.getElementById('bookingSuccessState');
      const refBadge = document.getElementById('bookingRefCode');
      const clientNameBadge = document.getElementById('bookingClientName');
      const clientDateBadge = document.getElementById('bookingDateSlot');

      if (successCard) {
        if (refBadge) refBadge.textContent = refNumber;
        if (clientNameBadge) clientNameBadge.textContent = fullName;
        if (clientDateBadge) clientDateBadge.textContent = `${preferredDate} at ${preferredTime}`;

        form.style.display = 'none';
        successCard.style.display = 'block';
        successCard.scrollIntoView({ behavior: 'smooth' });
      }

      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }, 900);
  });
}

/* --------------------------------------------------------------------------
   Contact Form Functionality
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const getVal = (id) => (form.querySelector(`#${id}`) ? form.querySelector(`#${id}`).value.trim() : '');
    const showError = (id, msg) => {
      const errEl = form.querySelector(`#${id}Error`);
      if (errEl) {
        errEl.textContent = msg;
        errEl.classList.add('visible');
      }
      isValid = false;
    };
    const clearError = (id) => {
      const errEl = form.querySelector(`#${id}Error`);
      if (errEl) {
        errEl.textContent = '';
        errEl.classList.remove('visible');
      }
    };

    const name = getVal('contactName');
    const email = getVal('contactEmail');
    const phone = getVal('contactPhone');
    const subject = getVal('contactSubject');
    const message = getVal('contactMessage');

    if (!name) showError('contactName', 'Please enter your name');
    else clearError('contactName');

    if (!email || !/\S+@\S+\.\S+/.test(email)) showError('contactEmail', 'Please enter a valid email address');
    else clearError('contactEmail');

    if (!phone) showError('contactPhone', 'Please enter your contact phone');
    else clearError('contactPhone');

    if (!subject) showError('contactSubject', 'Please enter a subject');
    else clearError('contactSubject');

    if (!message || message.length < 5) showError('contactMessage', 'Please write your message');
    else clearError('contactMessage');

    if (!isValid) return;

    // Loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const origText = submitBtn ? submitBtn.innerHTML : 'Send Message';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Message...';
    }

    setTimeout(() => {
      const refNumber = 'APX-MSG-' + Math.floor(10000 + Math.random() * 90000);
      const contactData = {
        refNumber,
        name,
        email,
        phone,
        subject,
        message,
        createdAt: new Date().toISOString()
      };

      try {
        const messages = JSON.parse(localStorage.getItem('apex_contact_messages') || '[]');
        messages.unshift(contactData);
        localStorage.setItem('apex_contact_messages', JSON.stringify(messages));
      } catch (err) {
        console.error('Storage error', err);
      }

      const successBox = document.getElementById('contactSuccessBox');
      const refSpan = document.getElementById('contactRefNumber');
      if (successBox) {
        if (refSpan) refSpan.textContent = refNumber;
        form.style.display = 'none';
        successBox.style.display = 'block';
      }

      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    }, 800);
  });
}

/* --------------------------------------------------------------------------
   Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   Smooth Scroll for Anchor Links
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
