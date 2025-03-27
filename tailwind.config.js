/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,tsx,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          main: '#081079',
          light: '#3949ab',
          dark: '#060d4d',
          contrast: '#ffffff',
        },
        
        // Session type colors
        workshop: {
          main: '#e05252',
          light: '#fff5f5',
          dark: '#c83838',
          hover: '#fff0f0',
          text: '#e05252',
        },
        
        speech: {
          main: '#3949ab',
          light: '#f5f7ff',
          dark: '#303f9f',
          hover: '#f0f2fa',
          text: '#3949ab',
        },
        
        common: {
          main: '#f0b429',
          light: '#fffbf0',
          hover: '#fff7e0',
          text: '#b88a00',
        },
        
        // Break colors (previously using amber palette)
        break: {
          main: '#f59e0b',    // amber-500 equivalent
          light: '#fef3c7',   // amber-50 equivalent
          dark: '#d97706',    // amber-600 equivalent
          text: '#b45309',    // amber-700 equivalent
        },

        break2: {
          main: '#c98376',    // The border color
          light: '#f8f0e5',   // The background color
          text: '#c98376',    // The text color
        },
        
        // Neutral colors
        neutral: {
          background: '#f5f7ff',
          card: '#ffffff',
          text: {
            primary: '#333333',
            secondary: '#666666',
          },
          border: '#e5e7eb',
        },
        
        // Status colors
        status: {
          success: '#34d399',
          warning: '#fbbf24',
          error: '#ef4444',
          info: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
}