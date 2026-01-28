// Content Population Functions
const PROFILE_DATA_OVERRIDE_KEY = 'profileDataOverride';

function getProfileData() {
    // Prefer admin override from localStorage if available.
    try {
        const raw = localStorage.getItem(PROFILE_DATA_OVERRIDE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') return parsed;
        }
    } catch (e) {
        console.warn('Invalid profileData override in localStorage. Falling back to base profileData.', e);
    }

    // Fall back to base profile-data.js
    if (typeof profileData !== 'undefined') return profileData;
    return null;
}

function populateContent() {
    const profileData = getProfileData();
    if (!profileData) {
        console.error('profileData is not available. Make sure profile-data.js is loaded.');
        return;
    }

    // Populate meta tags first
    populateMetaTags();
    
    populateNavigation();
    populateHero();
    populateAbout();
    populateExperience();
    populateSkills();
    populateContact();
    populateFooter();
    updatePageTitle();
}

function populateNavigation() {
    const profileData = getProfileData();
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu || !profileData.navigation) return;

    navMenu.innerHTML = '';
    profileData.navigation.forEach((item, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.href;
        a.className = 'nav-link' + (index === 0 ? ' active' : '');
        a.textContent = item.label;
        li.appendChild(a);
        navMenu.appendChild(li);
    });
}

function populateHero() {
    const profileData = getProfileData();
    if (!profileData.personal) return;

    const greeting = document.getElementById('hero-greeting');
    const title = document.getElementById('hero-title');
    const tagline = document.getElementById('hero-tagline');

    if (greeting && profileData.personal.greeting) {
        greeting.textContent = profileData.personal.greeting;
    }
    if (title && profileData.personal.name) {
        title.textContent = profileData.personal.name;
    }
    if (tagline && profileData.personal.tagline) {
        tagline.textContent = profileData.personal.tagline;
    }
}

function populateAbout() {
    const profileData = getProfileData();
    const aboutText = document.getElementById('about-text');
    if (!aboutText || !profileData.about) return;

    let html = '';
    
    // Add paragraphs
    if (profileData.about.paragraphs) {
        profileData.about.paragraphs.forEach(paragraph => {
            html += `<p class="reveal-text">${paragraph}</p>`;
        });
    }

    // Add stats
    if (profileData.about.stats && profileData.about.stats.length > 0) {
        html += '<div class="stats reveal-text">';
        profileData.about.stats.forEach(stat => {
            html += `
                <div class="stat-item">
                    <div class="stat-number" data-target="${stat.number}">0</div>
                    <div class="stat-label">${stat.label}</div>
                </div>
            `;
        });
        html += '</div>';
    }

    aboutText.innerHTML = html;
}

function populateExperience() {
    const profileData = getProfileData();
    const timeline = document.getElementById('timeline');
    if (!timeline || !profileData.experience) return;

    timeline.innerHTML = '';
    profileData.experience.forEach((exp, index) => {
        const isEven = index % 2 === 0;
        const slideClass = isEven ? 'slide-in-left' : 'slide-in-right';
        
        let html = `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content ${slideClass}">
                    <div class="timeline-date">${exp.date}</div>
                    <h3>${exp.title}</h3>
                    <p>${exp.description}</p>
        `;

        if (exp.responsibilities && exp.responsibilities.length > 0) {
            html += '<ul class="experience-list">';
            exp.responsibilities.forEach(resp => {
                html += `<li>${resp}</li>`;
            });
            html += '</ul>';
        }

        html += '</div></div>';
        timeline.innerHTML += html;
    });
}

function populateSkills() {
    const profileData = getProfileData();
    const skillsGrid = document.getElementById('skills-grid');
    if (!skillsGrid || !profileData.skills) return;

    skillsGrid.innerHTML = '';
    profileData.skills.forEach(skill => {
        let html = `
            <div class="skill-card">
                <div class="skill-icon">${skill.icon}</div>
                <h3>${skill.category}</h3>
                <div class="skill-tags">
        `;

        skill.items.forEach(item => {
            html += `<span class="skill-tag">${item}</span>`;
        });

        html += '</div></div></div>';
        skillsGrid.innerHTML += html;
    });
}

