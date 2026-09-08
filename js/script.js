/**
 * Apex Abroad - Primary JavaScript Functionality & Feedback Engine
 * Handles:
 * - Sticky header
 * - Mobile nav drawer & submenus
 * - Testimonial carousel (Auto-slide, pause-on-hover, dots, prev/next)
 * - FAQ accordions
 * - Interactive statistics counter with IntersectionObserver
 * - Back to top button & smooth scroll
 * - Frontend Feedback Engine:
 *   - Custom Toast Notifications (Success, Error, Info, Warning)
 *   - Modal Confirmation Dialogs with Reference Numbers & Copy features
 *   - Booking Counseling Form validation & submission with localStorage
 *   - Contact Form validation & submission with localStorage
 *   - Newsletter / Signup Form validation & submission with localStorage
 *   - Interactive Button Loading States & Universal Visible Click Feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  initToastSystem();
  initModalSystem();
  initStickyHeader();
  initMobileNav();
  initTestimonialCarousel();
  initFaqAccordion();
  initStatsCounter();
  initBookingForm();
  initContactForm();
  initNewsletterForm();
  initGlobalActionFeedback();
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

  const getItemsPerView = () => (window.innerWidth <= 992 ? 1 : 2);

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
    const gap = 20;
    const shift = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${shift}px)`;

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
   FAQ Accordions & Interactive Expansion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  // Support standard .accordion-item elements
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  if (accordionItems.length) {
    accordionItems.forEach(item => {
      const trigger = item.querySelector('.accordion-trigger');
      const content = item.querySelector('.accordion-content');

      if (!trigger || !content) return;

      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        const parent = item.parentElement;

        if (parent) {
          parent.querySelectorAll('.accordion-item').forEach(other => {
            if (other !== item) {
              other.classList.remove('active');
              trigger.setAttribute('aria-expanded', 'false');
              const otherContent = other.querySelector('.accordion-content');
              if (otherContent) {
                otherContent.style.maxHeight = null;
                otherContent.setAttribute('aria-hidden', 'true');
              }
            }
          });
        }

        if (isActive) {
          item.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
          content.style.maxHeight = null;
          content.setAttribute('aria-hidden', 'true');
        } else {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 'px';
          content.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }

  // Also support .faq-question inside .card or .faq-item elements
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const card = q.closest('.card, .faq-item');
      if (!card) return;

      const answer = card.querySelector('.faq-answer');
      const toggleIcon = q.querySelector('.faq-toggle-icon');
      const isOpen = card.classList.contains('active') || (answer && answer.style.display === 'block');

      // Close sibling FAQs in same container
      const container = card.parentElement;
      if (container) {
        container.querySelectorAll('.card, .faq-item').forEach(other => {
          if (other !== card) {
            other.classList.remove('active');
            const otherAns = other.querySelector('.faq-answer');
            const otherIcon = other.querySelector('.faq-toggle-icon');
            if (otherAns) {
              otherAns.style.display = 'none';
              otherAns.style.maxHeight = null;
            }
            if (otherIcon) otherIcon.textContent = '+';
          }
        });
      }

      if (isOpen) {
        card.classList.remove('active');
        if (answer) {
          answer.style.display = 'none';
          answer.style.maxHeight = null;
        }
        if (toggleIcon) toggleIcon.textContent = '+';
      } else {
        card.classList.add('active');
        if (answer) {
          answer.style.display = 'block';
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
        if (toggleIcon) toggleIcon.textContent = '−';
      }
    });
  });

  // Category filter tabs for FAQ page if present
  const categoryBtns = document.querySelectorAll('.faq-category-btn');
  if (categoryBtns.length) {
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');
        const groups = document.querySelectorAll('.faq-group');
        groups.forEach(group => {
          if (category === 'all' || group.getAttribute('data-group') === category) {
            group.style.display = 'block';
          } else {
            group.style.display = 'none';
          }
        });
      });
    });
  }
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
    const duration = 1800;
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
   Toast Notification System
   -------------------------------------------------------------------------- */
let toastContainerEl = null;

function initToastSystem() {
  if (!document.getElementById('toastContainer')) {
    toastContainerEl = document.createElement('div');
    toastContainerEl.id = 'toastContainer';
    document.body.appendChild(toastContainerEl);
  } else {
    toastContainerEl = document.getElementById('toastContainer');
  }
}

