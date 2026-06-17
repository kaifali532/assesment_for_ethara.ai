/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        apple: {
          gray: '#f5f5f7',
          dark: '#1d1d1f',
          blue: '#0066cc',
          border: '#d2d2d7'
        }
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'float': '0 10px 40px rgba(0, 0, 0, 0.08)',
        'inner-soft': 'inset 0 2px 4px rgba(0,0,0,0.02)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'apple-gradient': 'linear-gradient(145deg, #ffffff 0%, #f5f5f7 100%)',
      }
    },
  },
  plugins: [],
}
