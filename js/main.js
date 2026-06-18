// Corepath Academy - Main JavaScript Handler
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons if loaded
  initLucideIcons();

  // Mobile Menu Toggle
  initMobileMenu();

  // Sticky Header Effect
  initStickyHeader();

  // Active Navigation Link Highlighting
  highlightActiveLink();

  // Registration Form Validation & Storage
  initRegistrationForm();

  // Contact Form / Feedback Handling
  initContactForm();

  // Course Quick filters on Formations page
  initCourseFilters();

  // Dynamic CCNA 1 Session Countdown Timer
  initCCNA1Countdown();
});

/* Initialize Lucide Icons safely */
function initLucideIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/* Sticky Header on Scroll */
function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('shadow-lg', 'bg-dark-navy/98', 'py-3');
      header.classList.remove('py-5');
    } else {
      header.classList.remove('shadow-lg', 'bg-dark-navy/98', 'py-3');
      header.classList.add('py-5');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case page starts scrolled
}

/* Mobile Hamburger Menu Navigation */
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    
    // Change menu icon between hamburger and close
    const icon = menuBtn.querySelector('i');
    if (icon) {
      const isHidden = mobileMenu.classList.contains('hidden');
      icon.setAttribute('data-lucide', isHidden ? 'menu' : 'x');
      initLucideIcons();
    }
  });

  // Close menu on resize to desktop view
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      mobileMenu.classList.add('hidden');
      const icon = menuBtn.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', 'menu');
        initLucideIcons();
      }
    }
  });
}

/* Highlight Active Page in Navigation Bar */
function highlightActiveLink() {
  const currentPath = window.location.pathname;
  // Handle root and direct page names
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === '' && href === 'index.html')) {
      link.classList.add('text-cisco-blue', 'border-b-2', 'border-cisco-blue');
      link.classList.remove('text-slate-300', 'hover:text-white');
    } else {
      link.classList.remove('text-cisco-blue', 'border-b-2', 'border-cisco-blue');
    }
  });

  // Mobile nav links
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === '' && href === 'index.html')) {
      link.classList.add('bg-cisco-blue/15', 'text-cisco-blue', 'font-semibold');
      link.classList.remove('text-slate-300', 'hover:bg-white/5');
    }
  });
}

/* Registration Form handling and Validation */
function initRegistrationForm() {
  const form = document.getElementById('registration-form');
  if (!form) return;

  const resetBtn = document.getElementById('reset-btn');
  const errorAlert = document.getElementById('form-errors');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  // Load course parameter if present in the URL query (?course=coding)
  const urlParams = new URLSearchParams(window.location.search);
  const courseParam = urlParams.get('course');
  if (courseParam) {
    const selectElement = document.getElementById('formation');
    if (selectElement) {
      selectElement.value = courseParam;
    }
  }

  // Pre-fill fields if user details exist in localStorage (UX touch)
  const savedUser = JSON.parse(localStorage.getItem('corepath_profile') || '{}');
  if (savedUser.email) {
    if (document.getElementById('nom')) document.getElementById('nom').value = savedUser.nom || '';
    if (document.getElementById('prenom')) document.getElementById('prenom').value = savedUser.prenom || '';
    if (document.getElementById('phone')) document.getElementById('phone').value = savedUser.phone || '';
    if (document.getElementById('email')) document.getElementById('email').value = savedUser.email || '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorAlert.classList.add('hidden');
    errorAlert.innerHTML = '';

    const errors = [];
    const nom = document.getElementById('nom').value.trim();
    const prenom = document.getElementById('prenom').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const formation = document.getElementById('formation').value;
    const niveau = document.getElementById('niveau').value;
    const competencesEl = document.getElementById('competences');
    const competences = competencesEl ? competencesEl.value.trim() : '';
    const message = document.getElementById('message').value.trim();
    const acceptContact = document.getElementById('accept_contact').checked;

    // Field-by-field validation
    if (!nom) errors.push("Le nom est obligatoire.");
    if (!prenom) errors.push("Le prénom est obligatoire.");
    
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.push("L'adresse email est obligatoire.");
    } else if (!emailRegex.test(email)) {
      errors.push("L'adresse email saisie n'est pas valide.");
    }

    // Phone validation (numbers only, must be reasonable length)
    const phoneRegex = /^[+]?[0-9s\-() ]{8,20}$/;
    if (!phone) {
      errors.push("Le numéro de téléphone est obligatoire.");
    } else if (!phoneRegex.test(phone)) {
      errors.push("Le numéro de téléphone n'est pas au bon format.");
    }

    if (!formation) errors.push("Veuillez sélectionner un programme de formation.");
    if (!acceptContact) errors.push("Vous devez accepter d'être contacté par Corepath Academy pour valider votre dossier.");

    if (errors.length > 0) {
      // Display errors
      errorAlert.classList.remove('hidden');
      const ul = document.createElement('ul');
      ul.className = 'list-disc pl-5 text-sm text-red-400 space-y-1';
      errors.forEach(err => {
        const li = document.createElement('li');
        li.textContent = err;
        ul.appendChild(li);
      });
      errorAlert.appendChild(ul);
      errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Success flow - store details locally
    const registrationDetails = {
      nom,
      prenom,
      phone,
      email,
      formation,
      niveau,
      competences,
      message,
      date: new Date().toLocaleDateString('fr-FR')
    };

    // Save user info for subsequent autofills
    localStorage.setItem('corepath_profile', JSON.stringify({ nom, prenom, phone, email }));
    
    // Add to historical registrations
    const history = JSON.parse(localStorage.getItem('corepath_registrations') || '[]');
    history.push(registrationDetails);
    localStorage.setItem('corepath_registrations', JSON.stringify(history));

    // Show custom modal
    if (successModal) {
      successModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // freeze scrolling
      
      // Customize modal text dynamic greeting
      const modalText = document.getElementById('modal-text-greet');
      if (modalText) {
        modalText.innerHTML = `Merci de votre intérêt, <strong>${prenom}</strong> ! Votre demande d'inscription pour la formation <strong>${getCourseLabel(formation)}</strong> a été enregistrée avec succès. Un conseiller pédagogique vous contactera d'ici 24 heures au <strong>${phone}</strong>.`;
      }
    }

    form.reset();
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      errorAlert.classList.add('hidden');
      errorAlert.innerHTML = '';
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.add('hidden');
      document.body.style.overflow = ''; // restore scrolling
    });
  }
}