/**
 * Show a toast notification
 * @param {Object} opts
 * @param {'success'|'error'|'info'|'warning'} opts.type
 * @param {string} opts.title
 * @param {string} opts.message
 * @param {number} [opts.duration=4500]
 */
function showToast({ type = 'success', title = '', message = '', duration = 4500 }) {
  if (!toastContainerEl) initToastSystem();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  };

  toast.innerHTML = `
    <div class="toast-icon-wrapper">
      ${iconMap[type] || iconMap.info}
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close-btn" aria-label="Close notification">&times;</button>
    <div class="toast-progress-bar" style="animation: toastProgress ${duration}ms linear forwards;"></div>
  `;

  toastContainerEl.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
  });

  const removeToast = () => {
    toast.classList.remove('toast-show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 350);
  };

  const timer = setTimeout(removeToast, duration);

  const closeBtn = toast.querySelector('.toast-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      clearTimeout(timer);
      removeToast();
    });
  }
}

/* --------------------------------------------------------------------------
   Modal Confirmation System
   -------------------------------------------------------------------------- */
let modalOverlayEl = null;

function initModalSystem() {
  if (!document.getElementById('feedbackModalOverlay')) {
    modalOverlayEl = document.createElement('div');
    modalOverlayEl.id = 'feedbackModalOverlay';
    modalOverlayEl.className = 'feedback-modal-overlay';
    modalOverlayEl.innerHTML = `
      <div class="feedback-modal" role="dialog" aria-modal="true">
        <button class="feedback-modal-close" id="modalCloseBtn" aria-label="Close modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div class="feedback-modal-icon" id="modalIcon">🎉</div>
        <h3 class="feedback-modal-title" id="modalTitle">Booking Confirmed!</h3>
        <p class="feedback-modal-subtitle" id="modalSubtitle">Your consultation has been successfully scheduled.</p>
        <div class="feedback-ref-badge" id="modalRefBadge">Ref: APX-849201</div>
        <div class="feedback-modal-details" id="modalDetails"></div>
        <div class="feedback-modal-actions">
          <button class="btn btn-primary" id="modalConfirmBtn" style="padding: 10px 24px;">Done</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlayEl);

    const closeBtn = modalOverlayEl.querySelector('#modalCloseBtn');
    const confirmBtn = modalOverlayEl.querySelector('#modalConfirmBtn');

    const closeModal = () => {
      modalOverlayEl.classList.remove('active');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (confirmBtn) confirmBtn.addEventListener('click', closeModal);
    modalOverlayEl.addEventListener('click', (e) => {
      if (e.target === modalOverlayEl) closeModal();
    });
  } else {
    modalOverlayEl = document.getElementById('feedbackModalOverlay');
  }
}

/**
 * Show Modal Dialog with summary details
 * @param {Object} opts
 * @param {string} opts.title
 * @param {string} opts.subtitle
 * @param {string} opts.refNumber
 * @param {Array<{label: string, value: string}>} [opts.details]
 * @param {string} [opts.icon]
 */
function showFeedbackModal({ title, subtitle, refNumber, details = [], icon = '🎉' }) {
  if (!modalOverlayEl) initModalSystem();

  const titleEl = modalOverlayEl.querySelector('#modalTitle');
  const subtitleEl = modalOverlayEl.querySelector('#modalSubtitle');
  const refBadgeEl = modalOverlayEl.querySelector('#modalRefBadge');
  const detailsEl = modalOverlayEl.querySelector('#modalDetails');
  const iconEl = modalOverlayEl.querySelector('#modalIcon');

  if (titleEl) titleEl.textContent = title;
  if (subtitleEl) subtitleEl.textContent = subtitle;
  if (iconEl) iconEl.textContent = icon;

  if (refBadgeEl) {
    if (refNumber) {
      refBadgeEl.style.display = 'inline-flex';
      refBadgeEl.textContent = `Reference #: ${refNumber}`;
    } else {
      refBadgeEl.style.display = 'none';
    }
  }

  if (detailsEl) {
    if (details && details.length > 0) {
      detailsEl.style.display = 'flex';
      detailsEl.innerHTML = details.map(item => `
        <div class="feedback-detail-item">
          <span class="feedback-detail-label">${item.label}:</span>
          <span class="feedback-detail-value">${item.value}</span>
        </div>
      `).join('');
    } else {
      detailsEl.style.display = 'none';
    }
  }

  modalOverlayEl.classList.add('active');
}

