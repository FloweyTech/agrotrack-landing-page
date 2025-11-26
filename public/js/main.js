import { loadLanguage, getTranslation } from './modules/i18n.js';

// Sistema de traducción
let currentLanguage = 'en'; // Cambiar a inglés por defecto

const languageBtn = document.querySelector('.btn-language');
const currentLangSpan = document.querySelector('.current-lang');
const altLangSpan = document.querySelector('.alt-lang');

async function toggleLanguage() {
    // Cambiar entre español e inglés
    currentLanguage = currentLanguage === 'es' ? 'en' : 'es';

    // Cargar las traducciones desde el archivo JSON correspondiente
    await loadLanguage(currentLanguage);

    // Actualizar el botón de idioma correctamente
    updateLanguageButton();

    // Actualizar el atributo lang del HTML
    document.documentElement.lang = currentLanguage;
}

// Función para actualizar el botón de idioma
function updateLanguageButton() {
    if (currentLangSpan && altLangSpan) {
        currentLangSpan.textContent = currentLanguage.toUpperCase();
        altLangSpan.textContent = currentLanguage === 'es' ? 'EN' : 'ES';
    }
}

// Inicializar con idioma por defecto cuando cargue la página
document.addEventListener('DOMContentLoaded', async () => {
    await loadLanguage(currentLanguage);
    document.documentElement.lang = currentLanguage;

    // Configurar el botón inicial correctamente
    updateLanguageButton();
});

// Agregar event listener al botón de idioma
if (languageBtn) {
    languageBtn.addEventListener('click', toggleLanguage);
}

// Animaciones de navegación mejoradas
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Función para agregar/quitar clase 'scrolled' al navbar
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Función para detectar la sección activa
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100; // Offset para el navbar fijo

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remover clase active de todos los enlaces
            navLinks.forEach(link => link.classList.remove('active'));

            // Agregar clase active al enlace correspondiente
            const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// Función para scroll suave con offset personalizado
function smoothScrollToSection(targetId) {
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = targetSection.offsetTop - navbarHeight - 20; // 20px de padding extra

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Función para togglear el menú móvil
function toggleMobileMenu() {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

// Función para cerrar el menú móvil
function closeMobileMenu() {
    mobileMenuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
}

// Event listeners para navegación
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = link.getAttribute('href').substring(1); // Remover el #
        smoothScrollToSection(targetId);

        // Cerrar menú móvil si está abierto
        closeMobileMenu();

        // Agregar efecto visual al hacer clic
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = '';
        }, 150);
    });
});

// Event listener para el botón hamburguesa
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

// Cerrar menú al hacer clic fuera de él
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Cerrar menú al redimensionar la ventana (si cambia a desktop)
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Event listeners para scroll
window.addEventListener('scroll', () => {
    handleNavbarScroll();
    updateActiveNavLink();
});

// Llamar funciones iniciales
handleNavbarScroll();
updateActiveNavLink();

// Slider de servicios
const servicesWrapper = document.querySelector('.services-wrapper');
const nextBtn = document.querySelector('.next-btn');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
const totalSlides = 5; // Actualizado a 5 slides

function updateSlider() {
    if (servicesWrapper) {
        const slideWidth = document.querySelector('.service-card').offsetWidth + 32; // 32 es el gap
        servicesWrapper.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

        // Actualizar dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    });
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
    });
});

// Auto slide cada 5 segundos (solo si existe el wrapper)
if (servicesWrapper) {
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }, 5000);
}

// Función para animar el contador
function animateCounter(element, start, end, duration, decimals = 0) {
    let current = start;
    const range = end - start;
    const increment = range / (duration / 16); // 16ms es aproximadamente 60fps
    const suffix = element.dataset.suffix || '';

    function update() {
        current += increment;
        if ((increment >= 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            element.textContent = end.toFixed(decimals) + suffix;
            return;
        }
        element.textContent = current.toFixed(decimals) + suffix;
        requestAnimationFrame(update);
    }

    update();
}

// Función para verificar si un elemento está visible en la ventana
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Iniciar animación cuando los elementos sean visibles
function handleScroll() {
    const counters = document.querySelectorAll('.stat-number:not(.counted)');
    counters.forEach(counter => {
        if (isElementInViewport(counter)) {
            const target = parseFloat(counter.dataset.target);
            const decimals = parseInt(counter.dataset.decimals || 0);
            counter.classList.add('counted');
            animateCounter(counter, 0, target, 2000, decimals);
        }
    });
}

// Escuchar el evento scroll
window.addEventListener('scroll', handleScroll);
// Verificar al cargar la página
handleScroll();

// Form validation
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const mensaje = document.getElementById('mensaje').value;

        if (!nombre || !email || !mensaje) {
            alert(getTranslation('form-validation-required'));
            return;
        }

        if (!email.includes('@')) {
            alert(getTranslation('form-validation-email'));
            return;
        }

        // Aquí normalmente enviarías el formulario a un servidor
        console.log('Formulario enviado:', { nombre, email, mensaje });
        alert(getTranslation('form-success'));
        contactForm.reset();
    });
}

// Redirección a la aplicación web de AgroTrack
const AGROTRACK_APP_URL = 'https://agrotrack-web-app.netlify.app/';

// Función para redirigir a la aplicación web
function redirectToApp() {
    window.open(AGROTRACK_APP_URL, '_blank');
}

// Event listeners para botones de login y register en el navbar
const btnLogin = document.querySelector('.btn-login');
const btnRegister = document.querySelector('.btn-register');

if (btnLogin) {
    btnLogin.addEventListener('click', redirectToApp);
}

if (btnRegister) {
    btnRegister.addEventListener('click', redirectToApp);
}

// Event listener para el botón discover en el hero
const btnDiscover = document.querySelector('.btn-discover');

if (btnDiscover) {
    btnDiscover.addEventListener('click', redirectToApp);
}

// Event listeners para otros botones de registro en la página
const btnRegisterNow = document.querySelectorAll('.btn-register-now');
const btnPlan = document.querySelectorAll('.btn-plan');

btnRegisterNow.forEach(btn => {
    btn.addEventListener('click', redirectToApp);
});

btnPlan.forEach(btn => {
    btn.addEventListener('click', redirectToApp);
});

