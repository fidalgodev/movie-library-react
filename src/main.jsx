import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { store } from './store';
import theme from './utils/theme';
import GlobalStyle from './utils/globals';
import App from './App';

import 'react-modal-video/scss/modal-video.scss';

const root = createRoot(document.querySelector('#root'));

root.render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Helmet>
              <title>Movie Library</title>
              <meta
                name="description"
                content="A Movie Library where you can check all your favorite movies, as well as the cast of it, and so much more! Made with ❤️ by Fidalgo"
              />
              <link rel="canonical" href="https://movies.fidalgo.dev" />
            </Helmet>
            <GlobalStyle />
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </Provider>
  </StrictMode>
);
