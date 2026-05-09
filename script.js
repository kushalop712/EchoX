/* ============================================================
   EchoX Landing Page — JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  const navHamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ---- Mobile hamburger toggle ----
  if (navHamburger) {
    navHamburger.addEventListener('click', () => {
      navHamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navHamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ---- Intersection Observer for scroll-reveal ----
  const revealSections = document.querySelectorAll(
    '.feature-section, .ai-section, .specs-section, .gesture-section, .buy-section, .contact-section'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    { threshold: 0.15 }
  );

  revealSections.forEach((section) => revealObserver.observe(section));


  // ---- Video fallback handling ----
  document.querySelectorAll('.feature-video-bg video').forEach((video) => {
    video.addEventListener('canplay', () => {
      video.classList.add('is-playing');
    });
  });


  // ---- Equalizer Canvas Animation ----
  const canvas = document.getElementById('equalizerCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationId;
    let isAnimating = false;

    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Equalizer bar config
    const barCount = 80;
    const barGap = 3;
    const phases = Array.from({ length: barCount }, () => Math.random() * Math.PI * 2);
    const speeds = Array.from({ length: barCount }, () => 0.5 + Math.random() * 2.5);
    const amplitudes = Array.from({ length: barCount }, (_, i) => {
      // Create a natural "peak in the middle" shape
      const center = barCount / 2;
      const dist = Math.abs(i - center) / center;
      return 0.3 + (1 - dist * dist) * 0.7;
    });

    function drawEqualizer(time) {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, w, h);

      const totalBarWidth = (w - (barCount - 1) * barGap) / barCount;
      const barWidth = Math.max(totalBarWidth, 2);
      const maxBarHeight = h * 0.8;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + barGap);

        // Multiple sine waves for organic movement
        const wave1 = Math.sin(time * 0.001 * speeds[i] + phases[i]);
        const wave2 = Math.sin(time * 0.0015 * speeds[i] * 0.7 + phases[i] * 1.3);
        const wave3 = Math.sin(time * 0.0008 + i * 0.15);

        const combinedWave = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2);
        const normalizedHeight = (combinedWave + 1) / 2; // 0 to 1
        const barHeight = normalizedHeight * amplitudes[i] * maxBarHeight;

        const y = (h - barHeight) / 2;

        // Gradient color based on height
        const intensity = normalizedHeight * amplitudes[i];
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);

        if (intensity > 0.7) {
          gradient.addColorStop(0, `rgba(167, 139, 250, ${0.6 + intensity * 0.4})`);
          gradient.addColorStop(0.5, `rgba(100, 180, 255, ${0.8 + intensity * 0.2})`);
          gradient.addColorStop(1, `rgba(167, 139, 250, ${0.6 + intensity * 0.4})`);
        } else {
          gradient.addColorStop(0, `rgba(100, 180, 255, ${0.3 + intensity * 0.5})`);
          gradient.addColorStop(0.5, `rgba(100, 180, 255, ${0.5 + intensity * 0.4})`);
          gradient.addColorStop(1, `rgba(100, 180, 255, ${0.3 + intensity * 0.5})`);
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();

        // Rounded rectangles
        const radius = barWidth / 2;
        ctx.roundRect(x, y, barWidth, barHeight, radius);
        ctx.fill();

        // Glow effect for taller bars
        if (intensity > 0.6) {
          ctx.shadowColor = 'rgba(100, 180, 255, 0.3)';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }
      }

      animationId = requestAnimationFrame(drawEqualizer);
    }

    // Start equalizer when AI section is in view
    const aiSection = document.getElementById('ai-adaptive');
    const eqObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isAnimating) {
            isAnimating = true;
            resizeCanvas();
            animationId = requestAnimationFrame(drawEqualizer);
          } else if (!entry.isIntersecting && isAnimating) {
            isAnimating = false;
            cancelAnimationFrame(animationId);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (aiSection) eqObserver.observe(aiSection);
  }


  // ---- Gesture Controls — Ripple Effect ----
  const gestureItems = document.querySelectorAll('.gesture-item');
  const rippleContainer = document.getElementById('rippleContainer');

  gestureItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      if (!rippleContainer) return;

      // Create ripple
      const ripple = document.createElement('div');
      ripple.classList.add('ripple');
      rippleContainer.appendChild(ripple);

      // Remove after animation
      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });

      // Highlight the touch surface
      const touchGlow = document.querySelector('.touch-glow');
      if (touchGlow) {
        touchGlow.style.opacity = '1';
        setTimeout(() => {
          touchGlow.style.opacity = '0';
        }, 600);
      }
    });
  });


  // ---- Parallax-style subtle movement for feature sections ----
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        revealSections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top;
          const viewH = window.innerHeight;

          // Only apply parallax when section is in viewport range
          if (sectionTop < viewH && sectionTop > -viewH) {
            const progress = sectionTop / viewH; // -1 to 1

            // Subtle parallax on video bg and fallback image
            const videoBg = section.querySelector('.feature-video-bg video');
            const fallbackImg = section.querySelector('.feature-bg-fallback');
            const transform = `scale(1.05) translateY(${progress * 30}px)`;
            if (videoBg) videoBg.style.transform = transform;
            if (fallbackImg) fallbackImg.style.transform = transform;
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  });


  // ---- Active nav link tracking on scroll ----
  const navLinksAll = document.querySelectorAll('.nav-link');
  const sectionTargets = [
    { id: 'top', link: document.getElementById('nav-home') },
    { id: 'specs', link: document.getElementById('nav-products') },
    { id: 'contact', link: document.getElementById('nav-contact') },
  ];

  function updateActiveNav() {
    const scrollY = window.scrollY + 200;

    // Find which section we're in
    let activeLink = sectionTargets[0].link; // default to Home

    sectionTargets.forEach(({ id, link }) => {
      const section = document.getElementById(id);
      if (section && section.offsetTop <= scrollY) {
        activeLink = link;
      }
    });

    navLinksAll.forEach((l) => l.classList.remove('active'));
    if (activeLink) activeLink.classList.add('active');
  }

  window.addEventListener('scroll', updateActiveNav);


  // ---- Contact form submission ----
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show success message
      formSuccess.classList.add('show');

      // Reset form
      contactForm.reset();

      // Hide success after 5 seconds
      setTimeout(() => {
        formSuccess.classList.remove('show');
      }, 5000);
    });
  }


  // ---- Smooth scroll with navbar offset ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPos = target.offsetTop - navHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

})();
