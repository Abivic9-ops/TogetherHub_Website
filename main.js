

// STICKY NAVBAR
function initStickyHeader() {
  const header = document.querySelector('header');
  
  const handleScroll = () => {
    // Add glassmorphism stickiness when scrolled past 20px
    if (window.scrollY > 20) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check on load
}

/* MOBILE NAVIGATION DRAWER */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!menuToggle || !navMenu) return;
  
  // Dynamic backdrop creation
  let backdrop = document.querySelector('.nav-menu-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-menu-backdrop';
    document.body.appendChild(backdrop);
  }
  
  const toggleMenu = () => {
    const isActive = navMenu.classList.toggle('active');
    backdrop.classList.toggle('active', isActive);
    
    // Animate hamburger to X
    const spans = menuToggle.querySelectorAll('span');
    if (isActive) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  };
  
  menuToggle.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', toggleMenu);
  
  // Close menu when navigation anchors are clicked — allow default link behavior
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu();
    });
  });
}

/* THEME TOGGLE */
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle-btn');
  const body = document.body;
  const themeKey = 'togetherhub-theme';
  const storedTheme = localStorage.getItem(themeKey);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

  const applyTheme = (theme) => {
    body.classList.toggle('dark-mode', theme === 'dark');
    body.classList.toggle('light-mode', theme === 'light');
    if (themeToggle) {
      themeToggle.classList.toggle('active', theme === 'dark');
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggle.innerHTML = theme === 'dark' ? "<i class='bx bx-sun'></i>" : "<i class='bx bx-moon'></i>";
    }
    localStorage.setItem(themeKey, theme);
  };

  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }
}

/* DIALOG MODAL FRAMEWORKS */

function initModals() {
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const triggers = document.querySelectorAll('[data-modal-target]');
  const closeButtons = document.querySelectorAll('.modal-close');
  
  if (!triggers.length) return;
  
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modalOverlays.forEach(overlay => overlay.classList.remove('active'));
      document.body.style.overflow = '';
    });
  });
  
  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalOverlays.forEach(overlay => overlay.classList.remove('active'));
      document.body.style.overflow = '';
    }
  });
}

/* MODULAR FORM VERIFICATIONS */
function initFormValidations() {
  // Newsletter Inputs
  const newsletterForms = document.querySelectorAll('.newsletter-form, .footer-news-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input.value.trim();
      
      if (!validateEmail(email)) {
        showToast(' Please enter a valid email address.', 'error');
        return;
      }
      
      showToast(' Success! Thank you for subscribing to our newsletter.', 'success');
      input.value = '';
    });
  });
  
  // Standard Action Forms
  const validatedForms = document.querySelectorAll('.validated-form');
  validatedForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'hsl(354, 70%, 54%)'; // Error Red
          input.addEventListener('input', function resetBorder() {
            input.style.borderColor = '';
            input.removeEventListener('input', resetBorder);
          });
        }
      });
      
      if (!isValid) {
        showToast(' Please fill out all required fields.', 'warning');
        return;
      }
      
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && !validateEmail(emailInput.value.trim())) {
        showToast(' Please enter a valid email address.', 'error');
        emailInput.style.borderColor = 'hsl(354, 70%, 54%)';
        return;
      }
      
      // Close matching modal frame
      const parentOverlay = form.closest('.modal-overlay');
      if (parentOverlay) {
        parentOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
      
      const formType = form.getAttribute('data-form-type') || 'Submission';
      showToast(` ${formType} submitted successfully! Our team will contact you soon.`, 'success');
      form.reset();
    });
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/* CLIENT TOAST ALERTS */
let toastContainer;
function initToastNotificationSystem() {
  toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
}

