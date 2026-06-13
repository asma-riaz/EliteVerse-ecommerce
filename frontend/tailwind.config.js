export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50:'#fff7ed',100:'#ffedd5',400:'#fb923c',500:'#f97316',600:'#ea580c',700:'#c2410c',900:'#7c2d12' },
        dark:  { 800:'#1c1917', 900:'#0c0a09' }
      },
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"','sans-serif'],
        display: ['"Playfair Display"','serif'],
      }
    }
  },
  plugins: []
}