function populateContact() {
    const profileData = getProfileData();
    const contactInfo = document.getElementById('contact-info');
    if (!contactInfo || !profileData.contact) return;

    let html = '';

    // Email
    if (profileData.contact.email) {
        html += `
            <div class="contact-item">
                <div class="contact-icon">📧</div>
                <div>
                    <h3>Email</h3>
                    <p><a href="mailto:${profileData.contact.email}" style="color: inherit; text-decoration: none;">${profileData.contact.email}</a></p>
                </div>
            </div>
        `;
    }

    // LinkedIn
    if (profileData.contact.linkedin) {
        const linkedinUrl = profileData.contact.linkedin.startsWith('http') 
            ? profileData.contact.linkedin 
            : `https://${profileData.contact.linkedin}`;
        html += `
            <div class="contact-item">
                <div class="contact-icon">💼</div>
                <div>
                    <h3>LinkedIn</h3>
                    <p><a href="${linkedinUrl}" target="_blank" style="color: inherit; text-decoration: none;">${profileData.contact.linkedin}</a></p>
                </div>
            </div>
        `;
    }

    // GitHub
    if (profileData.contact.github) {
        const githubUrl = profileData.contact.github.startsWith('http') 
            ? profileData.contact.github 
            : `https://${profileData.contact.github}`;
        html += `
            <div class="contact-item">
                <div class="contact-icon">🐙</div>
                <div>
                    <h3>GitHub</h3>
                    <p><a href="${githubUrl}" target="_blank" style="color: inherit; text-decoration: none;">${profileData.contact.github}</a></p>
                </div>
            </div>
        `;
    }

    // Phone (optional)
    if (profileData.contact.phone) {
        html += `
            <div class="contact-item">
                <div class="contact-icon">📱</div>
                <div>
                    <h3>Phone</h3>
                    <p><a href="tel:${profileData.contact.phone}" style="color: inherit; text-decoration: none;">${profileData.contact.phone}</a></p>
                </div>
            </div>
        `;
    }

    contactInfo.innerHTML = html;
}

function populateFooter() {
    const profileData = getProfileData();
    const footerText = document.getElementById('footer-text');
    if (footerText && profileData.footer && profileData.footer.text) {
        footerText.textContent = profileData.footer.text;
    }
}

function updatePageTitle() {
    const profileData = getProfileData();
    const pageTitle = document.getElementById('page-title');
    if (pageTitle && profileData.meta && profileData.meta.title) {
        pageTitle.textContent = profileData.meta.title;
    } else if (pageTitle && profileData.personal && profileData.personal.name) {
        pageTitle.textContent = `${profileData.personal.name} - Profile`;
    }
}

function populateMetaTags() {
    const profileData = getProfileData();
    if (!profileData.meta) return;

    // Update document title
    if (profileData.meta.title) {
        document.title = profileData.meta.title;
    }

    // Update favicon
    if (profileData.meta.favicon) {
        // Remove existing favicon links
        const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
        existingFavicons.forEach(link => link.remove());

        // Add new favicon
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = profileData.meta.favicon.endsWith('.png') ? 'image/png' : 
                      profileData.meta.favicon.endsWith('.svg') ? 'image/svg+xml' : 'image/x-icon';
        favicon.href = profileData.meta.favicon;
        document.head.appendChild(favicon);

        // Also add shortcut icon for older browsers
        const shortcutIcon = document.createElement('link');
        shortcutIcon.rel = 'shortcut icon';
        shortcutIcon.href = profileData.meta.favicon;
        document.head.appendChild(shortcutIcon);
    }

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
    }
    if (profileData.meta.description) {
        metaDescription.setAttribute('content', profileData.meta.description);
    }

    // Update or create meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
    }
    if (profileData.meta.keywords) {
        metaKeywords.setAttribute('content', profileData.meta.keywords);
    }

    // Update or create meta author
    let metaAuthor = document.querySelector('meta[name="author"]');
    if (!metaAuthor) {
        metaAuthor = document.createElement('meta');
        metaAuthor.setAttribute('name', 'author');
        document.head.appendChild(metaAuthor);
    }
    if (profileData.meta.author) {
        metaAuthor.setAttribute('content', profileData.meta.author);
    }

    // Open Graph meta tags
    if (profileData.meta.ogTitle) {
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
            ogTitle = document.createElement('meta');
            ogTitle.setAttribute('property', 'og:title');
            document.head.appendChild(ogTitle);
        }
        ogTitle.setAttribute('content', profileData.meta.ogTitle);
    }

    if (profileData.meta.ogDescription) {
        let ogDescription = document.querySelector('meta[property="og:description"]');
        if (!ogDescription) {
            ogDescription = document.createElement('meta');
            ogDescription.setAttribute('property', 'og:description');
            document.head.appendChild(ogDescription);
        }
        ogDescription.setAttribute('content', profileData.meta.ogDescription);
    }

    if (profileData.meta.ogImage) {
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (!ogImage) {
            ogImage = document.createElement('meta');
            ogImage.setAttribute('property', 'og:image');
            document.head.appendChild(ogImage);
        }
        ogImage.setAttribute('content', profileData.meta.ogImage);
    }

    // Open Graph Type
    if (profileData.meta.ogType) {
        let ogType = document.querySelector('meta[property="og:type"]');
        if (!ogType) {
            ogType = document.createElement('meta');
            ogType.setAttribute('property', 'og:type');
            document.head.appendChild(ogType);
        }
        ogType.setAttribute('content', profileData.meta.ogType);
    }

    // Open Graph URL
    if (profileData.meta.ogUrl) {
        let ogUrl = document.querySelector('meta[property="og:url"]');
        if (!ogUrl) {
            ogUrl = document.createElement('meta');
            ogUrl.setAttribute('property', 'og:url');
            document.head.appendChild(ogUrl);
        }
        ogUrl.setAttribute('content', profileData.meta.ogUrl);
    }

    // Twitter Card meta tags
    if (profileData.meta.twitterCard) {
        let twitterCard = document.querySelector('meta[name="twitter:card"]');
        if (!twitterCard) {
            twitterCard = document.createElement('meta');
            twitterCard.setAttribute('name', 'twitter:card');
            document.head.appendChild(twitterCard);
        }
        twitterCard.setAttribute('content', profileData.meta.twitterCard);
    }
}

