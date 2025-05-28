/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Main background colors
        background: {
          primary: '#0f172a',   // Dark blue-gray
          secondary: '#1e293b', // Slightly lighter blue-gray
          tertiary: '#334155',  // Even lighter for contrasting elements
        },
        // Text colors
        content: {
          primary: '#e2e8f0',   // Light gray for primary text
          secondary: '#94a3b8', // Muted gray for secondary text
          accent: '#38bdf8',    // Light blue for accent elements
        },
        // UI component colors
        ui: {
          primary: '#0ea5e9',   // Sky blue for primary buttons
          secondary: '#475569', // Slate gray for secondary buttons
          accent: '#2dd4bf',    // Teal for accent elements
          hover: '#0284c7',     // Darker blue for hover states
          focus: '#0369a1',     // Even darker blue for focus states
          success: '#10b981',   // Green for success states
          warning: '#f59e0b',   // Amber for warning states
          error: '#ef4444',     // Red for error states
        }
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'serif': ['Merriweather', 'serif'],
        'mono': ['Fira Code', 'monospace'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.content.primary'),
            h1: {
              color: theme('colors.content.primary'),
              fontWeight: '600',
            },
            h2: {
              color: theme('colors.content.primary'),
              fontWeight: '500',
            },
            h3: {
              color: theme('colors.content.primary'),
              fontWeight: '500',
            },
            strong: {
              color: theme('colors.content.primary'),
              fontWeight: '600',
            },
            em: {
              fontStyle: 'italic',
            },
            a: {
              color: theme('colors.content.accent'),
              '&:hover': {
                color: theme('colors.ui.hover'),
              },
            },
          },
        },
      }),
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};