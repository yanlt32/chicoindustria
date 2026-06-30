/* ============================================================
   CHICO GRILL — SCRIPT.JS (VERSÃO CORRIGIDA E PROFISSIONAL)
   ============================================================ */

'use strict';

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// ── PAGE LOADER ─────────────────────────────────────────────
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (!loader) return;
    setTimeout(() => loader.classList.add('hidden'), 1700);
});

// ── AOS INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 900,
            once: true,
            offset: 60,
            easing: 'ease-out-quart',
            disable: window.innerWidth < 768 ? 'phone' : false,
        });
    }
});

// ── CURSOR PERSONALIZADO (desktop only) ─────────────────────
(function initCursor() {
    // Apenas em dispositivos com hover real
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let running = false;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';
        if (!running) { running = true; requestAnimationFrame(animateFollower); }
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.left = followerX + 'px';
        follower.style.top  = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }

    document.querySelectorAll('a, button, .menu-tab, .tab-btn, .burger-btn, .indicator, .faq-question').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform   = 'translate(-50%, -50%) scale(2.5)';
            cursor.style.opacity     = '0.4';
            follower.style.transform = 'translate(-50%, -50%) scale(0.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform   = 'translate(-50%, -50%) scale(1)';
            cursor.style.opacity     = '1';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
})();

// ── NAVBAR ───────────────────────────────────────────────────
(function initNavbar() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('navMenu');
    if (!navbar || !hamburger || !navMenu) return;

    // Mobile toggle
    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('active');
        navMenu.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') && !navbar.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = navMenu.querySelectorAll('a[href^="#"]');

    const onScroll = () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top    = section.offsetTop;
            const height = section.offsetHeight;
            const id     = section.getAttribute('id');
            const link   = navMenu.querySelector(`a[href="#${id}"]`);
            if (link) {
                link.classList.toggle('active', scrollY >= top && scrollY < top + height);
            }
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
})();

// ── HERO SLIDER ──────────────────────────────────────────────
(function initHeroSlider() {
    const slides     = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    if (!slides.length) return;

    let current = 0;
    let timer   = null;

    function goTo(index) {
        slides[current].classList.remove('active');
        if (indicators[current]) {
            indicators[current].classList.remove('active');
            indicators[current].setAttribute('aria-selected', 'false');
        }
        current = ((index % slides.length) + slides.length) % slides.length;
        slides[current].classList.add('active');
        if (indicators[current]) {
            indicators[current].classList.add('active');
            indicators[current].setAttribute('aria-selected', 'true');
        }
    }

    function startAuto() {
        clearInterval(timer);
        timer = setInterval(() => goTo(current + 1), 5500);
    }

    indicators.forEach((ind, i) => {
        ind.addEventListener('click', () => { goTo(i); startAuto(); });
        ind.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(i); startAuto(); }
        });
    });

    // Pausa ao sair da aba
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) clearInterval(timer);
        else startAuto();
    });

    startAuto();
})();

// ── SMOOTH SCROLL ────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const navH = document.querySelector('.navbar')?.offsetHeight || 64;
            const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ── MENU TABS (CARDÁPIO) ─────────────────────────────────────
(function initMenuTabs() {
    const tabs   = document.querySelectorAll('.menu-tab');
    const panels = document.querySelectorAll('.menu-panel');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            const panel = document.getElementById('tab-' + target);
            if (panel) panel.classList.add('active');
        });
    });
})();

// ── SWIPER CARROSSÉIS ────────────────────────────────────────
function getSlidesPerViewForWidth(config) {
    let slidesPerView = config.slidesPerView || 1;
    if (config.breakpoints) {
        const breakpoints = Object.keys(config.breakpoints)
            .map(key => Number(key))
            .filter(value => !Number.isNaN(value))
            .sort((a, b) => a - b);

        breakpoints.forEach(bp => {
            if (window.innerWidth >= bp) {
                const bpConfig = config.breakpoints[bp];
                if (bpConfig && bpConfig.slidesPerView != null) {
                    slidesPerView = bpConfig.slidesPerView;
                }
            }
        });
    }
    return Number(slidesPerView) || 1;
}

function initSafeSwiper(selector, config) {
    const container = document.querySelector(selector);
    if (!container) return null;
    const slides = container.querySelectorAll('.swiper-slide').length;
    const slidesPerView = getSlidesPerViewForWidth(config);

    if (config.loop && slides < slidesPerView * 2) {
        config.loop = false;
        config.loopedSlides = 0;
    }

    return new Swiper(selector, config);
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0 });
    }

    initSafeSwiper('.espetos-swiper', {
        slidesPerView: 1,
        spaceBetween: 12,
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 3200,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: { el: '.espetos-swiper .swiper-pagination', clickable: true, dynamicBullets: true },
        navigation: {
            nextEl: '.espetos-swiper .swiper-button-next',
            prevEl: '.espetos-swiper .swiper-button-prev',
        },
        breakpoints: {
            480:  { slidesPerView: 2, spaceBetween: 12 },
            768:  { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
        },
        a11y: { prevSlideMessage: 'Slide anterior', nextSlideMessage: 'Próximo slide' },
    });

    initSafeSwiper('.burgers-swiper', {
        slidesPerView: 1,
        spaceBetween: 12,
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 3800,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: { el: '.burgers-swiper .swiper-pagination', clickable: true, dynamicBullets: true },
        navigation: {
            nextEl: '.burgers-swiper .swiper-button-next',
            prevEl: '.burgers-swiper .swiper-button-prev',
        },
        breakpoints: {
            640:  { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 2, spaceBetween: 20 },
            1200: { slidesPerView: 3, spaceBetween: 24 },
        },
        a11y: { prevSlideMessage: 'Hambúrguer anterior', nextSlideMessage: 'Próximo hambúrguer' },
    });
});

