const theme = {
  colors: {
    main: '#37474f',
    dark: '#263238',
    light: '#546e7a',
    lighter: '#b0bec5',
    text: '#fafafa',
    link: '#444444',
  },
  breakpoints: [
    '56.25em',
    '80em',
    '90em',
    '97em',
  ],
  mediaQueries: {
    smallest: `only screen and (max-width: 25em)`, //275px
    smaller: 'only screen and (max-width: 31.25em)', //500px
    small: 'only screen and (max-width: 37.5em)', //600px
    medium: 'only screen and (max-width: 56.25em)', //900px
    large: 'only screen and (max-width: 80em)', //1300px
    larger: 'only screen and (max-width: 90em)', //1300px
    largest: 'only screen and (max-width: 97em)', //1500px
  },
};

export default theme;
