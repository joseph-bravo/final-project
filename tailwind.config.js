module.exports = {
  content: ['./client/**/*.jsx'],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['light']
  }
};
