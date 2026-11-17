
document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const themeColor = document.querySelector('meta[name="theme-color"]');

    const navbar = document.querySelector(".luxury-navbar");
    const navbarMenu = document.getElementById("navbarMenu");
    const navbarLinks = document.querySelectorAll(".navbar-nav .nav-link");

    const backToTop = document.getElementById("backToTop");
    const contactForm = document.getElementById("contactForm");
    const yearElement = document.getElementById("currentYear");

    /* =========================
       MODO CLARO Y OSCURO
    ========================= */

    function getSavedTheme() {
        try {
            return localStorage.getItem("portfolio-theme");
        } catch (error) {
            return null;
        }
    }

    function applyTheme(theme) {

        const isDark = theme === "dark";

        body.classList.toggle("dark", isDark);

        if (themeIcon) {
            themeIcon.classList.toggle("fa-moon", !isDark);
            themeIcon.classList.toggle("fa-sun", isDark);
        }

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                isDark ? "Activar modo claro" : "Activar modo oscuro"
            );

            themeToggle.setAttribute("aria-pressed", String(isDark));
        }

        if (themeColor) {
            themeColor.setAttribute(
                "content",
                isDark ? "#21191d" : "#fffdfb"
            );
        }
    }

    const savedTheme = getSavedTheme();

    applyTheme(savedTheme === "dark" ? "dark" : "light");

    themeToggle?.addEventListener("click", () => {

        const nextTheme = body.classList.contains("dark")
            ? "light"
            : "dark";

        applyTheme(nextTheme);

        try {
            localStorage.setItem("portfolio-theme", nextTheme);
        } catch (error) {
            console.warn("No se pudo guardar la preferencia del tema.");
        }

    });

    /* =========================
       NAVBAR AL DESPLAZARSE
    ========================= */

    function handleScroll() {

        const currentScroll = window.scrollY;

        navbar?.classList.toggle("scrolled", currentScroll > 35);

        backToTop?.classList.toggle("show", currentScroll > 400);

    }

    window.addEventListener("scroll", handleScroll, {
        passive: true
    });

    handleScroll();

    /* =========================
       BOTÓN VOLVER ARRIBA
    ========================= */

    backToTop?.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

    /* =========================
       MENÚ DE NAVEGACIÓN
    ========================= */

    navbarLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            if (
                navbarMenu?.classList.contains("show") &&
                window.bootstrap
            ) {
                window.bootstrap.Collapse
                    .getOrCreateInstance(navbarMenu)
                    .hide();
            }

        });

    });

    /* =========================
       BARRAS DE HABILIDADES
    ========================= */

    const progressBars = document.querySelectorAll(
        ".luxury-progress div"
    );

    progressBars.forEach(bar => {

        const width = bar.style.width;

        bar.style.width = "0";

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {
                bar.style.width = width;
            });

        });

    });

    /* =========================
       ANIMACIÓN DE ELEMENTOS
    ========================= */

    const animatedElements = document.querySelectorAll(
        ".about-card, .project-card, .experience-card, .education-item"
    );

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("visible");

                    observerInstance.unobserve(entry.target);

                });

            },
            {
                threshold: 0.12
            }
        );

        animatedElements.forEach(element => {

            element.style.opacity = "0";
            element.style.transform = "translateY(20px)";
            element.style.transition =
                "opacity .6s ease, transform .6s ease";

            observer.observe(element);

        });

        const revealStyle = document.createElement("style");

        revealStyle.textContent = `
            .about-card.visible,
            .project-card.visible,
            .experience-card.visible,
            .education-item.visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;

        document.head.appendChild(revealStyle);

    }

    /* =========================
       FORMULARIO DE CONTACTO
    ========================= */

    contactForm?.addEventListener("submit", event => {

        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const formData = new FormData(contactForm);

        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const subject = String(formData.get("subject") || "").trim();
        const message = String(formData.get("message") || "").trim();

        if (!name || !email || !subject || !message) {
            return;
        }

        const recipient = "crismairymorasoto30@gmail.com";

        const mailSubject = encodeURIComponent(subject);

        const mailBody = encodeURIComponent(
            `Hola Crismairy,

${message}

Nombre: ${name}
Correo de contacto: ${email}`
        );

        const mailtoLink =
            `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;

        window.location.href = mailtoLink;

    });

    /* =========================
       AÑO AUTOMÁTICO
    ========================= */

    if (yearElement) {

        yearElement.textContent = new Date().getFullYear();

    }

});




