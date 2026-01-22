// Theme Configuration
// Four themes: light-blue, dark-blue, colorful-light, colorful-dark

const themes = {
    'light-blue': {
        name: 'Light Blue',
        colors: {
            primary: '#3b82f6',
            secondary: '#60a5fa',
            accent: '#2563eb',
            background: '#f0f9ff',
            surface: '#e0f2fe',
            textPrimary: '#0c4a6e',
            textSecondary: '#075985',
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #2563eb 100%)',
            cardBg: '#ffffff',
            border: '#bfdbfe'
        }
    },
    'dark-blue': {
        name: 'Dark Blue',
        colors: {
            primary: '#1e40af',
            secondary: '#3b82f6',
            accent: '#60a5fa',
            background: '#0f172a',
            surface: '#1e3a8a',
            textPrimary: '#dbeafe',
            textSecondary: '#93c5fd',
            gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
            cardBg: '#1e293b',
            border: '#3b82f6'
        }
    },
    'colorful-light': {
        name: 'Colorful Light',
        colors: {
            primary: '#8b5cf6',
            secondary: '#ec4899',
            accent: '#f59e0b',
            background: '#fef3c7',
            surface: '#fde68a',
            textPrimary: '#78350f',
            textSecondary: '#92400e',
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)',
            cardBg: '#ffffff',
            border: '#fbbf24'
        }
    },
    'colorful-dark': {
        name: 'Colorful Dark',
        colors: {
            primary: '#6366f1',
            secondary: '#8b5cf6',
            accent: '#ec4899',
            background: '#0f172a',
            surface: '#1e293b',
            textPrimary: '#f1f5f9',
            textSecondary: '#cbd5e1',
            gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            cardBg: '#1e293b',
            border: '#6366f1'
        }
    }
};

// Default theme
const defaultTheme = 'colorful-dark';

// Get current theme from localStorage or use default
function getCurrentTheme() {
    return localStorage.getItem('selectedTheme') || defaultTheme;
}

// Set theme in localStorage
function setTheme(themeName) {
    localStorage.setItem('selectedTheme', themeName);
}

// Apply theme to document
function applyTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) {
        console.error(`Theme "${themeName}" not found`);
        return;
    }

    const root = document.documentElement;
    const colors = theme.colors;

    // Set CSS custom properties
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--accent-color', colors.accent);
    root.style.setProperty('--dark-bg', colors.background);
    root.style.setProperty('--dark-surface', colors.surface);
    root.style.setProperty('--text-primary', colors.textPrimary);
    root.style.setProperty('--text-secondary', colors.textSecondary);
    root.style.setProperty('--gradient', colors.gradient);
    root.style.setProperty('--card-bg', colors.cardBg);
    root.style.setProperty('--border-color', colors.border);

    // Update theme switcher active state (if function exists)
    if (typeof updateThemeSwitcher === 'function') {
        updateThemeSwitcher(themeName);
    } else {
        // Fallback: update directly
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-theme') === themeName) {
                option.classList.add('active');
            }
        });
    }
    
    // Save theme preference
    setTheme(themeName);
}

// Initialize theme on page load
function initTheme() {
    const currentTheme = getCurrentTheme();
    applyTheme(currentTheme);
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.themes = themes;
    window.getCurrentTheme = getCurrentTheme;
    window.setTheme = setTheme;
    window.applyTheme = applyTheme;
    window.initTheme = initTheme;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { themes, defaultTheme, getCurrentTheme, setTheme, applyTheme, initTheme };
}