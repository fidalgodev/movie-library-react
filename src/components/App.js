import React, { useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
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
  @import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,500,700');
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  line-height: 1.6;
}
`;

const MainWrapper = styled.div`
  display: flex;
`;

const ContentWrapper = styled.div`
  width: 100%;
`;

const App = props => {
  useEffect(() => {
    props.getConfig();
  }, []);

  return (
    <React.Fragment>
      <GlobalStyle />
      <MainWrapper>
        <Sidebar />
        <ContentWrapper>
          <Header />
        </ContentWrapper>
      </MainWrapper>
    </React.Fragment>
  );
};

export default connect(
  null,
  {
    getConfig,
  }
)(App);
