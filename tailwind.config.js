const { StarHalf } = require('lucide-react');

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

        favourite: {
          star: '#ecc94b',
          starHover: '#d69e2e',  // Fixed capitalization
        },

        // Fixed typo in nextButton light color (had double #)
        nextButton: {  // Changed to match your component usage
                  main: '#e05252',
          light: '#e36d6d',
          hover: '#c83838',
          text: '#ffffff',
        },
        
        // Break colors
        break: {
          main: '#f59e0b',
          light: '#fef3c7',
          dark: '#d97706',
          text: '#b45309',
        },
        
        // Break2 colors
        break2: {
          main: '#c98376',
          light: '#f8f0e5',
          dark: '#a5695e',
          text: '#c98376',
        },
        
        // New colors for Teams meeting button
        teams: {
          main: '#4b53bc',
          dark: '#3a4299',
          light: '#eef0ff',
        },
        
        // New colors for Recording button
        recording: {
          main: '#e05252',
          dark: '#c94747',
          light: '#ffe5e5',
        },
        
        // Neutral colors
        neutral: {
          background: '#f5f7ff',
          card: '#ffffff',
          text: {
            primary: '#333333',
            secondary: '#666666',
            white: '#ffffff',
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