/* --------------------------------------------------------------------------
   Booking Counseling Form (AJAX with localStorage demo)
   -------------------------------------------------------------------------- */
function initBookingForm() {
  const forms = document.querySelectorAll('.ajax-booking-form, #bookingForm');
  if (!forms.length) return;

  forms.forEach(form => {
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => input.classList.remove('input-error'));
      input.addEventListener('change', () => input.classList.remove('input-error'));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const name = formData.get('name')?.toString().trim() || '';
      const phone = formData.get('phone')?.toString().trim() || '';
      const email = formData.get('email')?.toString().trim() || '';
      const destination = formData.get('destination')?.toString().trim() || '';
      const mode = formData.get('mode')?.toString().trim() || '';
      const preferredDate = formData.get('preferredDate')?.toString().trim() || '';
      const timeSlot = formData.get('timeSlot')?.toString().trim() || '';
      const qualification = formData.get('qualification')?.toString().trim() || '';
      const notes = formData.get('notes')?.toString().trim() || '';

      let isValid = true;
      let firstInvalidInput = null;

      const validateInput = (inputName, condition) => {
        const inputEl = form.querySelector(`[name="${inputName}"]`);
        if (!condition) {
          isValid = false;
          if (inputEl) {
            inputEl.classList.add('input-error');
            if (!firstInvalidInput) firstInvalidInput = inputEl;
          }
        } else if (inputEl) {
          inputEl.classList.remove('input-error');
        }
      };

      validateInput('name', name.length >= 2);
      validateInput('phone', phone.length >= 7);
      validateInput('email', /\S+@\S+\.\S+/.test(email));
      validateInput('destination', destination.length > 0);
      validateInput('mode', mode.length > 0);
      validateInput('preferredDate', preferredDate.length > 0);
      validateInput('timeSlot', timeSlot.length > 0);
      validateInput('qualification', qualification.length > 0);

      if (!isValid) {
        if (firstInvalidInput) firstInvalidInput.focus();
        showToast({
          type: 'error',
          title: 'Validation Error',
          message: 'Please complete all required fields marked with * before submitting.'
        });
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.btn-primary');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Confirm Appointment Booking';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
        submitBtn.innerHTML = `<span class="btn-spinner"></span> Confirming Appointment...`;
      }

      setTimeout(() => {
        const refNumber = 'APX-' + Math.floor(100000 + Math.random() * 900000);

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

        try {
          const existing = JSON.parse(localStorage.getItem('apex_bookings') || '[]');
          existing.push(bookingData);
          localStorage.setItem('apex_bookings', JSON.stringify(existing));
        } catch (err) {
          console.error('Storage error:', err);
        }

        if (submitBtn) {
          submitBtn.classList.remove('btn-loading');
          submitBtn.classList.add('btn-success-state');
          submitBtn.innerHTML = `✓ Booking Confirmed!`;
        }

        showToast({
          type: 'success',
          title: 'Booking confirmed!',
          message: `Booking/Reference Number: ${refNumber}. We look forward to meeting you!`
        });

        showFeedbackModal({
          title: 'Booking confirmed!',
          subtitle: 'Your 1-on-1 counseling session has been successfully scheduled.',
          refNumber,
          icon: '🎓',
          details: [
            { label: 'Applicant Name', value: name },
            { label: 'Target Destination', value: destination },
            { label: 'Counseling Mode', value: mode },
            { label: 'Date', value: preferredDate },
            { label: 'Time Slot', value: timeSlot },
            { label: 'Qualification', value: qualification }
          ]
        });

        setTimeout(() => {
          form.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-success-state');
            submitBtn.innerHTML = originalText;
          }
        }, 2500);
      }, 900);
    });
  });
}