// Theme Switcher Functions
function initThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeMenu = document.getElementById('theme-menu');
    const themeOptions = document.querySelectorAll('.theme-option');

    // Toggle theme menu
    if (themeToggle && themeMenu) {
        themeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            themeMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!themeMenu.contains(e.target) && !themeToggle.contains(e.target)) {
                themeMenu.classList.remove('active');
            }
        });
    }

    // Handle theme selection
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const themeName = option.getAttribute('data-theme');
            if (window.applyTheme) {
                window.applyTheme(themeName);
                themeMenu.classList.remove('active');
            }
        });
    });
}

function updateThemeSwitcher(themeName) {
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-theme') === themeName) {
            option.classList.add('active');
        }
    });
}

// Loading Screen
window.addEventListener('load', () => {
    // Initialize theme first (before content loads)
    if (window.initTheme) {
        window.initTheme();
    }
    
    // Populate content
    populateContent();
    
    // Initialize smooth scrolling after content is populated
    initSmoothScrolling();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize theme switcher
    initThemeSwitcher();
    
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    // Simulate loading time (minimum 1.5 seconds for smooth experience)
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');
        
        // Initialize animations after loading
        setTimeout(() => {
            initScrollAnimations();
            initCounterAnimations();
        }, 100);
    }, 1500);
});

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(this.getAttribute('href'));
            }
        });
    });
}

// Update Active Navigation Link on Scroll
function updateActiveNavLink(hash) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        }
    });
}

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active nav link based on scroll position
    updateActiveNavOnScroll();
    
    lastScroll = currentScroll;
});

// Update Active Nav Link Based on Scroll Position
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link (will be re-initialized after content load)
function initMobileMenu() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    // Observe all elements with reveal classes
    document.querySelectorAll('.reveal-text, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
}

// Counter Animation for Stats
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// Skill Cards Hover Effect
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Skill Tags Interactive Effect
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(2deg)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Contact Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Show success message (you can integrate with a backend here)
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitButton.textContent = 'Message Sent! ✓';
            submitButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            
            // Reset form
            contactForm.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.style.background = '';
                submitButton.disabled = false;
            }, 3000);
        }, 1500);
    });
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
});

// Typing Effect for Hero Text (Optional Enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Add cursor blinking effect to code animation
const codeLines = document.querySelectorAll('.code-line');
codeLines.forEach((line, index) => {
    setInterval(() => {
        line.style.opacity = line.style.opacity === '0.5' ? '1' : '0.5';
    }, 1000 + index * 200);
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth reveal animation for timeline items
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 200);
        }
    });
}, { threshold: 0.2 });

timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'all 0.6s ease';
    timelineObserver.observe(item);
});

// Add floating animation to skill cards
document.querySelectorAll('.skill-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// Console welcome message
console.log('%c👋 Welcome to my Portfolio!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cI\'m a Senior Programmer with 8+ years of experience.', 'font-size: 14px; color: #8b5cf6;');

