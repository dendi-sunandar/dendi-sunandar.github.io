// Profile Data Configuration
// Update this file to manage your profile content easily

const profileData = {
    // Page Meta Information
    meta: {
        title: "Dendi Sunandar, S.T. - Senior Programmer Portfolio",
        description: "Portfolio of Dendi Sunandar, S.T. - Senior Programmer with 8+ years of experience in software development. Crafting elegant solutions through code since 2016.",
        keywords: "Dendi Sunandar, Senior Programmer, Software Developer, Portfolio, Web Development, Programming",
        author: "Dendi Sunandar, S.T.",
        // Favicon
        favicon: "favicon.ico", // Path to your favicon file (e.g., "favicon.svg", "favicon.ico", "images/favicon.png", or full URL)
        // Open Graph (for Google & social)
        ogTitle: "Dendi Sunandar, S.T. - Senior Programmer",
        ogDescription: "Senior Programmer with 8+ years of experience in software development. Crafting elegant solutions through code since 2016.",
        ogType: "website",
        ogUrl: "https://dendi-sunandar.github.io",
        ogImage: "", // Add your profile image URL here if available
        // Twitter Card
        twitterCard: "summary_large_image"
    },

    // Personal Information
    personal: {
        name: "Dendi Sunandar, S.T.",
        title: "Senior Programmer",
        tagline: "Crafting elegant solutions through code since 2016",
        greeting: "Hello, I'm"
    },

    // About Section
    about: {
        paragraphs: [
            "I am a passionate Senior Programmer with extensive experience in software development. Since August 2016, I have been dedicated to creating innovative solutions and delivering high-quality code that makes a difference.",
            "My journey in programming has been marked by continuous learning, problem-solving, and a commitment to excellence. I thrive in challenging environments and enjoy turning complex problems into elegant, maintainable solutions."
        ],
        stats: [
            {
                number: 8,
                label: "Years Experience"
            },
            {
                number: 100,
                label: "Projects Completed"
            },
            {
                number: 50,
                label: "Technologies"
            }
        ]
    },

    // Experience Section
    experience: [
        {
            date: "August 2016 - Present",
            title: "Senior Programmer",
            description: "Leading development teams and architecting scalable software solutions. Responsible for code reviews, mentoring junior developers, and implementing best practices across multiple projects.",
            responsibilities: [
                "Design and develop robust applications",
                "Optimize performance and scalability",
                "Collaborate with cross-functional teams",
                "Mentor and guide development teams"
            ]
        },
        {
            date: "2016 - 2018",
            title: "Programmer",
            description: "Developed and maintained various software applications, focusing on clean code and efficient solutions. Gained expertise in multiple programming languages and frameworks.",
            responsibilities: []
        }
    ],

    // Skills Section
    skills: [
        {
            icon: "💻",
            category: "Programming Languages",
            items: ["JavaScript", "Python", "Java", "C++", "TypeScript"]
        },
        {
            icon: "🛠️",
            category: "Frameworks & Tools",
            items: ["React", "Node.js", "Vue.js", "Django", "Git"]
        },
        {
            icon: "☁️",
            category: "Cloud & DevOps",
            items: ["AWS", "Docker", "Kubernetes", "CI/CD"]
        },
        {
            icon: "🗄️",
            category: "Databases",
            items: ["PostgreSQL", "MongoDB", "MySQL", "Redis"]
        }
    ],

    // Contact Information
    contact: {
        email: "dendisunandar@gmail.com",
        linkedin: "https://www.linkedin.com/in/dendi-sunandar-9355b7145",
        github: "github.com/dendi-sunandar",
        phone: "+62 813 2065 5381" // Optional
    },

    // Navigation Menu
    navigation: [
        { label: "Home", href: "#home" },
        { label: "About", href: "#about" },
        { label: "Experience", href: "#experience" },
        { label: "Skills", href: "#skills" },
        { label: "Contact", href: "#contact" }
    ],

    // Footer
    footer: {
        text: "© 2024 Dendi Sunandar, S.T.. All rights reserved."
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = profileData;
}