/* --------------------------------------------------------------------------
   Contact Form Functionality (AJAX with localStorage demo)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const forms = document.querySelectorAll('.ajax-contact-form, #contactForm');
  if (!forms.length) return;

  forms.forEach(form => {
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => input.classList.remove('input-error'));
      input.addEventListener('change', () => input.classList.remove('input-error'));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const name = formData.get('name')?.toString().trim() || '';
      const email = formData.get('email')?.toString().trim() || '';
      const phone = formData.get('phone')?.toString().trim() || '';
      const destination = formData.get('destination')?.toString().trim() || '';
      const message = formData.get('message')?.toString().trim() || '';

      let isValid = true;
      let firstInvalidInput = null;

      const validateInput = (inputName, condition) => {
        const inputEl = form.querySelector(`[name="${inputName}"]`);
        if (!condition) {
          isValid = false;
          if (inputEl) {
            inputEl.classList.add('input-error');
            if (!firstInvalidInput) firstInvalidInput = inputEl;
          }
        } else if (inputEl) {
          inputEl.classList.remove('input-error');
        }
      };

      validateInput('name', name.length >= 2);
      validateInput('email', /\S+@\S+\.\S+/.test(email));
      validateInput('phone', phone.length >= 7);
      validateInput('destination', destination.length > 0);
      validateInput('message', message.length >= 10);

      if (!isValid) {
        if (firstInvalidInput) firstInvalidInput.focus();
        showToast({
          type: 'error',
          title: 'Validation Error',
          message: 'Please complete all required fields with valid details (message min 10 characters).'
        });
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.btn-primary');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit Inquiry';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
        submitBtn.innerHTML = `<span class="btn-spinner"></span> Sending Message...`;
      }

      setTimeout(() => {
        const refNumber = 'MSG-' + Math.floor(100000 + Math.random() * 900000);

        const contactData = {
          refNumber,
          name,
          email,
          phone,
          destination,
          message,
          createdAt: new Date().toLocaleString()
        };

        try {
          const existing = JSON.parse(localStorage.getItem('apex_messages') || '[]');
          existing.push(contactData);
          localStorage.setItem('apex_messages', JSON.stringify(existing));
        } catch (err) {
          console.error('Storage error:', err);
        }

        if (submitBtn) {
          submitBtn.classList.remove('btn-loading');
          submitBtn.classList.add('btn-success-state');
          submitBtn.innerHTML = `✓ Message Sent!`;
        }

        showToast({
          type: 'success',
          title: 'Message sent successfully!',
          message: `Reference #: ${refNumber}. Thank you for contacting Apex Abroad. Our team will respond within 24 hours.`
        });

        showFeedbackModal({
          title: 'Message sent successfully!',
          subtitle: 'Our educational counselors will review your message and reach out shortly.',
          refNumber,
          icon: '✉️',
          details: [
            { label: 'Full Name', value: name },
            { label: 'Email', value: email },
            { label: 'Phone', value: phone },
            { label: 'Target Country', value: destination }
          ]
        });

        setTimeout(() => {
          form.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-success-state');
            submitBtn.innerHTML = originalText;
          }
        }, 2500);
      }, 900);
    });
  });
}

/* --------------------------------------------------------------------------
   Newsletter / Signup Form Handler
   -------------------------------------------------------------------------- */
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-form, .subscribe-form, #newsletterForm');

  forms.forEach(form => {
    const input = form.querySelector('input[type="email"]');
    if (input) {
      input.addEventListener('input', () => input.classList.remove('input-error'));
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = input ? input.value.trim() : '';

      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        if (input) {
          input.classList.add('input-error');
          input.focus();
        }
        showToast({
          type: 'error',
          title: 'Validation Error',
          message: 'Please enter a valid email address to subscribe.'
        });
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Subscribe';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
        submitBtn.innerHTML = `<span class="btn-spinner"></span> Subscribing...`;
      }

      setTimeout(() => {
        try {
          const subscribers = JSON.parse(localStorage.getItem('apex_subscribers') || '[]');
          if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('apex_subscribers', JSON.stringify(subscribers));
          }
        } catch (err) {
          console.error('Storage error:', err);
        }

        if (submitBtn) {
          submitBtn.classList.remove('btn-loading');
          submitBtn.classList.add('btn-success-state');
          submitBtn.innerHTML = `✓ Subscribed!`;
        }

        showToast({
          type: 'success',
          title: 'Subscribed Successfully!',
          message: 'Thank you for subscribing to Apex Abroad! You will receive the latest study abroad news and scholarship updates.'
        });

        setTimeout(() => {
          form.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-success-state');
            submitBtn.innerHTML = originalText;
          }
        }, 2000);
      }, 800);
    });
  });
}