function showToast(message, type = 'info') {
  if (!toastContainer) initToastNotificationSystem();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let iconSVG = '';
  switch(type) {
    case 'success':
      iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toast-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
      break;
    case 'error':
      iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toast-icon"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
      break;
    default:
      iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toast-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }
  
  toast.innerHTML = `
    ${iconSVG}
    <span class="toast-message">${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);
}

/*  DYNAMIC INTEGER LOADER COUNTERS */
function initStatsCounters() {
  const statsElements = document.querySelectorAll('.stats-number[data-target]');
  if (!statsElements.length) return;
  
  const observerOptions = {
    root: null,
    threshold: 0.15,
  };
  
  const animateStats = (entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const rawTarget = target.getAttribute('data-target');
      const targetNumber = Number(rawTarget.replace(/,/g, ''));
      const suffix = target.getAttribute('data-suffix') || '';
      const duration = 2200;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const currentValue = Math.floor(progress * targetNumber);
        target.textContent = formatNumber(currentValue) + suffix;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          target.textContent = formatNumber(targetNumber) + suffix;
        }
      };

      requestAnimationFrame(tick);
      observer.unobserve(target);
    });
  };
  
  const statsObserver = new IntersectionObserver(animateStats, observerOptions);
  statsElements.forEach(el => statsObserver.observe(el));
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* DYNAMIC CATALOG SEARCH AND FILTERING */
function initDynamicFilters() {
  const searchInput = document.getElementById('community-search');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.community-card');
  
  if (!filterButtons.length && !searchInput) return;
  
  let activeFilter = 'all';
  let activeQuery = '';
  
  const runFilter = () => {
    cards.forEach(card => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      const desc = card.querySelector('.card-desc').textContent.toLowerCase();
      const tags = card.getAttribute('data-category').toLowerCase();
      
      const matchesSearch = title.includes(activeQuery) || desc.includes(activeQuery);
      const matchesFilter = activeFilter === 'all' || tags.includes(activeFilter);
      
      if (matchesSearch && matchesFilter) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.96)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 180);
      }
    });
  };
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter').toLowerCase();
      runFilter();
    });
  });
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeQuery = e.target.value.toLowerCase().trim();
      runFilter();
    });
  }
}

/* DUAL TIMELINE STEP SWITCHERS */
function initTimelineSwitcher() {
  const tabBtns = document.querySelectorAll('.timeline-tab-btn');
  const timelines = document.querySelectorAll('.timeline-track');
  
  if (!tabBtns.length) return;
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTimeline = btn.getAttribute('data-timeline');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      timelines.forEach(timeline => {
        if (timeline.id === `${targetTimeline}-timeline`) {
          timeline.style.display = 'flex';
          setTimeout(() => {
            timeline.style.opacity = '1';
            timeline.style.transform = 'translateY(0)';
          }, 50);
        } else {
          timeline.style.opacity = '0';
          timeline.style.transform = 'translateY(12px)';
          setTimeout(() => {
            timeline.style.display = 'none';
          }, 180);
        }
      });
    });
  });
}

/* SUCCESS STORY SLIDERS */
function initSuccessStoriesSlider() {
  const sliderTrack = document.querySelector('.slider-track');
  const slides = document.querySelectorAll('.slider-slide');
  const prevBtn = document.querySelector('.slider-arrow.prev');
  const nextBtn = document.querySelector('.slider-arrow.next');
  const dotsContainer = document.querySelector('.slider-dots');
  
  if (!sliderTrack || !slides.length) return;
  
  let currentIndex = 0;
  const slideCount = slides.length;
  
  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => jumpToSlide(index));
    dotsContainer.appendChild(dot);
  });
  
  const dots = dotsContainer.querySelectorAll('.slider-dot');
  
  const updateSliderPosition = () => {
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  };
  
  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % slideCount;
    updateSliderPosition();
  };
  
  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateSliderPosition();
  };
  
  const jumpToSlide = (index) => {
    currentIndex = index;
    updateSliderPosition();
  };
  
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  
  let autoSlideTimer = setInterval(nextSlide, 6000);
  const resetAutoSlideTimer = () => {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(nextSlide, 6000);
  };
  
  if (prevBtn) prevBtn.addEventListener('click', resetAutoSlideTimer);
  if (nextBtn) nextBtn.addEventListener('click', resetAutoSlideTimer);
}

/* TESTIMONIAL SLIDER FOR MOBILE MOCK*/
function initTestimonialCarousel() {
  const dots = document.querySelectorAll('.testimonial-dot');
  const cards = document.querySelectorAll('.testimonial-card-item');
  
  if (!dots.length || !cards.length) return;
  
  // Set up dot active index matching card items
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      // De-active others
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      
      // On mobile viewport, we slide/fade. On desktop we show all.
      if (window.innerWidth <= 768) {
        cards.forEach((card, cardIndex) => {
          if (cardIndex === index % cards.length) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.96)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 180);
          }
        });
      } else {
        // Desktop displays all, so dot acts as a decorative or active visual highlight
        showToast('✨ Switched to featured highlight testimonial!', 'info');
      }
    });
  });
}

/* MOBILE FOOTER ACCORDION COLLAPSE */
function initFooterAccordion() {
  const footerTitles = document.querySelectorAll('.footer-col-title');
  
  if (!footerTitles.length) return;
  
  footerTitles.forEach(title => {
    title.addEventListener('click', () => {
      // Only execute on mobile widths
      if (window.innerWidth <= 768) {
        const parent = title.parentElement;
        const isActive = parent.classList.contains('active');
        
        // Collapse other panels first
        document.querySelectorAll('.footer-links-col').forEach(col => {
          col.classList.remove('active');
        });
        
        if (!isActive) {
          parent.classList.add('active');
        }
      }
    });
  });
  
  // Reset inline heights if resized back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      document.querySelectorAll('.footer-links-col').forEach(col => {
        col.classList.remove('active');
      });
    }
  });
}

/* --- COMMUNITIES PAGE FILTERING --- */
function initCommunityFiltering() {
  const searchInput = document.querySelector('#community-search');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const communityCards = document.querySelectorAll('.community-card');
  
  if (!communityCards.length) return;
  
  const filterCards = () => {
    const searchTerm = searchInput?.value.toLowerCase() || '';
    const activeFilters = Array.from(filterButtons)
      .filter(btn => btn.classList.contains('active'))
      .map(btn => btn.dataset.filter);
    
    communityCards.forEach(card => {
      const title = card.querySelector('.community-card-title')?.textContent.toLowerCase() || '';
      const mission = card.querySelector('.community-mission')?.textContent.toLowerCase() || '';
      const category = card.dataset.category || '';
      
      const matchesSearch = title.includes(searchTerm) || mission.includes(searchTerm);
      const matchesFilter = activeFilters.length === 0 || activeFilters.includes(category);
      
      card.style.display = (matchesSearch && matchesFilter) ? 'flex' : 'none';
    });
  };
  
  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.filter === 'all') {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      } else {
        document.querySelector('[data-filter="all"]')?.classList.remove('active');
        button.classList.toggle('active');
      }
      filterCards();
    });
  });
}

/* --- PROJECTS PAGE FILTERING & SORTING --- */
function initProjectFiltering() {
  const sortSelect = document.querySelector('.sort-select');
  const filterButtons = document.querySelectorAll('.projects-category-filter .filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  if (!projectCards.length) return;
  
  const sortAndFilter = () => {
    const activeFilters = Array.from(filterButtons)
      .filter(btn => btn.classList.contains('active'))
      .map(btn => btn.dataset.filter);
    
    const sortValue = sortSelect?.value || 'featured';
    
    // Filter cards
    let visibleCards = [];
    projectCards.forEach(card => {
      const category = card.dataset.category || '';
      const matchesFilter = activeFilters.length === 0 || activeFilters.includes(category);
      card.style.display = matchesFilter ? 'flex' : 'none';
      if (matchesFilter) visibleCards.push({ element: card, category });
    });
    
    // Sort cards
    if (sortValue === 'newest') {
      visibleCards.reverse();
    } else if (sortValue === 'funding') {
      visibleCards.sort((a, b) => {
        const aFunding = parseFloat(a.element.dataset.funding || 0);
        const bFunding = parseFloat(b.element.dataset.funding || 0);
        return bFunding - aFunding;
      });
    }
  };
  
  if (sortSelect) {
    sortSelect.addEventListener('change', sortAndFilter);
  }
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.filter === 'all') {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      } else {
        document.querySelector('[data-filter="all"]')?.classList.remove('active');
        button.classList.toggle('active');
      }
      sortAndFilter();
    });
  });
}

/* --- IMPACT METRICS COUNTER ANIMATION --- */
function initImpactCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;
  
  const animateCounter = (element) => {
    const target = parseInt(element.dataset.target, 10);
    const suffix = element.dataset.suffix || '';
    const duration = 2000;
    const start = Date.now();
    
    const updateCount = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(target * progress);
      element.textContent = current.toLocaleString() + suffix;
      
      if (progress < 1) requestAnimationFrame(updateCount);
    };
    
    updateCount();
  };
  
  const observerOptions = { threshold: 0.3 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => observer.observe(counter));
}

/* --- STORIES PAGE FAQ ACCORDION --- */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;
  
  faqItems.forEach(item => {
    const summary = item.querySelector('.faq-question');
    if (summary) {
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = item.hasAttribute('open');
        
        // Close all other items
        faqItems.forEach(other => {
          if (other !== item) {
            other.removeAttribute('open');
          }
        });
        
        // Toggle current item
        if (isOpen) {
          item.removeAttribute('open');
        } else {
          item.setAttribute('open', 'open');
        }
      });
    }
  });
}

/* --- STORIES PAGE "LOAD MORE" --- */
function initStoriesLoadMore() {
  const loadMoreBtn = document.querySelector('.btn-load-more');
  if (!loadMoreBtn) return;
  
  loadMoreBtn.addEventListener('click', () => {
    const storiesGrid = document.querySelector('.stories-grid');
    if (storiesGrid) {
      // Create placeholder story cards
      const placeholders = Array(3).fill(0).map(() => `
        <article class="editorial-story-card">
          <div class="story-image-wrapper">
            <div class="story-image-placeholder gradient-education"></div>
            <span class="story-read-time">6 min</span>
          </div>
          <div class="story-card-content">
            <span class="story-category-tag education">Education</span>
            <h3 class="story-card-title">New Story Loaded</h3>
            <p class="story-card-excerpt">Discover more inspiring stories from communities around the world...</p>
            <div class="story-card-meta">
              <div class="story-author-mini">
                <div class="author-avatar-sm gradient-teal">ML</div>
                <div>
                  <div class="author-name-mini">More Learning</div>
                  <div class="author-role-mini">Editor</div>
                </div>
              </div>
              <span class="publish-date-mini">Just now</span>
            </div>
          </div>
        </article>
      `).join('');
      
      storiesGrid.insertAdjacentHTML('beforeend', placeholders);
    }
    
    // Show toast notification
    showToast('3 more stories loaded!', 'success');
  });
}

/* --- CONTACT PAGE FORM HANDLING --- */
function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
      name: contactForm.querySelector('#contact-name')?.value || '',
      email: contactForm.querySelector('#contact-email')?.value || '',
      organization: contactForm.querySelector('#contact-organization')?.value || '',
      subject: contactForm.querySelector('#contact-subject')?.value || '',
      message: contactForm.querySelector('#contact-message')?.value || ''
    };
    
    // Validate
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    // Simulate sending
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';
    
    setTimeout(() => {
      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      contactForm.reset();
      btn.disabled = false;
      btn.textContent = originalText;
    }, 1500);
  });
}

/* --- INITIALIZE ALL NEW PAGE FEATURES --- */
function initNewPageFeatures() {
  initCommunityFiltering();
  initProjectFiltering();
  initImpactCounters();
  initFAQAccordion();
  initStoriesLoadMore();
  initContactForm();
}

// Update DOMContentLoaded to include new features
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modular systems
  initStickyHeader();
  initMobileMenu();
  initThemeToggle();
  initModals();
  initFormValidations();
  initToastNotificationSystem();
  initStatsCounters();
  initDynamicFilters();
  initTimelineSwitcher();
  initSuccessStoriesSlider();
  initTestimonialCarousel();
  initFooterAccordion();
  initNewPageFeatures(); // New page interactivity
});
