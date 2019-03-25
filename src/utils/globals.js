import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    * {
      margin: 0;
      padding: 0;
    }

    button {
      outline: none;
      cursor: pointer;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    html {
      font-size: 62.5%; //1rem = 10px
      box-sizing: border-box;
      --color-primary: ${props => props.theme.colors.main};
      --color-primary-dark: ${props => props.theme.colors.dark};
      --color-primary-light: ${props => props.theme.colors.light};
      --color-primary-lighter: ${props => props.theme.colors.lighter};
      --text-color: ${props => props.theme.colors.text};
      --link-color: ${props => props.theme.colors.link};
      --border-color: rgba(176, 190, 197, 0.5);
      --shadow-color: rgba(0, 0, 0, 0.2);
      --shadow-color-dark: rgba(0, 0, 0, 0.25);

      @media ${props => props.theme.mediaQueries.largest} {
          font-size: 57.5%;
      }

      @media ${props => props.theme.mediaQueries.large} {
          font-size: 55%;
      }
    }

    body {
      font-family: 'Montserrat', sans-serif;
      font-weight: 400;
      line-height: 1.6;
    }

    form,
    input,
    textarea,
    button,
    select,
    a {
      -webkit-tap-highlight-color: rgba(0,0,0,0);
    }
`;
