document.addEventListener('DOMContentLoaded', () => {

    // --- Header scroll ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    });

    // --- Mobile menu ---
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    burger.addEventListener('click', () => {
        nav.classList.toggle('open');
        const spans = burger.querySelectorAll('span');
        if (nav.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            burger.querySelectorAll('span').forEach(s => {
                s.style.transform = '';
                s.style.opacity = '';
            });
        });
    });

    // --- Active nav on scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // --- Animated counters ---
    function animateCounters(elements) {
        elements.forEach(el => {
            const target = parseInt(el.dataset.target);
            const totalFrames = 100;
            let frame = 0;

            function tick() {
                frame++;
                const progress = frame / totalFrames;
                const eased = 1 - (1 - progress) * (1 - progress);
                const current = Math.floor(eased * target);

                if (frame < totalFrames) {
                    el.textContent = current.toLocaleString('pl-PL');
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = target.toLocaleString('pl-PL');
                }
            }
            tick();
        });
    }

    // --- Intersection Observer ---
    let statsAnimated = false;
    let bannerAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Fade in
                if (entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('visible');
                }
                // Stats banner counters
                if (entry.target.classList.contains('stats-banner') && !bannerAnimated) {
                    bannerAnimated = true;
                    animateCounters(entry.target.querySelectorAll('.sb-val'));
                }
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    // Add fade-in to elements
    ['.svc-card', '.step-card', '.ci-item', '.why-card', '.terminal-badge'].forEach(sel => {
        document.querySelectorAll(sel).forEach((el, i) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${i * 80}ms`;
            observer.observe(el);
        });
    });

    // Observe stats banner
    const statsBanner = document.querySelector('.stats-banner');
    if (statsBanner) observer.observe(statsBanner);

    // --- Contact form ---
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const required = form.querySelectorAll('[required]');
            let valid = true;
            required.forEach(f => {
                if (!f.value || !f.value.trim()) {
                    valid = false;
                    f.style.borderColor = '#c44536';
                    setTimeout(() => { f.style.borderColor = ''; }, 2000);
                }
            });
            const lang = window.kkLang || 'pl';
            const t = (typeof translations !== 'undefined' && translations[lang]) || {};
            if (!valid) { showToast(t['toast.error'] || 'Wypelnij wymagane pola.'); return; }
            showToast(t['toast.success'] || 'Dziekujemy! Odpowiemy w ciagu godziny.');
            form.reset();
        });
    }

    // --- Toast ---
    function showToast(msg) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }

    // --- Smooth scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = document.querySelector('.header').offsetHeight;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            }
        });
    });
});
