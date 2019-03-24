import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import { device } from './utils/_devices';

import App from './containers/App';
import reducers from './reducers';

import '../node_modules/react-modal-video/scss/modal-video.scss';

const GlobalStyle = createGlobalStyle`
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
  --color-primary-dark: #263238;
  --color-primary: #37474f;
  --color-primary-light: #546e7a;
  --color-primary-lighter: #b0bec5;
  --text-color: #fafafa;
  --link-color: #444;
  --border-color: rgba(176, 190, 197, 0.5);
  --shadow-color: rgba(0, 0, 0, 0.2);
  --shadow-color-dark: rgba(0, 0, 0, 0.25);


  @media only screen and ${device.largest} {
      font-size: 57.5%;
  }

  @media only screen and ${device.large} {
      font-size: 55%;
  }
}

body {
  @import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700');
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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(reduxThunk))
);

ReactDOM.render(
  <Provider store={store}>
    <GlobalStyle />
    <App />
  </Provider>,
  document.querySelector('#root')
);
