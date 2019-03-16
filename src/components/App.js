import React, { useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Router, Switch, Route } from 'react-router-dom';
import history from '../history';
import { connect } from 'react-redux';
import { getConfig, getGenres } from '../actions';

import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';
import Home from './Home';
import Genre from './MoviesList/Genre';
import Discover from './MoviesList/Discover';
import Search from './MoviesList/Search';
import NotFound from './NotFound';

const GlobalStyle = createGlobalStyle`
* {
  margin: 0;
  padding: 0;
}

*,
*::before,
*::after {
  box-sizing: inherit;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  --border-color: rgba(176, 190, 197, 0.5);
  --shadow-color: rgba(0, 0, 0, 0.15);
`;

const ContentWrapper = styled.div`
  width: 100%;
  padding: 2rem 4rem;
`;

const App = props => {
  useEffect(() => {
    props.getConfig();
    props.getGenres();
  }, []);

  return props.base && props.genres ? (
    <Router history={history}>
      <React.Fragment>
        <GlobalStyle />
        <MainWrapper>
          <Sidebar />
          <ContentWrapper>
            <Header />
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/genres/:name" exact component={Genre} />
              <Route path="/discover/:name" exact component={Discover} />
              <Route path="/search/:query" exact component={Search} />
              <Route component={NotFound} />
            </Switch>
          </ContentWrapper>
        </MainWrapper>
      </React.Fragment>
    </Router>
  ) : (
    <div>Laoding</div>
  );
};

const mapStateToProps = ({ geral }) => {
  return { base: geral.base, genres: geral.genres };
};

export default connect(
  mapStateToProps,
  { getConfig, getGenres }
)(App);
