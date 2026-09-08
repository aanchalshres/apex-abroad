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
   Booking Counseling Form (AJAX with localStorage demo)
   -------------------------------------------------------------------------- */
function initBookingForm() {
  const form = document.querySelector('.ajax-booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values by name
    const formData = new FormData(form);
    const name = formData.get('name')?.trim() || '';
    const phone = formData.get('phone')?.trim() || '';
    const email = formData.get('email')?.trim() || '';
    const destination = formData.get('destination')?.trim() || '';
    const mode = formData.get('mode')?.trim() || '';
    const preferredDate = formData.get('preferredDate')?.trim() || '';
    const timeSlot = formData.get('timeSlot')?.trim() || '';
    const qualification = formData.get('qualification')?.trim() || '';
    const notes = formData.get('notes')?.trim() || '';

    // Validation
    let isValid = true;
    let errorMsg = '';

    if (!name) {
      errorMsg = 'Please enter your full name';
      isValid = false;
    } else if (!phone || phone.length < 7) {
      errorMsg = 'Please enter a valid phone number';
      isValid = false;
    } else if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errorMsg = 'Please enter a valid email address';
      isValid = false;
    } else if (!destination) {
      errorMsg = 'Please select a destination country';
      isValid = false;
    } else if (!mode) {
      errorMsg = 'Please select a counseling mode';
      isValid = false;
    } else if (!preferredDate) {
      errorMsg = 'Please select a preferred date';
      isValid = false;
    } else if (!timeSlot) {
      errorMsg = 'Please select a time slot';
      isValid = false;
    } else if (!qualification) {
      errorMsg = 'Please select your qualification';
      isValid = false;
    }

    if (!isValid) {
      alert(errorMsg);
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.innerHTML;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Processing... ⏳';
    }

    // Simulate API call with setTimeout
    setTimeout(() => {
      // Generate reference ID
      const refNumber = 'APX-' + Date.now().toString().slice(-8).toUpperCase();

      // Create booking data
      const bookingData = {
        refNumber,
        name,
        phone,
        email,
        destination,
        mode,
        preferredDate,
        timeSlot,
        qualification,
        notes,
        createdAt: new Date().toLocaleString()
      };

      // Save to localStorage
      try {
        const existingBookings = JSON.parse(localStorage.getItem('apex_bookings') || '[]');
        existingBookings.push(bookingData);
        localStorage.setItem('apex_bookings', JSON.stringify(existingBookings));
        console.log('Booking saved:', bookingData);
      } catch (err) {
        console.error('Storage error:', err);
      }

      // Show success message
      const successMsg = `✅ Success!\n\nYour appointment has been confirmed.\n\nReference: ${refNumber}\nDate: ${preferredDate}\nTime: ${timeSlot}\n\nYou will receive an email confirmation shortly.`;
      alert(successMsg);

      // Reset form
      form.reset();
      
      // Restore button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }, 1000);
  });
}

/* --------------------------------------------------------------------------
   Contact Form Functionality (AJAX with localStorage demo)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector('.ajax-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values by name
    const formData = new FormData(form);
    const name = formData.get('name')?.trim() || '';
    const email = formData.get('email')?.trim() || '';
    const phone = formData.get('phone')?.trim() || '';
    const destination = formData.get('destination')?.trim() || '';
    const message = formData.get('message')?.trim() || '';

    // Validation
    let isValid = true;
    let errorMsg = '';

    if (!name) {
      errorMsg = 'Please enter your full name';
      isValid = false;
    } else if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errorMsg = 'Please enter a valid email address';
      isValid = false;
    } else if (!phone) {
      errorMsg = 'Please enter your phone number';
      isValid = false;
    } else if (!destination) {
      errorMsg = 'Please select a destination country';
      isValid = false;
    } else if (!message || message.length < 10) {
      errorMsg = 'Please enter a message (at least 10 characters)';
      isValid = false;
    }

    if (!isValid) {
      alert(errorMsg);
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.innerHTML;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... ⏳';
    }

    // Simulate API call with setTimeout
    setTimeout(() => {
      // Generate reference ID
      const refNumber = 'MSG-' + Date.now().toString().slice(-8).toUpperCase();

      // Create message data
      const messageData = {
        refNumber,
        name,
        email,
        phone,
        destination,
        message,
        createdAt: new Date().toLocaleString()
      };

      // Save to localStorage
      try {
        const existingMessages = JSON.parse(localStorage.getItem('apex_messages') || '[]');
        existingMessages.push(messageData);
        localStorage.setItem('apex_messages', JSON.stringify(existingMessages));
        console.log('Message saved:', messageData);
      } catch (err) {
        console.error('Storage error:', err);
      }

      // Show success message
      const successMsg = `✅ Message Sent!\n\nThank you for contacting Apex Abroad.\n\nReference: ${refNumber}\n\nOur team will respond within 24 hours.\nCheck your email for updates.`;
      alert(successMsg);

      // Reset form
      form.reset();
      
      // Restore button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }, 1000);
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
