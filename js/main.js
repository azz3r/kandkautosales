// ===== K&K Auto Sales - Transport Kolejowy =====

document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1800);
    });
    // Fallback if load already fired
    if (document.readyState === 'complete') {
        setTimeout(() => preloader.classList.add('hidden'), 1800);
    }

    // --- Header scroll ---
    const header = document.getElementById('header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
        lastScroll = window.scrollY;
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
    const statVals = document.querySelectorAll('.stat-val');
    let countersAnimated = false;

    function animateCounters() {
        statVals.forEach(el => {
            const target = parseInt(el.dataset.target);
            const duration = 2200;
            const fps = 60;
            const totalFrames = duration / (1000 / fps);
            const step = target / totalFrames;
            let current = 0;
            let frame = 0;

            function tick() {
                frame++;
                // Ease out quad
                const progress = frame / totalFrames;
                const easedProgress = 1 - (1 - progress) * (1 - progress);
                current = Math.floor(easedProgress * target);

                if (frame < totalFrames) {
                    el.textContent = current.toLocaleString('pl-PL');
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = target.toLocaleString('pl-PL');
                }
            }
            tick();
        });

        // Animate stat bars
        document.querySelectorAll('.stat-bar span').forEach(bar => {
            setTimeout(() => bar.classList.add('animated'), 300);
        });
    }

    // --- Intersection Observer ---
    const observeCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Fade in
                if (entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('visible');
                }
                // Counters
                if (entry.target.classList.contains('stats-row') && !countersAnimated) {
                    countersAnimated = true;
                    animateCounters();
                }
            }
        });
    };

    const observer = new IntersectionObserver(observeCallback, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    // Add fade-in to elements
    const fadeTargets = [
        '.svc-card', '.process-step', '.stat-block',
        '.compare-card', '.ci-item', '.advantage'
    ];

    fadeTargets.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${i * 80}ms`;
            observer.observe(el);
        });
    });

    // Observe stats row for counter trigger
    const statsRow = document.querySelector('.stats-row');
    if (statsRow) observer.observe(statsRow);

    // --- Contact form ---
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            showToast('Dziekujemy! Odpowiemy w ciagu 24h.');
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
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
});
