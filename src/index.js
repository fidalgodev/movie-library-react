import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import App from './containers/App';
import store from './store';

import theme from './utils/theme';
import GlobalStyle from './utils/globals';

import '../node_modules/react-modal-video/scss/modal-video.scss';

ReactDOM.render(
  <Provider store={store}>
      <ThemeProvider theme={theme}>
          <Fragment>
              <App />
              <GlobalStyle />
          </Fragment>
      </ThemeProvider>
  </Provider>,
  document.querySelector('#root')
);
