/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cb: {
          primary: '#E24B4A',
          navy: '#0D1B2A',
          'navy-light': '#1B2838',
          cream: '#F0F0EC',
          amber: '#F5C518',
          success: '#1D9E75',
          info: '#378ADD',
          'gray-1': '#6B7280',
          'gray-2': '#9CA3AF',
          'gray-3': '#E5E7EB',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        pill: '24px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