/* Translate course value keys to human readable labels */
function getCourseLabel(key) {
  const labels = {
    'ccna1': 'CCNA 1 – Introduction aux Réseaux (ITN)',
    'ccna2': 'CCNA 2 – Commutation, Routage et Réseaux Sans Fil (SRWE)',
    'ccna3': 'CCNA 3 – Réseaux d’Entreprise, Sécurité et Automatisation (ENSA)',
    'linux': 'Linux Essentials',
    'python1': 'Python Essentials 1',
    'python2': 'Python Essentials 2'
  };
  return labels[key] || key;
}

/* Basic Inquiry Contact Form Handler */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('c-name').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const phoneEl = document.getElementById('c-phone');
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const subject = document.getElementById('c-subject').value.trim();
    const message = document.getElementById('c-message').value.trim();

    if (!name || !email || !message || !phone) {
      alert("S'il vous plaît, remplissez tous les champs obligatoires (*).");
      return;
    }

    // Save message locally
    const messages = JSON.parse(localStorage.getItem('corepath_messages') || '[]');
    messages.push({ name, email, phone, subject, message, date: new Date().toLocaleDateString('fr-FR') });
    localStorage.setItem('corepath_messages', JSON.stringify(messages));

    // Elegant notification banner
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-5 right-5 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in border border-green-500';
    notification.innerHTML = `
      <i data-lucide="check-circle" class="w-6 h-6 text-white"></i>
      <div>
        <p class="font-bold">Message envoyé avec succès !</p>
        <p class="text-xs text-green-100">Nous vous répondrons dans les plus brefs délais.</p>
      </div>
    `;
    document.body.appendChild(notification);
    initLucideIcons();

    // Reset contact form
    contactForm.reset();

    // Remove notification after 5 seconds
    setTimeout(() => {
      notification.classList.add('opacity-0', 'transition-all', 'duration-500', 'translate-y-5');
      setTimeout(() => notification.remove(), 500);
    }, 5000);
  });
}

/* Course filter on Formations page */
function initCourseFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  if (filterBtns.length === 0 || courseCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from any other buttons
      filterBtns.forEach(b => b.classList.remove('bg-cisco-blue', 'text-white', 'shadow-lg', 'shadow-cisco-blue/20'));
      filterBtns.forEach(b => b.classList.add('bg-white/5', 'text-slate-300', 'hover:bg-white/10'));

      // Highlight active button
      btn.classList.remove('bg-white/5', 'text-slate-300', 'hover:bg-white/10');
      btn.classList.add('bg-cisco-blue', 'text-white', 'shadow-lg', 'shadow-cisco-blue/20');

      const filterValue = btn.getAttribute('data-filter');

      courseCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          // Trigger slight fade-in transition
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 300ms ease-out';
            card.style.opacity = '1';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* Dynamic CCNA 1 Next Session countdown to June 28, 2026 */
function initCCNA1Countdown() {
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  if (!daysEl && !hoursEl && !minutesEl && !secondsEl) return;

  // Next Session target date: June 28, 2026, 18:00 (Algerian UTC+1 timezone)
  const targetDate = new Date('2026-06-28T18:00:00+01:00').getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      clearInterval(interval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const dDisplay = days < 10 ? '0' + days : days;
    const hDisplay = hours < 10 ? '0' + hours : hours;
    const mDisplay = minutes < 10 ? '0' + minutes : minutes;
    const sDisplay = seconds < 10 ? '0' + seconds : seconds;

    if (daysEl) daysEl.textContent = dDisplay;
    if (hoursEl) hoursEl.textContent = hDisplay;
    if (minutesEl) minutesEl.textContent = mDisplay;
    if (secondsEl) secondsEl.textContent = sDisplay;
  }

  // Run immediately and then start interval
  updateTimer();
  const interval = setInterval(updateTimer, 1000);
}
