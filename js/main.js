/**
 * Apurva Pingale - AI/ML Engineer Portfolio Script
 * Handles Navigation, Typing Effect, Scroll-Spy, Filters, Modals, and Form Submissions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');

  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      const isOpen = sidebar.classList.contains('open');
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.querySelectorAll('.nav a').forEach((link) => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Typing Effect in Hero Banner
  const typedTarget = document.getElementById('typed');
  const phrases = [
    'data pipelines that scale.',
    'multi-agent AI workflows.',
    'real-time anomaly detection.',
    'production-grade MLOps.',
    'RAG & LLM systems.'
  ];

  if (typedTarget) {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];
      typedTarget.textContent = isDeleting
        ? currentPhrase.slice(0, charIndex--)
        : currentPhrase.slice(0, charIndex++);

      if (!isDeleting && charIndex === currentPhrase.length + 1) {
        isDeleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }

      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }

      setTimeout(typeLoop, isDeleting ? 45 : 75);
    }

    typeLoop();
  }

  // 3. Scroll Reveal & Animated Skill Progress Bars
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          // Animate skill bars if present in this section
          const skillBars = entry.target.querySelectorAll('.bar i');
          skillBars.forEach((bar) => {
            const width = bar.getAttribute('data-w');
            if (width) {
              bar.style.width = `${width}%`;
            }
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((el) => revealObserver.observe(el));

  // 4. Scroll-Spy for Navigation Links
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');

  const scrollSpyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );

  sections.forEach((sec) => scrollSpyObserver.observe(sec));

  // 5. Project Category Filter
  const filterButtons = document.querySelectorAll('.filters button');
  const projectCards = document.querySelectorAll('#projGrid .card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('on'));
      btn.classList.add('on');
      const filterCategory = btn.getAttribute('data-f');

      projectCards.forEach((card) => {
        const matches = filterCategory === 'all' || card.getAttribute('data-cat') === filterCategory;
        card.style.display = matches ? 'flex' : 'none';
      });
    });
  });

  // 6. Form Submission Handling (Web3Forms API)
  async function submitForm(form, statusEl) {
    const keyInput = form.querySelector('input[name="access_key"]');
    const accessKey = keyInput ? keyInput.value.trim() : '';

    if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      statusEl.className = 'form-status err';
      statusEl.textContent = 'Contact form is ready. Please configure your Web3Forms access key in index.html to enable direct inbox delivery.';
      return;
    }

    statusEl.className = 'form-status';
    statusEl.textContent = 'Sending message…';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(form),
      });
      const data = await response.json();

      if (data.success) {
        statusEl.className = 'form-status ok';
        statusEl.textContent = 'Thank you! Your message has been sent successfully.';
        form.reset();
      } else {
        statusEl.className = 'form-status err';
        statusEl.textContent = data.message || 'Something went wrong. Please try emailing directly.';
      }
    } catch (error) {
      statusEl.className = 'form-status err';
      statusEl.textContent = 'Network error. Please reach out directly to apurvapingale24@gmail.com.';
    }
  }

  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');
  if (contactForm && contactStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitForm(contactForm, contactStatus);
    });
  }

  const endorseForm = document.getElementById('endorseForm');
  const endorseStatus = document.getElementById('endorseStatus');
  if (endorseForm && endorseStatus) {
    endorseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitForm(endorseForm, endorseStatus);
    });
  }

  // 7. Endorsement Modal Controls
  const endorseModal = document.getElementById('endorseModal');
  const openEndorseBtn = document.getElementById('openEndorse');
  const closeEndorseBtn = document.getElementById('closeEndorse');

  function openModal() {
    if (endorseModal) {
      endorseModal.classList.add('open');
      endorseModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (endorseModal) {
      endorseModal.classList.remove('open');
      endorseModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (openEndorseBtn) openEndorseBtn.addEventListener('click', openModal);
  if (closeEndorseBtn) closeEndorseBtn.addEventListener('click', closeModal);

  if (endorseModal) {
    endorseModal.addEventListener('click', (e) => {
      if (e.target === endorseModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && endorseModal && endorseModal.classList.contains('open')) {
      closeModal();
    }
  });
});
