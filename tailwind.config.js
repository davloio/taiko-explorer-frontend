/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Official Taiko Brand Colors (from brand specification)
        taiko: {
          japonica: '#D5775E',     // Primary brand color (Coral/Salmon) 
          cyan: '#2BD3EF',         // Secondary accent (Cyan Blue)
          white: '#FFFFFF',        // White
          charcoal: '#313131',     // Mine Shaft (Charcoal Gray)
        },
        // Legacy colors (backward compatibility)
        'taiko-pink': '#D5775E',   // Maps to japonica
        'taiko-purple': '#2BD3EF', // Maps to cyan 
        'taiko-yellow': '#F59E0B', // Warning color
        'taiko-gray': '#6b7280',
        'taiko-dark': '#313131',   // Maps to charcoal
        'taiko-light-gray': '#f8fafc',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#D5775E", // Taiko Japonica
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#2BD3EF", // Taiko Cyan
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F59E0B", // Warning Yellow
          foreground: "#313131",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#EFEFEF", // Taiko Gray
          foreground: "#0B101B",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Public Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Public Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        "slide-in": {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
      backgroundImage: {
        'taiko-gradient': 'linear-gradient(135deg, #D5775E 0%, #2BD3EF 100%)',
        'taiko-gradient-subtle': 'linear-gradient(135deg, #D5775E 0%, #2BD3EF 50%, #D5775E 100%)',
        'taiko-hero-gradient': 'linear-gradient(135deg, #D5775E 0%, #2BD3EF 50%, #D5775E 100%)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}