/* --------------------------------------------------------------------------
   Universal Visible Feedback for Every Button / Action Link
   -------------------------------------------------------------------------- */
function initGlobalActionFeedback() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('button, a, .btn, [data-action]');
    if (!target) return;

    target.classList.add('btn-click-effect');
    setTimeout(() => target.classList.remove('btn-click-effect'), 150);

    const href = target.getAttribute('href') || '';
    const text = target.innerText ? target.innerText.trim() : '';

    if (target.type === 'submit' && target.closest('form')) {
      return;
    }

    // Tel Links
    if (href.startsWith('tel:')) {
      const phoneNum = href.replace('tel:', '');
      try { navigator.clipboard.writeText(phoneNum); } catch(err) {}
      showToast({
        type: 'info',
        title: 'Calling Apex Abroad',
        message: `Connecting to ${phoneNum}. Phone number copied to clipboard.`
      });
      return;
    }

    // Mailto Links
    if (href.startsWith('mailto:')) {
      const emailAddr = href.replace('mailto:', '');
      showToast({
        type: 'info',
        title: 'Opening Email Client',
        message: `Preparing inquiry email to ${emailAddr}...`
      });
      return;
    }

    // Download buttons
    if (text.toLowerCase().includes('download') || target.hasAttribute('download')) {
      e.preventDefault();
      const docTitle = text.replace(/[^a-zA-Z0-9\s]/g, '') || 'Guide Document';

      const originalHtml = target.innerHTML;
      target.style.pointerEvents = 'none';
      target.innerHTML = `<span class="btn-spinner btn-spinner-dark"></span> Downloading...`;

      setTimeout(() => {
        target.style.pointerEvents = 'auto';
        target.innerHTML = originalHtml;
        showToast({
          type: 'success',
          title: 'Document Downloaded',
          message: `📄 "${docTitle}" has been saved to your device.`
        });
      }, 800);
      return;
    }

    // Check Eligibility buttons
    if (text.toLowerCase().includes('check eligibility')) {
      e.preventDefault();
      const originalHtml = target.innerHTML;
      target.style.pointerEvents = 'none';
      target.innerHTML = `<span class="btn-spinner btn-spinner-dark"></span> Checking Eligibility...`;

      setTimeout(() => {
        target.style.pointerEvents = 'auto';
        target.innerHTML = originalHtml;
        showToast({
          type: 'success',
          title: 'Eligibility Criteria Met!',
          message: 'Your background meets initial entry guidelines! Book a free consultation to submit your application.'
        });
      }, 750);
      return;
    }

    // Request Information / Trial Class / Assessment
    if (text.toLowerCase().includes('request') || text.toLowerCase().includes('trial class') || text.toLowerCase().includes('assessment')) {
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        showToast({
          type: 'info',
          title: 'Action Initiated',
          message: 'Redirecting to complete your counseling registration...'
        });
        return;
      }
      e.preventDefault();
      const originalHtml = target.innerHTML;
      target.style.pointerEvents = 'none';
      target.innerHTML = `<span class="btn-spinner"></span> Processing Request...`;

      setTimeout(() => {
        target.style.pointerEvents = 'auto';
        target.innerHTML = originalHtml;
        showToast({
          type: 'success',
          title: 'Request Submitted!',
          message: 'Thank you! Our advisory team will send detailed information to your email.'
        });
      }, 800);
      return;
    }

    // Empty or Javascript Links
    if (href === '#' || href === 'javascript:void(0)' || href === 'javascript:;') {
      e.preventDefault();
      showToast({
        type: 'info',
        title: 'Action Triggered',
        message: text ? `"${text}" completed successfully.` : 'Action processed.'
      });
      return;
    }
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
    showToast({
      type: 'info',
      title: 'Scrolled to Top',
      message: 'Returned to the top of the page.',
      duration: 2000
    });
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
