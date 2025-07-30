/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Quét tất cả các file JS, JSX, TS, TSX trong thư mục src
    "./public/index.html"         // Quét file index.html nếu có class Tailwind
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Thêm font Inter nếu bạn muốn sử dụng nó một cách tường minh
      },
      colors: {
        // Override with safe RGB colors only
        'blue': {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      animation: { // Thêm các keyframes đã định nghĩa trong animations.css
        'fade-in-down': 'fade-in-down 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
      },
      keyframes: { // Định nghĩa keyframes nếu muốn quản lý tập trung ở đây
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  corePlugins: {
    // Disable modern color functions to avoid oklch() errors
    colorScheme: false,
  },
  plugins: [
    // require('@tailwindcss/forms'), // Ví dụ nếu bạn muốn sử dụng plugin forms của Tailwind
  ],
}