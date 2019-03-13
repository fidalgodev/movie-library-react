import React, { useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getConfig } from '../actions';

import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';

const GlobalStyle = createGlobalStyle`
* {
  margin: 0;
  padding: 0;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

html {
  box-sizing: border-box;
  font-size: 62.5%; //1rem = 10px
}

body {
  @import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700');
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  line-height: 1.6;
}
`;

const MainWrapper = styled.div`
  display: flex;
  --color-primary-dark: #263238;
  --color-primary: #37474f;
  --color-primary-light: #546e7a;
  --color-primary-lighter: #b0bec5;
  --text-color: #fafafa;
  --link-color: #444;
  --border-color: rgba(176, 190, 197, 0.2);
  --shadow-color: rgba(0, 0, 0, 0.15);
`;

const ContentWrapper = styled.div`
  width: 100%;
  padding: 2rem 4rem;
`;

const App = props => {
  useEffect(() => {
    props.getConfig();
  }, []);

  return (
    <BrowserRouter>
      <React.Fragment>
        <GlobalStyle />
        <MainWrapper>
          <Sidebar />
          <ContentWrapper>
            <Header />
          </ContentWrapper>
        </MainWrapper>
      </React.Fragment>
    </BrowserRouter>
  );
};

export default connect(
  null,
  {
    getConfig,
  }
)(App);
