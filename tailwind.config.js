module.exports = {
  content: ['./apps/rl-ecommerce/src/**/*.{html,ts}'],
  theme: {
    fontFamily: {
      playfair: ['Playfair Display', 'serif'],
      inter: ['Inter', 'sans-serif'],
    },

    screens: {
      mobile: '510px',
      tablet: '640px',
      // => @media (min-width: 640px) { ... }

      laptop: '1024px',
      // => @media (min-width: 1024px) { ... }

      desktop: '1280px',
      // => @media (min-width: 1280px) { ... }
    },

    extend: {
      colors: {
        primary: '#800020',
        type_title: '#1C1C1C',
        type_title_gray: '#333333',
        type_grey: '#555555',
        type_caption: '#666666',
        bg_subtle: '#EDEDED',
        bg_main: '#F6F1E9',
        border_subtle: '#DCDCDC',
        grayish_blue: '#1B292F',
      },
    },
  },
  plugins: [],
};