// ── CONTADOR ANIMADO ─────────────────────────────────────────
(function initCounters() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;

    function animateCount(el) {
        const target    = parseFloat(el.getAttribute('data-count'));
        const isDecimal = !Number.isInteger(target);
        const duration  = 1600;
        const start     = performance.now();

        function update(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease     = 1 - Math.pow(1 - progress, 3);
            const value    = target * ease;
            el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = isDecimal ? target.toFixed(1) : target;
        }
        requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        stats.forEach(stat => observer.observe(stat));
    } else {
        // Fallback sem IntersectionObserver
        stats.forEach(el => { el.textContent = el.getAttribute('data-count'); });
    }
})();

// ── MODAL DE UNIDADES ────────────────────────────────────────
(function initModal() {
    const modal    = document.getElementById('unidadesModal');
    const openBtn  = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('modalClose');
    const backdrop = modal?.querySelector('.modal-backdrop');
    if (!modal) return;

    let lastFocused = null;

    function openModal() {
        lastFocused = document.activeElement;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        // Focus no botão fechar
        setTimeout(() => closeBtn?.focus(), 100);
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        lastFocused?.focus();
    }

    openBtn?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    // Trap focus dentro do modal
    modal.addEventListener('keydown', e => {
        if (e.key !== 'Tab') return;
        const focusables = modal.querySelectorAll('button, a, input, [tabindex]:not([tabindex="-1"])');
        const first = focusables[0];
        const last  = focusables[focusables.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
            if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });

    // Region tabs
    const tabBtns = modal.querySelectorAll('.tab-btn');
    const panels  = modal.querySelectorAll('.regiao-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
            panels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            const id = 'regiao-' + btn.getAttribute('data-regiao');
            document.getElementById(id)?.classList.add('active');
        });
    });
})();

// ── FAQ ACCORDION ────────────────────────────────────────────
(function initFaq() {
    const questions = document.querySelectorAll('.faq-question');
    if (!questions.length) return;

    questions.forEach(btn => {
        btn.addEventListener('click', () => {
            const answer   = btn.nextElementSibling;
            const isOpen   = btn.getAttribute('aria-expanded') === 'true';

            // Fecha todos
            questions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                const ans = q.nextElementSibling;
                if (ans) ans.classList.remove('open');
            });

            // Abre este se estava fechado
            if (!isOpen) {
                btn.setAttribute('aria-expanded', 'true');
                answer?.classList.add('open');
            }
        });
    });
})();

// ── NEWSLETTER ───────────────────────────────────────────────
(function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const btn   = form.querySelector('button');
        if (!input?.value) return;

        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = '#22c55e';
        input.value = '';

        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
        }, 2500);
    });
})();

// ── BURGER BUTTONS → scroll para delivery ───────────────────
document.querySelectorAll('.burger-btn, .burger-overlay a').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const delivery = document.querySelector('#delivery');
        if (delivery) {
            const navH = document.querySelector('.navbar')?.offsetHeight || 64;
            window.scrollTo({
                top: delivery.getBoundingClientRect().top + window.scrollY - navH - 8,
                behavior: 'smooth',
            });
        }
    });
});

// ── PARALLAX SUTIL NA HERO (apenas desktop) ──────────────────
(function initParallax() {
    if (window.innerWidth < 1024 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const heroText = document.querySelector('.hero-text');
    if (!heroText) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const limit   = window.innerHeight;
                if (scrollY < limit) {
                    heroText.style.transform = `translateY(${scrollY * 0.2}px)`;
                    heroText.style.opacity   = `${Math.max(0, 1 - scrollY / 600)}`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

// ── BACK TO TOP ao apertar Escape na página ──────────────────
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('unidadesModal')?.classList.contains('open')) {
        // Já tratado pelo modal
    }
});

// ── LOG ──────────────────────────────────────────────────────
console.log('%cChico Grill 🍔', 'font-size:1.5rem;font-weight:bold;color:#f97316;');
console.log('%c40+ unidades em São Paulo. O cheddar mais insano!', 'color:#fbbf24;');
console.log('%cSEO otimizado | Responsivo | Acessível ✓', 'color:#22c55e;font-size:0.8rem;');