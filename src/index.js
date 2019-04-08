import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-redux-multilingual';
import { ThemeProvider } from 'styled-components';

import App from './containers/App';

import store from './store';
import theme from './utils/theme';
import translations from './utils/translations';
import GlobalStyle from './utils/globals';

import '../node_modules/react-modal-video/scss/modal-video.scss';
import '../node_modules/slick-carousel/slick/slick.css';
import '../node_modules/slick-carousel/slick/slick-theme.css';

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Fragment>
      <IntlProvider translations={translations} >
          <Helmet>
              <title>Movie Library</title>
              <meta name="description" content="A Movie Library where you can check all your favorite movies, as well as the cast of it, and so mucnh more! Made with ❤️ by Fidalgo" />
              <link rel="canonical" href="https://movies.fidalgo.dev" />
          </Helmet>
        <App />
        <GlobalStyle />
      </IntlProvider>
    </ThemeProvider>
  </Provider>,
  document.querySelector('#root')
);
